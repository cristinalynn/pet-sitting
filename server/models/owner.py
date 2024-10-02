from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt
from flask_login import UserMixin

class Owner(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'owners'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column('password', db.String, nullable=False)
   
   # RELATIONSHIPS
    pets = db.relationship('Pet', back_populates='owner', lazy=True)

    # VALIDATION
    @validates('email')
    def validates_email(self, key, value):
        if key == 'email':
            if '@' not in value:
                raise ValueError("Email must contain @.")
        return value
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
      self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        if not password:
            return False
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<Owner {self.email}>'