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

    def set_status(self):
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

    def update_settings(self, variable):
        service_file = "{0}/service.json".format(self.__service_folder())
        settings = self.get_settings()
        unchanged_vars = filter(lambda v: v['name'] != variable['name'], settings['var_fields'])
        print("unchanged")
        print(unchanged_vars)
        new_vars = unchanged_vars.append(variable)
        print("vars")
        print(new_vars)
        settings['var_fields'] = new_vars

        with open(service_file, mode='w') as f:
            f.write(json.dumps(settings))

        return self.get_settings()

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
        return "docker-compose -f {0}/docker-compose.yml --env-file {0}/.env ".format(self.__service_folder())
