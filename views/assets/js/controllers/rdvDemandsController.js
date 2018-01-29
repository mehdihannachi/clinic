// newsController contoller 
materialAdmin.controller('rdvDemandsController', function($scope, $http, $resource, $window, $state, $filter, $sessionStorage, $uibModal, $rootScope, growlService, $timeout, usSpinnerService) {
  $scope.image = {};
  $scope.stopSpin = function() {
    usSpinnerService.stop('spinner-1');
    $scope.hideSpinner = true;
  }
  $rootScope.initRdv = function() {
    $scope.ShowOption = 'Toutes les demandes'

    //get all news rdvDemand available (draft and published)
    $scope.allrD = 1;
    $scope.acceptedrD = 0;
    $scope.refusedrD = 0;
    $scope.on_holdrD = 0;
    $scope.searchrdvDemand;
    $scope.rdvDemand;
    $scope.rdvDemands = [];

    var rdvDemandAll = $resource('/get-rdv-demands');
    rdvDemandAll.get().$promise.then(function(result) {
      $scope.totalItems = result.length
      $scope.rdvDemands = result.rdvDemand
      $scope.rdvDemands.forEach(function(rdvDemand) {

        $http.get('/user/patient/' + rdvDemand.user).success(function(response) {

          if (response) {
            if (response.error) {
              $scope.error = true;
              $scope.errorMSG = response.error
            }
            $scope.stopSpin()
            rdvDemand.user = response

          }

        }).error(function(err) {
          console.error(err)
        });

      });
      $scope.accepted = $scope.rdvDemands.filter(function(rdvDemand) {
        return (rdvDemand.etat == '2');
      });
      $scope.refused = $scope.rdvDemands.filter(function(rdvDemand) {
        return (rdvDemand.etat == '3');
      });
      $scope.on_hold = $scope.rdvDemands.filter(function(rdvDemand) {
        return (rdvDemand.etat == '1');
      })

      if (result.error) {
        $scope.error = true;
        $scope.errorMSG = result.error
      }
    });
  }

  $rootScope.initRdv();

  $scope.showAll = function() {

    $scope.allrD = 1;
    $scope.acceptedrD = 0;
    $scope.refusedrD = 0;
    $scope.on_holdrD = 0;

    $scope.ShowOption = 'Toutes les demandes';
    $scope.totalItems = $scope.rdvDemands.length
    if ($scope.totalItems == 0) {
      $scope.error = true;
      $scope.errorMSG = 'Pas de demande de Rendez-vous'
    }
    else
      $scope.error = false

  }
  $scope.showAccepted = function() {

    $scope.allrD = 0;
    $scope.acceptedrD = 1;
    $scope.refusedrD = 0;
    $scope.on_holdrD = 0;

    $scope.ShowOption = 'Demandes acceptées';
    $scope.totalItems = $scope.rdvDemands.length
    if ($scope.totalItems == 0) {
      $scope.error = true;
      $scope.errorMSG = 'Pas de demande de Rendez-vous'
    }
    else
      $scope.error = false

  }
  $scope.showRefused = function() {

    $scope.allrD = 0;
    $scope.acceptedrD = 0;
    $scope.refusedrD = 1;
    $scope.on_holdrD = 0;

    $scope.ShowOption = 'Demandes refusées';
    $scope.totalItems = $scope.rdvDemands.length
    if ($scope.totalItems == 0) {
      $scope.error = true;
      $scope.errorMSG = 'Pas de demande de Rendez-vous'
    }
    else
      $scope.error = false

  }
  $scope.showOn_hold = function() {

    $scope.allrD = 0;
    $scope.acceptedrD = 0;
    $scope.refusedrD = 0;
    $scope.on_holdrD = 1;

    $scope.ShowOption = 'Demandes en attente';
    $scope.totalItems = $scope.rdvDemands.length
    if ($scope.totalItems == 0) {
      $scope.error = true;
      $scope.errorMSG = 'Pas de demande de Rendez-vous'
    }
    else
      $scope.error = false

  }

  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $scope.getrdvDemands();
  };

  //get the next batch of users (pagination related)
  $scope.getrdvDemands = function() {

    $http.get('/paginate/' + $scope.currentPage).success(function(response) {
      $scope.rdvDemands = response.rdvDemands;


    }).error(function(response) {
      $scope.error = response.message;
    });
  };

  //delete the desired rdvDemand
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
          $http.delete("rdv-demand/" + id)
            .success(function() {
              // $state.reload();
              uibModalInstance.dismiss();
              $rootScope.initRdv();
              growlService.growl('Demande de rendez-vous supprimée', 'inverse');
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

  //add rdvDemand (publish it)
  $scope.addrdvDemand = function(valid) {
    $rootScope.news = $scope.rdvDemand;
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


  //render the update page (save the rdvDemand in session storage)  
  $scope.updateRdvDemand = function(rdvDemand, id) {
    rdvDemand.date = $filter('amDateFormat')(rdvDemand.date, 'dddd, MMMM Do YYYY');
    var uibModalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      animation: true,
      templateUrl: 'modalRdvContent.html',
      backdrop: 'static',
      controller: function($uibModalInstance, $scope, $rootScope) {
        $scope.ok = function(valid) {
          if (valid) {
            $http.post("/update/rdv-demand/" + id, {
                rdvDemand: rdvDemand,
                etat: $scope.etat
              })
              .success(function(response) {
                uibModalInstance.dismiss();
                $rootScope.initRdv();
                growlService.growl('Etat de demande de rendez-vous modifié', 'inverse');
              })
              .error(function() {

              });
          };
        }
        $scope.cancel = function() {
          uibModalInstance.dismiss('cancel');
        };

      },
      size: 'sm'
    });
  }

  //add rdvDemand as a draft
  $scope.draftrdvDemand = function(valid) {
    $rootScope.news = $scope.rdvDemand;
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

  $rootScope.selectedRdv = {};
  var ACTION_URL;
  //delete the desired rdvDemand
  $scope.ActionOnSelected = function() {
    if ($scope.testSelectedrdvDemands($rootScope.selectedRdv)) {
      var uibModalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        animation: true,
        templateUrl: 'myModalContent.html',
        backdrop: 'static',
        controller: function($uibModalInstance, $scope, $rootScope) {
          $scope.ok = function() {
            $http.post('/rdv-demands', {
              rdvDemands: $rootScope.selectedRdv
            }).success(function(response) {
              if (!response.error) {

                uibModalInstance.dismiss();
                $rootScope.initRdv();
                growlService.growl('Demandes de rendez-vous supprimées', 'inverse');

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
      $scope.errorMSG = "Aucune demande selectionnée";
      $timeout(function() {
        $scope.error = false;
      }, 4000);
    }
  }

  //show the ALL rdvDemands
  $scope.OnlyAll = function() {

      $scope.allrdvDemands = 1;
      $scope.draftrdvDemands = 0;
      $scope.publishedrdvDemands = 0;

      $scope.ShowOption = 'Toutes les demandes';
      $scope.totalItems = $scope.rdvDemands.length
      if ($scope.totalItems == 0) {
        $scope.error = true;
        $scope.errorMSG = 'No rdvDemands'
      }
      else
        $scope.error = false

    }
    //show the only drafte rdvDemands
  $scope.onlyDraft = function() {

      $scope.allrdvDemands = 0;
      $scope.draftrdvDemands = 1;
      $scope.publishedrdvDemands = 0;

      $scope.ShowOption = 'Drafts';
      $scope.totalItems = $scope.drafts.length
      if ($scope.totalItems == 0) {
        $scope.error = true;
        $scope.errorMSG = 'No rdvDemands in Draft'
      }
      else
        $scope.error = false


    }
    //show the only published rdvDemands
  $scope.onlyPublished = function() {

    $scope.allrdvDemands = 0;
    $scope.draftrdvDemands = 0;
    $scope.publishedrdvDemands = 1;

    $scope.ShowOption = 'Published rdvDemands';
    $scope.totalItems = $scope.published.length
    if ($scope.totalItems == 0) {
      $scope.error = true;
      $scope.errorMSG = 'No published rdvDemands'
    }
    else
      $scope.error = false


  }

  //test if there are any selected rdvDemands
  $scope.testSelectedrdvDemands = function(object) {
    for (var key in object) {
      if (object[key] == true) {
        return true
      }
    }
  }

});
