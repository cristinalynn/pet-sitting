from config import db


# Association table for the many-to-many relationship
sitter_availability = db.Table(
    'sitter_availability',
    db.Column('sitter_id', db.Integer, db.ForeignKey('sitters.id'), primary_key=True),
    db.Column('availability_id', db.Integer, db.ForeignKey('availability.id'), primary_key=True)
)