#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models.models import db, Owner, Pet, Service, Sitter
from config import app, db

# SEEDS PETS

def seed_pets():
    # Clear existing data
    Pet.query.delete()

    # List of sample pets with specific attributes

    pets = [
        {
            "name": "Buddy",
            "breed": "Golden retriever",
            "age": 5
        },
        {
            "name": "Bella",
            "breed": "Poodle",
            "age": 3
        }
    ]

    owners = {owner.name: owner for owner in Owner.query.all()}

    # Seed pets with random attributes
    # pets = []
    for pet_data in pets:
        # Find or create owner
        owner = Owner.query.filter_by(name=pet_data["owner"]).first()
        if not owner:
            owner = Owner(name=pet_data["owner"])
            db.session.add(owner)
            db.session.commit()

        new_pet = Pet(
            name=pet_data["name"],
            breed=pet_data["breeds"],
            age=pet_data["age"],  
            owner_id=owner.id, 
            sitter_id=None  # Can assign sitters later
        )

    db.session.add(new_pet)
    db.session.commit()

# SEEDS OWNER
def seed_owners():
    Owner.query.delete()
    owners =[]

    owner1 = Owner(name= 'fakename1', email= 'fakemail1@email.com', _password_hash= 'testpasstest1')
    owners.append(owner1)

    owner2 = Owner(name= 'fakename2', email= 'fakemail2@email.com', _password_hash= 'testpasstest2')
    owners.append(owner2)

    db.session.add_all(owners)
    db.session.commit()

# SEEDS SERVICES
def seed_services():
    # Clear existing data
    Service.query.delete()

    # List of services
    services = [
        Service(name="Dog Walking", price=20.0, duration=30),
        Service(name="Boarding", price=100.0, duration=1440),  # 1440 minutes = 24 hours
        Service(name="Drop ins", price=10.0, duration=15),
        Service(name="Training", price=50.0, duration=60)
    ]

    db.session.add_all(services)
    db.session.commit()

# SEEDS SITTERS
def seed_sitters():
    # Clear existing data
    Sitter.query.delete()

    # Use Faker to generate random sitter data
    sitters = []
    for _ in range(5):  # Create 5 sitters
        sitter = Sitter(
            name=fake.name(),
            address=fake.address(),
            email=fake.email(),
            availability=rc(['Full-time', 'Part-time', 'Occasional'])
        )
        sitters.append(sitter)

    db.session.add_all(sitters)
    db.session.commit()

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
         # Call the seed functions
        seed_owners()
        seed_sitters()
        seed_services()
        seed_pets()

        print("Seeding completed!")
