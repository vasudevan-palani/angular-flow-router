(function() {
  angular.module('app').config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controllerName: "accountRecoveryController",
      templateUrl: "app/components/myaccount/accountrecovery/wfm_sign_in.html",
      resolve: {
        _: ['$location', '$userService', function($location, $userService) {
          if ($userService.isLoggedIn() || angular.isDefined($userService.getAccountId())) {
            $location.url('/myaccount/dashboard');
          } else {
            return;
          }
        }]
      }
    });
    $routeProvider.when('/contactus', {
      templateUrl: "app/components/wcm/wcm_view.html",
      controllerName: "wcmController",
      resolve: {
        wcmurl: function() {
          return 'm/contactus';
        }
      }
    });
    $routeProvider.when('/myaccount/login', {
      templateUrl: "app/components/myaccount/auth/auth_view.html",
      controllerName: "loginController",
      on: {
        "loginOK": "/myaccount/dashboard"
      }
    });
    $routeProvider.when('/myaccount/dashboard', {
      templateUrl: "app/components/myaccount/dashboard/mydevices/wfm_dashboard_view.html",
      controllerName: "dashboardController"
    });
    $routeProvider.when('/myaccount/myprofile', {});
    $routeProvider.when('/unsubscribe', {
      templateUrl: "app/components/emailsubscribe/emailsubscribe_view.html",
      controllerName: "unsubscribeController",
      on: {
        "unsubscribeOK": "/unsubscribe/result"
      }
    });
    $routeProvider.when('/unsubscribe/result', {
      templateUrl: "app/components/emailsubscribe/emailsubscribe_success_view.html",
      controllerName: "unsubscribeController"
    });
  }]);
})()