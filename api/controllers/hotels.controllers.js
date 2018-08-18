var mongoose  = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = (req, res) => {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    // A geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };

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
}

module.exports.hotelsGetOne = (req, res) => {
    var hotelId = req.params.hotelId;
    console.log('Get the hotel with hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .exec((error, doc) => {
            if(error){
                console.log('Error in finding hotel');
                res
                    .status(500)
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

module.exports.hotelsUpdateOne = (req, res) => {
    var hotelId = req.params.hotelId;
    console.log('Get the hotel with hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")
        .exec((error, doc) => {
            var response = {
                status : 200,
                message : {}
            }
            if(error){
                console.log('Error in finding hotel');
                response.status = 500;
                response.message = error;
            } else if(!doc){
                response.status = 404;
                response.message = "Hotel Id not found";
            }
            if(response.status !== 200){
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                doc.name = req.body.name;
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = splitArray(req.body.services);
                doc.photos = splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address : req.body.address,
                    coordinates : [
                        parseFloat(req.body.lng),
                        parseFloat(req.body.lat)
                    ]
                }
                doc.save((error, hotelUpdated) => {
                    if(error){
                        res
                            .status(500)
                            .json(error)
                    } else {
                        res 
                            .status(204)
                            .json();
                    }
                });
            }
        });
}

// Delte a specific hotel
module.exports.hotelsDeleteOne = (req, res) => {
    var hotelId = req.params.hotelId;
    Hotel
        .findByIdAndRemove(hotelId)
        .exec((error, hotelDeleted) => {
            if(error){
                res
                    .status(404)
                    .json(error);
            } else {
                console.log('Hotel deleted by id ', hotelId);
                res
                    .status(204)
                    .json();
            }
        });
}