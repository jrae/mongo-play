from bson import Binary, Code, json_util
from bson.json_util import dumps
import json
import  re
import pymongo
from pymongo import GEO2D
from bottle import run,route,static_file,request,get,post, response
import random;

#Connect to local mongoDB

connection_string = "mongodb://localhost:27017"
connection = pymongo.MongoClient(connection_string)
database = connection.mongosizer
database.asset.ensure_index([("geometry.coordinates", GEO2D)])

@post('/square')
def square():
    print request.json
    number = request.json['aNumber']
    return { 'result' : number*number}

@route('/assets')
def getAssets():
    assets = []
    for v in xrange(1,5):
        status=random.choice(['tasked','free','issue'])
        veh = { 'Name' : "Vehicle" + str(v),
                'Location' : { 'lat': 51.52487262675978, 'long': -0.08617401123046874},
                'Callsign' : 'SC' + str(v),
                'status' : status,
                'Type' : 'Land Rover 110' }

        assets.append(veh)
    print assets
    return {'result': assets}

@route('/ping')
def ping():
    return {'hello':'world'}

#Top level page
@route('/')
def query_index():
    return static_file('index.html',root='./html')

@get('/asset')
def asset_search():
    response.body = dumps({"results" : [dict(record) for record in database.asset.find(dict(request.query))] })
    response.content_type = "application/json"
    return response

@post('/asset')
def asset_create():
    asset = request.json
    database.asset.insert(asset)
    response.set_header('Location', "/asset/%s" % asset['_id'])
    response.status = 201
    return response

#Anything in html directory send as is

@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root='./html')


run(host='0.0.0.0', port=8080, debug=True, reloader=True)
