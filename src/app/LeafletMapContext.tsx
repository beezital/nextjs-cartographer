import { createContext, RefObject, useRef, useState } from "react";
import type { LatLngLiteral, Map as LeafletMap, Marker } from 'leaflet';


export const LeafletMapContext = createContext<{
    leafletMapRef: RefObject<LeafletMap | null>;
    currentLocationMarkerRef: RefObject<Marker | null>;
    targetLocationMarkerRef: RefObject<Marker | null>;
    mapCenterLatLong: LatLngLiteral | null;
    setMapCenterLatLong: (latLong: LatLngLiteral | null) => void;
    currentLocation: LatLngLiteral | null;
    setCurrentLocation: (latLong: LatLngLiteral | null) => void;
    targetLocation: LatLngLiteral | null;
    setTargetLocation: (latLong: LatLngLiteral | null) => void;
}>({
    leafletMapRef: { current: null },
    currentLocationMarkerRef: { current: null },
    targetLocationMarkerRef: { current: null },
    mapCenterLatLong: null,
    setMapCenterLatLong: () => { },
    currentLocation: null,
    setCurrentLocation: () => { },
    targetLocation: null,
    setTargetLocation: () => { }
});


export function LeafletMapProvider({ children }: { children: React.ReactNode }) {

    const leafletMapRef = useRef<LeafletMap | null>(null);
    const currentLocationMarkerRef = useRef<Marker | null>(null);
    const targetLocationMarkerRef = useRef<Marker | null>(null);
    const [mapCenterLatLong, setMapCenterLatLong] = useState<LatLngLiteral | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LatLngLiteral | null>(null);
    const [targetLocation, setTargetLocation] = useState<LatLngLiteral | null>(null);
    
    return (
        <LeafletMapContext.Provider value={{ leafletMapRef, currentLocationMarkerRef, targetLocationMarkerRef, mapCenterLatLong, setMapCenterLatLong, currentLocation, setCurrentLocation, targetLocation, setTargetLocation }}>
            {children}
        </LeafletMapContext.Provider>
    );
}