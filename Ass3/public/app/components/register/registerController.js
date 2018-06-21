angular.module('citiesApp')
    .controller('registerController', ['$location', '$http' , function($location , $http) {

    self = this;
    let serverUrl = 'http://localhost:3000/';
    self.countries = [];
    //data for the ng-repeat that show the category filter
    self.categories = [
        {"catName":"Resterunts"},
        {"catName":"Pubs"},
        {"catName":"Museums"},
        {"catName":"Shopping"}
    ]

    //retrieve countries from the server
    $http.get(serverUrl + "Users/getCountries")
    .then(function (response){
        self.countries = response.data;
    }, function (response) {
    });

    //validate the data and register if valid
    self.register = function(categories)
    {
        if (sumChecked(categories)<2)
        {
            alert("You has to choose at least 2 categories");
            return;
        }
        else {
        var thecatList=[];            
        angular.forEach(categories, function (value, key) {
            if (categories[key].checked) {
                var catID=0;
                if (categories[key]["catName"]=="Resterunts")
                catID=1;
                else if (categories[key]["catName"]=="Pubs")
                catID=2;
                else if (categories[key]["catName"]=="Museums")
                catID=3;
                else  if (categories[key]["catName"]=="Shopping")
                catID=4;
                thecatList.push(catID);
            }
            });
        data = {
            "firstName" : self.firstName,
            "lastName" : self.lastName,
            "city" : self.city,
            "country" : self.country,
            "email" : self.email,
            "q1" : self.q1,
            "q2" : self.q2,
            "a1" : self.a1,
            "a2" : self.a2,
            "catList" : thecatList
        }
        $http.post(serverUrl+"Users/register", data)
        .then(function (response) {
            alert("Your username is: " + response.data[0]+"\nYour password is: " + response.data[1]);
            $location.path('/home');
            $location.replace();
        }, function (response) {
        });
    }
    }

    //count how many checked checkedbox was selected
    function sumChecked(categories)
    {
        var count=0;
        angular.forEach(categories, function (value, key) {
            if (categories[key].checked) {
                count++;
            }
            });
            return count;
    }
    
}]);