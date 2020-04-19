from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api
from flask.views import MethodView
from firebase_admin import credentials
import requests
import firebase_admin


#URLS
jisho = "https://jisho.org/api/v1/search/words?keyword="
#https://jisho.org/forum/54fefc1f6e73340b1f160000-is-there-any-kind-of-search-api = "Docs"

# Creating an instance with Flask
app = Flask(__name__)
CORS(app)

# Creating the API from the APP
api = Api(app)

@app.route("/jisho/kanji/<kanji>", methods=['GET'])
def getJishoKanji(kanji):
    """
    This route should get an kanji research request from the client, get it back
    from jisho.org (our dictionary source so far) and return the results for him.

    As this is an rest API, the attribute kanji of this function actually refers to the
    term kanji of the URL that is between the tags in this representation
    """
    r = requests.get(jisho+kanji)
    data = r.json()
    return data

cred = credentials.Certificate("treinamento-angular-75cf6-firebase-adminsdk-ydwr0-0ab0181d69.json")
firebase_admin.initialize_app(cred)

@app.route('/user/login', methods=['POST'])
def login():
    """
    This route should validate and secure the inputted data
    as well as make a login request to the database.
    """
    print(request.get_json())
    return {'code': 200}

@app.route('/user/signup', methods=['POST'])
def signup():
    """
    This route should validate and secure the inputted data
    as well as create an account for the user.
    """
    print(request.get_json())
    return {'code': 200}