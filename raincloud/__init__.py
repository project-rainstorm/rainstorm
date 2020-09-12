import os

from flask import Flask, redirect, url_for
from raincloud.models.service import Service
from flask_json import FlaskJSON, as_json
import json

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    json = FlaskJSON(app)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # TODO: validate login password
    @app.route('/login', methods=['POST'])
    def login():
        # the current password is stored in ~/.dropcloud/pw_sha256
        # the password is sha256 hashed
        # hash whatever password gets passed to this route and compare it to what's stored in the file
        # if it's valid, log the user in... i don't know what they entails...
        return

    # TODO: logout the user
    @app.route('/settings/logout', methods=['POST'])
    def logout():
        # however we "log in" the user... do the opposite of that
        return

    # TODO: change the password
    @app.route('/settings/password', methods=['POST'])
    def chpasswd():
        # Accepts 2 params: one for the new password and one for the current password
        # check that sha256(current_pass) ==== contents of ~/.dropcloud/pw_sha256
        # if they match
        # pass the new_pass as an argument to the change password script like this:
        # bash ~/project_rainstorm/scripts/pw_change.sh new_pass
        # else return an error message: wrong current_pass
        return

    # TODO: set the license key
    @app.route('/settings/activate', methods=['POST'])
    def setLicense():
        # when a user buys a license, they will get a key via email
        # they then activate the license by posting it here
        # this route will store the license in a file somewhere for validating premium actions
        return

    # TODO: enable backups on the device
    @app.route('/backups/enable', methods=['POST'])
    def enableBackups():
        # call the ~/project_rainstorm/scripts/backups_enable.sh script
        return

    # TODO: create a backup snapshot
    @app.route('/backups/snapshot', methods=['POST'])
    def createBackup():
        # call the ~/project_rainstorm/scripts/backups_backup.sh script
        return

    # TODO: restore from last  snapshot
    @app.route('/backups/restore', methods=['POST'])
    def restoreBackup():
        # call the ~/project_rainstorm/scripts/backups_restore.sh script
        return

    @app.route('/services', methods=['GET'])
    @as_json
    def getServices():
        # return all the folder names in ~/project_rainstorm/services
        return { 'data': [service.__dict__ for service in Service.all()] }

    @app.route('/services/<service_name>/enable', methods=['POST'])
    @as_json
    def enableService(service_name):
        service = Service(service_name)
        command = service.enable()

        if command:
            return {'status': 'failed'}
        else:
            return { 'data': service.__dict__ }

    @app.route('/services/<service_name>/disable', methods=['POST'])
    @as_json
    def disableService(service_name):
        service = Service(service_name)
        command = service.disable()

        if command:
            return {'status': 'failed'}
        else:
            return { 'data': service.__dict__ }

    @app.route('/services/<service_name>/icon', methods=['GET'])
    def getIcon(service_name):
        return redirect(url_for('static', filename='images/' + service_name + ".jpg"), code=301)

    # TODO: get system info
    @app.route('/settings/system/info', methods=['GET'])
    def getSysInfo():
        # return some basic system info
        # size of HDD /dev/sda1, HDD usage, CPU percent, Mem, temp, uptime, etc.
        return

    # TODO: shutdown the system
    @app.route('/settings/system/poweroff', methods=['POST'])
    def poweroff():
        # safely shutdown the system
        return


    return app
