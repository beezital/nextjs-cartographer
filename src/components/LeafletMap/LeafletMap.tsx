import { AlertsContext } from "@/contexts/AlertsContexts";
import { useLeafletHelper } from "@/hooks/useLeafletHelper";
import { MyLocation } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useContext, useEffect, useRef } from "react";

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';

import styles from './LeafletMap.module.css';


export default function LeafletMap() {

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { initMap, centerMapOnCurrentPosition } = useLeafletHelper();

  const { addError } = useContext(AlertsContext);

  useEffect(() => {
    console.log("initializing map");
    if (mapContainerRef.current) {
      initMap(mapContainerRef.current, addError);
    }

    return () => {
      console.log("about to cleanup map");
      if (mapContainerRef.current) {
        mapContainerRef.current.remove();
        mapContainerRef.current = null;
      }
    };

  }, [initMap, addError]);


  // Code more explicit than passing `centerMapOnCurrentPosition.bind(null, undefined)` to onClick in order to satisfy eslint
  function handleClick() {
    centerMapOnCurrentPosition(addError);
  }

  return (
    <div className={styles.leafletMap}>
      <div ref={mapContainerRef} className={styles.mapContainer}></div>
      <div className={styles.mapOverlay}>
        <Button variant="contained" startIcon={<MyLocation />} onClick={handleClick}>GPS</Button>
      </div>
    </div>
  )
}
