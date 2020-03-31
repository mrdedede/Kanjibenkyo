from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api
from flask.views import MethodView
import requests

#URLS
jisho = "https://jisho.org/api/v1/search/words?keyword="
#https://jisho.org/forum/54fefc1f6e73340b1f160000-is-there-any-kind-of-search-api = "Docs"

# Creating an instance with Flask
app = Flask(__name__)
CORS(app)

# Creating the API from the APP
api = Api(app)

@app.route("/")
def index():
    return jsonify("Hello World")

@app.route("/jisho/kanji/<kanji>", methods=['GET'])
def teste(kanji):
    r = requests.get(jisho+kanji)
    data = r.json()
    return data