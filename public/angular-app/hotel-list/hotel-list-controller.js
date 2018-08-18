angular.module('meanHotel').controller('hotelsController', hotelsController);

/*function hotelsController(hotelDataFactoy){
    var vm = this;
    vm.title = 'Mean Hotel App';

    hotelDataFactory.hotelList().then(function(response){
        // console.log(response);
        vm.hotels = response;
    });
}*/

function hotelsController($http){
    var vm = this;
    vm.title = 'Mean Hotel App';

    $http.get('/api/hotels?count=10').then(function(response){
        vm.hotels = response.data;
    });
}