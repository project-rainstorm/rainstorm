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

        partitions = psutil.disk_partitions()
        for p in partitions:
            if p.mountpoint in self.INCLUDED_PARTITIONS:
                usage = psutil.disk_usage(p.mountpoint)
                self.disk_partitions[p.mountpoint] = {
                    'total': usage.total,
                    'used': usage.used,
                    'percent': usage.percent
                }

