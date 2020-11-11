sudo apt-get install nginx

yarn --cwd /home/drop/project_rainstorm/thunder run build

sudo cp /home/drop/project_rainstorm/scripts/thunder.nginx.example /etc/nginx/sites-available/thunder.conf

sudo rm /etc/nginx/sites-enabled/thunder.conf

sudo ln -s /etc/nginx/sites-available/thunder.conf /etc/nginx/sites-enabled/thunder.conf

sudo rm /etc/nginx/sites-enabled/default

sudo cp /home/drop/project_rainstorm/scripts/rainstorm.service.example /etc/systemd/system/rainstorm.service

sudo systemctl daemon-reload
sudo sytemctl start rainstorm

sudo service nginx restart
