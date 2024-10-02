# Standard library imports
# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api

# model imports
from models.models import Owner

class OwnerResource(Resource):
    def get(self, owner_id):
        owner = Owner.query.get(owner_id)
        if not owner:
            return {'error': 'Owner not found'}, 404
        return owner.to_dict()

    def post(self):
        form_data = request.json
        new_owner = Owner(email=form_data['email'])
        new_owner.password_hash = form_data['password']
        db.session.add(new_owner)
        db.session.commit()
        return make_response(new_owner.to_dict(), 201)

    def patch(self, owner_id):
        form_data = request.json
        owner = Owner.query.get(owner_id)
        if not owner:
            return {'error': 'Owner not found'}, 404
        
        # Update owner's fields dynamically
        for attr, value in form_data.items():
            setattr(owner, attr, value)
            
        try:
            db.session.commit()
            return owner.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update owner profile'}, 500

    def delete(self, owner_id):
        owner = Owner.query.get(owner_id)
        if not owner:
            return {'error': 'Owner not found'}, 404
        db.session.delete(owner)
        db.session.commit()
        return make_response({}, 204)

# Register the resource with Flask-RESTful API
api.add_resource(OwnerResource, '/api/owners', '/api/owners/<int:owner_id>')
