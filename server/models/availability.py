from sqlalchemy_serializer import SerializerMixin
from config import db
from .sitter_availability import *


class Availability(db.Model, SerializerMixin):
    __tablename__ = 'availability'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, unique=True)

    # RELATIONSHIPS
    sitters = db.relationship('Sitter', secondary=sitter_availability, back_populates='availability')

    def __repr__(self):
        return f'<Availability {self.type}>'