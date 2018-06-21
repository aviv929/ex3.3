angular.module('citiesApp')
.controller('recoverController', ['$location', '$http' , function($location , $http) {

    self = this;
    var serverUrl = 'http://localhost:3000/';
    self.questions = new Array();
    self.shouldShow=false;
    
    //retrieve the questions of the specific username, from the server
    self.retiveUser = function()
    {
        if (!self.userName){
            alert("Missing your user name..");
            return;
        }
        else {
        userName = {
            "userName":self.userName
        };
       $http.post(serverUrl+"Users/getQuestion", userName)
       .then(function (response) {
           if (response.data[0]==undefined)
           {
            alert("Wrong name..");
            return;
           }
           else {
            self.questions[0] = response.data[0].q1;
            self.questions[1] = response.data[0].q2;
            self.shouldShow=true;
           }
       }, function (response) {
           console.log("Something wrong..");
       });
    }
    }

    //retrieve the password of the specific username and given answers, from the server
    self.retivePass = function()
    {
        if (!self.a1 || !self.a2){
            alert("Missing Answers..");
            return;
        }
        else if (!self.userName)
        {
            alert("Where is your user name??");
            return;
        }
        else {
            answers= {
                "userName":self.userName,
                "a1": self.a1,
                "a2": self.a2 };
            $http.post(serverUrl + "Users/getPassword", answers)
            .then(function (response){ 
                if (response.data[0].password==undefined) {
                    alert("Wrong Answers..");
                    return;  
                }
                else {
                    alert("Your Password is - "+response.data[0].password);
                    $location.path('/home');
                    $location.replace();
                }
            }, function (response) {
                console.log("Something Wromg..");
            });
         }
    }


}]);