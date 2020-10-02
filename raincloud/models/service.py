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

        # set flag - new variables applied
        settings = self.get_settings()
        settings['needs_update'] = False
        self.__save_settings(settings)
        self.settings = self.get_settings()
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
                settings = json.load(f)
                var_fields_with_values = []
                # Parse field values from .env
                for var in settings['var_fields']:
                    var['value'] = self.__get_env_value(var['name'])
                    var_fields_with_values.append(var)
                settings['var_fields'] = var_fields_with_values
                return settings
        return {}

    def get_service_file(self):
        return "{0}/service.json".format(self.__service_folder())

    def update_settings(self, variable):
        settings = self.get_settings()
        # add the new var
        settings['needs_update'] = True
        self.__save_settings(settings)
        self.__save_env_var(variable)

        self.settings = self.get_settings()

        return self.__dict__

    @classmethod
    def __services_folder(cls):
        base_dir = os.getcwd()

        return os.path.join(base_dir, 'services')

    def __run_command(self, command):
        if self.name not in Service.all_folders():
            raise Exception('Service not enabled')

        return subprocess.check_output(command, shell=True)

    def __save_settings(self, settings):
        service_file = "{0}/service.json".format(self.__service_folder())
        with open(service_file, mode='w') as f:
            f.write(json.dumps(settings, indent=2))

    def __save_env_var(self, variable):
        env_file = "{0}/.env".format(self.__service_folder())
        vars = open(env_file, "r").readlines()
        new_env = []
        for assignment in vars:
            name = assignment.split("=")[0]
            if name == variable['name']:
                new_env.append("{0}={1}\n".format(name, variable['value']))
            else:
                new_env.append(assignment)
        with open(env_file, mode='w') as f:
            for line in new_env:
                f.write(line)

    def __get_env_value(self, var_name):
        env_file = "{0}/.env".format(self.__service_folder())
        vars = open(env_file, "r").readlines()
        for assignment in vars:
            name, value = assignment.split("=")
            if name == var_name:
                return value


    def __service_folder(self):
        return os.path.join(Service.__services_folder(), self.name)

    def __docker_command(self):
        return "docker-compose -f {0}/docker-compose.yml --env-file {0}/.env ".format(self.__service_folder())
