//This class responsible about the configure of the application, and placed service of the set header
let app = angular.module('citiesApp', ["ngRoute" , 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');

    //routs requests
    $routeProvider.when('/', {  
        templateUrl: 'components/home/home.html',
        controller : 'homeController as homeCtrl'
    })
        .when('/register', {
            templateUrl: 'components/register/register.html',
            controller : 'registerController as regCtrl'
        })
        .when('/about', {
            templateUrl: 'components/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        .when('/favorite', {
            templateUrl: 'components/favorite/favorite.html',
            controller : 'favoriteController as favCtrl'
        })
        .when('/home', {
            templateUrl: 'components/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        .when('/members', {
            templateUrl: 'components/members/members.html',
            controller : 'membersController as memCtrl'
        })
        .when('/points', {
            templateUrl: 'components/points/points.html',
            controller : 'pointsController as pntCtrl'
        })
        .when('/recover', {
            templateUrl: 'components/recover/recover.html',
            controller : 'recoverController as rcvCtrl'
        })
        .when('/poiInfo/:id', {
            templateUrl: 'components/poiInfo/poiInfo.html',
            controller : 'poiInfoController as piCtrl'
        })
        .otherwise({ redirectTo: '/' });


}])
//restore the token in the local storage - module to inject for the headeas
.service('setHeadersToken',[ '$http','localStorageService', function ($http,localStorageService) {

    this.set = function (t) {
        $http.defaults.headers.common[ 'x-access-token' ] = t;
        localStorageService.set("token",t);
        console.log("set")
    }
}])

;