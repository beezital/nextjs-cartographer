"use client";

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';


import { useEffect } from "react";

export default function Home() {


  useEffect(() => {
    async function initMap() {
      const L = (await import("leaflet")).default;

      const map = L.map('map').setView([48.25, 7.35], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
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

    }

    initMap();
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <h1>Leaflet test</h1>
        {/* <div style={{ flexGrow: 1, border: "1px solid red" }}></div> */}
        <div id="map" style={{ flexGrow: 1 }}></div>
      </div>
    </>
  );
}
