import os

class Service:
    def __init__(self, name):
        self.name = name
    
    @classmethod
    def all(cls):
        return os.getcwd()
    
