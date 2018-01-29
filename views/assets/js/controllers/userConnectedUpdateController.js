// userController contoller 
materialAdmin.controller('userConnectedUpdateController', function($scope, $http, $resource, $window, $state, growlService, $sessionStorage, $uibModal, $rootScope, $timeout, usSpinnerService) {
    $scope.image = {};
    $scope.user = {}
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.hideSpinner = true;
    }

    $scope.initConnected = function() {
        $scope.user = $sessionStorage.connectedUser;
        $rootScope.URL;
        $scope.image.src = $scope.user.profile_picture;
        $scope.stopSpin()
    }

    $scope.initConnected();

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

    /* crop image 2 handler */
    $scope.myCroppedImage2 = '';
    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
            $scope.$apply(function($scope) {
                $scope.myImage2 = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    /* end  crop image 2  */

    $http.get('/user/profile/' + $scope.user.user_id).success(function(response) {
        var result = response.typeuser;
        if (result == '1') {
            $rootScope.URL = '/user/admin/';
        }
        if (result == '2') {
            $rootScope.URL = '/user/nurse/';
        }
        if (result == '3') {
            $rootScope.URL = '/user/doctor/';
        }
        if (result == '4') {
            $rootScope.URL = '/user/patient/';
        }

        $scope.updateUser = function(valid) {


            if (!valid) {
                $scope.error = true;
                $scope.errorMSG = "Veuillez Saisir tout les champs";
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else if (($scope.user.password != $scope.user.confPassword) && (!$scope.checked)) {
                $scope.error = true;
                $scope.errorMSG = "Mot de passe non conforme";
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else {
                $scope.error = false;
                if ($scope.checked)
                    $scope.user.password = generate();
                $scope.user.profilePicture = $scope.image.src;
                $scope.user = $scope.user;

                $scope.URL = $rootScope.URL;

                $http.post($scope.URL + $scope.user.id, {
                    user: $scope.user,
                    user_id: $scope.user.user_id
                }).success(function(response) {
                  
                    if (response) {
                        if (response.error) {
                            $scope.error = true;
                            $scope.errorMSG = response.error
                            $timeout(function() {
                                $scope.error = false;
                            }, 4000);
                        }
                        else  {
                            // $state.go('users')
                            //  $state.reload()
                            $sessionStorage.connectedUser = $scope.user;
                            growlService.growl("Updated Successfully !", 'success')
                        }
                    }
                }).error(function(err) {});
            }
        }

    }).error(function(response) {
        $scope.error = response.message;

    });

});
