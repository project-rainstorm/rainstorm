'''
Get system running status including CPU load, memory usage, network traffic.
'''
import time

import psutil
import socket


class SystemStatus(object):
    INCLUDED_PARTITIONS = set(['/', '/writable'])

    def __init__(self):
        self.timestamp = time.time()
        self.cpu_percent = psutil.cpu_percent()
        self.ram_percent = psutil.virtual_memory().percent
        self.disk_partitions = {}
        self.total_memory = psutil.virtual_memory().total
        hostname = socket.gethostname()
        ip = socket.gethostbyname(hostname)
        self.ip = ip
        self.serial = self.getserial()
        
        partitions = psutil.disk_partitions()
        for p in partitions:
            if p.mountpoint in self.INCLUDED_PARTITIONS:
                usage = psutil.disk_usage(p.mountpoint)
                self.disk_partitions[p.mountpoint] = {
                    'total': usage.total,
                    'used': usage.used,
                    'percent': usage.percent
                }

    def getserial(self):
        # Extract serial from cpuinfo file
        cpuserial = "0000000000000000"
        try:
            f = open('/proc/cpuinfo','r')
            for line in f:
                if line[0:6]=='Serial':
                    cpuserial = line[10:26]
            f.close()
        except:
            cpuserial = "ERROR000000000"

        return cpuserial
