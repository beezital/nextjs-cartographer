"use client";

import TextField from '@mui/material/TextField';
import { LatLng, Map as LeafletMap } from 'leaflet';

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';


import { useEffect, useState } from "react";

function Coordinates({ latLong }: { latLong: LatLng }) {

  const latLongString = `${latLong.lat}, ${latLong.lng}`;

  return (
    <TextField id="outlined-basic" label="Coordinates (Latitude, Longitude)" variant="outlined" value={latLongString} />
  );
}

function Map({ onMove }: { onMove: (latLong: LatLng) => void }) {
  useEffect(() => {
    async function initMap() {
      const L = (await import("leaflet")).default;

      const map = L.map('map').setView([48.26, 7.45], 13);

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

      mapDidMove(map);

      function mapDidMove(map: LeafletMap) {
        const center = map.getCenter();
        onMove(center);
      }
    }

    initMap();

  }, []);

  return (
    <div id="map" style={{ flexGrow: 1 }}></div>
  )

}

export default function Home() {

  const [latLong, setLatLong] = useState<LatLng | null>(null);

  function onMove(toLatLong: LatLng) {
    setLatLong(toLatLong);
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }}>
          <h1>Leaflet test</h1>
          {latLong && <Coordinates latLong={latLong} />}
        </div>
        <Map onMove={onMove} />
      </div>
    </>
  );
}
