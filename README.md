# BigDataCloud Free Reverse Geocoding JavaScript Client

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, zero-dependency JavaScript client for [BigDataCloud's free reverse geocoding API](https://www.bigdatacloud.com). Resolves the current device's GPS position to city, country and locality information — right in the browser, with no API key required.

**How it works:**
1. Requests the user's GPS position via the browser Geolocation API (fine location preferred)
2. If GPS is available and permitted, reverse geocodes the live coordinates
3. If GPS is denied or unavailable, automatically falls back to IP-based geolocation

No sign-up, no API key, no server required.

---

## Quick Start (ES Module)

```js
import BDCReverseGeocode from './bigdatacloud_reverse_geocode.mjs';

const geo = new BDCReverseGeocode();

// GPS first, IP fallback automatic
const location = await geo.detect();
console.log(location.city, location.countryName);
```

## Quick Start (Script Tag)

```html
<script src="bigdatacloud_reverse_geocode.js"></script>
<script>
  var geo = new BDCReverseGeocode();

  geo.getClientLocation(function(location) {
    if (!location) {
      console.error('Could not determine location');
      return;
    }
    console.log(location.city, location.countryName);
  });
</script>
```

---

## API Reference

### Constructor

```js
new BDCReverseGeocode(localityLanguage?, endpoint?, server?)
```

| Parameter | Default | Description |
|---|---|---|
| `localityLanguage` | `'en'` | Language for locality names (BCP 47) |
| `endpoint` | `'reverse-geocode-client'` | API endpoint |
| `server` | `'api.bigdatacloud.net'` | API server hostname |

### `detect()` → `Promise<LocationData>`

Auto-detects location. Requests GPS first; automatically falls back to IP geolocation if GPS is denied or unavailable.

```js
const location = await geo.detect();
console.log(location.city, location.countryName);
```

### `getClientLocation(callback)` *(legacy)*

Callback-based. Tries GPS then falls back to IP.

```js
geo.getClientLocation(function(location) {
  console.log(location?.city);
});
```

### `getClientCoordinates(callback)` *(legacy)*

Returns the raw GPS position via callback.

```js
geo.getClientCoordinates(function(position) {
  if (!position) return; // GPS denied — IP fallback will be used
  console.log(position.coords.latitude, position.coords.longitude);
});
```

---

### LocationData fields

| Field | Type | Description |
|---|---|---|
| `city` | string | City/town name |
| `localityName` | string | Locality/suburb name |
| `countryName` | string | Country name |
| `countryCode` | string | ISO 3166-1 alpha-2 |
| `principalSubdivision` | string | State/province |
| `postcode` | string | Postal code |
| `latitude` | number | Resolved latitude |
| `longitude` | number | Resolved longitude |

---

## Framework Alternatives

| Framework | Package |
|---|---|
| **React** | [`@bigdatacloudapi/react-reverse-geocode-client`](https://www.npmjs.com/package/@bigdatacloudapi/react-reverse-geocode-client) |
| **Vue / Nuxt** | [`@bigdatacloudapi/vue-reverse-geocode-client`](https://www.npmjs.com/package/@bigdatacloudapi/vue-reverse-geocode-client) |
| **Flutter / Dart** | [`bigdatacloud_reverse_geocode_client`](https://pub.dev/packages/bigdatacloud_reverse_geocode_client) |
| **Swift (iOS/macOS)** | [`bigdatacloud-swift-client`](https://github.com/bigdatacloudapi/bigdatacloud-swift-client) |
| **Kotlin (Android)** | [`bigdatacloud-kotlin-client`](https://github.com/bigdatacloudapi/bigdatacloud-kotlin-client) |

---

## Fair Use Policy

This library uses BigDataCloud's free client-side reverse geocoding API (`api.bigdatacloud.net`), governed by the [Fair Use Policy](https://www.bigdatacloud.com/docs/article/fair-use-policy-for-free-client-side-reverse-geocoding-api).

**This API is for resolving the current, real-time location of the calling device only.**

Key rules:
- **Client-side only** — requests must originate directly from the device being located, not from a server or automated script
- **Real-time coordinates only** — only live GPS/WiFi coordinates obtained at the moment of the call are permitted. Pre-stored, cached, or externally-sourced coordinates are strictly **not allowed**
- **User consent required** — coordinates must be obtained via the browser Geolocation API with the user's explicit permission

Violations result in a **402 error and your IP address being banned**.

If you need to geocode coordinates you already have, or need server-side geocoding, use the [Reverse Geocoding API](https://www.bigdatacloud.com/docs/reverse-geocoding) with a free API key instead — it includes 50,000 free queries per month.

---

© 2026 BigDataCloud Pty Ltd — MIT License
