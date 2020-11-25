import os

from flask import Flask
from flask import request
from raincloud.models.service import Service
from raincloud.models.system import SystemStatus
from raincloud.rainstick.security import authenticate, chpass
from raincloud.rainstick.config import app_config
from flask_json import FlaskJSON, as_json
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token, get_jwt_identity
)
from datetime import timedelta

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    jwt = JWTManager(app)
    app.config.from_mapping(
        SECRET_KEY='dev',
        JWT_SECRET_KEY='secret',
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(seconds=900),  # 15 min
        JWT_REFRESH_TOKEN_EXPIRES=timedelta(seconds=86400),  # 1 day
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    flask_json = FlaskJSON(app)

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

    @app.route('/refresh', methods=['POST'])
    @jwt_refresh_token_required
    def refresh_jwt_token():
        current_user = get_jwt_identity()
        return {
            'access_token': create_access_token(identity=current_user)
        }

    @app.route('/login', methods=['POST'])
    def login():
        if not request.is_json:
            return {'message':'Request is not JSON', 'severity': 'error'}, 500
        if authenticate(request.get_json()['password']):
            return {
                'access_token': create_access_token(identity=app_config['default_username']),
                'refresh_token': create_refresh_token(identity=app_config['default_username']),
                'message': "Logged in successfully!", "severity": "success"
            }
        return {'message': 'Password is incorrect!', 'severity': 'error'}, 401

    # TODO: change the password
    @app.route('/settings/password', methods=['POST'])
    def chpasswd():
        if not request.is_json:
            return {'message':'Request is not JSON', 'severity': 'error'}, 500
        r = request.get_json()
        if not authenticate(r['password']):
            return {'message':'Password is not correct!', 'severity': 'error'}, 401
        chpass(r['newPassword'])
        return {'message':'Password changed successfully!', 'severity': 'success'}, 200

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
    @jwt_required
    def getServices():
        # return all the folder names in ~/project_rainstorm/services
        return { 'data': [service.__dict__ for service in Service.all()] }

    @app.route('/services/<service_name>/enable', methods=['POST'])
    @as_json
    @jwt_required
    def enableService(service_name):
        service = Service(service_name)
        command = service.enable()

        if command:
            return {'status': 'failed'}, 500
        else:
            return { 'data': service.__dict__ }, 200

    @app.route('/services/<service_name>/disable', methods=['POST'])
    @jwt_required
    @as_json
    def disableService(service_name):
        service = Service(service_name)
        command = service.disable()

        if command:
            return {'status': 'failed'}, 500
        else:
            return { 'data': service.__dict__ }, 200

    @app.route('/services/<service_name>/restart', methods=['POST'])
    @as_json
    @jwt_required
    def restartService(service_name):
        service = Service(service_name)
        if service.status == 'enabled':
            service.disable()
            service.enable()
        else:
            service.enable()
        return { 'data': service.__dict__ }, 200

    @app.route('/services/<service_name>/vars', methods=['POST'])
    @as_json
    @jwt_required
    def vars(service_name):
        if request.is_json:
            service = Service(service_name)
            variable = request.get_json()

            return { 'data': service.update_var(variable) }, 200

    @app.route('/settings/system/info', methods=['GET'])
    @as_json
    @jwt_required
    def getSysInfo():
        # return some basic system info
        # size of HDD /dev/sda1, HDD usage, CPU percent, Mem, temp, uptime, etc.
        return { 'data': SystemStatus().__dict__ }, 200

    # TODO: shutdown the system
    @app.route('/settings/system/poweroff', methods=['POST'])
    def poweroff():
        # safely shutdown the system
        return


    return app
