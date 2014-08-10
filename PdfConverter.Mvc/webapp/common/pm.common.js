(function () {
    'use strict';

    var module = angular.module('pm.common', [
		'ngResource'
    ]);

    module.constant('$events', {
        IMAGE_UPLOADED: 'ImageUploaded'
    });


    module.controller('TopNavController', ['$scope', '$events', '$location', topNavController]);
    module.controller('ProjectController', ['$scope', '$config', projectController]);
    //module.controller('ImageUploadModalController', ['$scope', '$modalInstance', 'modalConfig', '$http', '$config', imageUploadModelController]);

    module.directive('fileUpload', ['Api', fileUpload]);
    module.directive('fileuploader', [fileuploader]);
    //module.directive('imageCropper', imageCropper);
    module.directive('imageLoader', imageLoader);
    module.directive('imgCropped', imgCropped);
    module.directive('imageToText', ['$textService', imageToText]);

    module.provider('Api', apiProvider);

    module.service('$common', ['$rootScope', '$events', '$config', '$location', '$timeout', '$q', '$http', '$window', 'Api', commonService]);
    module.service('$textService', ['$http', '$config', textService]);

    function topNavController($scope, $events, $location) {
        /*$scope.logout = $user.logout;
		$scope.pageTitle = "Project Management";
		$scope.pageIcon = "";

		$scope.$on($events.VIEW_CHANGE, function (event, args) {
			$scope.pageTitle = args.name;
			$scope.pageIcon = args.icon;
		});

		$scope.shouldShowBack = function () {
			var loc = $location.path();
			return (loc.split('/').length > 2);
		};

		$scope.goBack = function () {
			var loc = $location.path();
			$location.path('/' + loc.split('/')[1]);
		};*/
    }

    function projectController($scope, $config) {
        /*$scope.user = $user;
		$scope.menuItems = Menu.menuItems;
		$scope.menuGroups = Menu.menuGroups;

		var ownerType = null;
		var ownerId = null;
		if ($user.UserType === 'Airline' || $user.UserType === 'AirlineAdmin') {
			ownerType = 'Airline';
			ownerId = $user.AirlineId;
		}
		if ($user.UserType === 'Handler' || $user.UserType === 'HandlerAdmin') {
			ownerType = 'Handler';
			ownerId = $user.HandlerId;
		}
		if ($user.UserType === 'Hotel') {
			ownerType = 'Hotel';
			ownerId = $user.HotelId;
		}
		$scope.imagePath = $config.API_ENDPOINT + '/image?imageType=Profile&ownerType=' + ownerType + '&ownerId=' + ownerId;

		if ($user.UserType === 'Management') {
			$scope.imagePath = '/includes/images/logo.png';
		}

		$scope.logout = function () {
			window.location = "/index.html";
			window.sessionStorage.clear();
		};*/


    }

    function imageUploadModelController($scope, $modalInstance, modalConfig, $http, $config) {
        $scope.file = {
            input: null,
            url: null,
            coords: null
        };

        $scope.allowRect = modalConfig.allowRect;

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
        $scope.confirm = confirm;

        $scope.$watch('file', function () {
            var file = $scope.file.input;
            if (file) {
                var fr = new FileReader();
                fr.onloadend = function () {
                    $scope.safeApply(function () { $scope.file.url = fr.result; });
                };
                fr.readAsDataURL(file);
            } else {
                $scope.file.url = null;
            }

        }, true);

        function confirm() {
            var coords = $scope.file.coords;
            return $http.post(
				$config.API_ENDPOINT
				+ '/image?ownerType=' + modalConfig.type
				+ '&ownerId=' + modalConfig.id
				+ '&cropx=' + coords.x
				+ '&cropy=' + coords.y
				+ '&cropx2=' + coords.x2
				+ '&cropy2=' + coords.y2
				+ '&height=' + coords.h
				+ '&width=' + coords.w, $scope.file.input, {
				    headers: { 'Content-Type': undefined },
				    transformRequest: function (data) {
				        var formData = new FormData();
				        if (data) {
				            formData.append(data.type, data);
				        }
				        return formData;
				    },
				}).success(function (location) {
				    $scope.$close(location);
				}).error(function () {

				});
        }
    }

    function fileUpload(Api) {
        return {
            scope: {
                fileUrl: "=",
                ownerId: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    if (file) {
                        if (scope.ownerId) {
                            var config = {
                                type: attributes.ownerType,
                                id: scope.ownerId,
                                image: file
                            };
                            Api.Image.update(config, function (data) {
                                scope.fileUrl = JSON.parse(data);
                                scope.$emit('ImageUploaded');
                            }, function (data) {
                                //alert(data);
                            });
                        } else {
                            Api.Image.save(file, function (data) {
                                scope.fileUrl = JSON.parse(data);
                                scope.$emit('ImageUploaded', scope.fileUrl);
                            }, function (data) {
                                //alert(data);
                            });
                        }
                    }
                });
            }
        };
    }

    function fileuploader() {
        return {
            scope: {
                file: "="
            },
            link: function (scope, element, attributes) {
                scope.safeApply = function (fn) {
                    var phase = scope.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof (fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };
                element.bind("change", function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    if (file) {
                        scope.safeApply(function () { scope.file = file; });
                    } else {
                        scope.safeApply(function () { scope.file = null; });
                    }
                });
            }
        };
    }

    function imageLoader() {
        return {
            restrict: 'A',
            scope: {
                source: '=',
                result: '=',
                allowRect: '='
            },
            link: function ($scope, $element, $attrs) {
                $scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof (fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };
                var jcrop = null;

                $scope.$watch('source', function (newval) {
                    //debugger;
                    if (jcrop) {
                        jcrop.destroy();
                        jcrop = null;
                    }
                    if (newval) {
                        $attrs.$set('src', newval);

                        var img = new Image();
                        img.onload = function () {
                            var height = img.height;
                            var width = img.width;
                            var jcropConfig = {
                                trueSize: [width, height],
                                boxWidth: 750,
                                boxHeight: 900,
                                onSelect: onSelect,
                            };
                            //if (!$scope.allowRect)
                            //    jcropConfig.aspectRatio = 1;
                            $($element).Jcrop(jcropConfig, function () {
                                jcrop = this;
                            });
                        };
                            img.src = newval;

                    } else {
                        $attrs.$set('src', null);
                    }
                });


                function onSelect(coords) {
                    for (var key in coords) {
                        coords[key] = Math.round(coords[key]);
                    }
                    //debugger;
                    console.log(coords);
                    $scope.result = coords;
                    $scope.safeApply();
                }
            }
        }
    }

    function imgCropped() {
        return {
            restrict: 'E',
            replace: true,
            scope: { src: '@', selected: '&' },
            link: function (scope, element, attr) {
                var myImg;
                var clear = function () {
                    if (myImg) {
                        myImg.next().remove();
                        myImg.remove();
                        myImg = undefined;
                    }
                };

                scope.$watch('src', function (nv) {
                    clear();
                    if (nv) {
                        element.after('<img />');
                        myImg = element.next();
                        myImg.attr('src', nv);
                        $(myImg).Jcrop({
                            trackDocument: true,
                            onSelect: function (x) {
                                scope.$apply(function () {
                                    scope.selected({ cords: x });
                                });
                            },
                            aspectRatio: 1
                        }, function () {
                            // Use the API to get the real image size 
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                        });
                    }
                });
                scope.$on('$destroy', clear);
            }
        };
    }

    function apiProvider() {
        var _endpoint = null;

        var apiProvider = {
            setEndpoint: setEndpoint,
            $get: ['$config', '$resource', '$http', getApiService]
        };

        return apiProvider;

        function setEndpoint(endpoint) {
            _endpoint = endpoint;
        }

        function getApiService($config, $resource, $http) {
            _endpoint = _endpoint || $config.API_ENDPOINT;

            var _standardUpdateProcedure = {
                method: 'PUT',
                params: {
                    id: '@Id'
                }
            };

            var airline = $resource(_endpoint + '/airline/:id', {}, {
                update: _standardUpdateProcedure
            });

            var airport = $resource(_endpoint + '/airport/:id', {}, {
                update: _standardUpdateProcedure
            });

            var availability = $resource(_endpoint + '/availability/:id', {}, {
                update: _standardUpdateProcedure,
                current: {
                    method: 'GET',
                    url: _endpoint + '/availability/current',
                    isArray: true,
                },
                all: {
                    method: 'GET',
                    url: _endpoint + '/availability/all',
                    isArray: true,
                }
            });

            var booking = $resource(_endpoint + '/booking/:id', {}, {
                update: _standardUpdateProcedure,
                markAsCheckedIn: {
                    method: 'PUT',
                    url: _endpoint + '/booking/markAsCheckedIn',
                    isArray: false
                },
                markAsNotCheckedIn: {
                    method: 'PUT',
                    url: _endpoint + '/booking/markAsNotCheckedIn',
                    isArray: false
                }
            });

            var bookingDetail = $resource(_endpoint + '/bookingDetail/:id', {}, {
                update: _standardUpdateProcedure
            });

            var company = $resource(_endpoint + '/company/:id', {}, {
                update: _standardUpdateProcedure
            });

            var contractedRate = $resource(_endpoint + '/contractedRate/:id', {}, {
                update: _standardUpdateProcedure
            });

            var employee = $resource(_endpoint + '/employee/:id', {}, {
                update: _standardUpdateProcedure
            });

            var handler = $resource(_endpoint + '/handler/:id', {}, {
                update: _standardUpdateProcedure
            });

            var hotel = $resource(_endpoint + '/hotel/:id', {}, {
                update: _standardUpdateProcedure
            });

            var reservation = $resource(_endpoint + '/reservation/:id', {}, {
                update: _standardUpdateProcedure
            });

            var roomAvailability = $resource(_endpoint + '/roomAvailability/:id', {}, {
                update: _standardUpdateProcedure
            });

            var roomType = $resource(_endpoint + '/roomType/:id', {}, {
                update: _standardUpdateProcedure
            });

            var service = $resource(_endpoint + '/service/:id', {}, {
                update: _standardUpdateProcedure
            });

            var terminal = $resource(_endpoint + '/terminal/:id', {}, {
                update: _standardUpdateProcedure
            });

            var transportDirection = $resource(_endpoint + '/transportInstruction/:id', {}, {
                update: _standardUpdateProcedure
            });

            var image = {
                update: function (config, success, failure) {
                    $http.post(_endpoint + '/image?ownerType=' + config.type + '&ownerId=' + config.id, config.image, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: function (data) {
                            var formData = new FormData();
                            if (data) {
                                formData.append(data.type, data);
                            }
                            return formData;
                        },
                    }).success(success).error(failure);
                },
                save: function (image, success, failure) {
                    $http.post(_endpoint + '/image', image, {
                        headers: { 'Content-Type': undefined },
                        transformRequest: function (data) {
                            var formData = new FormData();
                            if (data) {
                                formData.append(data.type, data);
                            }
                            return formData;
                        },
                    }).success(success).error(failure);
                }
            }

            var configuration = $resource(_endpoint + '/config', {}, {
                update: _standardUpdateProcedure,
                unregister: {
                    url: _endpoint + '/config/unregister',
                    method: 'POST'
                },
                register: {
                    url: _endpoint + '/config/register',
                    method: 'POST'
                }
            });

            var apiService = {
                Airline: airline,
                Airport: airport,
                Availability: availability,
                Booking: booking,
                BookingDetail: bookingDetail,
                Company: company,
                ContractedRate: contractedRate,
                Employee: employee,
                Handler: handler,
                Hotel: hotel,
                Reservation: reservation,
                RoomAvailability: roomAvailability,
                RoomType: roomType,
                Service: service,
                Terminal: terminal,
                TransportInstruction: transportDirection,
                TransportDirection: transportDirection,
                Image: image,
                Configuration: configuration
            };

            return apiService;
        }
    }

    function commonService($rootScope, $events, $config, $location, $timeout, $q, $http, $window, Api) {
        return {
            $rootScope: $rootScope,
            $events: $events,
            $config: $config,
            $location: $location,
            $timeout: $timeout,
            $q: $q,
            $http: $http,
            $window: $window,
            Api: Api
        };
    }

    function textService($http, $config) {
        var apiurl = "";

        var textFactory = {};

        textFactory.convertImageToText = function (project, pageNumber, coords) {
            //debugger;
            return $http.post(
				$config.API_ENDPOINT
				+ 'project/imagetotext?project=' + project
				+ '&pageNumber=' + pageNumber
				+ '&x1=' + coords.x
				+ '&y1=' + coords.y
				+ '&x2=' + coords.x2
				+ '&y2=' + coords.y2, {
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
    			    return JSON.parse(data);
				}).error(function () {
			});
        };

        return textFactory;
    }

    function imageToText(textService) {
        var editorTemplate =
        //    '<div>' +
        //    '<div ng-hide="view.editorEnabled" ng-click="enableEditor()">' +
        //        '{{value}} ' +
        //    '</div>' +
        //    '<div ng-show="view.editorEnabled">' +
        //        '<input id="taskEditor" type="text" ng-model="view.editableValue">' +
        //        '<a ng-click="save()"><span class="glyphicon glyphicon-ok"></a>' +
        //        '<a ng-click="disableEditor()"><span class="glyphicon glyphicon-remove"></a>' +
        //    '</div>' +
        //'</div>';        
        '<div>' +
            '<input type="text" ng-model="view.scannedText" />' +
            '<button ng-click="scanText()">scan</button>' +
        '</div>'
        return {
            restrict: "A",
            replace: true,
            template: editorTemplate,
            scope: {
                value: "=clickToEdit"
            },
            link: function (scope, elem, attrs) {
                //debugger;
                attrs.$observe('coordinates', function (value) {
                    scope.setCoordinates(value);
                });
                attrs.$observe('pageNumber', function (value) {
                    scope.setPageNumber(value);
                });
                attrs.$observe('project', function (value) {
                    scope.setProject(value);
                });
            },
            controller: function ($scope, $timeout) {
                $scope.view = {
                    editorEnabled: false,
                    coordinates: null,
                    pageNumber: 1,
                    project: null,
                    scannedText: null
                };

                $scope.setCoordinates = function (coords) {
                    //debugger;
                    if (coords != undefined && coords != "") {
                        $scope.view.coordinates = JSON.parse(coords);
                    }
                };
                $scope.setPageNumber = function (pageNumber) {
                    //debugger;
                    if (pageNumber == undefined) {
                        $scope.view.pageNumber = 1;
                    } else {
                        $scope.view.pageNumber = pageNumber;
                    }                    
                };
                $scope.setProject = function (project) {
                    //debugger;
                    // temporarily set this to empty
                    $scope.view.project = "";//project;
                };

                $scope.scanText = function () {
                    //debugger;
                    textService.convertImageToText($scope.view.project, $scope.view.pageNumber, $scope.view.coordinates)
                    .then(function (text) {
                        //debugger;
                        $scope.view.scannedText = text.data;
                    }, function(){
                        $scope.view.scannedText = "**** Error reading data  ***";
                    });
                    //$scope.closeEditor();
                };

                //$scope.save = function () {
                //    $scope.value = $scope.view.editableValue;
                //    $scope.closeEditor();
                //    $timeout(function () {
                //        $scope.saveCallback();
                //    });
                //};
            }
        }
    }

})();