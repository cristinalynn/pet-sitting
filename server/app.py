from config import app
from models.models import *
from routes.routes import *

# Standard library imports

# Remote library imports
#from flask import request
#from flask_restful import Resource

# Local imports

# Add your model imports


# Views go here!

#@app.route('/')
#def index():
 #   return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

