/**
 * BigDataCloud Free Reverse Geocoding JavaScript Client (Legacy / Script Tag)
 * For modern ES modules, use bigdatacloud_reverse_geocode.mjs
 *
 * Fair Use Policy: https://www.bigdatacloud.com/docs/article/fair-use-policy-for-free-client-side-reverse-geocoding-api
 *
 * This API is for resolving the current, real-time location of the calling device only.
 * Pre-stored, cached, or externally-sourced coordinates are NOT permitted.
 * Violations result in a 402 error and IP ban.
 */
;(function(_w) {
  var BDCReverseGeocode = function(localityLanguage, endpoint, server) {
    this.endpoint = endpoint || 'reverse-geocode-client';
    this.server = server || 'api.bigdatacloud.net';
    this.localityLanguage = localityLanguage || 'en';
  };

  BDCReverseGeocode.prototype = {

    /**
     * Get live GPS coordinates from the browser (fine accuracy preferred).
     * @param {Function} cb - Callback receiving (GeolocationPosition | false)
     */
    getClientCoordinates: function(cb) {
      if (!cb) return false;
      if (!navigator.geolocation || !navigator.geolocation.getCurrentPosition) return cb(false);
      return navigator.geolocation.getCurrentPosition(
        function(position) { cb(position); },
        function(err) { console.error(err); cb(false); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    },

    /**
     * Detect location: tries GPS first, falls back to IP if GPS is denied/unavailable.
     * @param {Function} cb - Callback receiving (result | false)
     */
    getClientLocation: function(cb) {
      var _this = this;
      if (typeof cb !== 'function') return false;

      this.getClientCoordinates(function(position) {
        var params = {};
        if (position && position.coords) {
          params.latitude  = parseFloat(parseFloat(position.coords.latitude).toFixed(5));
          params.longitude = parseFloat(parseFloat(position.coords.longitude).toFixed(5));
        }
        // If no GPS — params is empty and the API uses IP for location
        _this.callApi(params, function(result) { cb(result); });
      });
    },

    callApi: function(payload, cb) {
      var xhr = new XMLHttpRequest();
      var data = ['localityLanguage=' + encodeURIComponent(this.localityLanguage)];
      if (payload) {
        for (var key in payload) {
          if (key !== 'localityLanguage') {
            data.push(encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]));
          }
        }
      }
      xhr.open('GET', 'https://' + this.server + '/data/' + this.endpoint + '?' + data.join('&'), true);
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            try { cb(JSON.parse(this.responseText)); } catch(e) { cb(false); }
          } else {
            console.error(this.responseText, this.status);
            cb(false);
          }
        }
      };
      xhr.send();
    }
  };

  _w.BDCReverseGeocode = BDCReverseGeocode;

})(window);
