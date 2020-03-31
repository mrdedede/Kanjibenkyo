from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask.views import MethodView
import requests

#URLS
jisho = "https://jisho.org/api/v1/search/words?keyword="

# Creating an instance with Flask
app = Flask(__name__)
CORS(app)

# Creating the API from the APP
api = Api(app)

@app.route("/")
def index():
    return jsonify("Hello World")

class MainServer(MethodView):
    def get(self):
        r = requests.get(jisho+"外")
        data = r.json()
        return data

    def post(self):
        return jsonify("Hello World! 3")

    def get_headers(self, environ):
        return [('Content-Type', 'application/json')]

api.add_resource(MainServer, "/MainServer")