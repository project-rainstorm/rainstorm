sudo apt-get install nginx

scripts_dir="$(dirname "$(readlink -f "$0")")"
root_dir="$(dirname "$(readlink -f $scripts_dir)")"

source "$scripts_dir"/functions.sh
eval $(_parse $root_dir/config.yml)

yarn --cwd "$root_dir/thunder" run build

if [ -d "$root_dir/venv" ]; then
  python3 -m venv "$root_dir/venv"
fi


sudo rm /etc/nginx/sites-enabled/thunder.conf

cp "$scripts_dir/thunder.nginx.example" "$scripts_dir/thunder.nginx"

sed -i "s~<root_dir>~$root_dir~g" $scripts_dir/thunder.nginx

sudo mv "$scripts_dir/thunder.nginx" /etc/nginx/sites-available/thunder.conf

sudo ln -s /etc/nginx/sites-available/thunder.conf /etc/nginx/sites-enabled/thunder.conf

sudo rm /etc/nginx/sites-enabled/default

sudo cp "$scripts_dir/raincloud.service.example" "$scripts_dir/raincloud.service"

sed -i "s~<root_dir>~$root_dir~g" $scripts_dir/raincloud.service
sed -i "s~<user>~$default_username~g" $scripts_dir/raincloud.service

sudo mv "$scripts_dir/raincloud.service" /etc/systemd/system/raincloud.service

sudo systemctl daemon-reload
sudo systemctl start raincloud
sudo systemctl enable raincloud

sudo service nginx restart
