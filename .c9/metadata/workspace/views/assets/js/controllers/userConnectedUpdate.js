{"filter":false,"title":"userConnectedUpdate.js","tooltip":"/views/assets/js/controllers/userConnectedUpdate.js","undoManager":{"mark":31,"position":31,"stack":[[{"start":{"row":0,"column":0},"end":{"row":95,"column":0},"action":"insert","lines":["// userController contoller ","materialAdmin.controller('userUpdateController', function($scope, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope) {","    var typeuser = $sessionStorage.typeuser;","    var user_id = $sessionStorage.userProfile","","    if (typeuser == 1) {","        URL = '/user/admin/';","    }","    else if (typeuser == 2) {","        URL = '/user/nurse/';","    }","    else if (typeuser == 3) {","        URL = '/user/doctor/';","    }","    else if (typeuser == 4) {","        URL = '/user/patient/';","    }","    $http.get(URL + user_id).success(function(response) {","","        if (response) {","            if (response.error) {","                $scope.error = true;","                $scope.errorMSG = response.error","            }","","            $rootScope.user = response","        }","    }).error(function(err) {","        console.error(err)","    });","","","","","","    //function to call update web service","    $scope.updateUser = function(valid) {","        if (valid) {","            $scope.user = $rootScope.user;","            var uibModalInstance = $uibModal.open({","                animation: true,","                ariaLabelledBy: 'modal-title',","                ariaDescribedBy: 'modal-body',","                animation: true,","                templateUrl: 'myModalContent.html',","                backdrop: 'static',","                controller: function($uibModalInstance, $scope, $rootScope) {","                    $scope.ok = function() {","                        $http.post(URL + $scope.user.id, {","                                user: $scope.user,","                                user_id: $scope.user.user_id","                            })","                            .success(function(response) {","                                if (response) {","                                    if (response.error) {","                                        $scope.error = true;","                                        $scope.errorMSG = response.error","                                    }","                                    else {","                                        uibModalInstance.dismiss();","                                        $state.go('users')","                                    }","                                }","                            }).error(function(err) {","                                console.error(err)","                            });","                        // $state.reload();","","                    };","                    $scope.cancel = function() {","                        uibModalInstance.dismiss('cancel');","                    };","","                },","                size: 'sm'","            });","        }","        else {","            $scope.error = true;","            $scope.errorMSG = \"Veuillez Saisir tout les champs\";","        }","    }","","","});","","materialAdmin.filter('ageFilter', function() {","    return function(birthday) {","        var birthday = new Date(birthday);","        var today = new Date();","        var age = ((today - birthday) / (31557600000));","        var age = Math.floor(age);","        return age;","    }","});",""],"id":1}],[{"start":{"row":1,"column":26},"end":{"row":1,"column":46},"action":"remove","lines":["userUpdateController"],"id":2},{"start":{"row":1,"column":26},"end":{"row":1,"column":27},"action":"insert","lines":["u"]}],[{"start":{"row":1,"column":27},"end":{"row":1,"column":28},"action":"insert","lines":["s"],"id":3}],[{"start":{"row":1,"column":28},"end":{"row":1,"column":29},"action":"insert","lines":["e"],"id":4}],[{"start":{"row":1,"column":29},"end":{"row":1,"column":30},"action":"insert","lines":["r"],"id":5}],[{"start":{"row":1,"column":30},"end":{"row":1,"column":31},"action":"insert","lines":["C"],"id":6}],[{"start":{"row":1,"column":31},"end":{"row":1,"column":32},"action":"insert","lines":["o"],"id":7}],[{"start":{"row":1,"column":32},"end":{"row":1,"column":33},"action":"insert","lines":["n"],"id":8}],[{"start":{"row":1,"column":33},"end":{"row":1,"column":34},"action":"insert","lines":["n"],"id":9}],[{"start":{"row":1,"column":34},"end":{"row":1,"column":35},"action":"insert","lines":["e"],"id":10}],[{"start":{"row":1,"column":35},"end":{"row":1,"column":36},"action":"insert","lines":["c"],"id":11}],[{"start":{"row":1,"column":36},"end":{"row":1,"column":37},"action":"insert","lines":["t"],"id":12}],[{"start":{"row":1,"column":37},"end":{"row":1,"column":38},"action":"insert","lines":["e"],"id":13}],[{"start":{"row":1,"column":38},"end":{"row":1,"column":39},"action":"insert","lines":["d"],"id":14}],[{"start":{"row":1,"column":39},"end":{"row":1,"column":40},"action":"insert","lines":["U"],"id":15}],[{"start":{"row":1,"column":40},"end":{"row":1,"column":41},"action":"insert","lines":["p"],"id":16}],[{"start":{"row":1,"column":41},"end":{"row":1,"column":42},"action":"insert","lines":["d"],"id":17}],[{"start":{"row":1,"column":42},"end":{"row":1,"column":43},"action":"insert","lines":["a"],"id":18}],[{"start":{"row":1,"column":43},"end":{"row":1,"column":44},"action":"insert","lines":["t"],"id":19}],[{"start":{"row":1,"column":44},"end":{"row":1,"column":45},"action":"insert","lines":["e"],"id":20}],[{"start":{"row":1,"column":45},"end":{"row":1,"column":46},"action":"insert","lines":["C"],"id":21}],[{"start":{"row":1,"column":46},"end":{"row":1,"column":47},"action":"insert","lines":["o"],"id":22}],[{"start":{"row":1,"column":47},"end":{"row":1,"column":48},"action":"insert","lines":["n"],"id":23}],[{"start":{"row":1,"column":48},"end":{"row":1,"column":49},"action":"insert","lines":["t"],"id":24}],[{"start":{"row":1,"column":49},"end":{"row":1,"column":50},"action":"insert","lines":["r"],"id":25}],[{"start":{"row":1,"column":50},"end":{"row":1,"column":51},"action":"insert","lines":["o"],"id":26}],[{"start":{"row":1,"column":51},"end":{"row":1,"column":52},"action":"insert","lines":["o"],"id":27}],[{"start":{"row":1,"column":51},"end":{"row":1,"column":52},"action":"remove","lines":["o"],"id":28}],[{"start":{"row":1,"column":51},"end":{"row":1,"column":52},"action":"insert","lines":["l"],"id":29}],[{"start":{"row":1,"column":52},"end":{"row":1,"column":53},"action":"insert","lines":["l"],"id":30}],[{"start":{"row":1,"column":53},"end":{"row":1,"column":54},"action":"insert","lines":["e"],"id":31}],[{"start":{"row":1,"column":54},"end":{"row":1,"column":55},"action":"insert","lines":["r"],"id":32}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":1,"column":26},"end":{"row":1,"column":55},"isBackwards":true},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1484846119336,"hash":"467a435368808d7cc6f344a9fa6d1ddfeef957b6"}