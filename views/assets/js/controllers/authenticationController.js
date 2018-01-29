// loginController contoller 
materialAdmin.controller('loginController', function($scope, $http, $sessionStorage, $state, $uibModal, $timeout) {
 this.login = 1;
 this.register = 0;
 this.forgot = 0;

 /*if (forgetpassword == true) {
  this.login = 0;
  this.register = 0;
  this.forgot = 1;
 }*/

 $scope.userLogin = {};
 $scope.userSignup = {};
 $scope.PassReco = {};


 // function btn_login
 $scope.btn_login = function(valid) {
  $scope.submitted = true;
  if (valid) {

   $http.post('/ajax/login', {
    email: $scope.userLogin.email,
    password: $scope.userLogin.password
   }).success(function(response) {
    console.log(response)
    if (response.error == false) {
     $sessionStorage.connectedUser = response.user;
     window.location.href = '/';
    }
    else {
     $scope.error = true;
     $scope.errorMSG = response.error;
     $timeout(function() {
      $scope.error = false;
     }, 4000);
    }

   }).error(function(res2) {});
  }

 }

 $scope.test = function() {
  $scope.userLogin = {};
  $scope.userSignup = {};
  $scope.forgetemail = "";
  $scope.error = false;
  $scope.errorMSG = "";
  $scope.submitted = false;
 }

 $scope.btn_signup = function(valid) {
  $scope.submitted = true;

  if ((valid) && ($scope.userSignup.license)) {

   $http.post('/ajax/signup-admin', {
    user: $scope.userSignup,
    email: $scope.userSignup.email,
    password: $scope.userSignup.password,
    isAdmin: 'true'
   }).success(function(response) {
    if (!response.error) {

     var uibModalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      animation: true,
      templateUrl: 'myModalContent.html',
      backdrop: 'static',
      controller: function($uibModalInstance, $scope, $rootScope) {
       $scope.ok = function() {
        window.location.href = '/';
       };
       $scope.cancel = function() {
        uibModalInstance.dismiss('cancel');
       };

      },
      size: 'sm'
     });

    }
    else {
     if (response.error) {
      $scope.error = true;
      $scope.errorMSG = response.error;
      $timeout(function() {
       $scope.error = false;
      }, 4000);
     }
     // console.error("Error sign up patient")
    }
   }).error(function(err) {});

  }
  else {
   $scope.error = true;
   $scope.errorMSG = 'Veuillez verifier tout les champs et les termes du contrat'
   $timeout(function() {
    $scope.error = false;
   }, 4000);
  }
 }


 // passwordController
 $scope.btn_Forgotpassword = function(passwordForm) {
  console.log("test")
  console.log(passwordForm)
  $scope.submitted = true;
  $scope.sendmail = false;
  $scope.error = false;
  $scope.errorMSG = "";
  if (passwordForm) {
   $scope.submitted = false;
   $http.post('/ajax/forgotpassword', {
    email: $scope.PassReco.forgetemail
   }).success(function(response) {
    if (!response.error) {
     $scope.sendmail = true;
     $scope.error = false;
    }
    else if (response.error == true) {
     $scope.error = true
     $scope.errorMSG = response.message
     $timeout(function() {
      $scope.error = false;
     }, 4000);
    }
   }).error(function(res2) {
    $scope.showerrorcnx = true;
    $scope.errorcnx = res2;
   });
  }

 }

});
