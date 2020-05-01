from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api
from flask.views import MethodView
from initialization import config
import requests
import pyrebase
import pymongo
import json


#MongoDB configuration
client = pymongo.MongoClient('localhost', 27017)

# Creating an instance with Flask
app = Flask(__name__)
CORS(app, cross_origin=['jisho.org', 'localhost:4200', 'firebaseapp.com', 'firebaseio.com'])

# Creating the API from the APP
api = Api(app)

# Interface-related routes

@app.route("/dictionary/kanji/<kanji>", methods=['GET'])
def getJishoKanji(kanji):
    """
    This route should get an kanji research request from the client, get it back
    from jisho.org (our dictionary source so far) and return the results for him.

    As this is an rest API, the attribute kanji of this function actually refers to the
    term kanji of the URL that is between the tags in this representation.

    This usage has been authorized by Kim Ahlström, Jisho.org's owner.
    """
    r = requests.get(config.jisho+kanji)
    data = r.json()
    return data

@app.route('/dictionary/sentence/<kanji>', methods=['GET'])
def getSentence(kanji):
    """
    This route should get an sentence that contains the requested kanji and return it and its
    translation (if there is one), to its client.

    All sentences used in our database come from the tatoeba project, https://tatoeba.org,
    whose data is released under CC-BY 2.0 FR
    """
    db = client['phrase_data']
    query_result = db['sentences'].find({"text": {"$regex": f"{kanji}"}})
    query_list = []
    for data in query_result:
        del data['_id']
        query_list.append(data)
    return {"data": query_list}


# User-related routes:

@app.route('/user/login', methods=['POST'])
def login():
    """
    This route should validate and secure the inputted data
    as well as make a login request to the database.
    """
    firebase = pyrebase.initialize_app(config.firebase_config)
    auth = firebase.auth()
    login_data = request.get_json()
    try:
        creation = auth.sign_in_with_email_and_password(
            login_data['email'], login_data['password']
        )
        return creation
    except requests.HTTPError:
        return {'error': 'Wrong Password'}
    except requests.ConnectionError:
        return {'error': 'Connection Error'}
    else:
        return {'error': 'Unknown Error'}

@app.route('/user/signup', methods=['POST'])
def signup():
    """
    This route should validate and secure the inputted data
    as well as create an account for the user.
    """
    firebase = pyrebase.initialize_app(config.firebase_config)
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
            return {'error': "Connection Error"}
        except requests.HTTPError:
            return {'error': "HTTP Error"}
        else:
            return {'error': "Unknown Error"}