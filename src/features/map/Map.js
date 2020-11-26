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
      // if (e.originalEvent.button === 0) {
      //   this.addToRoute(e.lngLat, this.state.route_index, this.state.paths.length)
      // } else {
      //   this.deleteFromRoute(this.state.route_index, 0)
      // }
      this.addToRoute(e.lngLat, this.state.route_index, this.state.paths.length)
    });
  }

  removePath = (index) => {
    // if (index >= this.state.paths.length){
    //   index = this.state.paths.length-1
    // }
    const data = this.state.paths[index];
    const coords = data.coordinates;
    const newLine = {
      type: "Feature",
      properties: {
        // color: "#B5B5FE" // soft purple
        color: "#000000", // stronger purple
      },
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    }
    const newFeatures = this.map.getSource("lines")["_data"].features;
    newFeatures.push(newLine);

    this.map.getSource("lines").setData({
      ...this.map.getSource("lines")["_data"],
      newFeatures,
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

    let new_node = null;
    let newPaths = null;

    if (!this.state.isBuildingPath) {
      new_node = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat]).addTo(this.map)

      //First insert_node call has been made: start_node coords == end_node coords
      newPaths = this.state.paths;
      obj.ind = index
      newPaths.push(obj);
      this.setState({ paths: newPaths });
      this.setState({ isBuildingPath: true });

    } else if (this.state.isBuildingPath) {
      new_node = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat]).addTo(this.map);
      //Second insert call has been made and start_node coords !== end_node coords
      newPaths = this.state.paths;
      newPaths.push(obj);
      this.setState({ paths: newPaths }, this.drawPath(this.state.paths.length - 1));
    }
    function onClickDelete() {
      console.log("WANNA DELETE BRO??")
    }
    function onDragEnd() {
      var lngLat = new_node.getLngLat();
    }
    new_node.on('click', () => {
      onClickDelete()
    });
    new_node.on('dragend', () => {
      new_node.remove();
      this.deleteFromRoute(0, index)
    });
  }

  addToRoute(lngLat, route, index) {
    const { lng, lat } = lngLat
    const body = {
      index,
      route,
      lat,
      lng
    }
    fetch("http://Tfsd2-env.eba-2rmc52x2.us-east-2.elasticbeanstalk.com/api/insertNode", {
      method: "POST",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status !== 200) {
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
    fetch("http://Tfsd2-env.eba-2rmc52x2.us-east-2.elasticbeanstalk.com/api/deleteNode", {
      method: "DELETE",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status !== 200) {
        console.log("There was a problem, Status code: " + response.status)
        return
      }
      response.json().then((data) => {
        console.log("Retrieved Delete Node data is:")
        console.log(data)
        console.log(Object.keys(data)[0])
        console.log(this.state.paths.length)
        this.removeMarker(data, index)
      })
    }).catch((error) => {
      console.log("Fetch error " + error)
    })
  }

  removeMarker(data, index) {
    let new_paths = this.state.paths;
    if (new_paths.length == 0) {
      return
    }
    this.removePath(index);
    new_paths.splice(index, 1);
    for (let i = index; i < new_paths.length; i++){
      new_paths[i].ind--
    }
    let to_change = index;
    let j = 0;
    for (let i = 0; i < this.state.paths.length; i++) {
      console.log(new_paths[i])
      if (i === to_change - 1) {
        console.log(data[to_change])
        new_paths[i].end_node = data[to_change].end_node;
      }
      if (i === to_change) {
        this.removePath(i);
        new_paths[i].start_node = data[to_change].start_node;
        new_paths[i].coordinates = data[to_change].coordinates;
        j = i;
        break;
      }
    }
    this.setState({ paths: new_paths })
    if (new_paths.length == 0) {
      return
    }
    this.drawPath(j);
    console.log(this.state.paths)
  }

  modifyRoute(lngLat, route, index) {
    const { lng, lat } = lngLat
    const body = {
      index,
      route,
      lat,
      lng
    }
    fetch("http://Tfsd2-env.eba-2rmc52x2.us-east-2.elasticbeanstalk.com/api/modifyNode", {
      method: "PATCH",
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status !== 200) {
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
