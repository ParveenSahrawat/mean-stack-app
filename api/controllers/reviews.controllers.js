var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// Get all the reviews for a hotel
module.exports.reviewsGetAll = (req, res) => {
    var hotelId = req.params.hotelId;
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec((error, hotel) => {
            var response = {
                status : 200,
                message : []
            };
            if(error){
                console.log("Error in finding the hotel");
                response.status = 500;
                response.message = error;
            }else if(!hotel){
                console.log(`Hotel with hotelId ${hotelId} not found`);
                response.status = 404;
                response.message = {
                    "message" : "Hotel not found"
                }
            }else{
                response.message = hotel.reviews ? hotel.reviews : [];
            }
            res
                .status(response.status)
                .json(response.message);
        });
}

// Get a single review for a hotel
module.exports.reviewsGetOne = (req, res) => {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec((error, hotel) => {
            var response = {
                status : 200,
                message : {}
            };
            if(error){
                console.log(`Error in finding hotel`);
                response.status = 500;
                response.message = error;
            }else if(!hotel){
                console.log(`Hotel with hotelId ${hotelId} not found`);
                response.status = 404;
                response.message = {
                    "message" : "Hotel not found"
                }
            }else{
                console.log(`Get the reviews for the hotel with hotelId ${hotelId}`);
                var review = hotel.reviews.id(reviewId);
                console.log(review);
                response.message = hotel.reviews.id(reviewId);    
            }
            res 
                .status(response.status)
                .json(response.message);
        });
}

var addReview = (req, res, hotel) => {
    hotel.reviews.push({
        name : req.body.name,
        rating : parseInt(req.body.rating, 10),
        review : req.body.review     
    });

    hotel.save((error, hotelUpdated) => {
        if(error){
            res 
                .status(500)
                .json(error);
        } else {
            res
                .status(201)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
        }
    })
}

// Add a single review to a hotel
module.exports.reviewsAddOne = (req, res) => {
    var hotelId = req.params.hotelId;
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec((error, hotel) => {
            var response = {
                status : 200,
                message : []
            }
            if(error){
                console.log("Error in finding the hotel");
                response.status = 500;
                response.message = error;
            } else if(!hotel){
                console.log(`Hotel with hotelId ${hotelId} not found`);
                response.status = 404;
                response.message = {
                    "message" : "Hotel not found"
                }
            }
            if(hotel){
                addReview(req, res, hotel);
            } else {
                res
                    .status(response.status)
                    .json(response.message);
            }
    });
}

// Update a single review
module.exports.reviewsUpdateOne = (req, res) => {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec((error, hotel) => {
            var response = {
                status : 200,
                message : {}
            };
            if(error){
                console.log(`Error in finding hotel`);
                response.status = 500;
                response.message = error;
            }else if(!hotel){
                console.log(`Hotel with hotelId ${hotelId} not found`);
                response.status = 404;
                response.message = {
                    "message" : "Hotel not found"
                }
            } else {
                // Get the review
                var thisReview = hotel.reviews.id(reviewId);
                // If review doesn't exist mongoose returns null
                if(!thisReview){
                    response.status = 404;
                    response.message = {
                        "message" : "Review with Id " + reviewId + " not found"
                    }
                }
            }

            if(response.status !==200){
                res 
                    .status(response.status)
                    .json(response.message);
            } else {
                console.log(`Get the reviews for the hotel with hotelId ${hotelId}`);
                thisReview.name = req.body.name;
                thisReview.rating = parseInt(req.body.rating, 10);
                thisReview.review = req.body.review;    
            }
            hotel.save((error, hotel) => {
                if(error){
                    res
                        .status(500)
                        .json(error);
                } else {
                    res
                        .status(204)
                        .json();
                }
            });
        });
}

// Delete a specific review
module.exports.reviewsDeleteOne = (req, res) => {   
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec((error, hotel) => {
            var response = {
                status : 200,
                message : {}
            };
            if(error){
                console.log(`Error in finding hotel`);
                response.status = 500;
                response.message = error;
            }else if(!hotel){
                console.log(`Hotel with hotelId ${hotelId} not found`);
                response.status = 404;
                response.message = {
                    "message" : "Hotel not found"
                }
            } else {
                // Get the review
                var thisReview = hotel.reviews.id(reviewId);
                // If review doesn't exist mongoose returns null
                if(!thisReview){
                    response.status = 404;
                    response.message = {
                        "message" : "Review with Id " + reviewId + " not found"
                    }
                }
            }

            if(response.status !==200){
                res 
                    .status(response.status)
                    .json(response.message);
            } else {
                hotel.reviews.id(reviewId).remove();
                 hotel.save((error, hotel) => {
                if(error){
                    res
                        .status(500)
                        .json(error);
                } else {
                    res
                        .status(204)
                        .json();
                }
            });
            }
        });
}