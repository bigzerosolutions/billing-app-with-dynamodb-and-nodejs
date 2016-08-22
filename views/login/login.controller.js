(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location','$scope','$http','AuthenticationService', 'FlashService'];
    function LoginController($location,$scope,$http,AuthenticationService, FlashService) {
        var vm = this;
       $scope.login = function()
        {  
            vm.dataLoading = true;
            //console.log($scope.vm);
            $http.post('/login',$scope.vm).success(function(response)
            {   

                console.log(response);
                if(response == "true") 
                {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    var test = $location.path('/home');
                    console.log(test);
                    
                }
                
            });
        };

           
        
       
    }

})();
