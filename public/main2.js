var requestApp = angular.module('requestApp', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'gm.datepickerMultiSelect']);

requestApp.config(function($routeProvider) {
    $routeProvider.
	      otherwise({
	        redirectTo: '/'
	      });
    
});

requestApp.factory('climbRequests', function($resource){
	var model = $resource('/api/:id', {id: '@_id'});
	return{
		model: model,
		//first query up to db to get info to pre fill page
		items: model.query()
	};
});

requestApp.controller('ScrollController', ['$scope', '$location', '$anchorScroll',
  function ($scope, $location, $anchorScroll) {
    $scope.gotoMap = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('map');

      // call $anchorScroll()
      $anchorScroll();
    };
  }]);
  requestApp.controller('requestController', function($scope, $http, $location, $anchorScroll, climbRequests){

  	$scope.items = climbRequests.items;
	$scope.markerList = [{}];

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    //this also populates climber list
    var createMarker = function (info){
        
		$http.get('/api/')
		.success(function(data) {
			for (var i = 0; i < data.length; i++) {
				$scope.markerList.push({
					name: data[i].name,
					state: data[i].state,
					grade: data[i].grade,
					date: data[i].date,
					info: data[i].info,
					id: data[i]._id,
					latitude: data[i].geo.lat,
					longitude: data[i].geo.long
				});	
					
			}
		})
		.error(function(data) {
			console.log(data);
		});
		$scope.addItem = function(){
		var newRequest = new climbRequests.model($scope.newItem);
		newRequest.$save(function(savedItem){

			climbRequests.items.push(savedItem);

			//markers
			var geocoder = new google.maps.Geocoder();
 			geocoder.geocode( { "address": savedItem.crag + ',' + savedItem.state }, function(results, status) {
	     		if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
	        		var location = results[0].geometry.location;
	        		$scope.latitude = location.A;
	        		$scope.longitude = location.F; 
	        		
	        		$scope.newItem.geo = {id: savedItem._id, lat: location.A, long: location.F};
	        		$http.put('/api/'+ savedItem._id, $scope.newItem.geo)
	        			.success(function(data) {
	        			})
	        			.error(function(data) {
	        				console.log(data);
	        			});
	        			var marker = new google.maps.Marker({
	        				map: $scope.map,
	        				id:savedItem._id, 
	        				latitude: $scope.latitude, 
	        				longitude: $scope.longitude
	        			});
					$scope.markerList.push(marker);	
		     	}
			});	
		});
	$scope.newItem = {};		
    }; 


        // var marker = new google.maps.Marker({
        //     map: $scope.map,
        //     position: new google.maps.LatLng(info.lat, info.long),
        //     title: info.city
        // });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
         for (i = 0; i < markerList.length; i++){
        createMarker(markerList[i]);
    }
    
        
    };
     
    // for (i = 0; i < markers.length; i++){
    //     createMarker(markers[i]);
    // }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

});
//no camel case
requestApp.directive('climbrequests', function(){
	return{
		//only matches element name(use when creating component that is in control of template, use Attribute when decorating an element with another behavior)
		restrict: 'E',
		templateUrl: '/templates/climbRequests',
		//without isolating the scope the directive could only be used once for each controller. Instead, seperate inside scope then map outer scope into directive
		scope:{
			item: '='
		}
	};
});

