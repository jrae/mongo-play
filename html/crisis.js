function CrisisCtrl($scope, $http, $timeout) {
	$scope.example = "hello";
	$scope.assets = [];
	var m, map, marker;

	$scope.callWS = function(e) {
		testobj = {
			aNumber : 2
		}

		$http.post('/square', testobj).success(function(data) {
			$scope.result = data.result;
		})
	}

	$scope.getAssets = function(e) {
		$http.get('/asset').success(function(data) {
			$scope.assets = data.results;
			for (_i = 0, _len = $scope.assets.length; _i < _len; _i++) {
				asset = $scope.assets[_i];
				map.render_enquiry(asset);
			}
		})
	}

	if ($("#map-container").length > 0) {

		m = L.map('map-container', {
			detectRetina : true
		});
		marker = null;
		map = {
			init : function() {
				var _this;
				_this = this;
				_this.buildMap();
				return _this.bindEvents();
			},
			buildMap : function() {
				var _this;
				_this = this;
				console.log('build map');
				m.locate({
					setView : true,
					maxZoom : 16
				});
				return L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution : '#mongoplay'
				}).addTo(m);
			},
			bindEvents : function() {
				var _this;
				_this = this;
				console.log('bind events');
				m.on('click', function(e) {
					return _this.dropPin(e.latlng);
				});
				m.on('load', function(e) {
					return _this.updateCoords(m.getCenter());
				});
				m.on('locationfound', function() {
					return console.log("loction found");
				});
				m.on('locationerror', function() {
					console.log("location not found :(");
					return m.setView(
							[ '50.8357439925239', '-0.787275619804859' ], 13);
				});
				return $('.locate-button').on('click', function() {
					return m.locate({
						setView : true,
						maxZoom : 16
					});
				});
			},
			dropPin : function(loc) {
				var _this;
				_this = this;
				console.log("dropping pin at pos:", loc);
				if (marker === null) {
					marker = new L.marker(loc, {
						draggable : true,
						bounceOnAdd : true,
						clickable : true
					});
					marker.on('dragend', function(ev) {
						return console.log("coords", ev.target.getLatLng());
					});
					marker.on('click', function(ev) {
						return console.log("coords", ev.target.getLatLng());
					});

					marker.addTo(m);
					_this.updateCoords(loc);
				} else {
					marker.setLatLng(loc);
					_this.updateCoords(loc);
				}
				return $('.create-button').removeClass('is-disabled').text(
						'Start report');
			},
			updateCoords : function(coords) {
				var url, _this;
				_this = this;
				$('#enquiries').html("");
				$('#hidden_lat').text(coords.lat);
				$('#hidden_long').text(coords.lng);
				_this.request_local_enquiries();
				url = "asset";
				// return $('.create-button').magnificPopup({
				// type: 'ajax',
				// ajax: {
				// settings: {
				// url: url
				// }
				// }
				// });
			},

			get_long_lat_params : function() {
				var latitude, longitude;
				latitude = $('#hidden_lat').text();
				longitude = $('#hidden_long').text();
				return "?lat=" + latitude + "&long=" + longitude;
			},

			categoryIcon : function(iconName, iconColor) {
				var iconDictionary = {
					vehicle : 'truck',
					person : 'male'
				}, faIcon;
				faIcon = iconDictionary[iconName] || faIcon;
				return L.AwesomeMarkers.icon({
					icon : faIcon,
					markerColor : iconColor,
					prefix : 'fa'
				});
			},

			request_local_enquiries : function() {
				var url, _this;
				_this = this;

				$scope.getAssets();
			},
			render_enquiry : function(asset) {
				var _this;
				_this = this;
				L.marker(
						[ asset.geometry.coordinates[1],
								asset.geometry.coordinates[0] ], {
							icon : _this.categoryIcon(asset.type, 'red'),
							draggable : true,
							clickable : true
						}).on(
						'dragend',
						function(ev) {
							return console.log("coords", ev.target.getLatLng(),
									asset._id);
						}).addTo(m);
			},
			re_bindEvents : function() {
				return $('.result').each(function() {
					console.log($(this));
					return $(this).magnificPopup({
						type : 'ajax',
						ajax : {
							settings : {
								url : "/enquiries/" + $(this).attr('id'),
								type : 'GET'
							}
						}
					});
				});
			}
		};

		map.init();
	}
}
