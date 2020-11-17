import React from 'react';
import mapboxgl from 'mapbox-gl';
import { getHereToken, getMapboxToken } from './mapActions';
import "./Map.module.css";
import Menu from "../menu/Menu"


mapboxgl.accessToken = getMapboxToken();

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 43.659880,
      lng: -79.390342,
      zoom: 14
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })

    this.map.on("load", ()=> {
      this.map.addSource("lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          // can draw multiple lines by including multiple objects inside features list
          features: [
            {
              type: "Feature",
              properties: {
                // color: "#B5B5FE" // soft purple
                color: "#9A21F9" // stronger purple
              },
              geometry: {
                type: "LineString",
                coordinates: [                  
                  // [long, lat]
                  [ -79.396000, 43.658716],
                  [-79.399877, 43.667489]
                ]
              }
            }
          ]
        }
      });
        this.map.addLayer({
          id: "lines",
          type: "line",
          source: "lines",
          paint: {
            "line-width": 3,
            // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
            // to set the line-caolor to a feature property value.
            "line-color": ["get", "color"]
          }
        });
      });

    new mapboxgl.Marker()
      .setLngLat([-79.396000, 43.658716])
      .addTo(this.map);

    // new mapboxgl.Marker()
    //   .setLngLat([-79.399877, 43.667489])
    //   .addTo(this.map);

    this.map.on('click', (e)=>{
      console.log("from e", e.lngLat)
      this.addMarker(this.map, e.lngLat)
    });    
  }


  addMarker(map, lngLat){
    console.log("add marker")
    const {lng, lat} = lngLat
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

  componentWillUnmount() {
    this.map.remove()
  }
  render() {

    return <div className={'map'} ref={e => (this.container = e)} >
      <Menu/>

    </div>
  }
}

export default Map
