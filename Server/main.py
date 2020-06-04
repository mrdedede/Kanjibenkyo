from flask import Flask, Response, jsonify, request, render_template
from flask_cors import CORS
from flask_restful import Resource, Api
from flask.views import MethodView
from initialization import config, util
import requests
import pyrebase
import pymongo
import json


#MongoDB configuration
client = pymongo.MongoClient(config.mongo, connectTimeoutMS=30000, socketTimeoutMS=None, socketKeepAlive=True, connect=False, maxPoolsize=1)

# Creating an instance with Flask
app = Flask(__name__)
CORS(app, cross_origin=['jisho.org', 'localhost:4200', 'firebaseapp.com', 'firebaseio.com',
    'mongodb.net', 'pythonanywhere.com'])

# Creating the API from the APP
api = Api(app)

# Test routes

@app.route('/')
@app.route('/home')
@app.route('/login')
@app.route('/signup')
@app.route('/level')
@app.route('/about')
def get_page():
    # Remember that, when deploying, we should not place --base-href and also
    # the path /static should be placed at the url and href attributes manually
    return render_template("index.html")

# Kanji-related routes

@app.route('/dictionary/sentence/<kanji>', methods=['GET'])
def get_sentence(kanji):
    """
    This route gets a sentence that contains the requested kanji and returns it and its
    translation (if there is one), to its client.

    All sentence data used in our database comes from the tatoeba project, https://tatoeba.org,
    whose data is released under CC-BY 2.0 FR
    """
    db = client['phrase_data']
    query_result = db['sentences'].find({"text": {"$regex": f"{kanji}"}}).limit(20)
    query_list = []
    for data in query_result:
        del data['_id']
        query_list.append(data)
    return {"data": query_list}

@app.route('/kanji/<level>', methods=['GET'])
def get_level(level):
    """
    This route gets all the kanji that are from the specified level and returns it to the client

    All kanji data used in our database comes from Tanos, http://www.tanos.co.uk/jlpt/skills/kanji/,
    whose data is licenced under Creative Commons "BY"
    """
    db = client['kanji']
    query_result = db[level].find()
    query_list = []
    for data in query_result:
        del data['_id']
        query_list.append(data)
    return {"data": query_list}

@app.route('/kanji/<level>/<kanji>', methods=['GET'])
def get_kanji(level, kanji):
    """
    This route gets an specific kanji from an specific level

    All kanji data used in our database comes from Tanos, http://www.tanos.co.uk/jlpt/skills/kanji/,
    whose data is licenced under Creative Commons "BY"
    """
    db = client['kanji']
    query_result = db[level].find({'kanji': kanji})
    query_list = []
    for data in query_result:
        del data['_id']
        query_list.append(data)
    return {"data": query_list}

@app.route('/user/kanji/new', methods=['POST'])
def update_known_list():
    """
    This route changes the list of the current user's known kanji, whose data is in firebase.
    """
    firebase = pyrebase.initialize_app(config.firebase_config)
    user_info = request.get_json()
    try:
        db = firebase.database()
        new_req = db.child('users').child(util.get_user(user_info['email'])).update({'kanji_known': user_info['kanji_known']})
        return new_req
    except requests.HTTPError:
        return {'error': 'Wrong Password'}
    except requests.ConnectionError:
        return {'error': 'Connection Error'}
    else:
        return {'error': 'Unknown Error'}

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
        db = firebase.database()
        user_data = db.child('users').child(util.get_user(login_data['email'])).get()
        creation['kanji_known'] = user_data.val()['kanji_known']
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
    This route validates and secures the inputted data, creates an account for the user and
    creates an instance for it in firebase, so we can keep track of its progress.
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
            new_user_data = {"kanji_known": ""}
            db = firebase.database()
            db.child("users").child(util.get_user(creation['email'])).set(new_user_data)
            creation['kanji_known'] = " "
            return creation
        except requests.ConnectionError:
            return {'error': "Connection Error"}
        except requests.HTTPError:
            return {'error': "HTTP Error"}
        else:
            return {'error': "Unknown Error"}