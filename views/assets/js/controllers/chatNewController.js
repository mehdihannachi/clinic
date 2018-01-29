// chatController contoller 
materialAdmin.controller('chatNewController', function($filter, $scope, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope, growlService, usSpinnerService) {



    $scope.stopSpin = function() {
            usSpinnerService.stop('spinner-1');
            $scope.hideSpinner = true;
        }
        // init controller
    $rootScope.initNewChat = function() {
        console.log('initNewChat')
        $scope.discussion = $sessionStorage.discussion;
        $rootScope.user = {};
        $scope.users;
        $scope.allIncoming = false;
        $http.get('/users').success(function(response) {
            $scope.admins = response.admin;
            $scope.doctors = response.doctor;
            $scope.nurses = response.nurse;
            $scope.patients = response.patient;

            var connectedRemoved = $scope.admins.filter(function(user) {
                return user.id !== $sessionStorage.connectedUser.id;
            });

            //All users = obj
            var obj = {};
            obj = $scope.doctors.concat($scope.admins, $scope.nurses, $scope.patients);
            var connectedRemoved = obj.filter(function(user) {
                return user.id !== $sessionStorage.connectedUser.id;
            });


            $scope.users = $filter('orderBy')(connectedRemoved, "created_at", true);
            $scope.stopSpin()

            if (!$scope.users.length) {
                $scope.errorUser = true;
                $scope.errorMSGUser = 'No users!'
            }
        }).error(function(response) {
            $scope.error = response.message;
        });
    }
    $rootScope.initNewChat();

    // create new chat
    $scope.newChat = function(user_id) {
        $http.post('/chat/new/', {
            connectedUser: $sessionStorage.connectedUser,
            correspondant_id: user_id
        }).success(function(response) {
            $sessionStorage.discussion = response.data;
            $state.go('singleChat');

        }).error(function(response) {
            $scope.error = response.message;
        });

    }
})
