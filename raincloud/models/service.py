import os
import json

class Service(object):
    def __init__(self, name):
        self.name = name
    
    @classmethod
    def all(cls):
        folders = os.listdir(cls.__services_folder())

        return [Service(folder) for folder in folders]

    def enable(self):
        command = "docker-compose -f {0}/docker-compose.yml up -d".format(self.__service_folder())
        print(command)
        return os.system(command)
    
    @classmethod
    def __services_folder(cls):
        base_dir = os.getcwd()
        
        return os.path.join(base_dir, 'services')

    def __service_folder(self):
        return os.path.join(Service.__services_folder(), self.name)

