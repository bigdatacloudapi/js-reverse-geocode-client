# BigDataCloud Free Reverse Geocoding JavaScript Client

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Description

A lightweight, zero-dependency JavaScript client for [BigDataCloud's free reverse geocoding API](https://www.bigdatacloud.com). Convert GPS coordinates to city, country and locality information — right in the browser, with no API key required.

**How it works:**
1. Requests the user's GPS position via the browser Geolocation API
2. If GPS is available and permitted, reverse geocodes the coordinates
3. If GPS is denied or unavailable, automatically falls back to IP-based geolocation

No sign-up, no API key, no server required for basic use.

---

## Quick Start (Modern — ES Module)

```js
import BDCReverseGeocode from './bigdatacloud_reverse_geocode.mjs';

const geo = new BDCReverseGeocode();

// Promise-based: GPS first, IP fallback automatic
const location = await geo.detect();
console.log(location.city, location.countryName);
```

### With async/await error handling

```js
import BDCReverseGeocode from './bigdatacloud_reverse_geocode.mjs';

const geo = new BDCReverseGeocode();

try {
  const location = await geo.detect();
  console.log(`You are in ${location.city}, ${location.countryName}`);
} catch (err) {
  console.error('Could not determine location', err);
}
```

### Reverse geocode known coordinates

```js
const location = await geo.reverseGeocode(-33.8688, 151.2093);
console.log(location.city); // "Sydney"
```

## Quick Start (Script Tag — Legacy)

For pages that don't use ES modules, include the legacy script:

```html
<script src="bigdatacloud_reverse_geocode.js"></script>
<script>
  var geo = new BDCReverseGeocode();

  // GPS first, IP fallback
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

---

### Modern API (`.mjs`)

#### `detect()` → `Promise<LocationData>`

Auto-detects location. Tries GPS first; falls back to IP geolocation if GPS is denied or unavailable.

```js
const location = await geo.detect();
```

#### `reverseGeocode(latitude, longitude)` → `Promise<LocationData>`

Reverse geocodes the given coordinates directly.

```js
const location = await geo.reverseGeocode(-33.8688, 151.2093);
```

#### Internal IP fallback (automatic when GPS denied) → `Promise<LocationData>`


```js
```

#### `getClientLocation(latLng?, callback)` *(legacy-compatible)*

Callback-based. If `latLng` is omitted, tries GPS then falls back to IP.

```js
geo.getClientLocation(function(location) {
  console.log(location?.city);
});

// Or with known coords:
geo.getClientLocation({ latitude: -33.8688, longitude: 151.2093 }, function(location) {
  console.log(location.city);
});
```

#### `getClientCoordinates(callback)` *(legacy-compatible)*

Returns the raw GPS position via callback.

```js
geo.getClientCoordinates(function(position) {
  if (!position) return; // GPS denied
  console.log(position.coords.latitude, position.coords.longitude);
});
```

---

### LocationData response fields

Key fields returned by the API:

| Field | Type | Description |
|---|---|---|
| `latitude` | number | Latitude |
| `longitude` | number | Longitude |
| `city` | string | City/town name |
| `locality` | string | Locality/suburb name |
| `countryName` | string | Country name |
| `countryCode` | string | ISO 3166-1 alpha-2 country code |
| `principalSubdivision` | string | State/province |
| `postcode` | string | Postal code (if available) |
| `isLandmark` | boolean | Whether coordinates fall on a landmark |

---

## Framework-Specific Alternatives

If you're using a framework, consider these dedicated packages:

| Framework | Package |
|---|---|
| **React** | [`@bigdatacloudapi/react-reverse-geocode-client`](https://www.npmjs.com/package/@bigdatacloudapi/react-reverse-geocode-client) on npm |
| **Vue / Nuxt** | [`@bigdatacloudapi/vue-reverse-geocode-client`](https://www.npmjs.com/package/@bigdatacloudapi/vue-reverse-geocode-client) on npm |
| **Flutter / Dart** | [`bigdatacloud_reverse_geocode_client`](https://pub.dev/packages/bigdatacloud_reverse_geocode_client) on pub.dev |
| **Node.js** | [`@bigdatacloudapi/client`](https://www.npmjs.com/package/@bigdatacloudapi/client) on npm |
| **AI / MCP** | [`@bigdatacloudapi/mcp-server`](https://www.npmjs.com/package/@bigdatacloudapi/mcp-server) on npm |

---

## Fair Use

This client uses BigDataCloud's **free, client-side reverse geocoding API**. It is intended for browser-based use only — requests must originate from end-user browsers, not from servers or automated scripts.

Please review the [Fair Use Policy](https://www.bigdatacloud.com/support/fair-use-policy-for-free-client-side-reverse-geocoding-api) before integrating.

For **server-side or testing use**, please use the authenticated [Reverse Geocode to City API](https://www.bigdatacloud.com/reverse-geocoding/reverse-geocode-to-city-api) instead. A free tier is available after sign-up.

---

## Links

- 🌐 Website: [bigdatacloud.com](https://www.bigdatacloud.com)
- 🔑 Sign up / Log in: [bigdatacloud.com/login](https://www.bigdatacloud.com/login)
- 📡 What is my IP: [bigdatacloud.com/what-is-my-ip](https://www.bigdatacloud.com/what-is-my-ip)
- 🗺️ ISP & Network guide: [bigdatacloud.com/network-by-ip](https://www.bigdatacloud.com/network-by-ip)
- 📊 Accuracy report: [bigdatacloud.com/geocoding-accuracy](https://www.bigdatacloud.com/geocoding-accuracy)
- ⚖️ Fair use policy: [bigdatacloud.com/support/fair-use-policy-for-free-client-side-reverse-geocoding-api](https://www.bigdatacloud.com/support/fair-use-policy-for-free-client-side-reverse-geocoding-api)

---

© 2026 BigDataCloud Pty Ltd — MIT License
