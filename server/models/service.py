from sqlalchemy_serializer import SerializerMixin
from config import db

class Service(db.Model, SerializerMixin):
    __tablename__ = 'services' 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Name of the service (e.g., "Walking", "Boarding", "Drop in")
    price = db.Column(db.Float, nullable=False)  # Price or cost of the service
    duration = db.Column(db.Integer) # minutes, hours or days

    def __repr__(self):
        return f"<Service {self.name}>"