import os
import json

class Service(object):
    def __init__(self, name):
        self.name = name
    
    @classmethod
    def all(cls):
        base_dir = os.getcwd()
        services_folder = os.path.join(base_dir, 'services')
        folders = os.listdir(services_folder)

        return [Service(folder) for folder in folders]

