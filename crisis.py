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
    response.body = dumps({"results" : [render_asset(record) for record in database.asset.find(dict(request.query)).sort([("attributes.Status",pymongo.ASCENDING)])] })
    response.content_type = "application/json"
    return response

@get('/asset/<id>')
def get_asset(id):
    response.body = dumps(render_asset(database.asset.find_one({"_id": id})))
    response.content_type = "application/json"
    return response

@post('/asset')
def asset_create():
    asset = request.json
    database.asset.update({"_id" : asset['_id']}, asset, upsert=True)
    response.set_header('Location', "/asset/%s" % asset['_id'])
    response.status = 201
    return response

@post('/update_asset')
def asset_create():
    asset = request.json
    database.asset.update({"_id" : asset['_id']}, asset, upsert=True)
    response.set_header('Location', "/asset/%s" % asset['_id'])
    response.status = 201
    return response

@post("/category")
def category_create():
    category = request.json
    database.category.update({"_id" : category['_id']}, category, upsert=True)
    response.set_header('Location', "/category/%s" % category['_id'])
    response.status = 201
    return response

@get("/category")
def categories():
    response.body = dumps({"results" : [dict(record) for record in database.category.find()]})
    response.content_type = "application/json"
    return response

@get("/category/<id>")
def get_category(id):
    response.body = dumps(database.category.find_one({"_id": id}))
    response.content_type = "application/json"
    return response

#Anything in html directory send as is

@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root='./html')

def render_asset(asset_record):
    copy = dict(asset_record)
    if "containing" in copy:
        copy['containing'] = [{"link" : "/asset/%s" % key } for key in asset_record['containing']]
    return copy

run(host='0.0.0.0', port=8080, debug=True, reloader=True)
