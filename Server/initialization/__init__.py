from flask import Flask, Response, jsonify, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask.views import MethodView
import requests
import pyrebase

#Firebase Configuration
config = {
    'apiKey': "AIzaSyBlU1AmQzjyBBRLkcN8ctSktt9UqsAxe8M",
    'authDomain': "treinamento-angular-75cf6.firebaseapp.com",
    'databaseURL': "https://treinamento-angular-75cf6.firebaseio.com",
    'projectId': "treinamento-angular-75cf6",
    'storageBucket': "treinamento-angular-75cf6.appspot.com",
    'messagingSenderId': "357652417983",
    'appId': "1:357652417983:web:996c92d85c21d7141ea50a",
    'measurementId': "G-BWKFXCWGT0"
  }

#URLS
jisho = "https://jisho.org/api/v1/search/words?keyword="
#https://jisho.org/forum/54fefc1f6e73340b1f160000-is-there-any-kind-of-search-api = "Docs"

# Creating an instance with Flask
app = Flask(__name__)
CORS(app, cross_origin=['jisho.org', 'localhost:4200', 'firebaseapp.com', 'firebaseio.com'])

# Creating the API from the APP
api = Api(app)

@app.route("/jisho/kanji/<kanji>", methods=['GET'])
def getJishoKanji(kanji):
    """
    This route should get an kanji research request from the client, get it back
    from jisho.org (our dictionary source so far) and return the results for him.

    As this is an rest API, the attribute kanji of this function actually refers to the
    term kanji of the URL that is between the tags in this representation.

    This usage has been authorized by Kim Ahlström, Jisho.org's owner.
    """
    r = requests.get(jisho+kanji)
    data = r.json()
    return data

# cred = credentials.Certificate("treinamento-angular-75cf6-firebase-adminsdk-ydwr0-0ab0181d69.json")
# firebase_admin.initialize_app(cred)

@app.route('/user/login', methods=['POST'])
def login():
    """
    This route should validate and secure the inputted data
    as well as make a login request to the database.
    """
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    login_data = request.get_json()
    try:
        creation = auth.sign_in_with_email_and_password(
            login_data['email'], login['password']
        )
        return creation
    except requests.HTTPError:
        return {'error': 'Wrong Password'}
    except requests.ConnectionError:
        return {'error': 'Connection Error'}
    return {'code': 200}

@app.route('/user/signup', methods=['POST'])
def signup():
    """
    This route should validate and secure the inputted data
    as well as create an account for the user.
    """
    firebase = pyrebase.initialize_app(config)
    auth = firebase.auth()
    sign_data = request.get_json()
    if(sign_data['passCheck'] != sign_data['password']):
        return {'error': 'invalid sign up data'}
    else:
        try:
            creation = auth.create_user_with_email_and_password(
                sign_data['email'], sign_data['password']
            )
            return creation
        except requests.ConnectionError:
            return {'error': 'Connection Error'}
        except requests.HTTPError:
            return {'error': 'HTTP Error'}
        else:
            return {'error': 'Unknown Error'}