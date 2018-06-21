angular.module('citiesApp')
.controller('homeController', ['$location', '$http' ,'localStorageService', '$rootScope' ,'setHeadersToken', function($location , $http, localStorageService,$rootScope,setHeadersToken) {

    self = this;
    let serverUrl = 'http://localhost:3000/';
    self.cities = [];
    var citiesList=[];
    var thershold=1;


    //fiter by the rate of the point
    filterByGrade = function()
    {
        for(var i=0;i<citiesList.length;i++)
        {
            if (citiesList[i].numOfGrade==0)
                citiesList[i].numOfGrade=1;
            var rate = citiesList[i].sumOfGrade/citiesList[i].numOfGrade;
            if (rate<thershold)
            {
                delete citiesList[i];
            }
        }
    }
   

    //pick random id of points of interset to show
    pickRandom = function()
    {
        var index = 0;
        var end= 3;
        if (citiesList.length<end)
        end=citiesList.length;
        while (index<end)
        {
            var rnd = Math.floor(Math.random() * (citiesList.length - index));
            if (citiesList[rnd]!=undefined){
            self.cities[index] = citiesList[rnd];
            citiesList[rnd] = citiesList[citiesList.length - index];
            citiesList[citiesList.length - index] = self.cities[index];
            index++;
            }
        }
    }

    //retrive all the points of interest for future usage
    $http.get(serverUrl + "Points/getAllPoints")
    .then(function (response){
        var allPoints=new Array();
       for (var i=0;i<response.data.length;i++){
          localStorageService.set(response.data[i].pointID,response.data[i]);
          allPoints.push(response.data[i]);
       }
       
       localStorageService.set("allPoints",allPoints);
       citiesList = localStorageService.get("allPoints");
       filterByGrade();
       pickRandom();
       
    }, function (response) {
        console.log("There is no points in the DB..");
    })

    //redirect to register page
    self.register = function ()
    {
        $location.path('/register');
        $location.replace();
    };

    //validate data and login if valid and update token
    self.retivePass = function()
    {
        $location.path('/recover');
        $location.replace();
    }

    //redirect to login page
    self.login = function()
    {
        if (!self.userName || !self.password)
        {
            alert("User Name or Password are missing..");
            return;
        }
        else {
        
        data={
            "userName": self.userName,
            "password": self.password
        }
        $http.post(serverUrl+"Users/login", data)
        .then(function (response) {
            if (response.data=="Invalid Parameters") {
            alert("User Name or Password are no correct");
            return;
            }
            else
            {
                localStorageService.remove("favUser");
                $rootScope.favToShow=[];
                $rootScope.favDBList=[];
                $rootScope.isConnect=true;
                setHeadersToken.set(response.data.token);

                $http.get(serverUrl + "Users/verify/getUser")
                .then(function (response){  
                    $rootScope.helloName= response.data[0].userName;
                    
                }, function (response) {
                    console.log("There is no points in the DB..");
                })

                alert("WELCOME TO NEW YORK TRAVELS");
                $location.path('members');
                $location.replace();
            }
        }, function (response) {

        });
    }
    }

    //redirect to point of interst profile page
    self.getPoiInfo = function(id)
    {
        $location.path('/poiInfo/'+id);
        $location.replace();
    }
}]);