from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from models.models import Availability, db

from config import api, db
from models.models import Availability  

class AvailabilityResource(Resource):
    # GET all availability or a specific one by ID
    def get(self, availability_id=None):
        if availability_id:
            availability = Availability.query.get(availability_id)
            if not availability:
                return {'error': 'Availability not found'}, 404
            return jsonify(availability.to_dict())
        else:
            all_availability = Availability.query.all()
            return jsonify([availability.to_dict() for availability in all_availability])

    # POST a new availability
    def post(self):
        data = request.get_json()
        try:
            new_availability = Availability(type=data.get('type'))
            db.session.add(new_availability)
            db.session.commit()
            return make_response(jsonify(new_availability.to_dict()), 201)
        except IntegrityError:
            db.session.rollback()
            return {'error': 'Availability type must be unique'}, 400
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

    # PATCH an existing availability
    def patch(self, availability_id):
        availability = Availability.query.get(availability_id)
        if not availability:
            return {'error': 'Availability not found'}, 404

        data = request.get_json()
        if 'type' in data:
            availability.type = data['type']
        try:
            db.session.commit()
            return make_response(jsonify(availability.to_dict()), 200)
        except IntegrityError:
            db.session.rollback()
            return {'error': 'Availability type must be unique'}, 400
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

    # DELETE an availability entry
    def delete(self, availability_id):
        availability = Availability.query.get(availability_id)
        if not availability:
            return {'error': 'Availability not found'}, 404

        try:
            db.session.delete(availability)
            db.session.commit()
            return make_response({'message': 'Availability deleted'}, 204)
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
        
api.add_resource(AvailabilityResource, '/api/availability', '/api/availability/<int:availability_id>')
