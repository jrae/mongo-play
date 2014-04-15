import urllib2, json
import random

assets = [
{"_id" : "John", "type" : "person", "attributes" : {"name" : "John Lennon", "job" : "driver"}},
{"_id" : "Paul", "type" : "person", "attributes" : {"name" : "Paul McCartney", "job" : "medic"}},
{"_id" : "George", "type" : "person", "attributes" : {"name" : "George Harrison", "job" : "medic"}},
{"_id" : "Ringo", "type" : "person", "attributes" : {"name" : "Ringo Starr", "job" : "engineer"}},
{"_id" : "vehicle1", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08617401123046874, 51.52487262675978]}, "containing" : ["John", "Paul", "George", "Ringo"]},
{"_id" : "vehicle2", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.07836341857910156, 51.52528648801461]}},
{"_id" : "vehicle3", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08703231811523438, 51.52284331713511]}},
{"_id" : "vehicle4", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08934974670410155, 51.52599404854359]}},
{"_id" : "vehicle5", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08986473083496094, 51.52615424940099]}},
{"_id" : "vehicle6", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.07973670959472656, 51.52922465690234]}},
{"_id" : "vehicle7", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.076904296875     , 51.52492602842339]}},
{"_id" : "vehicle8", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08359909057617188, 51.52212235641814]}},
{"_id" : "vehicle9", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08990764617919922, 51.5212945726301 ]}},
{"_id" : "vehicle10", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08475780487060547, 51.52537994003543]}},
{"_id" : "vehicle11", "type" : "vehicle", "geometry" : { "type" : "point", "coordinates" : [-0.08065938949584961, 51.52513963445152]}}
]

categories = [
    {"_id" : "vehicle", "icon" : {"name" : "vehicle", "colour" : "blue"}},
    {"_id" : "person", "icon" : {"name" : "person", "colour" : "red"}}
]

vehno = 20
for asset in assets:
    if asset['type'] == 'vehicle':
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
