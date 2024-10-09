from sqlalchemy_serializer import SerializerMixin
from config import db
from .sitter_availability import *

class Sitter(db.Model, SerializerMixin):
    __tablename__ = 'sitters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    availability = db.Column(db.String(50), nullable=False)
   
   # RELATIONSHIPS
    availability = db.relationship('Availability', secondary=sitter_availability, back_populates='sitters')
    pets = db.relationship('Pet', back_populates='sitter', lazy=True)

    def __repr__(self):
        return f'<Sitter {self.name}>'
    
   