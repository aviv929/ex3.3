//This class responsible about the local storage service 
angular.module("citiesApp")
    .service('localStorageModule', ['localStorageService', '$rootScope', function(localStorageService, $rootScope) {

       var self=this;
        //add for the local storage
       self.addLocalStorage = function (key, value) {
           var dataVal = localStorageService.get(key);
           if (!dataVal)
           if (localStorageService.set(key, value)) {

           }

       }

       //ger from the local storage
       self.getLocalStorage= function (key)
       {
          return  localStorageService.get(key)
       }

       //update the local storage
       self.updateLocalStorage = function (key,value)
       {
           localStorageService.remove(key);
           localStorageService.set(key,value);
       }

      


    }])