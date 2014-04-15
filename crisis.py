from bson import Binary, Code, json_util
from bson.json_util import dumps
import json
import  re
import pymongo
from bottle import run,route,static_file,request,get,post, response


#Connect to local mongoDB

connection_string = "mongodb://localhost:27017"
connection = pymongo.MongoClient(connection_string)
database = connection.mongosizer

@post('/square')
def square():
    print request.json
    number = request.json['aNumber']
    return { 'result' : number*number}

@route('/assets')
def getAssets():
    assets = [];
    for v in xrange(1,5):
        veh = { 'Name' : "Vehicle" + str(v) }
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
    return database.asset.find(dict(request.query))

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
