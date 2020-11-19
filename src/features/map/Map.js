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
      route_index: 0,
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
      this.addToRoute(e.lngLat, this.state.route_index, this.state.paths.length)
    });
  }

  drawPath = (index) => {
    const data = this.state.paths[index];
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
    // this.setState({
    //   isBuildingPath: false,
    // });
  };

  addMarker(obj, index) {
    // const { lng, lat } = lngLat;
    const lng = obj["end_node"]["lng"];
    const lat = obj["end_node"]["lat"];

    if (!this.state.isBuildingPath) {
      let new_node = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
      let html_element = new_node.getElement()
      html_element.addEventListener("click", () => {
        console.log("Want to delete Node: " + index)
        this.deleteFromRoute(this.state.route_index, index)
      })
      //First insert_node call has been made: start_node coords == end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      this.setState({ paths: newPaths });
      this.setState({ isBuildingPath: true });
      console.log("Ran as first node")
    } else if (this.state.isBuildingPath) {
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
      //Second insert call has been made and start_node coords !== end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      console.log("The New Paths is:");
      console.log(newPaths)
      this.setState({ paths: newPaths }, this.drawPath(this.state.paths.length - 1));
      console.log("Length of Paths Var is: " + this.state.paths.length)
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
        console.log("Retrieved insertNode data is:")
        console.log(data)
        this.addMarker(data[index], index)
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
        console.log("Retrieved insertNode data is:")
        console.log(data)
        this.removeMarker(data)
      })
    }).catch((error) => {
      console.log("Fetch error " + error)
    })
  }

  removeMarker(data){
    let keys = []
    for(let k in data) keys.push(k);
    for(let i = 0; i<keys.length;i++){
      let index = parseInt(keys[i])
      this.state.paths[index] = data[index]
      drawPath(index)
    }
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
