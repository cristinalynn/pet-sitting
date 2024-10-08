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

    # List of sample pet names and breeds
    pet_names = ['Buddy', 'Max', 'Charlie', 'Bella', 'Lucy']
    pet_breeds = ['Golden Retriever', 'Bulldog', 'Beagle', 'Poodle', 'German Shepherd']

    # Seed pets with random attributes
    pets = []
    for _ in range(5):  # Create 5 pets
        new_pet = Pet(
            name=rc(pet_names),
            breed=rc(pet_breeds),
            age=randint(1, 15),  # Random age between 1 and 15
            owner_id=randint(1, 2),  # Assuming there are 2 seeded owners
            sitter_id=None  # Can assign sitters later
        )
        pets.append(new_pet)

    db.session.add_all(pets)
    db.session.commit()

# SEEDS OWNER
def seed_owners():
    Owner.query.delete()
    owners =[]

    owner1 = Owner(email= 'fakemail1@email.com', _password_hash= 'testpasstest1')
    owners.append(owner1)

    owner2 = Owner(email= 'fakemail2@email.com', _password_hash= 'testpasstest2')
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
