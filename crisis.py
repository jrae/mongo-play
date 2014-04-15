from bson import Binary, Code, json_util
from bson.json_util import dumps
import json
import  re
import pymongo
from bottle import run,route,static_file,request,get,post


#Connect to local mongoDB

connection_string = "mongodb://localhost:27017"
connection = pymongo.MongoClient(connection_string)
database = connection.mongosizer

@route('/ping')
def ping():
    return {'hello':'world'}

#Top level page
@route('/')
def query_index():
    return static_file('index.html',root='./html')

#Anything in html directory send as is

@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root='./html')


run(host='0.0.0.0', port=8080)
