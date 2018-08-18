angular.module('meanHotel').controller('hotelController', hotelController);

/*function hotelController(hotelDataFactory, $routeParams){
    var vm = this;
    var id = $routeParams.id;
    hotelDataFactory.hotelDisplay(id).then(function(response){
        vm.hotel = response;
    });
}*/

function hotelController($http, $routeParams){
    var vm = this;
    var id = $routeParams.id;
    $http.get('/api/hotels/' + id).then(function(response){
        vm.hotel = response.data;
        vm.stars = getStarRating(response.data.stars);
    });

    function getStarRating(star){
        return new Array(star);
    }
}