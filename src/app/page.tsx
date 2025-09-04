"use client";

import { Button, InputAdornment } from '@mui/material';
import { ExploreOutlined } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import type { LatLngLiteral, Map as LeafletMap } from 'leaflet';

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from "react";


const COORDINATES_PRECISION = 1000000;


function Coordinates({ latLong, centerMap }: { latLong: LatLngLiteral, centerMap: (latLong: LatLngLiteral) => void }) {

  function roundCoordinate(coord: number) {
    return Math.round(coord * COORDINATES_PRECISION) / COORDINATES_PRECISION;
  }
  const lat = roundCoordinate(latLong.lat);
  const lng = roundCoordinate(latLong.lng);
  const latLongString = `${lat}, ${lng}`;

  const [coordinates, setCoordinates] = useState(latLongString);

  useEffect(() => {
    setCoordinates(latLongString);
  }, [latLongString]);

  function go(formData: FormData) {
    console.log("Form submitted:", formData.keys().toArray());
    const newCoordinates = formData.get("coordinates")?.toString() || "";
    let [lat, lng] = newCoordinates.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Parsed coordinates:", lat, lng);
      lat = roundCoordinate(lat);
      lng = roundCoordinate(lng);
      console.log("Parsed coordinates rounded:", lat, lng);
      const center: LatLngLiteral = { lat, lng };
      centerMap(center);
    }
  }

  return (
    <form action={go}>
      <TextField
        style={{ width: "100%" }}
        id='coordinates-input'
        label="Coordinates (Latitude, Longitude)"
        variant="outlined"
        name="coordinates"
        value={coordinates}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCoordinates(event.target.value);
        }}
        // https://mui.com/material-ui/react-text-field/#input-adornments
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">
              <Button variant='contained' type='submit'>Go</Button>
            </InputAdornment>
          }
        }}
      />
    </form>
  );
}

function Map({ centerMapOnCurrentPosition }: { centerMapOnCurrentPosition: () => void }) {



  return (
    <div style={{ position: "relative", flexGrow: 1 }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 500, display: "flex", gap: "1em", padding: "1em", justifyContent: "center" }}>
        <Button variant="contained" startIcon={<ExploreOutlined />} onClick={centerMapOnCurrentPosition}>GPS</Button>
      </div>
    </div>
  )
}

export default function Home() {

  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    async function initMap() {
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

      const map = L.map('map', {
        center: [48.26, 7.45],
        zoom: 13,
        layers: [layerIGNv2]
      });
      mapRef.current = map;

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

      map.on('move', function () {
        mapDidMove(map);
      });

      function mapDidMove(map: LeafletMap) {
        const center = map.getCenter();
        onMove(center);
      }
    }

    initMap();

    centerMapOnCurrentPosition();

  }, []);

  const [latLong, setLatLong] = useState<LatLngLiteral | null>(null);

  function onMove(toLatLong: LatLngLiteral) {
    setLatLong(toLatLong);
  }

  function centerMapOn(latLong: LatLngLiteral) {
    console.log("New center:", latLong);
    if (mapRef.current) {
      mapRef.current.setView(latLong);
      setLatLong(latLong);
    }
  }

  function centerMapOnCurrentPosition() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
    if ("geolocation" in navigator) {
      /* geolocation is available */
      console.log("Geolocation is available");
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("Current position:", lat, lng);

        centerMapOn({ lat, lng });
      }, function (error) {
        console.error("Error getting geolocation:", error);
      });
    } else {
      /* geolocation IS NOT available */
      console.log("Geolocation is NOT available");
      // mapDidMove(map);
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }}>
          <h1>Leaflet test</h1>
          {latLong && <Coordinates latLong={latLong} centerMap={centerMapOn} />}
        </div>
        <Map centerMapOnCurrentPosition={centerMapOnCurrentPosition} />
      </div>
    </>
  );
}
