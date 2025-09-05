import { createContext, RefObject, useRef, useState } from "react";
import type { LatLngLiteral, Map as LeafletMap } from 'leaflet';


export const LeafletMapContext = createContext<{
    leafletMapRef: RefObject<LeafletMap | null>;
    mapCenterLatLong: LatLngLiteral | null;
    setMapCenterLatLong: (latLong: LatLngLiteral | null) => void;
}>({ leafletMapRef: { current: null }, mapCenterLatLong: null, setMapCenterLatLong: () => { } });


export function LeafletMapProvider({ children }: { children: React.ReactNode }) {

    const leafletMapRef = useRef<LeafletMap | null>(null);
    const [mapCenterLatLong, setMapCenterLatLong] = useState<LatLngLiteral | null>(null);
    
    return (
        <LeafletMapContext.Provider value={{ leafletMapRef, mapCenterLatLong, setMapCenterLatLong }}>
            {children}
        </LeafletMapContext.Provider>
    );
}