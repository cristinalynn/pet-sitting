from flask import request, make_response
from flask_restful import Resource
# from flask_login import login_required

# Local imports
from config import db, api

# Model imports 
from models.models import Sitter

# SITTERS ROUTES - GET, POST, PATCH, DELETE
class SitterResource(Resource):

    # GET all sitters or a specific sitter by ID
    # @login_required
    def get(self, sitter_id=None):
        if sitter_id:
            sitter = Sitter.query.get(sitter_id)
            if not sitter:
                return {'error': f'Sitter with ID {sitter_id} not found'}, 404
            return sitter.to_dict(), 200
        else:
            sitters = Sitter.query.all()
            return [sitter.to_dict() for sitter in sitters], 200 

    # POST - Create a new sitter
    # @login_required
    def post(self):
        form_data = request.get_json()

        # Basic validation (optional)
        if not form_data.get('name') or not form_data.get('email') or not form_data.get('address') or not form_data.get('availability'):
            return {'error': 'Missing required fields (name, email, address, availability)'}, 400

        # Check for existing sitter with the same email
        existing_sitter = Sitter.query.filter_by(email=form_data['email']).first()
        if existing_sitter:
            return {'error': 'Sitter with this email already exists'}, 400

        # Create the new sitter
        new_sitter = Sitter(
            name=form_data['name'],
            email=form_data['email'],
            address=form_data['address'],
            availability=form_data['availability']
        )
        db.session.add(new_sitter)
        db.session.commit()
        return make_response(new_sitter.to_dict(), 201)

    # PATCH - Update a specific sitter by ID
    # @login_required
    def patch(self, sitter_id):
        sitter = Sitter.query.get(sitter_id)
        if not sitter:
            return {'error': f'Sitter with ID {sitter_id} not found'}, 404

        form_data = request.get_json()

        # Update sitter fields dynamically
        for attr, value in form_data.items():
            setattr(sitter, attr, value)

        db.session.commit()
        return make_response(sitter.to_dict(), 200)

    # DELETE - Delete a specific sitter by ID
    # @login_required
    def delete(self, sitter_id):
        sitter = Sitter.query.get(sitter_id)
        if not sitter:
            return {'error': f'Sitter with ID {sitter_id} not found'}, 404

        db.session.delete(sitter)
        db.session.commit()
        return make_response({}, 204)

# Add the Sitter resource to the API
api.add_resource(SitterResource, '/api/sitters', '/api/sitters/<int:sitter_id>')
