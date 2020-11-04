import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getHereToken, getMapboxToken } from './mapActions';
import "./Map.module.css";

export function Map() {
    const mapRef = useRef(null);
    const [lng, setLng] = useState(-79.3832);
    const [lat, setLat] = useState(43.6532);
    const [zoom, setZoom] = useState(15.0);

    useEffect(() => {
        mapboxgl.accessToken = getMapboxToken();
        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
            transformRequest: function (url, resourceType) {
                if (url.match('vector.*.hereapi.com')) {
                    return {
                        url: url,
                        headers: { 'Authorization': 'Bearer ' + getHereToken() }
                    }
                }
            }
        });
        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        return () => map.remove();
    }, []);

    return (
        <div className='map-container'>
            <div className='map' ref={mapRef} />
        </div>
    )
}