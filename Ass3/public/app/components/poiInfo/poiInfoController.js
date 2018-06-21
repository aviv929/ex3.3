angular.module('citiesApp')
  .controller('poiInfoController', ['$location', '$http' ,'$rootScope', 'localStorageService','setHeadersToken', function( $location , $http, $rootScope,localStorageService,setHeadersToken) {
    self = this;
      let serverUrl = 'http://localhost:3000/';
      let id = document.URL.split('/')[7];
      self.point = {};
      self.reviews = [];
      self.grade="" ;
      self.images= [];

      //retrieve specific point of interest from the server
      $http.get(serverUrl + "Points/getPoi/"+id)
      .then(function (response){
          self.point=response.data[0];
          self.images = response.data[0].pointPIC;
          if (self.point.numOfGrade==0){
          self.grade=0;}
          else {
          self.grade = (self.point.sumOfGrade / self.point.numOfGrade) * 20;
          }

          var address=self.point.pointName+", New York";
          var tmpTok = $http.defaults.headers.common;
          $http.defaults.headers.common= "";
          $http.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine='+address)
            .then(function(response){
                var map = L.map('mapid').setView([response.data.candidates[0].location.y, response.data.candidates[0].location.x], 13);
    
                map.setZoom(15);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    id: 'mapbox.streets'
                }).addTo(map);
    
                L.marker([response.data.candidates[0].location.y, response.data.candidates[0].location.x]).addTo(map);
    
            }, function(response){});
    
            $http.defaults.headers.common=tmpTok;


      }, function (response) {
      })

      //retrieve 2 last reviews from the server
      $http.get(serverUrl + "Points/get2LastReview/"+id)
      .then(function (response){
          if (response.data.length==0)
          {
            self.reviews=response.data;
            self.reviews.push({"review":"---"});
            self.reviews.push({"review":"---"});
          }
          else if (response.data.length==1)
          {
            self.reviews=response.data;
            self.reviews.push({"review":"---"});
          }
          else {
          self.reviews=response.data;
          }
      }, function (response) {
      })

      //insert new in the Db of the server
      data={
        "pointID": id
      }
      $http.put(serverUrl + "Points/updateWatch",data)
      .then(function (response){
      }, function (response) {
      })


    if ($rootScope.favToShow!=null && $rootScope.isContain(id,$rootScope.favToShow)==-1)
        self.picShow=false;
    else
        self.picShow=true;

      //add pointID to the local favorite list
      self.addToFavorites=function(id)
      {
        self.picShow=true;
          $rootScope.shopCounter++;
          $rootScope.favToShow.push(localStorageService.get(id));
          localStorageService.set("favUser", $rootScope.favToShow);
      }

      //remove pointID from the local favorite list
      self.removeFromFavorites=function(id)
      {
          self.picShow=false;
          for (var i=0;i<$rootScope.favToShow.length;i++)
          {
               if ($rootScope.favToShow[i]["pointID"]==id) {
                  if ( $rootScope.shopCounter>0){
                        $rootScope.shopCounter--;
                  }
                  $rootScope.favToShow[i]["pointID"].tmpDel=true;
                  $rootScope.favToShow.splice(i, 1);
                  localStorageService.remove("favUser");
                  localStorageService.set("favUser",$rootScope.favToShow);
                  return;
               }
          }
      }
      
    

  }]);