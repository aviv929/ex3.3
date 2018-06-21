angular.module('citiesApp')
    .controller('favoriteController', ['$location', '$http' ,'localStorageService','$rootScope', 'setHeadersToken', function($location , $http, localStorageService,$rootScope,$setHeadersToken) {  
        var self = this;
        let serverUrl = 'http://localhost:3000/';
        self.point="";
        self.name="";
        self.selectedRate=0;
        self.selectedOrder='myOrder';
        self.selectedCat={category: 'any'};
        self.isnotlogged=false;
        self.numOfRows=0;
        self.hasRows=true;
        self.favorites=[];
        self.myOrder=[];
        self.myOrderBank=[]
        self.rates =[ 0, 1, 2, 3, 4, 5 ]
        self.orderby =  [ "pointID",  "pointName",  "category", "pointRate", "myOrder" ]
        console.log($rootScope.favToShow);
        $rootScope.favToShow=localStorageService.get("favUser");
        if ($rootScope.favToShow==undefined || $rootScope.favToShow==null)
                  $rootScope.favToShow=new Array();

        //retrieve favorite list from the server and combine it with local favorite list
        $http.get(serverUrl + "Users/verify/getFavorite")
        .then(function (response) {
            $rootScope.favDBList = response.data;
            var max=0;
            if (!$rootScope.isConnect){
                if ($rootScope.favDBList!=undefined){
                    for (var i=0;i<$rootScope.favDBList.length;i++)
                    {
                        if ( $rootScope.isContain($rootScope.favDBList[i]["pointID"],$rootScope.favToShow)==-1)     {
                            $rootScope.favToShow.push({
                                "pointID":$rootScope.favDBList[i]["pointID"],
                                "priority": $rootScope.favToShow[i].priority
                             });
                        }
                        if ($rootScope.favDBList[i].myOrder>=max)
                        max=$rootScope.favDBList[i].myOrder;
                    }
                }
            }
            for (var i=0;i<$rootScope.favToShow.length;i++)
            {
                $rootScope.favToShow[i]=(localStorageService.get($rootScope.favToShow[i]["pointID"]));
                for (let j = 0; j < $rootScope.favDBList.length; j++) {
                    if ($rootScope.favToShow[i].pointID===$rootScope.favDBList[j].pointID) {
                        $rootScope.favToShow[i].priority = $rootScope.favDBList[j].priority;
                    }
                }
                if($rootScope.favToShow[i].priority==undefined) {
                    $rootScope.favToShow[i].priority = 0;
                }
                $rootScope.favToShow[i].tmpDel=false;
            }
            $rootScope.favToShow.sort(function(a, b){
                return (a.priority - b.priority);
            });
            for(let i = 0; i < $rootScope.favToShow.length; i++) {
                console.log( $rootScope.favToShow[i].priority);
                $rootScope.favToShow[i].priority=document.getElementById("myTable").getElementsByTagName("tr")[i+1].getElementsByTagName("td")[7].innerText;
                console.log( $rootScope.favToShow[i].priority);
            }
            for (let i = 0; i < $rootScope.favToShow.length; i++) {
                self.favorites[i]=false;
                $rootScope.favToShow[i].myOrder=$rootScope.favToShow[i].priority;
                $rootScope.favToShow[i].localID=$rootScope.favToShow[i].pointID;
                $rootScope.favToShow[i].pointRate=-20*Math.round($rootScope.favToShow[i].sumOfGrade/$rootScope.favToShow[i].numOfGrade);
                if (isNaN($rootScope.favToShow[i].pointRate))
                    $rootScope.favToShow[i].pointRate=0;
            }
                localStorageService.set("favUser",$rootScope.favToShow);

            }, function (response) {
            });

        //add update and remove the favoites table in the server by the local favorites list
        self.sevFav = function() {     
            if ((($rootScope.favToShow!=undefined || $rootScope.favToShow!=null))){
            for (var i=0;i<$rootScope.favToShow.length;i++)
            {
                var x = $rootScope.isContain($rootScope.favToShow[i]["pointID"],$rootScope.favDBList);
                if (x == -1)
                {
                    data={
                        "pointID": $rootScope.favToShow[i]["pointID"],
                        "priority": $rootScope.favToShow[i].myOrder
                    };

                    $http.post(serverUrl+"Users/verify/addFavorite", data)
                    .then(function (response){
                        console.log("here1");
                    }, function (response) {
                        console.log("err");

                    });
                }
                else
                {
                    data={
                        "pointID": $rootScope.favToShow[i]["pointID"],
                        "priority": $rootScope.favToShow[i].myOrder
                    };
                    $http.put(serverUrl+"Users/verify/updateFavorite", data)
                        .then(function (response){
                            console.log("here2");

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


    //retrieve specific point from the server
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

    //redirect to point profile page
self.getPoiInfo = function(id)
{
    $location.path('/poiInfo/'+id);
    $location.replace();
}

//filter the row of the ng repeat by category name and rate
self.filterFn=function(row){
    if (row.tmpDel==true) {
        return false;
    }
    if ((self.selectedCat.category==='any' ||row.category===self.selectedCat.category) &&row.pointName.toLowerCase().includes(self.name.toLowerCase())){
        if (isNaN(row.sumOfGrade/row.numOfGrade) &&self.selectedRate==0) {
            self.numOfRows++;
            self.hasRows=true;
            return true;
        }
        else if (20*row.sumOfGrade/row.numOfGrade>=self.selectedRate){
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
self.reviewName="";
self.reviewRate=-1;
self.reviewText="";
self.reviewID=0;

    //make the rate enabled
    self.makeRate=function(id,name)
    {
        self.hidden=false;
        self.reviewID=id;
        self.reviewName=name;
    }

    //send review request and rate request with specific data
    self.sendReview=function() {
        if (self.reviewRate != null && self.reviewRate < 6 && self.reviewRate > -1)
        {
            var data={};
            data.pointID = self.reviewID;
            data.grade = self.reviewRate;
            $http.put(serverUrl+'Users/verify/addGrade',data)
                .then(function (response) {


                }, function (response) {
            });
        }
        if (self.reviewText != null && self.reviewText !="") {
            var data={};
            data.pointID = self.reviewID;
            data.review = self.reviewText;
            $http.post(serverUrl+'Users/verify/addReview',data)
                .then(function (response) {

                }, function (response) {
                });
        }
        self.hidden = true;
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

//zero parameter for future counting
self.zeroRows=function()
{
    self.numOfRows=0;
}

self.MOmode="Choose your order";
self.MOhide=true;
self.MOlist=[];
self.MOselctedlist1=1;
self.MOselctedlist2=1;

//enabled my order mode so u can change the personal order of the username, also make finish button enabled
self.MOchangeMode=function () {
    if ($rootScope.favToShow==null || $rootScope.favToShow==undefined)
    {
        return;
    }
    if(self.MOmode==="Choose your order")
    {
        self.MOlist=[];
        for (let i = 0; i <$rootScope.favToShow.length ; i++) {
            self.MOlist[i]=document.getElementById("myTable").getElementsByTagName("tr")[i+1].getElementsByTagName("td")[7].innerText;
            $rootScope.favToShow[i].myOrder == self.MOlist[i];
        }
            console.log( self.MOlist);

        for (let i = 0; i <self.MOlist.length-1 ; i++) {
            for (let j = i+1; j <self.MOlist.length ; j++) {
                if (self.MOlist[i]>self.MOlist[j])
                {
                    var temp=self.MOlist[i];
                    self.MOlist[i]=self.MOlist[j];
                    self.MOlist[j]=temp;
                }
            }
        }

        self.MOselctedlist1=self.MOlist[0];
        self.MOselctedlist2=self.MOlist[0];

        self.MOhide=false;
        self.MOmode="back";
    }
    else
    {
        self.MOhide=true;
        self.MOmode="Choose your order";
    }
}

//swap between 2 select rows of the data of the ng repeat
self.MOswap=function () {
    var i1,i2;
    if ($rootScope.favToShow!=null || $rootScope.favToShow!=undefined) {
        for (let i = 0; i < $rootScope.favToShow.length; i++) {
            if ($rootScope.favToShow[i].myOrder == self.MOselctedlist1)
                i1 = i;
            if ($rootScope.favToShow[i].myOrder == self.MOselctedlist2)
                i2 = i;
        }
    }
    
    if ($rootScope.favToShow[i1]!=null && $rootScope.favToShow[i2]!=null){
    var x=$rootScope.favToShow[i1].pointID;
    $rootScope.favToShow[i1].pointID=$rootScope.favToShow[i2].pointID;
    $rootScope.favToShow[i2].pointID=x;

    x=$rootScope.favToShow[i1].pointName;
    $rootScope.favToShow[i1].pointName=$rootScope.favToShow[i2].pointName;
    $rootScope.favToShow[i2].pointName=x;

    x=$rootScope.favToShow[i1].pointRate;
    $rootScope.favToShow[i1].pointRate=$rootScope.favToShow[i2].pointRate;
    $rootScope.favToShow[i2].pointRate=x;

    x=$rootScope.favToShow[i1].category;
    $rootScope.favToShow[i1].category=$rootScope.favToShow[i2].category;
    $rootScope.favToShow[i2].category=x;

    x=$rootScope.favToShow[i1].pointLink;
    $rootScope.favToShow[i1].pointLink=$rootScope.favToShow[i2].pointLink;
    $rootScope.favToShow[i2].pointLink=x;
    }

else {
    alert("Pick 2 points to switch");
}
}

}]);