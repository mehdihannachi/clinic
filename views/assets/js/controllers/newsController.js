// newsController contoller 
materialAdmin.controller('newsController', function($scope, $http, $resource, $window, $state, $sessionStorage, $uibModal, $rootScope, growlService, $timeout, usSpinnerService) {
  $scope.image = {};
  $scope.stopSpin = function() {
    usSpinnerService.stop('spinner-1');
    $scope.hideSpinner = true;
  }
  $rootScope.initNews = function() {
    $scope.ShowOption = 'Show All'

    //get all news article available (draft and published)
    $scope.allArticles = 1;
    $scope.draftArticles = 0;
    $scope.publishedArticles = 0;
    $scope.searchArticle;
    $scope.article;
    $scope.articles = [];

    var newsAll = $resource('/news');
    newsAll.get().$promise.then(function(result) {
      $scope.totalItems = result.length
      $scope.articles = result.articles
      $scope.stopSpin()
      $scope.drafts = $scope.articles.filter(function(article) {
        return (article.as_draft == true);
      })
      $scope.published = $scope.articles.filter(function(article) {
        return (article.as_draft == false);
      })

      if (result.error) {
        $scope.error = true;
        $scope.errorMSG = result.error
      }
    });
  }
  $rootScope.initNews();

  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $scope.getArticles();
  };

  //get the next batch of users (pagination related)
  $scope.getArticles = function() {

    $http.get('/paginate/' + $scope.currentPage).success(function(response) {
      $scope.articles = response.articles;


    }).error(function(response) {
      $scope.error = response.message;
    });
  };

  //delete the desired article
  $scope.deleteModal = function(id) {
    var uibModalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      animation: true,
      templateUrl: 'myModalContent.html',
      backdrop: 'static',
      controller: function($uibModalInstance, $scope, $rootScope) {
        $scope.ok = function() {
          $http.post("news/delete/" + id)
            .success(function() {
              // $state.reload();
              uibModalInstance.dismiss();
              $rootScope.initNews();
              growlService.growl('News article has been deleted', 'inverse');
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

  //add article (publish it)
  $scope.addArticle = function(valid) {
    $rootScope.news = $scope.article;
    $rootScope.news.cover_photo = $scope.image.src;

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
            $http.post("news/add/", {
                title: $rootScope.news.title,
                content: $rootScope.news.htmlContent,
                introduction: $rootScope.news.introduction,
                cover_photo: $rootScope.news.cover_photo
              })
              .success(function() {
                uibModalInstance.dismiss();
                growlService.growl("Add Successfully !", 'success')
                $state.go('news');
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


  //render the update page (save the article in session storage)  
  $scope.updateArticle = function(id) {
    $http.get("/news/article/" + id)
      .success(function(response) {
        console.log(response)
        $sessionStorage.title = response.title;
        $sessionStorage.htmlContent = response.content;
        $sessionStorage.introduction = response.introduction;
        $sessionStorage.cover_photo = response.cover_photo;
        $sessionStorage.id = response._id;
        $sessionStorage.as_draft = response.as_draft;
        $state.go("update-article");

      })
      .error(function() {

      });
  }

  //add article as a draft
  $scope.draftArticle = function(valid) {
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
            $http.post("/news/draft", {
                title: $scope.news.title,
                content: $scope.news.htmlContent,
                introduction: $scope.news.introduction,
                cover_photo: $scope.news.cover_photo
              })
              .success(function(response) {
                $sessionStorage.title = response.title;
                $sessionStorage.htmlContent = response.content;
                uibModalInstance.dismiss();
                $state.go("news");

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

  $rootScope.selectedNews = {};
  var ACTION_URL;
  //delete the desired article
  $scope.ActionOnSelected = function(value) {
    if ($scope.testSelectedArticles($rootScope.selectedNews)) {
      var uibModalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        animation: true,
        templateUrl: 'myModalContent.html',
        backdrop: 'static',
        controller: function($uibModalInstance, $scope, $rootScope) {
          $scope.ok = function() {
            if (value == 1) {
              ACTION_URL = '/news/many/draft'
            }
            if (value == 2) {
              ACTION_URL = '/news/many/delete'
            }
            $http.post(ACTION_URL, {
              articles: $rootScope.selectedNews
            }).success(function(response) {
              if (!response.error) {

                uibModalInstance.dismiss();
                $rootScope.initNews();
                if (value == 1)
                  growlService.growl('Selected Articles have been moved to Draft', 'inverse');
                else if (value == 2)
                  growlService.growl('Selected Articles have been deleted', 'inverse');

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
      $scope.errorMSG = "Aucun article selectionné";
      $timeout(function() {
        $scope.error = false;
      }, 4000);
    }
  }

  //show the ALL articles
  $scope.OnlyAll = function() {

      $scope.allArticles = 1;
      $scope.draftArticles = 0;
      $scope.publishedArticles = 0;

      $scope.ShowOption = 'Show All';
      $scope.totalItems = $scope.articles.length
      if ($scope.totalItems == 0) {
        $scope.error = true;
        $scope.errorMSG = 'No articles'
      }
      else
        $scope.error = false

    }
    //show the only drafte articles
  $scope.onlyDraft = function() {

      $scope.allArticles = 0;
      $scope.draftArticles = 1;
      $scope.publishedArticles = 0;

      $scope.ShowOption = 'Drafts';
      $scope.totalItems = $scope.drafts.length
      if ($scope.totalItems == 0) {
        $scope.error = true;
        $scope.errorMSG = 'No articles in Draft'
      }
      else
        $scope.error = false


    }
    //show the only published articles
  $scope.onlyPublished = function() {

    $scope.allArticles = 0;
    $scope.draftArticles = 0;
    $scope.publishedArticles = 1;

    $scope.ShowOption = 'Published Articles';
    $scope.totalItems = $scope.published.length
    if ($scope.totalItems == 0) {
      $scope.error = true;
      $scope.errorMSG = 'No published articles'
    }
    else
      $scope.error = false


  }

  //test if there are any selected articles
  $scope.testSelectedArticles = function(object) {
    console.log(object)
    for (var key in object) {
      console.log(key)
      console.log(object[key])
      if (object[key] == true) {
        return true
      }
    }
  }

});
