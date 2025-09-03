"use client";

import { Button, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import type { LatLngLiteral, Map as LeafletMap } from 'leaflet';

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from "react";


function Coordinates({ latLong, centerMap }: { latLong: LatLngLiteral, centerMap: (latLong: LatLngLiteral) => void }) {

  const latLongString = `${latLong.lat}, ${latLong.lng}`;

  return (
    <TextField
      id='coordinates-input'
      label="Coordinates (Latitude, Longitude)"
      variant="outlined"
      value={latLongString}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const [lat, lng] = event.target.value.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const center: LatLngLiteral = { lat, lng };
          centerMap(center);
        }
      }}
      // https://mui.com/material-ui/react-text-field/#input-adornments
      slotProps={{
        input: {
          endAdornment: <InputAdornment position="end">
            <Button variant='contained'>Go</Button>
          </InputAdornment>
        }
      }}
    />

  );
}

function Map() {
  return (
    <div id="map" style={{ flexGrow: 1 }}></div>
  )
}

export default function Home() {

  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    async function initMap() {
      const L = (await import("leaflet")).default;

      const map = L.map('map').setView([48.26, 7.45], 13);
      mapRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // https://geoservices.ign.fr/documentation/services/utilisation-web/affichage-wmts/leaflet-et-wmts
      L.tileLayer(
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
      ).addTo(map);

      map.on('move', function (e) {
        mapDidMove(map);
      });

      // mapDidMove(map);

      function mapDidMove(map: LeafletMap) {
        const center = map.getCenter();
        onMove(center);
      }
    }

    initMap();

  }, []);

  const [latLong, setLatLong] = useState<LatLngLiteral | null>(null);

  function onMove(toLatLong: LatLngLiteral) {
    setLatLong(toLatLong);
  }

  function centerMap(toLatLong: LatLngLiteral) {
    console.log("New center:", toLatLong);
    if (mapRef.current) {
      mapRef.current.setView(toLatLong);
      setLatLong(toLatLong);
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }}>
          <h1>Leaflet test</h1>
          {latLong && <Coordinates latLong={latLong} centerMap={centerMap} />}
        </div>
        <Map />
      </div>
    </>
  );
}
