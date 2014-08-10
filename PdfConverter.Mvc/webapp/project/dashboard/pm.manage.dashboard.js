(function (angular, undefined) {
	'use strict';

	var module = angular.module('pm.manage.dashboard', [
		'ngRoute',
		'pm.common',
	]);

	module.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/dashboard', {
			controller: 'ProjectDashboardController',
			templateUrl: 'WebApp/project/dashboard/dashboard.html'
		})
		.otherwise({
			redirectTo: '/dashboard'
		});

	}]);

	module.controller("ProjectDashboardController", ['$scope', '$common', '$controller', '$http', '$config', ProjectDashboardController]);

	function ProjectDashboardController($scope, $common, $controller, $http, $config) {

	    var Api = $common.Api;

	    $scope.safeApply = function (fn) {
	        var phase = $scope.$root.$$phase;
	        if (phase == '$apply' || phase == '$digest') {
	            if (fn && (typeof (fn) === 'function')) {
	                fn();
	            }
	        } else {
	            this.$apply(fn);
	        }
	    };
		
		$scope.file = {
			input: null,
			url: null,
			coords: null
		};

		$scope.scannedText = null;
		$scope.pdfPageCount = 0;
		$scope.currentPage = 0;

		$scope.isImageLoaded = false;
		$scope.firstPage = null;
		$scope.projectName = "";

		$scope.isWebRequest = false;

		$scope.getPageCount = function () {
			return new Array($scope.pdfPageCount);
		};

		$scope.getPage = function (pageNumber) {
		    $scope.isWebRequest = true;
			return $http.post(
				$config.API_ENDPOINT
				+ 'project/getPdfpage?project=' + $scope.projectName
				+ '&pageNumber=' + pageNumber
				+ '&localFileName=' + $scope.localFileName, {
					headers: { 'Content-Type': 'multipart/form-data' },
					transformRequest: function (data) {
						var formData = new FormData();
						if (data) {
							formData.append(data.type, data);
						}
						return formData;
					},
				}).success(function (data) {
					//debugger;
					// set the image of the new page using the data uri
					$scope.firstPage = data.imageData;

					// Set the selected page as current page
					//$scope.currentPage = pageNumber;
					$scope.safeApply(function () { $scope.currentPage = pageNumber; });

					$scope.isImageLoaded = true;
					$scope.isWebRequest = false;
					console.log(data.imageData);
				}).error(function () {
				    $scope.isWebRequest = false;
				});
		};

		$scope.upload = function () {
		    $scope.isWebRequest = true;
			return $http.post(
				$config.API_ENDPOINT
				+ 'project/upload?project=' + $scope.projectName, $scope.file.input, {
					headers: { 'Content-Type': undefined },
					transformRequest: function (data) {
						var formData = new FormData();
						if (data) {
							formData.append(data.type, data);
						}
						return formData;
					},
				}).success(function (data) {
					//debugger;
					// Set the first page image using data uri 
					$scope.firstPage = data.imageData;
					// get the total number of pages in the pdf file
					$scope.pdfPageCount = data.pageCount;
					// TODO : Save the pdf file with project name 
					$scope.localFileName = data.localFileName;

					// Set the Current Page since first page is displayed by default
					$scope.currentPage = 1;

					$scope.isWebRequest = false;

					// set this flag to hide upload related controls 
					$scope.isImageLoaded = true;
				}).error(function () {
				    $scope.isWebRequest = false;
				});
		};

		$scope.getText = function () {
		    $scope.isWebRequest = true;
			return $http.post(
				$config.API_ENDPOINT
				+ 'project/imagetotext?project=' + $scope.projectName
				+ '&pageNumber=' + $scope.currentPage
				+ '&x1=' + $scope.file.coords.x
				+ '&y1=' + $scope.file.coords.y
				+ '&x2=' + $scope.file.coords.x2
				+ '&y2=' + $scope.file.coords.y2, {
					headers: { 'Content-Type': 'multipart/form-data' },
					transformRequest: function (data) {
						var formData = new FormData();
						if (data) {
							formData.append(data.type, data);
						}
						return formData;
					},
				}).success(function (data) {
					//debugger;
				    $scope.scannedText = JSON.parse(data);

				    $scope.isWebRequest = false;
				}).error(function () {
				    $scope.isWebRequest = false;
				});
		};

	}

}(angular));