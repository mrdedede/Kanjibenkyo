from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask.views import MethodView

# Creating an instance with Flask
app = Flask(__name__)
CORS(app)

# Creating the API from the APP
api = Api(app)

@app.route("/")
def index():
    return jsonify("Hello World")

# class MainServer(MethodView):
#     def get(self):
#         return Response("Hello World! 2",headers={'Access-Control-Allow-Origin':'*'})

#     def post(self):
#         return Response("Hello World! 3",headers={'Access-Control-Allow-Origin':'*'})

#     def get_headers(self, environ):
#         return [('Content-Type', 'application/json')]

# api.add_resource(MainServer, "/MainServer")