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


    // Example of segment connecting nodes (markers)
    const startSegment = [ -79.396000, 43.658716]
    const endSegment = [-79.399877, 43.667489]

    // add line/segment
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
                  startSegment,
                  endSegment
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
            // to set the line-color to a feature property value.
            "line-color": ["get", "color"]
          }
        });
      });

    // add markers/nodes
    new mapboxgl.Marker()
      .setLngLat(startSegment)
      .addTo(this.map);

    new mapboxgl.Marker()
      .setLngLat(endSegment)
      .addTo(this.map);

    this.map.on('click', (e)=>{
      // this.addMarker(e.lngLat)
      this.addToRoute(e.lngLat, 0, 0)
    });    
  }

  addToRoute(lngLat, route, index){
  	const {lng, lat} = lngLat
  	const body = {
    		index,
    		route,
    		lat,
    		lng
    	}
    fetch("http://127.0.0.1:8080/api/insertNode", {
    	method:"POST",
    	body: JSON.stringify(body)
    }).then((response) => {
    	if(response.status != 200){
    		console.log("There was a problem, Status code: " + response.status)
    		return
    	}
    	response.json().then((data) => {
    		console.log(JSON.parse(data))
    		// addMarker()
    	})
    }).catch((error) => {
    	console.log("Fetch error " + error)
    })
  }

  addMarker(lngLat){
    const {lng, lat} = lngLat
    console.log("selected lng: ", lng)
    console.log("selected lat: ", lat)
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

  deleteFromRoute(route, index){
  	const body = {
		index,
		route
	}
    fetch("http://127.0.0.1:8080/api/deleteNode", {
    	method:"DELETE",
    	body: JSON.stringify(body)
    }).then((response) => {
    	if(response.status != 200){
    		console.log("There was a problem, Status code: " + response.status)
    		return
    	}
    	response.json().then((data) => {
    		console.log(JSON.parse(data))
    		// removeMarker()
    	})
    }).catch((error) => {
    	console.log("Fetch error " + error)
    })
  }


    modifyRoute(lngLat, route, index){
  	const {lng, lat} = lngLat
  	const body = {
		index,
		route,
		lat,
		lng
	}
    fetch("http://127.0.0.1:8080/api/modifyNode", {
    	method:"PATCH",
    	body: JSON.stringify(body)
    }).then((response) => {
    	if(response.status != 200){
    		console.log("There was a problem, Status code: " + response.status)
    		return
    	}
    	response.json().then((data) => {
    		console.log(JSON.parse(data))
    		// removeMarker()
    		// addMarker()
    	})
    }).catch((error) => {
    	console.log("Fetch error " + error)
    })
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
