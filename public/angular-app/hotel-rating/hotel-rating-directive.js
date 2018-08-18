angular.module('meanHotel').directive('hotelRating', hotelRating);

function hotelRating(){
    return {
        restrict : 'E',
        template : '<i ng-repeat="star in vm.stars track by $index" class="fa fa-star">{{ star }}</i>',
        bindToController : true,
        controller : 'hotelController',
        controllerAS : 'vm',
        scope : { // to create isolate scope
            stars : '@'
        }
    }
}