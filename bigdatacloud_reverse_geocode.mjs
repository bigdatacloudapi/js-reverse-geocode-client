/**
 * BigDataCloud Free Reverse Geocoding JavaScript Client (Modern ES Module)
 * https://www.bigdatacloud.com
 *
 * Fair Use Policy: https://www.bigdatacloud.com/docs/article/fair-use-policy-for-free-client-side-reverse-geocoding-api
 *
 * This API is for resolving the current, real-time location of the calling device only.
 * Pre-stored, cached, or externally-sourced coordinates are NOT permitted.
 * Violations result in a 402 error and IP ban.
 *
 * GPS-first with automatic IP-based fallback when GPS is denied. No API key required.
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
   * @param {Object} params - Optional lat/lng params (from live device GPS only)
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
   * @param {Object} params - Query params (live GPS coords or empty for IP fallback)
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
   * Get GPS coordinates from the browser (fine accuracy preferred).
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

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Auto-detect location: tries GPS first, falls back to IP if denied/unavailable.
   * This is the primary method — always use this for automatic location detection.
   * @returns {Promise<Object>} Location data
   */
  async detect() {
    try {
      const coords = await this._getGpsCoordinates();
      return this._callApi({
        latitude: parseFloat(coords.latitude.toFixed(5)),
        longitude: parseFloat(coords.longitude.toFixed(5)),
      });
    } catch {
      // GPS denied or unavailable — fall back to IP geolocation
      return this._callApi();
    }
  }

  /**
   * Callback-based location detection (legacy-compatible).
   * Tries GPS first, automatically falls back to IP if GPS is denied/unavailable.
   * @param {Function} cb - Callback receiving (result | false)
   */
  getClientLocation(cb) {
    if (typeof cb !== 'function') return false;

    this._getGpsCoordinates()
      .then((coords) => this._callApi({
        latitude: parseFloat(coords.latitude.toFixed(5)),
        longitude: parseFloat(coords.longitude.toFixed(5)),
      }))
      .catch(() => this._callApi())  // GPS denied — IP fallback
      .then((result) => cb(result))
      .catch((err) => { console.error(err); cb(false); });
  }

  /**
   * Callback-based GPS coordinate retrieval (legacy-compatible).
   * Returns null if GPS is denied — use detect() for automatic IP fallback.
   * @param {Function} cb - Callback receiving (GeolocationPosition | false)
   */
  getClientCoordinates(cb) {
    if (!cb) return false;
    this._getGpsCoordinates()
      .then((coords) => cb({ coords }))
      .catch((err) => { console.error(err); cb(false); });
  }
}
