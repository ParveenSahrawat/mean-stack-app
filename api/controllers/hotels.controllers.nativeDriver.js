var mongoose  = require('mongoose');
var Hotel = mongoose.model('Hotel');


//var dbConn = require('../data/dbConnection.js');
//var ObjectId = require('mongodb').ObjectId;
//var hotelData = require('../data/hotel-data.json');

var runGeoQuery = (req, res) => {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    // A geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    /*var geoOptions = {
        spherical : true,
        maxDistance : 2000,
        num : 5
    };*/

    Hotel
        .aggregate([
            {
                $geoNear : {
                    near : point,
                    spherical : true,
                    maxDistance : 2000,
                    num : 5,
                    distanceField : "dist.calculated"
                }
            }
        ], (error, results, stats) => {
            if(error){
                res 
                    .status(400)
                    .json(error);
            } else if(!results){
                res     
                    .status(404)
                    .json('Hotel with these coordinates ' + coordinates + ' are not found ');
            }
            console.log(`Stats : ${stats}`)
            res
                .status(200)
                .json(results);
        });
}

module.exports.hotelsGetAll = (req, res) => {

   // var client = dbConn.get();//get the data
    //var collection = client.db('meanhotel').collection('hotels');

    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if(req.query && req.query.lat && req.query.lng){
        runGeoQuery(req, res);
        return;
    }

    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10);
    }
    if(req.query && req.query.count){
        count = parseInt(req.query.count, 10);
    }
    
    if(isNaN(offset) || isNaN(count)){
        res
            .status(400)
            .json({"message" : "Querystring should contain count and offset as numbers."});
        return; 
    }

    if( count > maxCount){
        res
            .status(400)
            .json({"meassage" : "Count limit of " + maxCount + " exceeded"});
        return;    
    }
    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec((error, hotels) => {
            if(error){
                console.log(`Error in finding hotels.`);
                res 
                    .status(500)
                    .json(error);
            } else {
                console.log(`Found ${hotels.length} hotels`);
            res
                .status(200)
                .json(hotels);
            }   
        });
    /*collection
        .find()
        .skip(offset)
        .limit(count)
        .toArray( (error, docs) => {
            res
                .send(200)
                .json(docs);
        });
    var returnedData = hotelData.slice(offset, offset+count);
    console.log('Get the hotels');
    res
        .status(200)
        .json(returnedData);*/
}

module.exports.hotelsGetOne = (req, res) => {
    //var client = dbConn.get();//get the data
    //var collection = client.db('meanhotel').collection('hotels');

    var hotelId = req.params.hotelId;
    console.log('Get the hotel with hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .exec((error, doc) => {
            if(error){
                console.log('Error in finding hotel');
                res
                    .status(400)
                    .json(error);
            } else if(!doc){
                res
                    .status(404)
                    .json("Hotel Id not found");
            }
            res
                .status(200)
                .json(doc);
        });
}

var splitArray = (input) => {
    var output;
    if(input && input.length > 0){
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
}

module.exports.hotelsAddOne = (req, res) => {
   // Native driver code
    /* var client = dbConn.get();//get the data
    var collection = client.db('meanhotel').collection('hotels');
    var newHotel;
    console.log(req);
    //console.log(res.body.name);
    //console.log(req.body.stars);

    if(req.body && req.body.name && req.body.stars){
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);
        collection.insertOne(newHotel, (error, response) => {
            res
                .status(201)
                .json(response);
        })
    }else{
        res 
            .status(400)
            .json({'message' : 'Data  is missing from body'});
    }*/
    console.log(req.body);
    Hotel
        .create(
            {
                name : req.body.name,
                description : req.body.description,
                stars : parseInt(req.body.stars, 10),
                services : splitArray(req.body.services),
                photos : splitArray(req.body.photos),
                currency : req.body.currency,
                location : {
                    address : req.body.address,
                    coordinates : [
                        parseFloat(req.body.lng),
                        parseFloat(req.body.lat)
                    ]
                }
            }, (error, hotel) => {
            if(error){
                console.log(`Error in creating hotel`);
                res 
                    .status(400)
                    .json(error);
            } else {
                console.log('Hotel created ', hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });    
}