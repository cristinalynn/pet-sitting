from flask import request, make_response
from flask_restful import Resource
#from flask_login import login_required

# Local imports
from config import db, api

# Model imports 
from models.models import Pet

# PETS ROUTES - GET, POST, PUT, DELETE
class PetResource(Resource):

    # GET all pets or a specific pet by ID
    #@login_required
    def get(self, pet_id=None):
        if pet_id:
            pet = Pet.query.get(pet_id)
            if not pet:
                return {'error': 'Pet not found'}, 404
            return pet.to_dict(), 200
        else:
            pets = Pet.query.all()
            return [pet.to_dict() for pet in pets], 200 

    # POST - Create a new pet    
    #@login_required
    def post(self):
        form_data = request.get_json()

        # Basic validation (optional)
        if not form_data.get('name') or not form_data.get('breed') or not form_data.get('age'):
            return {'error': 'Missing required fields'}, 400

        # Create the new pet
        new_pet = Pet(
            name=form_data['name'],
            breed=form_data['breed'],
            age=form_data['age'],
            owner_id=form_data.get('owner_id'),  # Foreign key
            sitter_id=form_data.get('sitter_id')  # Foreign key, if applicable
        )
        db.session.add(new_pet)
        db.session.commit()
        return make_response(new_pet.to_dict(), 201)

    # DELETE a specific pet by ID
    #@login_required 
    def delete(self, pet_id):
        pet = Pet.query.get(pet_id)
        if not pet:
            return {'error': 'Pet not found'}, 404

        db.session.delete(pet)
        db.session.commit()
        return make_response({}, 204)
    
    # PATCH - Update a specific pet by ID
    #@login_required
    def patch(self, pet_id):
        pet = Pet.query.get(pet_id)
        if not pet:
            return {'error': 'Pet not found'}, 404

        form_data = request.get_json()

        # Update the pet's details dynamically
        for attr, value in form_data.items():
            setattr(pet, attr, value)

        db.session.commit()
        return make_response(pet.to_dict(), 200)
    
api.add_resource(PetResource, '/api/pets', '/api/pets/<int:pet_id>')
