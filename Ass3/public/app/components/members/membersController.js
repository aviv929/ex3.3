angular.module('citiesApp')
.controller('membersController', ['$location', '$http' , 'localStorageService' , '$rootScope' ,'setHeadersToken', function($location , $http, localStorageService , $rootScope,$setHeadersToken) {
    self = this;
    self.favPoi = [];
    self.topTwo = [];
    var serverUrl = 'http://localhost:3000/';
    self.isSaved=false;

    //get local favorite list
 $rootScope.favToShow=localStorageService.get("favUser");

 if ($rootScope.favToShow==undefined || $rootScope.favToShow==null)
           $rootScope.favToShow=new Array();

 //retrieve favorite list from the server and combine it with local favorite list
 $http.get(serverUrl + "Users/verify/getFavorite")
 .then(function (response) {
     $rootScope.favDBList = response.data;

     if ($rootScope.favDBList!=undefined){
     for (var i=0;i<$rootScope.favDBList.length;i++)
     {
         if ( $rootScope.isContain($rootScope.favDBList[i]["pointID"],$rootScope.favToShow)==-1)     {

             $rootScope.favToShow.push({"pointID":$rootScope.favDBList[i]["pointID"]});
         }   
     } 
 }
 for (var i=0;i<$rootScope.favToShow.length;i++)
     {
        
         $rootScope.favToShow[i]=(localStorageService.get($rootScope.favToShow[i]["pointID"]));
         $rootScope.favToShow[i].tmpDel=false;   
     } 
     localStorageService.set("favUser",$rootScope.favToShow);
     if ($rootScope.favToShow.length==0)
     {
       self.isSaved=false;
     }
     else {
       self.isSaved=true;
       for (var i=0; i<$rootScope.favToShow.length && i<2; i++) {
           var x = localStorageService.get(($rootScope.favToShow[i]["pointID"]));
           self.favPoi.push(x);
           }
       }
 }, function (response) {
 });

    //brind specific point of interest from the server
    $http.get(serverUrl + "Users/verify/getUser")
      .then(function (response){
            var arr = [response.data[0].catList[0], response.data[0].catList[1]];
            var firstCat = getPoiByCat(arr[0]);
            var secCat = getPoiByCat(arr[1]);
            self.topTwo = getTop(firstCat,secCat);      
        }, function (response) {

        })

        //retrive the 2 top values from the combine of the lists
        function getTop(arr1,arr2)
        {
            arr1.sort(function(a, b){
                return ((b.sumOfGrade/b.numOfGrade) - (a.sumOfGrade/a.numOfGrade))});
            arr2.sort(function(a, b){
                return ((b.sumOfGrade/b.numOfGrade) - (a.sumOfGrade/a.numOfGrade))});
            var arr3 = [arr1[0],arr1[1],arr2[0],arr2[1]];
            arr3.sort(function(a, b){
                return ((b.sumOfGrade/b.numOfGrade) - (a.sumOfGrade/a.numOfGrade))});   
            return [arr3[0],arr3[1]];
        }

        //return list of all points filtered by category
        function getPoiByCat(CAT) {
            var ALL = localStorageService.get("allPoints");
            var catPoints = [];
            for (var key in ALL) {
                if (ALL[key].category==CAT) { 
                    catPoints.push(ALL[key]);
                }
            }
            return catPoints;
        }

        //redirect to point profile page
        self.getPoiInfo = function(id)
        {
            $location.path('/poiInfo/'+id);
            $location.replace();
        }

        //reset values by logout
        self.logOut = function()
        {
            localStorageService.remove("token");
            $rootScope.shopCounter=0;
            localStorageService.remove("favUser");
            $rootScope.isConnect=false;
            $rootScope.helloName="guest";
            $location.path('/home');
            $location.replace();
        }
  
}]);