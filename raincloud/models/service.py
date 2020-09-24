import os
import subprocess
import docker
import json

class Service(object):
    def __init__(self, name):
        self.name = name
        self.status = self.get_status()
        self.settings = self.get_settings()

    @classmethod
    def all(cls):
        return [Service(folder) for folder in cls.all_folders()]

    @classmethod
    def all_folders(cls):
        return [ f.name for f in os.scandir(cls.__services_folder()) if f.is_dir() ]

    def enable(self):
        command = "{0} up -d".format(self.__docker_command())
        output = self.__run_command(command)
        self.set_status()

        return output

    def disable(self):
        command = "{0} down".format(self.__docker_command())
        output = self.__run_command(command)
        self.set_status()

        return output

    def setVars(self, vars):
        # example vars = [{name: ENV_VAR, value: ENV_VALUE}]
        settings = self.get_settings()
        new_fields = []
        for var in vars:
            old_field = next((x for x in settings.var_fields if x.value == var.value), None)
            new_fields.append({**old_field, "value": var.value  })
        new_settings = {**settings, 'var_fields': new_fields}
        with open(self.get_service_file(), "w") as f:
            try:
                f.write(new_settings)
                return 0
            except:
              return 1

    def set_status(self, status):
        self.status = self.get_status()

    def get_status(self):
        client = docker.from_env()
        try:
            if client.containers.get(self.name).status == 'running':
                return 'enabled'
            else:
                return 'disabled'
        except docker.errors.NotFound:
            return 'disabled'

    def get_settings(self):
        service_file = self.get_service_file()
        if os.path.isfile(service_file):
            with open(service_file) as f:
                return json.load(f)
        return {}

    def get_service_file(self):
        return "{0}/service.json".format(self.__service_folder())

    @classmethod
    def __services_folder(cls):
        base_dir = os.getcwd()

        return os.path.join(base_dir, 'services')

    def __run_command(self, command):
        if self.name not in Service.all_folders():
            raise Exception('Service not enabled')

        return subprocess.check_output(command, shell=True)


    def __service_folder(self):
        return os.path.join(Service.__services_folder(), self.name)

    def __docker_command(self):
        return "docker-compose -f {0}/docker-compose.yml".format(self.__service_folder())
