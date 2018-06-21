angular.module('citiesApp')
    .controller('pointsController', ['$location', '$http' ,'localStorageService',  '$rootScope', 'setHeadersToken',function($location , $http, localStorageService,$rootScope,setHeadersToken) {

    let serverUrl = 'http://localhost:3000/';
    var self = this;
    self.point="";
    self.name="";
    self.selectedRate=0;
    self.selectedOrder='pointID';
    self.selectedCat={category: 'any'};
    self.isnotlogged=false;
    self.numOfRows=0;
    self.hasRows=true;
    self.favorites=[];
    self.rates =[ 0, 1, 2, 3, 4, 5 ];
    self.orderby =  [ "pointID",  "pointName",  "category", "pointRate"] ;
    self.points=localStorageService.get("allPoints");

if (localStorageService.get("token")==undefined)
    self.isnotlogged=true;

//set values for each point e.g favorite, rate, localID...
for (let i = 0; i < self.points.length; i++) {
    if ($rootScope.favToShow==undefined)
        self.favorites[i]=false;
    else if ($rootScope.isContain(self.points[i]["pointID"],$rootScope.favToShow)==-1)
        self.favorites[i]=false;
    else
        self.favorites[i]=true;

    self.points[i].localID=i;
    self.points[i].pointRate=-20*Math.round(self.points[i].sumOfGrade/self.points[i].numOfGrade);
    if (isNaN(self.points[i].pointRate))
          self.points[i].pointRate=0;
}

//retrieve categories from the server and prepare the data for the ng repeat
$http.get(serverUrl+'Points/getCategory')
    .then(function(response){
        var temp=new Array();
        temp[0]={category: 'any'}
        for (let i = 0; i < response.data.length; i++) {
            temp[i+1]=response.data[i];
        }
        self.categories =temp;
    },function(response) {
});

//redirect to the point profile page
self.getPoiInfo = function(id)
{
    $location.path('/poiInfo/'+id);
    $location.replace();
}

    //filter the row from the ng repeat by namge rate and caegory
    self.filterFn=function(row){
        if ((self.selectedCat.category==='any' ||row.category===self.selectedCat.category) &&row.pointName.toLowerCase().includes(self.name))
        {
            if (isNaN(row.sumOfGrade/row.numOfGrade) &&self.selectedRate==0) {
                self.numOfRows++;
                self.hasRows=true;
                return true;
            }
            else if (20*row.sumOfGrade/row.numOfGrade>=self.selectedRate)
            {
                self.numOfRows++;
                self.hasRows=true;
                return true;
            }
        }
        if (self.numOfRows==0)
            self.hasRows=false;
        return false;
    };

    self.hidden=true;
    self.reviewName="12";
    self.reviewRate=-1;
    self.reviewText="";

    //prepare the values for making rate
    self.makeRate=function(id,name)
    {
        //alert(id+name);
        self.hidden=false;
        self.reviewName=name;
    }

    //add the chosen point to the local favorite list
    self.addToFavorites=function(picid,id)
    {
        self.favorites[picid]=true;
        $rootScope.shopCounter++;
        $rootScope.favToShow.push(localStorageService.get(id));
        localStorageService.set("favUser", $rootScope.favToShow);
        console.log(localStorageService.get("favUser"));
    }

    //remove the chosen point from the local favorite list
    self.removeFromFavorites=function(picid,id)
    {
        self.favorites[picid]=false;
        for (var i=0;i<$rootScope.favToShow.length;i++)
        {
                if ($rootScope.favToShow[i]["pointID"]==id) {
                if ( $rootScope.shopCounter>0)
                $rootScope.shopCounter--;
                $rootScope.favToShow[i]["pointID"].tmpDel=true;
                $rootScope.favToShow.splice(i, 1);
                localStorageService.remove("favUser");
                localStorageService.set("favUser",$rootScope.favToShow);
                return;
                }
        }
    }

    //zero the num of the row for future counting
    self.zeroRows=function()
    {
        self.numOfRows=0;
    }


    //add update and remove the favoites table in the server by the local favorites list
    self.sevFav = function()
    {
        
        if (   (($rootScope.favToShow!=undefined || $rootScope.favToShow!=null))){
        for (var i=0;i<$rootScope.favToShow.length;i++)
        {
            var x = $rootScope.isContain($rootScope.favToShow[i]["pointID"],$rootScope.favDBList);
                if (x == -1)
            {
                data={
                    "pointID": $rootScope.favToShow[i]["pointID"],
                    // "priority": $rootScope.favToShow.length+1
                    "priority": $rootScope.favToShow[i].priority
                };
                $http.post(serverUrl+"Users/verify/addFavorite", data)
                .then(function (response){
                }, function (response) {
                });
            }
        }
    }
        if (($rootScope.favDBList!=undefined || $rootScope.favDBList!=null)){
        for (var i=0;i<$rootScope.favDBList.length;i++)
        {
            var x = $rootScope.isContain($rootScope.favDBList[i]["pointID"],$rootScope.favToShow);
            if (x==-1)
            {
                data={
                    "pointID": $rootScope.favDBList[i]["pointID"]
                };
                $http.put(serverUrl + "Users/verify/delFavorite",data)
                .then(function (response){
                }, function (response) {
                });
            }
        }

    }
}
}]);

