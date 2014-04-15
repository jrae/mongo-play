function CrisisCtrl($scope, $http, $timeout) {
    $scope.example = "hello";
    $scope.assets = [];
    $scope.test="hi";
    var m, map, marker;

    $scope.callWS = function(e) {
        testobj = {
            aNumber : 2
        }

        $http.post('/square', testobj).success(function(data) {
            $scope.result = data.result;
        })
    }

    

    $scope.select_asset = function(asset) {
       $scope.selected = asset;
       $("#popup").show();
    }

    $scope.save_changes = function(e) {
       
    }

    $scope.abandon_changes = function(e) {
        $("#popup").hide();
    }

		$scope.getAssets = function(e) {
			$http.get('/asset').success(function(data) {
				$scope.assets = data.results;
				$scope.selected = data.results[0];
			  for (_i = 0, _len = $scope.assets.length; _i < _len; _i++) {
					asset = $scope.assets[_i];
					console.info(asset);
					if (asset.geometry != null){
						map.render_enquiry(asset);
					}
			  }
			})
		}

		$scope.update = function(data)
		{
			$http.post('/update_asset', data).success(function() {
				console.log('updated asset');
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
				    },
					colorDictionary = {
				        vehicle: 'blue',
				        person: 'red'
			        },
					faIcon;
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
				var marker = L.marker(
						[ asset.geometry.coordinates[1],
								asset.geometry.coordinates[0] ], {
							icon : _this.categoryIcon(asset.type, 'red'),
							draggable : true,
							clickable : true
						});
				marker.on(
						'dragend',
						function(ev) {
							var longLat = ev.target.getLatLng();
						              asset.geometry.coordinates[0] = longLat.lng;
						              asset.geometry.coordinates[1] = longLat.lat;
						              $scope.update(asset);
						});
				// marker.bindToLabel('test label');
				marker.addTo(m);
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
