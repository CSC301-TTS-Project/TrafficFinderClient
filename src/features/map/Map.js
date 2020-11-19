import React from "react";
import mapboxgl from "mapbox-gl";
import { getHereToken, getMapboxToken } from "./mapActions";
import "./Map.module.css";
import Menu from "../menu/Menu";

mapboxgl.accessToken = getMapboxToken();

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 43.65988,
      lng: -79.390342,
      zoom: 14,
      paths: [],
      isBuildingPath: false,
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.container,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });

    // add line/segment
    this.map.on("load", () => {
      this.map.addSource("lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          // can draw multiple lines by including multiple objects inside features list
          features: [],
        },
      });
      this.map.addLayer({
        id: "lines",
        type: "line",
        source: "lines",
        paint: {
          "line-width": 3,
          // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
          // to set the line-color to a feature property value.
          "line-color": ["get", "color"],
        },
      });
    });

    this.map.on('click', (e) => {
      // this.addMarker(e.lngLat)
      this.addToRoute(e.lngLat, 0, this.state.paths.length)
    });
  }

  drawPath = () => {
    const data = this.state.paths[this.state.paths.length - 1];
    const coords = data.coordinates;
    const newLine = {
      type: "Feature",
      properties: {
        // color: "#B5B5FE" // soft purple
        color: "#9A21F9", // stronger purple
      },
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    };

    // Add Feature object to features array to add points
    // Example new line uncomment when needed
    // const newLine = {
    //   type: "Feature",
    //   properties: {
    //     // color: "#B5B5FE" // soft purple
    //     color: "#9A21F9", // stronger purple
    //   },
    //   geometry: {
    //     type: "LineString",
    //     coordinates: coords,
    //   },
    // };

    const newFeatures = this.map.getSource("lines")["_data"].features;
    newFeatures.push(newLine);

    this.map.getSource("lines").setData({
      ...this.map.getSource("lines")["_data"],
      newFeatures,
    });
    this.setState({
      isBuildingPath: false,
    });
  };

  addMarker(obj) {
    // const { lng, lat } = lngLat;
    console.log(obj)
    const lng = obj["end_node"]["lng"];
    const lat = obj["end_node"]["lat"];
    console.log("selected lng: ", lat);
    console.log("selected lat: ", lng);

    if (!this.state.isBuildingPath) {
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
      //First insert_node call has been made: start_node coords == end_node coords
      this.setState({ isBuildingPath: true });
    } else if (this.state.isBuildingPath) {
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
      //Second insert call has been made and start_node coords !== end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      console.log(newPaths)
      this.setState({ paths: newPaths }, this.drawPath);
      console.log(this.state.paths)
    }
  }

  addToRoute(lngLat, route, index) {
    const { lng, lat } = lngLat
    const body = {
      index,
      route,
      lat,
      lng
    }
    fetch("http://127.0.0.1:8080/api/insertNode", {
      method: "POST",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status != 200) {
        console.log("There was a problem, Status code: " + response.status)
        return
      }
      response.json().then((data) => {
        console.log(data)
        this.addMarker(data[index])
      })
    }).catch((error) => {
      console.log("Fetch error " + error)
    })
  }

  deleteFromRoute(route, index) {
    const body = {
      index,
      route
    }
    fetch("http://127.0.0.1:8080/api/deleteNode", {
      method: "DELETE",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status != 200) {
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


  modifyRoute(lngLat, route, index) {
    const { lng, lat } = lngLat
    const body = {
      index,
      route,
      lat,
      lng
    }
    fetch("http://127.0.0.1:8080/api/modifyNode", {
      method: "PATCH",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status != 200) {
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
    this.map.remove();
  }
  render() {
    return (
      <div className={"map"} ref={(e) => (this.container = e)}>
        <Menu />
      </div>
    );
  }
}

export default Map;
