import os
import subprocess
import docker

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
        return os.listdir(cls.__services_folder())

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
    service_file = "{0}/service.json".format(self.__service_folder())
        if os.path.isfile(settingsFile):
            with open(service_file) as f:
                return json.load(f)
        return {}

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
