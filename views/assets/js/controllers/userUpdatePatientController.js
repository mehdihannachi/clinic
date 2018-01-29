// userController contoller 
materialAdmin.controller('userUpdatePatientController', function($filter, $scope, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope, growlService, usSpinnerService) {
    var typeuser = $sessionStorage.typeuser;
    var user_id = $sessionStorage.userProfile.user_id
    $scope.image = {};
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.hideSpinner = true;
    }
    $scope.init = function() {


        $scope.locations = locations;


        $http.get('/user/patient/' + user_id).success(function(response) {

            if (response) {
                if (response.error) {
                    $scope.error = true;
                    $scope.errorMSG = response.error
                }
                console.log(response)
                $scope.user = response
                $scope.image.src = $scope.user.profile_picture;
                var date = new Date($scope.user.birth)
                $scope._birthYear = date.getFullYear().toString();

                $scope._birthMonth = date.getMonth().toString();
                $scope._birthDay = date.getDate().toString();
                $scope.stopSpin()

            }
        }).error(function(err) {
            console.error(err)
        });


    }
    $scope.init();

    //function to call update web service
    $scope.updateUser = function(valid) {

        if (valid) {
            $scope.user.profilePicture = $scope.image.src;
            $scope.user.birth = new Date();
            $scope.user.birth.setMonth($scope._birthMonth, $scope._birthDay);
            $scope.user.birth.setFullYear($scope._birthYear);
            $rootScope.user = $scope.user
            var uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                animation: true,
                templateUrl: 'myModalContent.html',
                backdrop: 'static',
                controller: function($uibModalInstance, $scope, $rootScope) {

                    $scope.ok = function() {
                        $http.post('/user/patient/' + $rootScope.user.id, {
                                user: $rootScope.user,
                                user_id: $rootScope.user.user_id
                            })
                            .success(function(response) {
                                if (response) {
                                    if (response.error) {
                                        $scope.error = true;
                                        $scope.errorMSG = response.error
                                    }
                                    if (response.success) {
                                        uibModalInstance.dismiss();
                                        growlService.growl('User has been Updated', 'success');
                                        $state.go('users')
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
            $scope.error = true;
            $scope.errorMSG = "Veuillez Saisir tout les champs";
        }
    }


});

materialAdmin.filter('ageFilter', function() {
    return function(birthday) {
        var birthday = new Date(birthday);
        var today = new Date();
        var age = ((today - birthday) / (31557600000));
        var age = Math.floor(age);
        return age;
    }
});
