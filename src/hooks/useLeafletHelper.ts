import type { LatLngLiteral, Map as LeafletMap } from 'leaflet';
import { useCallback, useContext } from 'react';
import { LeafletMapContext } from '../contexts/LeafletMapContext';

export function useLeafletHelper() {


    const { leafletMapRef, currentLocationMarkerRef, targetLocationMarkerRef, setMapCenterLatLong } = useContext(LeafletMapContext);

    /**
     * Handles the map's 'move' event to update the center coordinates in the context.
     */
    const mapDidMove = useCallback((map: LeafletMap) => {
        const center = map.getCenter();
        setMapCenterLatLong(center);
    }, [setMapCenterLatLong]);


    /**
     * Displays the target location marker at the specified latitude and longitude.
     * If the marker is already on the map, it updates its position.
     * @param latLong The latitude and longitude where the target location marker should be shown.
     */
    const showTargetLocationMarkerAt = useCallback((latLong: LatLngLiteral) => {
        console.log("showTargetLocationMarkerAt:", latLong);
        if (targetLocationMarkerRef.current && leafletMapRef.current) {
            targetLocationMarkerRef.current.setLatLng([latLong.lat, latLong.lng]);
            targetLocationMarkerRef.current.addTo(leafletMapRef.current!);
        }
    }, [targetLocationMarkerRef, leafletMapRef]);


    /**
     * Centers the map on the specified latitude and longitude.
     * @param latLong The latitude and longitude to center the map on.
     */
    const centerMapOn = useCallback((latLong: LatLngLiteral) => {
        console.log("New center:", latLong);
        if (leafletMapRef.current) {
            leafletMapRef.current.setView(latLong);
            setMapCenterLatLong(latLong);
        }
    }, [leafletMapRef, setMapCenterLatLong]);


    /**
     * Displays the current location marker at the specified latitude and longitude.
     * If the marker is already on the map, it updates its position.
     * @param latLong The latitude and longitude where the current location marker should be shown.
     */
    const showCurrentLocationMarkerAt = useCallback((latLong: LatLngLiteral) => {
        console.log("showCurrentLocationMarkerAt:", latLong);
        if (currentLocationMarkerRef.current && leafletMapRef.current) {
            currentLocationMarkerRef.current.setLatLng([latLong.lat, latLong.lng]);
            currentLocationMarkerRef.current.addTo(leafletMapRef.current!);
        }
    }, [currentLocationMarkerRef, leafletMapRef]);


    /**
     * Centers the map on the user's current geolocation, if available.
     * If geolocation is not available or an error occurs, the map remains unchanged.
     * @param onError Optional callback to handle errors (e.g., display an alert).
     */
    const centerMapOnCurrentPosition = useCallback((onError: ((error: string) => void) = () => { }) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
        if ("geolocation" in navigator) {
            /* geolocation is available */
            console.log("Geolocation is available");
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log("Current position:", position);

                showCurrentLocationMarkerAt({ lat, lng });

                centerMapOn({ lat, lng });
            }, function (error) {
                console.warn("Error getting geolocation:", error);
                onError(error.message);
                if (currentLocationMarkerRef.current && leafletMapRef.current) {
                    currentLocationMarkerRef.current.removeFrom(leafletMapRef.current!);
                }
                if (leafletMapRef.current) {
                    mapDidMove(leafletMapRef.current);
                } else {
                    console.log("mapRef.current is null");
                }
            }, { enableHighAccuracy: true});
        } else {
            /* geolocation IS NOT available */
            console.log("Geolocation is NOT available");
            onError("Geolocation is not available in your browser.");
            if (currentLocationMarkerRef.current && leafletMapRef.current) {
                currentLocationMarkerRef.current.removeFrom(leafletMapRef.current!);
            }
            if (leafletMapRef.current) {
                mapDidMove(leafletMapRef.current);
            }
        }
    }, [showCurrentLocationMarkerAt, centerMapOn, currentLocationMarkerRef, leafletMapRef, mapDidMove]);


    /**
     * Initializes the Leaflet map in the given container div.
     * @param mapContainerDiv The HTMLDivElement to contain the map.
     * @param onError Callback to handle errors.
     */
    const initMap = useCallback(async (mapContainerDiv: HTMLDivElement, onError: ((error: string) => void)) => {
        const L = (await import("leaflet")).default;

        const layerOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        // https://geoservices.ign.fr/documentation/services/utilisation-web/affichage-wmts/leaflet-et-wmts
        // https://geoservices.ign.fr/services-web-essentiels
        // https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities
        const layerIGNv2 = L.tileLayer(
            "https://data.geopf.fr/wmts?" +
            "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
            "&STYLE=normal" +
            "&TILEMATRIXSET=PM" +
            // "&FORMAT=image/jpeg" +
            // "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS" +
            "&FORMAT=image/png" +
            "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" +
            "&TILEMATRIX={z}" +
            "&TILEROW={y}" +
            "&TILECOL={x}",
            {
                minZoom: 0,
                maxZoom: 18,
                attribution: "IGN-F/Geoportail",
                tileSize: 256 // les tuiles du Géooportail font 256x256px
            }
        );

        const layerSatellite = L.tileLayer(
            "https://data.geopf.fr/wmts?" +
            "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
            "&STYLE=normal" +
            "&TILEMATRIXSET=PM" +
            "&FORMAT=image/jpeg" +
            "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS" +
            "&TILEMATRIX={z}" +
            "&TILEROW={y}" +
            "&TILECOL={x}",
            {
                minZoom: 0,
                maxZoom: 19,
                attribution: "IGN-F/Geoportail",
                tileSize: 256 // les tuiles du Géooportail font 256x256px
            }
        );

        const layerDFCI = L.tileLayer(
            "https://data.geopf.fr/wmts?" +
            "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
            "&STYLE=normal" +
            "&TILEMATRIXSET=PM" +
            "&FORMAT=image/png" +
            "&LAYER=GEOGRAPHICALGRIDSYSTEM.DFCI" +
            "&TILEMATRIX={z}" +
            "&TILEROW={y}" +
            "&TILECOL={x}",
            {
                minZoom: 0,
                maxZoom: 16,
                attribution: "IGN-F/Geoportail",
                tileSize: 256 // les tuiles du Géooportail font 256x256px
            }
        );

        const map = L.map(mapContainerDiv, {
            center: [48.260022, 7.424172],
            zoom: 13,
            layers: [layerIGNv2]
        });
        leafletMapRef.current = map;

        // prepare currentLocation marker
        const currentLocationIcon = L.icon({
            iconUrl: 'my_location_24dp_FF0000.svg',
        });
        const currentLocationMarker = L.marker([48.260022, 7.424172], { icon: currentLocationIcon });
        currentLocationMarker.bindPopup("Current location");
        currentLocationMarkerRef.current = currentLocationMarker;

        // prepare targetLocation marker
        const targetLocationIcon = L.icon({
            iconUrl: 'gamepad_24dp_FF0000.svg',
        });
        const targetLocationMarker = L.marker([48.260022, 7.424172], { icon: targetLocationIcon });
        targetLocationMarker.bindPopup("Target location");
        targetLocationMarkerRef.current = targetLocationMarker;

        // Prepare the layer control
        const baseMaps = {
            "IGNv2": layerIGNv2,
            "OpenStreetMap": layerOSM
        };

        const overlayMaps = {
            "Satellite": layerSatellite,
            "DFCI": layerDFCI
        };

        const layerControl = L.control.layers(baseMaps, overlayMaps);
        layerControl.addTo(map);

        // Add the event listener for map movements
        map.on('move', function () {
            mapDidMove(map);
        });

        centerMapOnCurrentPosition(onError);
    }, [leafletMapRef, currentLocationMarkerRef, targetLocationMarkerRef, centerMapOnCurrentPosition, mapDidMove]);

    return {
        initMap,
        mapDidMove,
        centerMapOn,
        centerMapOnCurrentPosition,
        showTargetLocationMarkerAt,
    }
}