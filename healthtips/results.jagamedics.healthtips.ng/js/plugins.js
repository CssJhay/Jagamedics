/*global $, angular, FB, console, language, lang, oldurl, alert*/
// resApp js
var resApp = angular.module("resApp", ["ngRoute", "ngCookies", "ngSanitize"]);
resApp.filter('unique', function() {
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
//routes js
resApp.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    "use strict";
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode({
        enabled: true,
        rewriteLinks: false,
        requireBase: false
    });
    $routeProvider
        .when("/", {
            templateUrl: "pages/login-" + lang + ".html",
            controller: "loginCtrl"
        })
        .when("/signup", {
            templateUrl: "pages/signup-" + lang + ".html",
            controller: "registerCtrl"
        })
        .when("/patient", {
            templateUrl: "pages/testresukt-" + lang + ".html",
            controller: "resultCtrl",
            authenticated: true
        })
        .when("/corp", {
            templateUrl: "pages/test-cor-" + lang + ".html",
            controller: "corpCtrl",
            authenticated: true
        })
        .when("/visitor", {
            templateUrl: "pages/visit-" + lang + ".html",
            controller: "visitCtrl"
        })
        .otherwise({ //otherwise dont redirect but run a controller that checks url
            templateUrl: "pages/login-" + lang + ".html",
            controller: "loginCtrl"
        });
}]);

resApp.run(["$rootScope", "$location", "authFact", function ($rootScope, $location, authFact) {
    "use strict";
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.$$route.authenticated) {
            var userAuth = authFact.getAccessToken();
            if (!userAuth) {
                $location.path("/");
            }
        }
    });
}]);

resApp.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
} ])
//generalCtrl js
resApp.controller("generalCtrl", ["$scope", "$location", "$cookies", "$http", function ($scope, $location, $cookies, $http) {
    "use strict";
     // packages list
    var packageslist = JSON.stringify({
        "count": "",
        "pageIndex": "0",
        "Category": "",
        "lang": lang
    });
    $http({
            method: "POST",
            data: packageslist,
            url: oldurl + "/PromotionList"
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.isSuccess) {
                $scope.packages = response.data.promotions;
            } else {
                $scope.errorpackages = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    // get test library
    var reqtests = JSON.stringify({
        "TestName": ""
    });
    $http({
            method: "POST",
            data: reqtests,
            url: oldurl + "/TestLibrary"
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.isSuccess) {
                $scope.testlibrary = response.data.Tests;
            } else {
                $scope.errortestlibrary = response.data.ErrorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    // health tips category
    var healthtipscat = JSON.stringify({
        "count": 1000,
        "pageIndex": "0",
        "lang": lang
    });
    $http({
            method: "POST",
            data: healthtipscat,
            url: oldurl + "/HealthTipsCategoryList"
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.isSuccess) {
                $scope.healthtips = response.data.healthTipsCategories;
            } else {
                $scope.errorhealthtips = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });
    // health tips category details
    $scope.gethealthcat = function (x) {
        var healthtipscatdet = JSON.stringify({
            "count": "100",
            "pageIndex": "0",
            "categoryId": x,
            "lang": lang
        });
        $http({
                method: "POST",
                data: healthtipscatdet,
                url: oldurl + "/HealthTipsList"
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data.isSuccess) {
                    $scope.healthtipsdet = response.data.healthTips;
                    console.log(response.data);
                    console.log($scope.healthtipsdet);
                } else {
                    $scope.errorhealthtipsdet = response.data.errorMessage;
                }
            }, function (reason) {
                console.log(reason.data);
            });
    };
    // precautions
    var precautionsapi = JSON.stringify({
        "lang": lang
    });
    $http({
            method: "POST",
            data: precautionsapi,
            url: oldurl + "/GetPrecautions"
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.isSuccess) {
                $scope.precautions = response.data.PrecautionsBody;
            } else {
                $scope.precautions = response.data.errorMessage;
            }
        }, function (reason) {
            console.log(reason.data);
        });

    $scope.loadingRingvisible = false;
    // house visit booking
    $scope.fileupload;
    $scope.getTheFiles = function ($files) {
        $scope.fileupload=$files;
    };
$scope.bookvisit = function () {
        $scope.loadingRingvisible = true;
        var formData = new FormData();
      angular.forEach($scope.fileupload, function (value, key) {
        formData.append(key, value);
        });
        formData.append('mobileNumber', $scope.visitmobno);
        formData.append('patientName', $scope.visitname);
        var srource = "<br/>";
        var paddress = "";
         paddress += $scope.pataddress;
        paddress += srource;
        paddress += "<br/> Comments: ";
        paddress += $scope.visitcomments;



        formData.append("address", paddress);

        if ($scope.visitname == "" || typeof $scope.visitname == "undefined") {
            ErrorEvent('please add your name');
        } else if ($scope.visitmobno == "" || typeof $scope.visitmobno == "undefined") {
            ErrorEvent('please add mobile number');
        } else {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log(this.responseText);
                    if (this.readyState === 4 && this.responseText) {

                        console.log("Request sent");
                        alert('Thank you for booking  house care service .');
                    } else {
                        console.log("request error");
                    }
                }
            });
            xhr.open("POST", oldurl + "/HomeVisitReserve");
            xhr.send(formData);

        }

    };
       

}


]);

//visitCtrl js
resApp.controller("visitCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    // check authorization
    if ($cookies.get("visit")) {
        console.log("true");
        $scope.visitoraccess = true;
    } else {
        console.log("false");
        $scope.visitoraccess = false;
    }
    if ($cookies.get("visitor")) {
        console.log("true");
        $scope.visitoravail = true;
    } else {
        console.log("false");
        $scope.visitoravail = false;
    }
    //select visit
    $scope.visitreq = $cookies.get("visit");
    //get tests
    var results = JSON.stringify({
        "lang": lang,
        "ID": $cookies.get("visitor"),
        "lastID": "0",
        "count": "200",
        "pageIndex": "0"
    });
    $http({
            method: "POST",
            url: oldurl + "/TestResultList",
            data: results
        })
        .then(function (response) {
            if (response.data.isSuccess) {
                $scope.results = response.data;
                console.log($scope.results);
            } else {
                $scope.ErrorMSG = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            $scope.upreply = reason.data;
            console.log(reason.data);
        });
    //loginup
    $scope.loginup = function () {
        $cookies.remove('accessToken');
        $location.path("/");
    };
}]);

//registerCtrl js
resApp.controller("registerCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    //loginpage
    $scope.loginpage = function () {
        $location.path("/");
    };
    //register
    $scope.registration = function () {
        var registerdata = JSON.stringify({
            "email": $scope.regemail,
            "password": $scope.regpass,
            "fullName": $scope.regname,
            "gender": $scope.reggender,
            "mobileNumber": $scope.regno,
            "IsDoctor": $scope.regdoctor,
            "address": $scope.regaddress
        });
        $http({
                method: "POST",
                url: oldurl + "/Registeration",
                data: registerdata
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    console.log("true");
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.upreply = reason.data;
                console.log(reason.data);
            });
    };
}]);

//loginCtrl js
resApp.controller("loginCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    //regpage
    $scope.regpage = function () {
        $location.path("/signup");
    };
    //v2 access
    var locationurl = window.location.href;
    console.log(locationurl);
    if (locationurl.indexOf("V2/?V=") === -1 && locationurl.indexOf("V/?V=") === -1) {
        console.log("normal access");
        $location.path("/");
    } else if (locationurl.indexOf("V2/?V=") > 0) {
        console.log("v2 access");
        console.log(locationurl.slice((locationurl.indexOf("V2/?V=") + 6), locationurl.indexOf("&VstCode=")));
        console.log(locationurl.slice((locationurl.indexOf("&VstCode=") + 9)));
        //verify user
        $http({
                method: "POST",
                url: oldurl + "/VerifyWebLogin",
                data: JSON.stringify({
                    "UserCode": locationurl.slice((locationurl.indexOf("V2/?V=") + 6), locationurl.indexOf("&VstCode="))
                })
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.visitdirest = response.data;
                    console.log($scope.visitdirest);
                    $cookies.put("visitor", response.data.id);
                    $cookies.put("visit", locationurl.slice((locationurl.indexOf("&VstCode=") + 9)));
                    $location.path("/visitor");
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#errormodal').modal("show");
                }
            });
    } else if (locationurl.indexOf("V/?V=") > 0) {
        console.log("v access");
        console.log(locationurl.slice((locationurl.indexOf("V/?V=") + 5), locationurl.indexOf("&VstCode=")));
        //verify user
        $http({
                method: "POST",
                url: oldurl + "/VerifyWebLogin",
                data: JSON.stringify({
                    "UserCode": locationurl.slice((locationurl.indexOf("V/?V=") + 5), locationurl.indexOf("&VstCode="))
                })
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.visitdirest = response.data;
                    console.log($scope.visitdirest);
                    $cookies.put("visitor", response.data.id);
                    $location.path("/visitor");
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#errormodal').modal("show");
                }
            });
    }
    //forget password
    $scope.forgetpass = function () {
        var forgetdata = JSON.stringify({
            "Email": $scope.forgetemail
        });
        $http({
                method: "POST",
                url: oldurl + "/ForgetPassword",
                data: forgetdata
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $('#forgetmodal').modal("hide");
                    $('#resetpasswordmodal').modal("show");
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.upreply = reason.data;
                console.log(reason.data);
            });
    };
    //reset forget password
    $scope.reforgetpass = function () {
        var reforgetdata = JSON.stringify({
            "email": $scope.reforgetemail,
            "newPassword": $scope.repassword,
            "resetId": $scope.reforgetcode
        });
        $http({
                method: "POST",
                url: oldurl + "/ResetPassword",
                data: reforgetdata
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $('#resetpasswordmodal').modal("hide");
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.upreply = reason.data;
                console.log(reason.data);
            });
    };

    //access
    $scope.login = function () {
        var logindata = JSON.stringify({
            "email": $scope.uname,
            "password": $scope.upass
        });
        $http({
                method: "POST",
                url: oldurl + "/Login",
                data: logindata
            })
            .then(function (response) {
                $scope.upreply = response.data;
                console.log(response.data);
                if ($scope.upreply.isSuccess) {
                    if ($scope.upreply.type === "Corporate") {
                        var accessToken = $scope.uname.split("-")[1];
                        console.log(accessToken);
                        authFact.setAccessToken(accessToken);
                        $location.path("/corp");
                    } else {
                        var accessToken = $scope.upreply.id;
                        $cookies.put("udetails", JSON.stringify($scope.upreply));
                        console.log(accessToken);
                        authFact.setAccessToken(accessToken);
                        $location.path("/patient");
                    }
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.upreply = reason.data;
                console.log(reason.data);
            });
    };
}]);

//resultCtrl js
resApp.controller("resultCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    //retrieve details
    $scope.udetails = JSON.parse($cookies.get("udetails"));
    console.log($scope.udetails);
    //get points
    var points = JSON.stringify({
        "UserID": $cookies.get("accessToken")
    });
    $http({
            method: "POST",
            url: oldurl + "/GetPatientPoints",
            data: points
        })
        .then(function (response) {
            if (response.data.isSuccess) {
                $scope.points = response.data;
            } else {
                $scope.ErrorMSG = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            $scope.upreply = reason.data;
            console.log(reason.data);
        });
    //get tests
    var results = JSON.stringify({
        "lang": lang,
        "ID": $cookies.get("accessToken"),
        "lastID": "0",
        "count": "200",
        "pageIndex": "0"
    });
    $http({
            method: "POST",
            url: oldurl + "/TestResultList",
            data: results
        })
        .then(function (response) {
            if (response.data.isSuccess) {
                $scope.results = response.data;
                console.log($scope.results);
            } else {
                $scope.ErrorMSG = response.data.errorMessage;
                $('#errormodal').modal("show");
            }
        }, function (reason) {
            $scope.upreply = reason.data;
            console.log(reason.data);
        });
    //edit profile
    $scope.editprofile = function () {
        var newprofile = JSON.stringify({
            "UserID": $scope.udetails.id,
            "Email": $scope.editemail,
            "MobileNumber": $scope.editmob,
            "UserName": $scope.editusername
        });
        $http({
                method: "POST",
                url: oldurl + "/UpdateProfileRegisteredData",
                data: newprofile
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.editemail = "";
                    $scope.editmob = "";
                    $scope.editusername = "";
                    alert('Changes saved! تم حفظ التعديل');
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.upreply = reason.data;
                console.log(reason.data);
            });
    };
    //edit password
    $scope.editpassword = function () {
        var newpass = JSON.stringify({
            "UserID": $scope.udetails.id,
            "CurrentPassword": $scope.editpassold,
            "NewPassword": $scope.editpassnew
        });
        $http({
                method: "POST",
                url: oldurl + "/UpdatePassword",
                data: newpass
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.editpassold = "";
                    $scope.editpassnew = "";
                    alert('Changes saved!');
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.upreply = reason.data;
                console.log(reason.data);
            });
    };
    //Get Diabetes
    var GetDiabetes = JSON.stringify({
        "UserID": $cookies.get("accessToken"),
        "lang": lang
    });
    $http({
            method: "POST",
            url: oldurl + "/GetDiabetesList",
            data: GetDiabetes
        })
        .then(function (response) {
            if (response.data.isSuccess) {
                $scope.diabetes = response.data.DiabetesList;
            } else {
                $scope.ErrorMSG = response.data.errorMessage;
            }
        }, function (reason) {
            $scope.upreply = reason.data;
            console.log(reason.data);
        });
    //set diabetes
    $scope.setDiabetes = function () {
        var list = [];
        for (var i = 0; i < $scope.diabetes.length; i++) {
            if ($scope.diabetes[i].IsSelected) list.push($scope.diabetes[i]);
        }
        $http({
            method: 'POST',
            url: oldurl + '/SetUserDiabetes',
            data: JSON.stringify({
                "UserID": $cookies.get('accessToken'),
                "DiabetesList": list
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    };
    //send message email
    $scope.sendmail = function () {
        var data = JSON.stringify({
            "Body": "Patient name: " + $scope.messagename + "<br>issue related to: " + $scope.messagerelated + "<br>message: " + $scope.messagemsg + "<br>Contact number: " + $scope.messageno,
            "Subject": "Message from webresults",
            "TO": "info@alborglab.com"
        });
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/SendEmail/Api/SendMail/SendMail",
            data: data
        });
        $scope.messagename = "";
        $scope.messageno = "";
        $scope.messagemsg = "";
        alert('Thank you for your feedback! ');
    };
    //logout
    $scope.logout = function () {
        $cookies.remove('accessToken');
        $cookies.remove('udetails');
        $location.path("/");
    };
}]);

//corpCtrl js
resApp.controller("corpCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    // language is AR or EN
    console.log(language);
    //search by visit number
    $scope.searchvisit = function () {
        var searchvstno = JSON.stringify({
            "ID": $cookies.get("accessToken"),
            "FromDate": "1970-01-01",
            "ToDate": "9999-01-01",
            "VstCode": $scope.visitnum
        });
        $http({
                method: "POST",
                url: oldurl + "/CorporateDetailsList",
                data: searchvstno
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.corpresult = response.data.corporateEmpsList;
                    console.log($scope.corpresult);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.corpresult = reason.data;
                console.log(reason.data);
            });
    };
    //search by date
    $scope.searchvisitdate = function () {
        var fromdate = JSON.stringify($scope.startdate).substr(1, 4) + "-" + JSON.stringify($scope.startdate).substr(6, 2) + "-" + JSON.stringify($scope.startdate).substr(9, 2),
            todate = JSON.stringify($scope.enddate).substr(1, 4) + "-" + JSON.stringify($scope.enddate).substr(6, 2) + "-" + JSON.stringify($scope.enddate).substr(9, 2),
            searchvstdate = JSON.stringify({
                "ID": $cookies.get("accessToken"),
                "FromDate": fromdate,
                "ToDate": todate
            });
        console.log(searchvstdate);
        $http({
                method: "POST",
                url: oldurl + "/CorporateDetailsList",
                data: searchvstdate
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.corpresult = response.data.corporateEmpsList;
                    console.log($scope.corpresult);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.corpresult = reason.data;
                console.log(reason.data);
            });
    };
    //visit details
    $scope.visitdet = function (x, y) {
        var selectedvisit = JSON.stringify({
            "MobileNumber": x,
            "PermNo": y
        });
        console.log(selectedvisit);
        $http({
                method: "POST",
                url: oldurl + "/CorporateTestResult",
                data: selectedvisit
            })
            .then(function (response) {
                if (response.data.isSuccess) {
                    $scope.corpresultdet = response.data.testResultVisits;
                    console.log($scope.corpresultdet);
                } else {
                    $scope.ErrorMSG = response.data.errorMessage;
                    console.log(response.data.errorMessage);
                    $('#errormodal').modal("show");
                }
            }, function (reason) {
                $scope.corpresultdet = reason.data;
                console.log(reason.data);
            });
    };
    //logout
    $scope.logout = function () {
        $cookies.remove('accessToken');
        $location.path("/");
    };
}]);

//authFact js
resApp.factory("authFact", ["$cookies", function ($cookies) {
    "use strict";
    var authFact = {};
    authFact.setAccessToken = function (accessToken) {
        $cookies.put("accessToken", accessToken);
    };
    authFact.getAccessToken = function () {
        authFact.authToken = $cookies.get("accessToken");
        return authFact.authToken;
    };
    return authFact;
}]);
