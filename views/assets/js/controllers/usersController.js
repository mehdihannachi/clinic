// usersController contoller 
materialAdmin.controller('usersController', function($scope, $http, $resource, $window, $state, $sessionStorage, $rootScope, $uibModal, growlService, $timeout, usSpinnerService, $filter) {
    $scope.image = {};
    $scope.image.src = $sessionStorage.imageSrc;


    $scope.checked = false
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.hideSpinner = true;
    }
    $rootScope.initUsers = function() {
        $scope.selected = true;
        $rootScope.user = {};
        $scope.users;
        $rootScope.user.password = '';
        $http.get('/users').success(function(response) {
            $scope.admins = $filter('orderBy')(response.admin, "created_at", true);
            $scope.doctors = $filter('orderBy')(response.doctor, "created_at", true);
            $scope.nurses = $filter('orderBy')(response.nurse, "created_at", true);
            $scope.patients = $filter('orderBy')(response.patient, "created_at", true);

            var connectedRemoved = $scope.admins.filter(function(user) {
                return user.id !== $sessionStorage.connectedUser.id;
            });

            $scope.admins = connectedRemoved;
            if (!$scope.admins.length) {
                $scope.errorAdmin = true;
                $scope.errorMSGAdmin = 'No admins!'
            }
            if (!$scope.doctors.length) {
                $scope.errorDoctor = true;
                $scope.errorMSGDoctor = 'No doctors!'
            }
            if (!$scope.nurses.length) {
                $scope.errorNurse = true;
                $scope.errorMSGNurse = 'No nurses!'
            }
            if (!$scope.patients.length) {
                $scope.errorPatient = true;
                $scope.errorMSGPatient = 'No patients!'
            }
            //All users = obj
            var obj = {};
            obj = $scope.doctors.concat($scope.admins, $scope.nurses, $scope.patients);

            $scope.users = $filter('orderBy')(obj, "created_at", true);
            var obj2 = {};
            obj2 = $scope.doctors.concat($scope.patients);

            $scope.users2 = $filter('orderBy')(obj2, "created_at", true);
                //$scope.users = obj;
            $scope.stopSpin()


            if (!$scope.users.length) {
                $scope.errorUser = true;
                $scope.errorMSGUser = 'No users!'
            }
        }).error(function(response) {
            $scope.error = response.message;
        });
    }

    $scope.initUsers();

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

    // Create a new user function
    $scope.btn_createUser = function(valid, type) {
        var POST_URL;
        console.log("$scope")
        console.log($scope.user)
        console.log("valid")
        console.log(valid)

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
            $rootScope.user.profilePicture = $scope.image.src;
        $scope.user = $rootScope.user;
        if (valid) {
            if ((!$scope.checked) && ($scope.user.password === undefined) && ($scope.user.confPassword === undefined)) {
                $scope.errorMSG = "saisir ou generer votre mot de passe";
                $scope.error = true;
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else if ((!$scope.checked) && ($scope.user.password === undefined)) {
                $scope.errorMSG = "saisir ou generer votre mot de passe";
                $scope.error = true;
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else if ((!$scope.checked) && ($scope.user.confPassword === undefined)) {
                $scope.errorMSG = "saisir ou generer votre mot de passe";
                $scope.error = true;
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else if ((!$scope.checked) && ($scope.user.password != $scope.user.confPassword)) {
                $scope.errorMSG = "Verifier votre mot de passe";
                $scope.error = true;
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else if (($scope.user.password == $scope.user.confPassword) && ($scope.user.password.length < 8)) {
                $scope.errorMSG = "Mot de passe doit contenir plus que 8 caractères";
                $scope.error = true;
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
            else {
                if ($scope.checked)
                    toSendPassword = generate();
                else {
                    if ($scope.user.password == $scope.user.confPassword)
                        toSendPassword = $scope.user.password;

                }
                $scope.user.birth = new Date();
                $scope.user.birth.setMonth($scope._birthMonth, $scope._birthDay);
                $scope.user.birth.setFullYear($scope._birthYear);
                var uibModalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    backdrop: 'static',
                    controller: function($uibModalInstance, $scope, $rootScope) {
                        $scope.ok = function() {



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

                                    $rootScope.errorAdd(response.error);
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
        }
        else {
            $scope.submitted = true;
            $scope.error = true;
            $scope.errorMSG = "Veuillez Saisir tout les champs";
            $timeout(function() {
                $scope.error = false;
            }, 4000);
        }
    }

    //shows error when there is error on add
    $rootScope.errorAdd = function(message) {
        $scope.error = true;
        $scope.errorMSG = message
        $timeout(function() {
            $scope.error = false;
        }, 4000);
    }

    $rootScope.selectedUser = {};
    //delete the selected users
    $scope.RemoveSelected = function() {
        if ($scope.testSelectedUsers($rootScope.selectedUser)) {
            $scope.errorUser = false;
            var uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                animation: true,
                templateUrl: 'myModalContent.html',
                backdrop: 'static',
                controller: function($uibModalInstance, $scope, $rootScope) {
                    $scope.ok = function() {
                        $http.post('/users/delete', {
                            users: $rootScope.selectedUser
                        }).success(function(response) {
                            if (response.success) {
                                uibModalInstance.dismiss();
                                $rootScope.initUsers();
                                growlService.growl('Selected Users have been deleted', 'inverse');


                            }
                            else {
                                if (response.error) {
                                    $scope.error = true;
                                    $scope.errorMSG = response.error
                                }
                            }
                        }).error(function(err) {
                            console.error(err)
                        });
                        // $state.reload();

                    };
                    $scope.cancel = function() {
                        uibModalInstance.dismiss('cancel');
                    };

                },
                size: 'sm'
            });
        }
        else {
            $scope.errorUser = true;
            $scope.errorMSGUser = "Aucun utilisateur selectionné";
            $timeout(function() {
                $scope.errorUser = false;
            }, 4000);
        }

    }

    //depending on the type of user it redirects to its profile info page
    $scope.userProfile = function(id) {
        $http.get('/user/profile/' + id, {
            id: id
        }).success(function(response) {
            var result = response.typeuser;
            if (result == 1) {
                $sessionStorage.userProfile = id;
                $sessionStorage.typeuser = result;
                $state.go('profile-admin');
            }
            if (result == 2) {
                $sessionStorage.userProfile = id;
                $sessionStorage.typeuser = result;
                $state.go('profile-nurse');
            }
            if (result == 3) {
                $sessionStorage.userProfile = id;
                $sessionStorage.typeuser = result;
                $state.go('profile-doctor');
            }
            if (result == 4) {
                $sessionStorage.userProfile = id;
                $sessionStorage.typeuser = result;
                $state.go('profile-patient');
                $sessionStorage.newPatient = true

            }

        }).error(function(response) {
            $scope.error = response.message;
        });
    }

    //checkbox OnChange type of user view
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

    //chat with user imports the already existant chat or creates a new one
    $scope.newChat = function(user_id) {
        $http.post('/chat/new/', {
            connectedUser: $sessionStorage.connectedUser,
            correspondant_id: user_id
        }).success(function(response) {
            $sessionStorage.discussion = response.data;
            $state.go('singleChat');

        }).error(function(response) {
            $scope.errorUser = true;
            $scope.errorMSGUser = response.message;
            $timeout(function() {
                $scope.error = false;
            }, 4000);
        });

    }

    //test if there are any selected users
    $scope.testSelectedUsers = function(object) {
        for (var key in object) {
            if (object[key] == true) {
                return true
            }
        }
    }

});
