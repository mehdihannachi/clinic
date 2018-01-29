// newsController contoller 
materialAdmin.controller('newsUpdateController', function($scope, $http, $resource, $window, $state, $sessionStorage, $rootScope, $uibModal, growlService, $timeout, usSpinnerService) {
    $scope.image = {};
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
        $scope.hideSpinner = true;
    }
    $rootScope.initUpdateNews = function() {
        $scope.article = {};
        $scope.article.title = $sessionStorage.title;
        $scope.image.src = '/img/' + $sessionStorage.cover_photo;
        $scope.article.introduction = $sessionStorage.introduction;
        $scope.article.htmlContent = $sessionStorage.htmlContent;
        $scope.article.id = $sessionStorage.id;
        $scope.article.as_draft = $sessionStorage.as_draft;
        $scope.stopSpin()
    }
    $rootScope.initUpdateNews();

    //function to call update web service
    $scope.updateArticle = function(valid, id) {
            $scope.article.cover_photo = $scope.image.src;
            $rootScope.news = $scope.article;
            if (valid) {
                $scope.error = false;
                var uibModalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    backdrop: 'static',
                    controller: function($uibModalInstance, $scope, $rootScope) {
                        $scope.ok = function() {
                            $http.post("/news/update/" + id, {
                                    draft: $scope.news.as_draft,
                                    title: $scope.news.title,
                                    content: $scope.news.htmlContent,
                                    introduction: $scope.news.introduction,
                                    cover_photo: $scope.news.cover_photo
                                })
                                .success(function(response) {
                                    $sessionStorage.title = response.title;
                                    $sessionStorage.htmlContent = response.content;
                                    $sessionStorage.introduction = response.introduction;
                                    $sessionStorage.cover_photo = response.cover_photo;
                                    uibModalInstance.dismiss();
                                    $rootScope.initUpdateNews();
                                    growlService.growl("Updated Successfully !", 'success')
                                    $state.go('news')

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
            else {
                $scope.error = true;
                $scope.errorMSG = "Veuillez Saisir tout les champs";
                $timeout(function() {
                    $scope.error = false;
                }, 4000);
            }
        }
        //changes the state of the article from draft to article and vise versa
    $scope.draftArticle = function(valid, id) {
        $scope.article.cover_photo = $scope.image.src;
        $rootScope.news = $scope.article;
        if (valid) {
            $scope.error = false;
            var uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                animation: true,
                templateUrl: 'myModalContent.html',
                backdrop: 'static',
                controller: function($uibModalInstance, $scope, $rootScope) {
                    $scope.ok = function() {
                        $http.post("/news/update/" + id, {
                                draft: !$scope.news.as_draft,
                                title: $scope.news.title,
                                content: $scope.news.htmlContent,
                                introduction: $scope.news.introduction,
                                cover_photo: $scope.news.cover_photo
                            })
                            .success(function(response) {
                                $sessionStorage.as_draft = !$scope.news.as_draft;
                                $sessionStorage.title = response.title;
                                $sessionStorage.htmlContent = response.content;
                                $sessionStorage.introduction = response.introduction;
                                $sessionStorage.cover_photo = response.cover_photo;
                                uibModalInstance.dismiss();
                                $rootScope.initUpdateNews();

                                if ($sessionStorage.as_draft)
                                    growlService.growl('News article moved to draft', 'inverse');
                                else if (!$sessionStorage.as_draft)
                                    growlService.growl('News article Published', 'inverse');


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
        else {
            $scope.error = true;
            $scope.errorMSG = "Veuillez Saisir tout les champs";
            $timeout(function() {
                $scope.error = false;
            }, 4000);
        }
    }
});
