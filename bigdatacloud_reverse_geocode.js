;(function(_w,$) {
	var BDCReverseGeocode=function(localityLanguage,endpoint,server) {
		this.endpoint=endpoint ? endpoint : 'reverse-geocode-client';
		this.server=server ? server : 'api.bigdatacloud.net';
		this.localityLanguage=localityLanguage ? localityLanguage : 'en';
	};
	BDCReverseGeocode.prototype={
		setApi:function(api) {
			this.api=api;
			return this;
		},
		getApi:function() {
			return this.api;
		},
		getClientCoordinates:function(cb) {
			if (!cb) return false;
			if (!navigator.geolocation || !navigator.geolocation.getCurrentPosition) return cb(false);
			return navigator.geolocation.getCurrentPosition(
				(function(position) { return this.cb(position);}).bind({cb:cb}),
				(function(err) { console.error(err); return this.cb(false);}).bind({cb:cb}),
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				}
				);
		},
		getClientLocation:function(latLng,cb) {
			var _this=this;

			if (typeof latLng=='function' && !cb) {
				cb=latLng;
				latLng=null;
			} else if (latLng=='function') {
				latLng=latLng();
			}
			if (!cb) return false;
			if (!latLng) {
				return this.getClientCoordinates(function(position) {
					if (!position) {
						return cb(false);
					}
					_this.getClientLocation(position,cb);
				})
			} else {
				this.callApi(this.processLatLng(latLng),function(result) {
					cb(result);
				},function(err) {
					console.error(err);
					cb(false);
				});
			}
		},
		processLatLng:function(latLng) {
			if (latLng.coords) {
				latLng=latLng.coords;
			}
			if (!typeof latLng.latitude) {
				if (latLng.lat) {
					latLng.latitude=latLng.lat;
				}
			}
			if (!typeof latLng.longitude) {
				if (latLng.long) {
					latLng.longitude=latLng.long;
				}
				if (latLng.lng) {
					latLng.longitude=latLng.lng;
				}
			}
			if (typeof latLng.latitude!= 'undefined') {
				latLng.latitude=parseFloat(parseFloat(latLng.latitude).toFixed(5));
			}
			if (typeof latLng.longitude!= 'undefined') {
				latLng.longitude=parseFloat(parseFloat(latLng.longitude).toFixed(5));
			}
			return latLng;
		},
		callApi:function(payload,cb) {
			var xhr = new XMLHttpRequest()
			xhr.open(
				'GET',
				'https://'+this.server+'/data/'+this.endpoint+'?'+this.prepareData(payload),
				true
				);
			xhr.onreadystatechange = function() {
				if (this.readyState === XMLHttpRequest.DONE) {
					if (this.status === 200) {
						try {
							cb(JSON.parse(this.responseText))
						} catch (e) {
							cb(false)
						}
					} else {
						try {
							var result=JSON.parse(this.responseText);
							console.error(result,this.status);
							cb(false);
						} catch (e) {
							console.error(this.responseText,this.status);
							cb(false);
						}
					}
				}
			}
			xhr.send();
		},
		prepareData:function(payload) {
			var data=[];
			var hasLocalityLanguage=false;
			if (payload) {
				for (var i in payload) {
					switch(i) {
						case 'localityLanguage':
						hasLocalityLanguage=true;
						break;
					}
					data.push(encodeURIComponent(i)+'='+encodeURIComponent(payload[i]));
				}
			}
			if (!hasLocalityLanguage) data.push('localityLanguage='+this.localityLanguage);
			data=data.join('&');
			return data;
		}
	}

	_w.BDCReverseGeocode=BDCReverseGeocode;

})(window,typeof jQuery=='undefined' ? null : jQuery);