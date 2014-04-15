$(function() {

  var m, map, marker;

  if ($("#map-container").length > 0) {

    m = L.map('map-container', {
      detectRetina: true
    });
    marker = null;
    map = {
      init: function() {
        var _this;
        _this = this;
        _this.buildMap();
        return _this.bindEvents();
      },
      buildMap: function() {
        var _this;
        _this = this;
        console.log('build map');
        m.locate({
          setView: true,
          maxZoom: 16
        });
        return L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '#highwayhack'
        }).addTo(m);
      },
      bindEvents: function() {
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
          return m.setView(['50.8357439925239', '-0.787275619804859'], 13);
        });
        return $('.locate-button').on('click', function() {
          return m.locate({
            setView: true,
            maxZoom: 16
          });
        });
      },
      dropPin: function(loc) {
        var _this;
        _this = this;
        console.log("dropping pin at pos:", loc);
        if (marker === null) {
          marker = new L.marker(loc, {
            draggable: true,
            bounceOnAdd: true,
            clickable: true
          });
          marker.on('dragend', function(ev) {
            return console.log("coords", ev.target.getLatLng());
          });
          marker.addTo(m);
          _this.updateCoords(loc);
        } else {
          marker.setLatLng(loc);
          _this.updateCoords(loc);
        }
        return $('.create-button').removeClass('is-disabled').text('Start report');
      },
      updateCoords: function(coords) {
        var url, _this;
        _this = this;
        $('#enquiries').html("");
        $('#hidden_lat').text(coords.lat);
        $('#hidden_long').text(coords.lng);
        _this.request_local_enquiries();
        // url = "/enquiries/new" + _this.get_long_lat_params();
        // return $('.create-button').magnificPopup({
        //   type: 'ajax',
        //   ajax: {
        //     settings: {
        //       url: url
        //     }
        //   }
        // });
      },
      get_long_lat_params: function() {
        var latitude, longitude;
        latitude = $('#hidden_lat').text();
        longitude = $('#hidden_long').text();
        return "?lat=" + latitude + "&long=" + longitude;
      },
      categoryIcon: function(category) {
        var icon, iconName = null, markerColor = null;
        switch (category) {
          case "book":
            iconName = "book";
			markerColor = 'red';
            break;
          case "Floods":
            iconUrl = "flooding";
            break;
          case "Ice And Snow":
            iconUrl = "ice";
            break;
          case "Obstruction":
            iconUrl = "obstruction";
            break;
          case "Damaged Highway":
            iconUrl = "highway";
            break;
          case "Potholes":
            iconUrl = "pothole";
            break;
          default:
            iconUrl = "default";
        }
        icon = L.AwesomeMarkers.icon({
		  icon: iconName,
		  markerColor: markerColor,
		  prefix: 'fa'
        });
        return icon;
      },
      request_local_enquiries: function() {
        var url, _this;
        _this = this;
        // url = "/search_enquiries" + _this.get_long_lat_params();
        // return $.get(url, function(data) {
        //   console.log(data);
        //   _this.render_data(data);
        //   return _this.re_bindEvents();
        // });
      },
      render_data: function(data) {
        var enquiry, _i, _len, _results, _this;
        _this = this;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          enquiry = data[_i];
          _results.push(_this.render_enquiry(enquiry));
        }
        return _results;
      },
      render_enquiry: function(enquiry) {
        var _this;
        _this = this;
        console.log(_this.categoryIcon(enquiry.category.name));
        L.marker([enquiry.latitude, enquiry.longitude], {
          icon: _this.categoryIcon(enquiry.category.name),
          draggable: true,
          clickable: true
        }).on('dragend', function(ev) {
          return console.log("coords", ev.target.getLatLng());
        }).addTo(m);
        return $('#enquiries').html($('#enquiries').html() + "<div class=\"result\" id='" + enquiry.id + "'> <div class=\"result__icon cat-" + enquiry.category.id + "\"></div> <div class=\"result__details\"> <h3 class=\"result__type\">" + enquiry.category.name + "</h3> <p class=\"result__description\">" + enquiry.description + "</p> </div> </div>");
      },
      re_bindEvents: function() {
        return $('.result').each(function() {
          console.log($(this));
          return $(this).magnificPopup({
            type: 'ajax',
            ajax: {
              settings: {
                url: "/enquiries/" + $(this).attr('id'),
                type: 'GET'
              }
            }
          });
        });
      }
    };

	L.marker([51.5244,-0.08467], {icon: map.categoryIcon('book')}).addTo(m);

    return map.init();
  }
});
