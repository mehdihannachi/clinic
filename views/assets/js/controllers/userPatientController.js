// usersController contoller 
materialAdmin.controller('userPatientController', function($scope, $http, $resource, $window, $state, $sessionStorage, $rootScope, $uibModal, growlService) {
    $scope.image = {};
    $scope.image.src = $sessionStorage.imageSrc;


    if (typeof $sessionStorage.newPatient !== 'undefined') {
        if ($sessionStorage.newPatient)
            $scope.locations = locations;


    }

    // BEGIN Generate password shortid
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var ID_LENGTH = 8;

    var generate = function() {
            var rtn = '';
            for (var i = 0; i < ID_LENGTH; i++) {
                rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
            }
            return rtn;
        }
        // END Generate password shortid

    $scope.btn_createUser = function(valid, type) {
        //$scope.user.country = $scope.country.country
        var POST_URL;
        if (type == 1) {
            POST_URL = '/users/admin';
        }
        else if (type == 2) {
            POST_URL = '/users/nurse';
        }
        else if (type == 3) {
            POST_URL = '/users/doctor';
        }
        else if (type == 4) {
            POST_URL = '/users/patient';
        }
        var toSendPassword;

        if ($scope.image.src != '')
            $scope.user.profilePicture = $scope.image.src;
        if (valid) {
            if ($scope.checked)
                toSendPassword = generate();
            else {
                if ($scope.user.password == $scope.user.confPassword)
                    toSendPassword = $scope.user.password;
            }
            $scope.user.birth = new Date();
            $scope.user.birth.setMonth($scope._birthMonth, $scope._birthDay);
            $scope.user.birth.setFullYear($scope._birthYear);
            console.log('$scope.user');
            console.log($scope.user);


            var uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                animation: true,
                templateUrl: 'myModalContent.html',
                backdrop: 'static',
                controller: function($uibModalInstance, $scope, $rootScope) {
                    $scope.ok = function() {
                        console.log('$scope.user');
                        console.log($scope.user);


                        $http.post(POST_URL, {
                            user: $scope.user,
                            email: $scope.user.email,
                            password: toSendPassword
                        }).success(function(response) {
                            if (!response.error) {
                                uibModalInstance.dismiss();
                                growlService.growl('User has been Created', 'success');
                                $state.go('users');
                            }
                            else {
                                uibModalInstance.dismiss();

                                $rootScope.errorAdd();

                                // console.error("Error sign up patient")
                            }
                        }).error(function(err) {
                            console.error(err)
                        });

                    };
                    $scope.cancel = function() {
                        uibModalInstance.dismiss('cancel');
                    };

                },
                size: 'sm'
            });
        }
        else
            $scope.error = true;
        $scope.errorMSG = "Veuillez Saisir tout les champs";
    }

    $rootScope.errorAdd = function() {
        $scope.error = true;
        $scope.errorMSG = 'Mail existant'
    }
    $scope.change = function() {
        if ($scope.link == 'new-admin') {
            $state.go('new-admin');
            $sessionStorage.imageSrc = "img/admin.png";

        }
        else if ($scope.link == 'new-nurse') {
            $state.go('new-nurse');
            $sessionStorage.imageSrc = "img/nurse.png";


        }
        else if ($scope.link == 'new-doctor') {
            $state.go('new-doctor');
            $sessionStorage.imageSrc = "img/doctor.png";
            $scope.selected = 'new-doctor';


        }
        else if ($scope.link == 'new-patient') {
            $state.go('new-patient');
            $sessionStorage.imageSrc = "img/patient.png";
            $sessionStorage.newPatient = true


        }

    }

})
