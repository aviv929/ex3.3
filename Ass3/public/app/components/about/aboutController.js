angular.module('citiesApp')
.controller('aboutController', ['$location', '$http' ,'localStorageService', function($location , $http, localStorageService) {      self = this;
      let serverUrl = 'http://localhost:3000/';

      //data for the ng-repeat that show some point of intersts by those id
      self.points=[
        localStorageService.get("1"),
        localStorageService.get("6"),
        localStorageService.get("11"),
        localStorageService.get("17"),
        localStorageService.get("20"),
      ];

    //redirect to the point profile
      self.getPoiInfo = function(id)
      {
          $location.path('/poiInfo/'+id);
          $location.replace();
      }
  }]);