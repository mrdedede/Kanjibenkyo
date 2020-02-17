from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask.views import MethodView

# Creating an instance with Flask
app = Flask(__name__)

# Creating the API from the APP
api = Api(app)

@app.route("/")
def index():
    return "Hello World"

class MainServer(MethodView):
    def get(self):
        return "Hello Get", 200

    def post(self):
        return "Hello Post", 201

api.add_resource(MainServer, "/MainServer")