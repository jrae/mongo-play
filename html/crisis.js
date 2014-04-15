function CrisisCtrl($scope, $http, $timeout) {
	$scope.example = "hello";
	$scope.assets = [];
	
	$scope.clickMe = function(e)
	{
		alert('You clicked me');
	}

	$scope.callWS = function(e)
	{

		testobj = { aNumber: 2 }
		
		$http.post( '/square', testobj).success(function(data) {	
			$scope.result = data.result; 	
		})
	}
	
	$scope.getAssets = function(e)
	{
		$http.get( '/assets').success(function(data) {	
			$scope.assets = data.result; 	
		})
	}
	
	$scope.getAssets();
}



