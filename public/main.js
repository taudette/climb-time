var requestApp = angular.module('requestApp', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'gm.datepickerMultiSelect']);

requestApp.config(function($routeProvider) {
    $routeProvider
    .otherwise('/');
    //load page using otherwise to add #/
    
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

	var showMarkers = function(){
		//sending request to server side endpoint (api)
		$http.get('/api/')
		//data coming in from res.send
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
	};


	showMarkers();
	$scope.window = function(){
		console.log('click');
	};
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
	        				id:savedItem._id, latitude: $scope.latitude, longitude: $scope.longitude
	        			});
					$scope.markerList.push(marker);	
		     	}
			});	
		});
	$scope.newItem = {};		
    }; 	
	$scope.removeItem = function(item){
		// console.log($scope.items);
		this.item.$remove(function(){
			var index = $scope.items.indexOf(this.item);
			$scope.items.splice(index, 1);
		});
	};

	//map stuff
	
	$scope.map = { center: { latitude: 39.8282, longitude: -98.5 }, zoom: 3, options:{ styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#675a4b"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#ffebc5"},{"lightness":"-10"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#675a4b"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#b70046"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"color":"#675a4b"},{"weight":"0.50"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"color":"#675a4b"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#ff850a"}]},{"featureType":"administrative.neighborhood","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"saturation":"-71"},{"lightness":"-2"},{"color":"#ffebc5"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#70bfaf"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#675a4c"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#675a4b"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#675a4b"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7ccff0"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#cfeae4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#109579"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}]} };

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
