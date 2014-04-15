import urllib2, json
import random

assets = [
{"id" : "vehicle1", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08617401123046874, 51.52487262675978]}},
{"id" : "vehicle2", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.07836341857910156, 51.52528648801461]}},
{"id" : "vehicle3", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08703231811523438, 51.52284331713511]}},
{"id" : "vehicle4", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08934974670410155, 51.52599404854359]}},
{"id" : "vehicle5", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08986473083496094, 51.52615424940099]}},
{"id" : "vehicle6", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.07973670959472656, 51.52922465690234]}},
{"id" : "vehicle7", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.076904296875     , 51.52492602842339]}},
{"id" : "vehicle8", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08359909057617188, 51.52212235641814]}},
{"id" : "vehicle9", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08990764617919922, 51.5212945726301 ]}},
{"id" : "vehicle10", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08475780487060547, 51.52537994003543]}},
{"id" : "vehicle11", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08065938949584961, 51.52513963445152]}}
]

categories = [
    {"id" : "vehicle", "icon" : {"name" : "vehicle", "colour" : "blue"}},
    {"id" : "person", "icon" : {"name" : "person", "colour" : "red"}}
]

vehno = 20
for asset in assets:
    attribs = {}
    attribs['VehicleID'] = vehno
    vehno = vehno + 1
    attribs["Callsign"] = 'M' + str(random.randint(0,6)) +  chr(random.randint(1, 25) + 65)  + chr(random.randint(1, 25) + 65)   + chr(random.randint(1, 25) + 65)
    attribs['Type'] = random.choice(['Landrover 110','Landrover 90','Mitsubishi Shogun','Jeep'])
    attribs['Winch'] = random.choice(['Yes','No'])
    attribs['Status'] = random.choice(['Available','Tasked','Unserviceable'])
    if(attribs['Status'] == 'Tasked'):
        attribs['TaskedUntil'] = random.choice(['12:00','12:30','12:45','13:00','13:15'])
    asset['attributes'] = attribs

    req = urllib2.Request("http://0.0.0.0:8080/asset", json.dumps(asset), {"Content-Type": "application/json"})
    res = urllib2.urlopen(req)
    assert res.getcode() == 201

for cat in categories:
    req = urllib2.Request("http://0.0.0.0:8080/category", json.dumps(cat), {"Content-Type": "application/json"})
    res = urllib2.urlopen(req)
    assert res.getcode() == 201
