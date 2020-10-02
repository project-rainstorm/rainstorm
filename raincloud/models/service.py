import os
import subprocess
import docker
import json

class Service(object):
    def __init__(self, name):
        self.name = name
        self.status = self.get_status()
        self.settings = self.get_settings()
        self.needs_update = self.check_needs_update()

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
        # set flag since any new variables were applied
        self.set_needs_update(False)
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
        env = self.__get_env_dict()
        print(json.dumps(env))
        if os.path.isfile(service_file):
            with open(service_file) as f:
                settings = json.load(f)
                var_fields_with_values = []
                # Parse field values from .env
                for var in settings['var_fields']:
                    print("var['name']=" + var['name'])
                    try:
                        var['value'] = env[var['name']]
                    except:
                        continue
                    var_fields_with_values.append(var)
                settings['var_fields'] = var_fields_with_values
                return settings
        return {}

    def get_service_file(self):
        return "{0}/service.json".format(self.__service_folder())

    def get_env_file(self):
        return "{0}/.env".format(self.__service_folder())

    def get_update_file(self):
        return "{0}/.update".format(self.__service_folder())

    def update_var(self, variable):
        self.set_needs_update(True)
        env = self.__get_env_dict()
        env[variable['name']] = variable['value']
        self.__save_env(env)
        self.settings = self.get_settings()
        return self.__dict__

    def check_needs_update(self):
        return os.path.isfile(self.get_update_file())

    def set_needs_update(self, needs_update):
        self.needs_update = needs_update
        update_file = self.get_update_file()
        if needs_update:
            with open(update_file, 'w') as f:
                pass
        else:
            if os.path.isfile(update_file):
                os.remove(update_file)
            else:
                print("Update flag unset. Skipping...")

    @classmethod
    def __services_folder(cls):
        base_dir = os.getcwd()

        return os.path.join(base_dir, 'services')

    def __run_command(self, command):
        if self.name not in Service.all_folders():
            raise Exception('Service not enabled')

        return subprocess.check_output(command, shell=True)

    def __get_env_dict(self):
        env_file = self.get_env_file()
        dict = {}
        if os.path.isfile(env_file):
            vars = open(env_file, "r").readlines()
            for assignment in vars:
                name, value = assignment.split("=")
                dict[name] = value.strip()
        return dict

    def __save_env(self, dict):
        env_file = self.get_env_file()
        with open(env_file, mode='w') as f:
            for name in dict.keys():
                assignment = "{0}={1}\n".format(name, dict[name])
                f.write(assignment)

    def __service_folder(self):
        return os.path.join(Service.__services_folder(), self.name)

    def __docker_command(self):
        return "docker-compose -f {0}/docker-compose.yml --env-file {0}/.env ".format(self.__service_folder())
