/**
 * BigDataCloud Free Reverse Geocoding JavaScript Client (Modern ES Module)
 * https://www.bigdatacloud.com
 *
 * GPS-first with automatic IP-based fallback. No API key required.
 * For legacy script tag usage, see bigdatacloud_reverse_geocode.js
 */

export default class BDCReverseGeocode {
  constructor(
    localityLanguage = 'en',
    endpoint = 'reverse-geocode-client',
    server = 'api.bigdatacloud.net'
  ) {
    this.localityLanguage = localityLanguage;
    this.endpoint = endpoint;
    this.server = server;
  }

  /**
   * Build the API URL with query parameters.
   * @param {Object} params - Optional lat/lng and other params
   * @returns {string}
   */
  _buildUrl(params = {}) {
    const query = new URLSearchParams({
      localityLanguage: this.localityLanguage,
      ...params,
    });
    return `https://${this.server}/data/${this.endpoint}?${query.toString()}`;
  }

  /**
   * Call the BigDataCloud API.
   * @param {Object} params - Query params (optional lat/lng)
   * @returns {Promise<Object>} Parsed JSON response
   */
  async _callApi(params = {}) {
    const url = this._buildUrl(params);
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }
    return response.json();
  }

  /**
   * Get GPS coordinates from the browser.
   * @returns {Promise<GeolocationCoordinates>}
   */
  _getGpsCoordinates() {
    return new Promise((resolve, reject) => {
      if (!navigator?.geolocation?.getCurrentPosition) {
        return reject(new Error('Geolocation not available'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  /**
   * Normalise various lat/lng shapes into { latitude, longitude }.
   * @param {Object} latLng
   * @returns {{ latitude: number, longitude: number } | {}}
   */
  _processLatLng(latLng) {
    if (!latLng || latLng === -1) return {};
    const src = latLng.coords ?? latLng;
    const lat = src.latitude ?? src.lat;
    const lng = src.longitude ?? src.long ?? src.lng;
    const result = {};
    if (lat != null) result.latitude = parseFloat(parseFloat(lat).toFixed(5));
    if (lng != null) result.longitude = parseFloat(parseFloat(lng).toFixed(5));
    return result;
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Reverse geocode given coordinates.
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<Object>} Location data
   */
  async reverseGeocode(latitude, longitude) {
    return this._callApi({
      latitude: parseFloat(parseFloat(latitude).toFixed(5)),
      longitude: parseFloat(parseFloat(longitude).toFixed(5)),
    });
  }

  /**
   * IP-based geolocation (no coordinates needed).
   * @returns {Promise<Object>} Location data
   */
  async ipGeolocate() {
    return this._callApi();
  }

  /**
   * Auto-detect location: tries GPS first, falls back to IP if denied/unavailable.
   * @returns {Promise<Object>} Location data
   */
  async detect() {
    try {
      const coords = await this._getGpsCoordinates();
      return this._callApi({
        latitude: parseFloat(parseFloat(coords.latitude).toFixed(5)),
        longitude: parseFloat(parseFloat(coords.longitude).toFixed(5)),
      });
    } catch {
      // GPS denied or unavailable — fall back to IP geolocation
      return this._callApi();
    }
  }

  /**
   * Callback-based reverse geocode (legacy-compatible).
   * If latLng is omitted or a function, tries GPS first then IP fallback.
   * @param {Object|Function|null} latLng - Coordinates object, or callback if skipping
   * @param {Function} [cb] - Callback receiving (result | false)
   */
  getClientLocation(latLng, cb) {
    if (typeof latLng === 'function' && !cb) {
      cb = latLng;
      latLng = null;
    }
    if (!cb) return false;

    if (!latLng && latLng !== -1) {
      // Try GPS first
      this._getGpsCoordinates()
        .then((coords) => {
          const params = this._processLatLng(coords);
          return this._callApi(params);
        })
        .catch(() => {
          // GPS failed — fall back to IP
          return this._callApi();
        })
        .then((result) => cb(result))
        .catch((err) => { console.error(err); cb(false); });
    } else {
      const params = this._processLatLng(latLng);
      this._callApi(params)
        .then((result) => cb(result))
        .catch((err) => { console.error(err); cb(false); });
    }
  }

  /**
   * Callback-based GPS coordinate retrieval (legacy-compatible).
   * @param {Function} cb - Callback receiving (GeolocationPosition | false)
   */
  getClientCoordinates(cb) {
    if (!cb) return false;
    this._getGpsCoordinates()
      .then((coords) => cb({ coords }))
      .catch((err) => { console.error(err); cb(false); });
  }
}
