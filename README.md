# BigDataCloud Free Reverse Geocoding Javascript API Client


A frontend Javascript client for using the Free Reverse Geocoding API provided by [BigDataCloud](https://www.bigdatacloud.net)
This client works without any Javascript dependencies and has no API key or account requirement... Simply load it up and start Reverse Geocoding your customer's locations.


## Documentation

Documentation specific to this Free API Client is detailed below.
For more information on other available APIs, please visit our [API area](https://www.bigdatacloud.net/ip-geolocation-apis).



## Authentication / Identification

There is no authentication or identification required to use this API or client.
You may use this API and client for Free without an account.



## Usage Limits

This client-side API is completely FREE for both commercial and non-commercial use, including unlimited usage with no throttling or limitations.
This particular API is for client-side use only. Any user found abusing this service by implementing it server-side will be blacklisted from all of our free Api Services.
If you wish to utilise this Reverse Geocoding API in your backend applications, please visit our [server-side variation of this API](https://www.bigdatacloud.com/geocoding-apis/reverse-geocode-to-city-api) for pricing details.



## Manual Installation

1. Download the included javascript file and place it in a publically accessible location
2. Include the script tag `<script src="bigdatacloud_reverse_geocode.js" type="text/javascript"></script>` before your code execution
3. Initiate the Reverse geocode API Client as per the below example



## CDN Installation

1. Include the CDN script tag `<script src="https://cdn.jsdelivr.net/gh/bigdatacloudapi/js-reverse-geocode-client@latest/bigdatacloud_reverse_geocode.min.js" type="text/javascript"></script>` before your code execution
2. Initiate the API Client and make the required calls as necessary



## Example usage

```javascript
<script src="https://cdn.jsdelivr.net/gh/bigdatacloudapi/js-reverse-geocode-client@latest/bigdatacloud_reverse_geocode.min.js" type="text/javascript"></script>
<script type="text/javascript">

    /* Initialise Reverse Geocode API Client */
    var reverseGeocoder=new BDCReverseGeocode();
    
    /* Get the current user's location information, based on the coordinates provided by their browser */
    /* Fetching coordinates requires the user to be accessing your page over HTTPS and to allow the location prompt. */
    reverseGeocoder.getClientLocation(function(result) {
        console.log(result);
    });

    /* Get the administrative location information using a set of known coordinates */
    reverseGeocoder.getClientLocation({
        latitude: -33.8688,
        longitude: 151.2093,
    },function(result) {
        console.log(result);
    });

    /* You can also set the locality language as needed */
    reverseGeocoder.localityLanguage='es';

    /* Request the current user's coordinates (requires HTTPS and acceptance of prompt) */
    reverseGeocoder.getClientCoordinates(function(result) {
        console.log(result);
    });

</script>
```


## Example output

```javascript
{
    "latitude": "-33.8688",
    "longitude": "151.2093",
    "localityLanguageRequested": "en",
    "countryName": "Australia",
    "principalSubdivision": "New South Wales",
    "locality": "Sydney",
    "localityInfo": {
        "administrative": [{
            "order": 1,
            "adminLevel": 2,
            "name": "Australia",
            "description": "country in Oceania",
            "isoName": "Australia",
            "isoCode": "AU",
            "wikidataId": "Q408"
        }, {
            "order": 2,
            "adminLevel": 4,
            "name": "New South Wales",
            "description": "state of Australia",
            "isoName": "New South Wales",
            "isoCode": "AU-NSW",
            "wikidataId": "Q3224"
        }, {
            "order": 3,
            "adminLevel": 7,
            "name": "Sydney",
            "description": "capital city of New South Wales, Australia",
            "wikidataId": "Q3130"
        }, {
            "order": 4,
            "adminLevel": 6,
            "name": "Council of the City of Sydney",
            "description": "municipality"
        }, {
            "order": 5,
            "adminLevel": 10,
            "name": "Sydney",
            "description": "central business district of Sydney, New South Wales, Australia",
            "wikidataId": "Q1852577"
        }]
    }
}
```
