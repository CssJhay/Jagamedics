/*global $, angular, console, language, lang, apiurl, alert*/
// myApp js
var myApp = angular.module("myApp", ["ngSanitize"]);

myApp.filter('unique', function() {
   // we will return a function which will take in a collection
   // and a keyname
   return function(collection, keyname) {
      // we define our output and keys array;
      var output = [], 
          keys = [];
      
      // we utilize angular's foreach function
      // this takes in our original collection and an iterator function
      angular.forEach(collection, function(item) {
          // we check to see whether our object exists
          var key = item[keyname];
          // if it's not already part of our keys array
          if(keys.indexOf(key) === -1) {
              // add it to our keys array
              keys.push(key); 
              // push this item to our final output array
              output.push(item);
          }
      });
      // return our array which should be devoid of
      // any duplicates
      return output;
   };
});

//indexCtrl js
myApp.controller("indexCtrl", ["$scope", "$http", function ($scope, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    //intial points of map
    $scope.latitude = 10.5126502;
    $scope.longitude = 7.431629899999962;
    //in page navigation 
    /*
    $scope.scrollTo = function (id) {
        $location.hash(id);
        console.log($location.hash());
        $anchorScroll();
    };
    */
    // change language
  /*  $scope.homear = function () {
        $location.path("/ar");
    };
    $scope.homeen = function () {
        $location.path("/");
    };
    // go to about us page
    $scope.aboutuspage = function () {
        $location.path("/about-us-" + lang);
    };
    // go to career page
    $scope.careerpage = function () {
        $location.path("/career-" + lang);
    };*/
    // get about api
    $http({
            method: "GET",
            url: apiurl + "/Api/About/GetAllAbout?Lang=" + language
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.AboutList.length === 0) {
                $scope.aboutpara = "Sorry server error /r/n عفوا تعذر الاتصال بالخادم";
            } else {
                $scope.aboutparas = response.data.AboutList;
                console.log($scope.aboutparas);
            }

        }, function (reason) {
            $scope.abouterror = reason.data;
            console.log(reason.data);
        });
    // branches api
    $http({
            method: "GET",
            url: apiurl + "/Api/Branches/GetAllBranches?PageIndex=0&Lang=" + language + "&Count=1000"
        })
        .then(function (response) {
            console.log(response.data);
            $scope.allbranches = response.data;
            if (response.data.AllBranches.length === 0 || response.data.IsSuccess === "false") {
                $scope.aboutpara = "Sorry server error /r/n عفوا تعذر الاتصال بالخادم";
            } else {
                $scope.mybranches = response.data.AllBranches;
            }
        }, function (reason) {
            $scope.brancherror = reason.data;
            console.log(reason.data);
        });
    //select branch
    $scope.selectbranch = function () {
        console.log($scope.selectedbranch);    
        console.log($scope.selectedcountry);

        $scope.latitude = $scope.selectedbranch.GeoLocation.substring(0, $scope.selectedbranch.GeoLocation.search(","));
        $scope.longitude = $scope.selectedbranch.GeoLocation.substring($scope.selectedbranch.GeoLocation.search(",") + 1);
        console.log($scope.latitude);
        console.log($scope.longitude);
        window.setTimeout(initMap, 10);
    };
    
    // get news api
    $http({
            method: "GET",
            url: apiurl + "/Api/News/GetNewsList?Lang=" + language + "&count=10&PageIndex=0"
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allnews = response.data.AllNews;
            } else {
                $scope.errorallnews = "Sorry server error /r/n عفوا تعذر الاتصال بالخادم";
            }
        }, function (reason) {
            $scope.forgeterror = reason.data;
            console.log(reason.data);
        });
    // feedback
    $scope.feedback = function () {
        var data = JSON.stringify({
            "Body": "Name: " + $scope.feedname + "<br>Email: " + $scope.feedemail + "<br>mobile: " + $scope.feedno + "<br>subject: " + $scope.feedsub + "<br>Message: " + $scope.feedmsg,
            "Subject": "Feedback From Alborg Website user",
            "TO": "info@alborglab.com"
        });
        $scope.feedname = "";
        $scope.feedemail = "";
        $scope.feedno = "";
        $scope.feedsub = "";
        $scope.feedmsg = "";
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/SendEmail/Api/SendMail/SendMail",
            data: data
        });
    };
    // house visit booking
    $scope.bookvisit = function () {
        var data = JSON.stringify({
            "Body": "Name: " + $scope.visitname + "<br>Email: " + $scope.visitemail + "<br>mobile: " + $scope.visitmobno + "<br>Time: " + $scope.visitday,
            "Subject": "House Visit Through Website",
            "TO": "b.housevisit@alborglab.com"
        });
        $scope.visitname = "";
        $scope.visitemail = "";
        $scope.visitmobno = "";
        $scope.visitday = "";
        $http({
                method: "POST",
                url: "http://yakensolution.cloudapp.net/SendEmail/Api/SendMail/SendMail",
                data: data
            })
            .then(function (response) {
                alert('Thank you for booking a visit. شكرا لحجزكم زيارة منزلية');
            });
    };
}]);

//aboutCtrl js
myApp.controller("aboutCtrl", ["$scope", "$http", function ($scope, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    //in page navigation 
    /*$scope.scrollTo = function (id) {
        $location.hash(id);
        console.log($location.hash());
        $anchorScroll();
    };*/
    // get about api
    $http({
            method: "GET",
            url: apiurl + "/Api/About/GetAllAbout?Lang=" + language
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.AboutList.length === 0) {
                $scope.aboutpara = "Sorry server error /r/n عفوا تعذر الاتصال بالخادم";
            } else {
                $scope.aboutparas = response.data.AboutList;
                console.log($scope.aboutparas);
            }

        }, function (reason) {
            $scope.abouterror = reason.data;
            console.log(reason.data);
        });
    // back to home page
    /*
    $scope.homear = function () {
        $location.path("/ar");
    };
    $scope.homeen = function () {
        $location.path("/");
    };
    */
}]);

//careersCtrl js
myApp.controller("careersCtrl", ["$scope", "$http", function ($scope, $http) {
    "use strict";
    // language is AR or EN
    //console.log(language);
    // get Careers
     /* $scope.scrollTo = function (id) {
        $location.hash(id);
        console.log($location.hash());
        $anchorScroll();
    };*/
    $http({
            method: "GET",
            url: apiurl + "/Api/Careers/GetCareersList?Lang=" + language
        })
        .then(function (response) {
            //console.log(response.data);
            $scope.jobs = response.data.AllCareers;
        }, function (reason) {
            //console.log(reason.data);
        });
    // select job to apply for
    $scope.selectjob = function (jobID, jobTitle) {
        $scope.applyjobid = jobID;
        $scope.applyjobtitle = jobTitle;
    };
    //send job email
    $scope.sendmail = function () {
        var data = JSON.stringify({
            "Body": "Job ID: " + $scope.applyjobid + "<br>Job Title: " + $scope.applyjobtitle + "<br>Applicant Name: " + $scope.applyname + "<br>Applicant Email: " + $scope.applyemail + "<br>Cover letter: " + $scope.applymsg + "<br>Mobile Number: " + $scope.applymob,
            "Subject": "HR Job ID:" + $scope.applyjobid + "(" + $scope.applyjobtitle + ")",
            "TO": "careers@alborglab.com"
        });
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/SendEmail/Api/SendMail/SendMail",
            data: data
        });
    };
}]);

//footerCtrl js
myApp.controller("footerCtrl", ["$scope", "$http", function ($scope, $http) {
    "use strict";
    // language is AR or EN
    //console.log(language);
    //send subscribe email
      /*  $scope.scrollTo = function (id) {
        $location.hash(id);
        console.log($location.hash());
        $anchorScroll();
    };*/
    $scope.submail = function () {
        var data = JSON.stringify({
            "Body": "Subscriber Email: " + $scope.subemail,
            "Subject": "Subscription from alborglab:",
            "TO": "info@alborglab.com"
        });
        $scope.subemail = "";
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/SendEmail/Api/SendMail/SendMail",
            data: data
        });
    };
    // get about api
    $http({
            method: "GET",
            url: apiurl + "/Api/About/GetAllAbout?Lang=" + language
        })
        .then(function (response) {
            //console.log(response.data);
            if (response.data.AboutList.length === 0) {
                $scope.aboutpara = "Sorry server error /r/n عفوا تعذر الاتصال بالخادم";
            } else {
                $scope.aboutparas = response.data.AboutList;
                //console.log($scope.aboutparas);
            }

        }, function (reason) {
            $scope.abouterror = reason.data;
            //console.log(reason.data);
        });
    // get news api
    $http({
            method: "GET",
            url: apiurl + "/Api/News/GetNewsList?Lang=" + language + "&count=10&PageIndex=0"
        })
        .then(function (response) {
            //console.log(response.data);
            if (response.data.IsSuccess) {
                $scope.allnews = response.data.AllNews;
            } else {
                $scope.errorallnews = "Sorry server error /r/n عفوا تعذر الاتصال بالخادم";
            }
        }, function (reason) {
            $scope.forgeterror = reason.data;
            //console.log(reason.data);
        });
}]);
