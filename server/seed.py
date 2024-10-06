#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models.models import db, Owner, Pet, Service, Sitter
from config import app, db

# SEEDS OWNERS

def seed_owners():
    # Delete data first
    Owner.query.delete()

    # List of owners
    owners =[]

# SEEDS PETS

# SEEDS SERVICES

# SEEDS SITTERS

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
