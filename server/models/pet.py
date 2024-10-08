from sqlalchemy_serializer import SerializerMixin
from config import db
from .owner import *
from .sitter import *



class Pet(db.Model, SerializerMixin):
    __tablename__ = 'pets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    

     # FOREIGN KEYS
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=True)
    sitter_id = db.Column(db.Integer, db.ForeignKey('sitters.id'), nullable=True)

    # RELATIONSHIPS
    owner = db.relationship('Owner', back_populates='pets')
    sitter = db.relationship('Sitter', back_populates='pets')
    
    # SERIALIZATION
    serialize_rules = ( '-owner', '-owners')

    def __repr__(self):
        return f'<Pet {self.name}>'