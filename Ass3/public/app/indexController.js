//This class responsible about the main index
angular.module('citiesApp')
    .controller('indexController', ['$location', '$http' ,'localStorageService', '$rootScope', 'setHeadersToken',function($location , $http, localStorageService,$rootScope ,setHeadersToken) {
        self = this;

        var serverUrl = 'http://localhost:3000/';
        $rootScope.isConnnect = false;
        $rootScope.helloName= "guest";
        $rootScope.shopCounter=0;

        //get points from the server to the local storage - once
        $http.get(serverUrl + "Points/getAllPoints")
        .then(function (response){
            var allPoints=new Array();
           for (var i=0;i<response.data.length;i++){
              localStorageService.set(response.data[i].pointID,response.data[i]);
              allPoints.push(response.data[i]);
           }
           
           localStorageService.set("allPoints",allPoints);
           
        }, function (response) {
            console.log("There is no points in the DB..");
        })

     
        //if there is user login - get his favorite - once
        if(localStorageService.get('token')!=undefined){
        $rootScope.favToShow=localStorageService.get("favUser");
        if ($rootScope.favToShow==undefined || $rootScope.favToShow==null)
                  $rootScope.favToShow=new Array();
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
        }, function (response) {
        });
    }

    //if there is user login - get his token - once
    if (localStorageService.get('token')!=undefined)
    {
        setHeadersToken.set((localStorageService.get('token')));
        $rootScope.isConnect=true;
        $http.get(serverUrl + "Users/verify/getUser")
    .then(function (response){  
        $rootScope.helloName= response.data[0].userName;
       
       
    }, function (response) {
        console.log("There is no points in the DB..");
    })
      
        $location.path('/members');
        $location.replace();
    }

    //function that a lot of use for some controlores
    $rootScope.isContain = function(id,arr)
    {
        for (var i=0;i<arr.length;i++)
        {
            if (arr[i]["pointID"]==id){
                return i;
            }
               
        }
        return -1;
    }

    }]);

