# PUT FRONTEND ROUTES IN 

import ipdb

from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from flask_login import LoginManager, login_user, logout_user, current_user
import traceback

from config import app, db, api
from models.models import Owner

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(owner_id):
    return Owner.query.filter(Owner.id == owner_id).first()


class Signup(Resource):
    def post(self):
        data = request.get_json()

        try:
            new_owner = Owner(
                name=data.get('name'),
                email=data.get('email')
            )
            new_owner.password_hash = data.get('password')
            db.session.add(new_owner)
            db.session.commit()
            login_user(new_owner, remember=True)
            return make_response(new_owner.to_dict(), 201)
        except IntegrityError:  # Handle unique constraint violation
            db.session.rollback()
            return {"error": "Email already registered"}, 400
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred during signup", "message": str(e)}, 500


class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            owner = Owner.query.filter_by(email=data.get('email')).first()
            password = request.get_json()['password']

            if owner.authenticate(password):
                login_user(owner, remember=True)
                return owner.to_dict(), 200
            if not owner:
                return {'error': 'Invalid Email/Password'}, 401
        except Exception as e:
            traceback.print_exc()
            return {"error": "An error occurred while attempting to log in", "message": str(e)}, 500


class AuthorizedSession(Resource):
    def get(self):
        try:
            if current_user.is_authenticated:
                owner = current_user.to_dict()
                return make_response(owner, 200)
        
        except:
            return make_response('Not Authorized', 401)


class Logout(Resource):
    def post(self):
        logout_user()
        return 'Goodbye!', 200


class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            owner = current_user.to_dict()
            return make_response(owner, 200)
        else:
            return {"error": "Please log in"}, 401





api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Signup, "/api/signup")
api.add_resource(Login, "/api/login")
api.add_resource(AuthorizedSession, '/authorized')
api.add_resource(Logout, '/api/logout')

