// chatController contoller 
materialAdmin.controller('chatHistoryController', function($filter, $scope, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope, growlService, $timeout, usSpinnerService) {


    $scope.showChat = false;
    $rootScope.allUnread = 0;
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.hideSpinner = true;
    }

    //init controller
    $scope.initChat = function() {
        // $rootScope.initNewChat
        $scope.discussion = $sessionStorage.discussion;
        $rootScope.userHistory = {};
        $rootScope.allIncomingHistory = false;
        $scope.showChat = true;
        $rootScope.discussionsHistory;

        $http.get('/chat/discussionsHistory/' + $sessionStorage.userProfile.user_id, {}).success(function(response) {
            console.log(response)
            if (response.data) {
                $rootScope.discussionsHistory = response.data;
                $rootScope.allUnreadHistory = 0;
                $rootScope.discussionsHistory.forEach(function(discussion) {
                    discussion.lastOne = discussion.messages[discussion.messages.length - 1];
                    discussion.newMessages = 0;
                    discussion.messages.forEach(function(message) {
                        if ((!message.seen) && (message.to == $sessionStorage.userProfile.user_id)) {
                            discussion.newMessages++;
                        }
                    })
                    if (discussion.newMessages != 0)
                        discussion.incoming = true;
                    else
                        discussion.incoming = false;
                    $rootScope.allUnreadHistory = $rootScope.allUnreadHistory + discussion.newMessages;
                    if ($rootScope.allUnreadHistory != 0)
                        $rootScope.allIncomingHistory = true;

                })

                // $sessionStorage.allDiscussions = $scope.discussions;
                $scope.discussionsHistory = $filter('orderBy')($rootScope.discussionsHistory, 'lastOne.date', true);
                $scope.chatDiscussionsHistory = $rootScope.discussionsHistory;
                $scope.dashDiscussionsHistory = $filter('orderBy')($rootScope.discussionsHistory, 'newMessages', true);

                $scope.stopSpin()

                $scope.showChat = false;
            }
            else if (response.error) {
                $scope.error = true;
                $scope.errorMSG = response.message
                $scope.stopSpin()


            }

        }).error(function(response) {
            $scope.error = response.message;


        });
        /* if (typeof $scope.discussions === "undefined") {
          
          
             $scope.stopSpin()
         }*/
    }

    $scope.initChat();

    //listning on event, init controller when ON
    $rootScope.$on('customEvent', function(event) {
        $scope.initChat();
    });

    $scope.getChat = function(id) {
        $http.get('/chat/discussionHistory/' + id, {
            user_id: $sessionStorage.userProfile.user_id
        }).success(function(response) {
            $sessionStorage.discussion = response.data;
            $scope.$emit('customEvent');
            $state.go('single-chat-history');


        }).error(function(response) {
            $scope.error = response.message;
        });
    }

    $scope.selectChat = function(id) {
        $http.get('/chat/discussionHistory/' + id, {
            user_id: $sessionStorage.userProfile.user_id
        }).success(function(response) {
            $sessionStorage.discussion = response.data;
            $rootScope.initSingleChatHistory();



        }).error(function(response) {
            $scope.error = response.message;
        });
    }

    //delete the desired conversation
    $scope.deleteModal = function(id, index) {
        console.log(index)
        var uibModalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            animation: true,
            templateUrl: 'myModalContent.html',
            backdrop: 'static',
            controller: function($uibModalInstance, $scope, $rootScope) {
                $scope.ok = function() {
                    $http.post("chat/delete/" + id)
                        .success(function() {
                            // $state.reload();
                            uibModalInstance.dismiss();
                            $scope.$emit('customEvent');

                            //$rootScope.discussions.splice(index, 1);

                            growlService.growl('Conversation deleted ', 'inverse');
                        })
                        .error(function() {

                        });
                };
                $scope.cancel = function() {
                    uibModalInstance.dismiss('cancel');
                };

            },
            size: 'sm'
        });
    }

    $rootScope.selectedConversations = {};

    //delete the selected conversations from checkbox
    $scope.deleteSelected = function() {
        if ($scope.testSelectedDiscussion($rootScope.selectedConversations)) {
            var uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                animation: true,
                templateUrl: 'myModalContent.html',
                backdrop: 'static',
                controller: function($uibModalInstance, $scope, $rootScope) {
                    $scope.ok = function() {
                        $http.post('/chat/deleteSelected', {
                            discussions: $rootScope.selectedConversations
                        }).success(function(response) {
                            if (!response.error) {
                                console.log($scope.chatDiscussions)
                                $scope.$emit('customEvent');
                                uibModalInstance.dismiss();
                                growlService.growl('Selected conversations have been deleted', 'danger');

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
            $scope.error = true;
            $scope.errorMSG = "Aucune discussion selectionnée";
            $timeout(function() {
                $scope.error = false;
            }, 4000);
        }

    }

    //test if there are any selected chat
    $scope.testSelectedDiscussion = function(object) {
        for (var key in object) {
            if (object[key] == true) {
                return true
            }
        }
    }
})
