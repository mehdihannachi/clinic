'use strict';



materialAdmin.factory('chatFactory', function() {
    var chatResource = $resource('/chat/discussions/' + $sessionStorage.connectedUser.id);
    var chat = chatResource.get(function() {
        user.abc = true;
        user.$save();
    });

    return {
        getPeople: function() {
            return people;
        };
    }

});
materialAdmin.factory('chatFactory', ['$scope', '$http', '$sessionStorage', function($scope, $http, $sessionStorage) {

    $http.get('/chat/discussions/' + $sessionStorage.connectedUser.id, {}).success(function(response) {
        if (response.data) {
            $scope.discussions = response.data;
            console.log(response)
            $scope.discussions.allUnread = 0;
            $scope.discussions.forEach(function(discussion) {
                discussion.lastOne = discussion.messages[discussion.messages.length - 1];
                discussion.users.forEach(function(user) {
                    if (user._id != $sessionStorage.connectedUser.user_id) {
                        if (user.local.typeuser == 1) {
                            URL = '/user/admin/';
                        }
                        else if (user.local.typeuser == 2) {
                            URL = '/user/nurse/';
                        }
                        else if (user.local.typeuser == 3) {
                            URL = '/user/doctor/';
                        }
                        else if (user.local.typeuser == 4) {
                            URL = '/user/patient/';
                        }
                        $http.get(URL + user._id).success(function(response) {

                            if (response) {
                                if (response.error) {
                                    $scope.error = true;
                                    $scope.errorMSG = response.error
                                }

                                discussion.correspondant = response
                            }
                        }).error(function(err) {
                            console.error(err)
                        });
                    }

                })
                discussion.newMessages = 0;
                discussion.messages.forEach(function(message) {
                    if ((!message.seen) && (message.to == $sessionStorage.connectedUser.user_id)) {
                        discussion.newMessages++;
                    }
                })
                if (discussion.newMessages != 0)
                    discussion.incoming = true;
                else
                    discussion.incoming = false;
                $scope.discussions.allUnread = $scope.discussions.allUnread + discussion.newMessages;
                if ($scope.discussions.allUnread != 0)
                    $scope.allIncoming = true;

            })

            $sessionStorage.allDiscussions = $scope.discussions;
            $scope.chatDiscussions = $scope.discussions;
            return $scope.chatDiscussions


        }
        else if (response.error) {
            $scope.errorUser = true;
            $scope.errorMSG = response.message
        }

    }).error(function(response) {
        $scope.error = response.message;

    });

}]);
