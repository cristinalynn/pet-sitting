from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates

class Service(db.Model, SerializerMixin):
    __tablename__ = 'services' 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Name of the service (e.g., "Walking", "Boarding", "Drop in")
    price = db.Column(db.Numeric(10, 2), nullable=False)  # Price or cost of the service with 2 decimal precision
    duration = db.Column(db.Integer, nullable=True) # minutes, hours or days. Can be null if the service doesn't have a duration

    # Validation
    @validates('price')
    def validates_price(self, key, value):
        if value <= 0:
            raise ValueError("Price must be greater than 0")
        return value
    
    @validates('duration')
    def validates_duration(self, key, value):
        if value is not None and value <= 0:
            raise ValueError("Duration must be greater than 0")
        return value

    def __repr__(self):
        return f'<Service {self.name}, Price: {self.price}, Duration: {self.price}>'