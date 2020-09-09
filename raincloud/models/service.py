import os
import subprocess

class Service(object):
    def __init__(self, name):
        self.name = name

    @classmethod
    def all(cls):
        return [Service(folder) for folder in cls.all_folders()]

    @classmethod
    def all_folders(cls):
        return os.listdir(cls.__services_folder()) 

    def enable(self):
        command = "{0} up -d".format(self.__docker_command())
        return self.__run_command(command)
    
    def disable(self):
        command = "{0} down".format(self.__docker_command())
        return self.__run_command(command)

    def get_status(self):
        # try to attach to logs
        command = "{0} logs".format(self.__docker_command())
        output = self.__run_command(command)

        if self.name in str(output):
            return 'Enabled'
        else:
            return 'Disabled'
    
    
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

