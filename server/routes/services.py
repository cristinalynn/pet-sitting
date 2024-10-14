from flask import request, make_response
from flask_restful import Resource
# from flask_login import login_required

# Local imports
from config import db, api

# Model imports 
from models.models import Service

# SERVICES ROUTES - GET, POST, PUT, DELETE
class ServiceResource(Resource):
    
    # GET all services or a specific service by ID
    # @login_required
    def get(self, service_id=None):
        if service_id:
            service = Service.query.get(service_id)
            if not service:
                return {'error': f'Service with ID {service_id} not found'}, 404
            return service.to_dict(), 200
        else:
            services = Service.query.all()
            return [service.to_dict() for service in services], 200 

    # POST - Create a new service
    #@login_required
    def post(self):
        form_data = request.get_json()

        # Basic validation (optional)
        if not form_data.get('name') or not form_data.get('price'):
            return {'error': 'Missing required fields (name, price)'}, 400

        # Create the new service
        new_service = Service(
            name=form_data['name'],
            price=form_data['price'],
            duration=form_data.get('duration')  # Duration is optional
        )
        db.session.add(new_service)
        db.session.commit()
        return make_response(new_service.to_dict(), 201)

    # PATCH - Update a specific service by ID
    #@login_required
    def patch(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {'error': f'Service with ID {service_id} not found'}, 404

        form_data = request.get_json()

        # Update service fields dynamically
        for attr, value in form_data.items():
            setattr(service, attr, value)

        db.session.commit()
        return make_response(service.to_dict(), 200)

    # DELETE - Delete a specific service by ID
    #@login_required
    def delete(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {'error': f'Service with ID {service_id} not found'}, 404

        db.session.delete(service)
        db.session.commit()
        return make_response({}, 204)

# Add the Service resource to the API
api.add_resource(ServiceResource, '/api/services', '/api/services/<int:service_id>')
