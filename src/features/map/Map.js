import React from "react";
import mapboxgl from "mapbox-gl";
import { getHereToken, getMapboxToken } from "./mapActions";
import "./Map.module.css";
import Menu from "../menu/Menu";
import { ENDPOINT } from "./../requests";
import ReactDOM from "react-dom";
import styles from "./Map.module.css";
import { isEqual } from "lodash";

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
      numMarkers: 0,
      markersDetailInfo: {},
      orderedMarkerIds: [],
      markerDeletionWindowOpen: false,
    };
  }

  markerDeletionWindow = (markerId) => (
    <div className={styles.popUpContents}>
      <h3>Are you sure you want to delete the marker?</h3>
      <div className={styles.popUpContents}>
        <button
          className={styles.primaryBtn}
          onClick={() => {
            const marker = this.state.markersDetailInfo[markerId];
            console.log("marker id");
            console.log(markerId);
            console.log("marker info");
            console.log(this.state.markersDetailInfo);

            marker.remove();

            // find the index of the deletion marker in the path
            let deletionIndex = -1;
            for (
              let index = 0;
              index < this.state.orderedMarkerIds.length;
              index++
            ) {
              if (markerId === this.state.orderedMarkerIds[index]) {
                deletionIndex = index;
                break;
              }
            }
            const routeId = 0;
            // console.log("the deletion index is ");
            // console.log(deletionIndex);
            this.deleteFromRoute(routeId, deletionIndex);

            // After successfully deleted marker, we remove the deleted marker id from
            // state.orderedMarkerIds to synchronize the path information backend has
            const newOrderedMarkers = this.state.orderedMarkerIds.filter(
              (n) => n !== markerId
            );
            this.setState({ orderedMarkerIds: newOrderedMarkers });
            this.setState({ markerDeletionWindowOpen: false });
          }}
        >
          delete
        </button>
      </div>
    </div>
  );

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.container,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });

    this.map.doubleClickZoom.disable();

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
      fetch(`${ENDPOINT}/api/getRoute`, {
        method: "POST",
        //Fetch first and only route on map
        body: JSON.stringify({ route: 0 }),
      })
        .then((response) => {
          if (response.status !== 200) {
            console.log("Internal error, status code: " + response.status);
          } else {
            response.json().then((data) => {
              const pathNodes = data;
              for (let i = 0; i < pathNodes.length; i++) {
                this.addMarker(pathNodes[i]);
              }
            });
          }
        })
        .catch((error) => {
          console.log("Could not get route data: " + error);
        });
    });

    this.map.on("dblclick", (e) => {
      if (e.originalEvent.button === 0) {
        // wait until the the state.markerDeletionWindowOpen is updated when marker it self is been clicked
        // the state.markerDeletionWindowOpen is updated at
        setTimeout(() => {
          // console.log("the marker itself has been clicked is");
          console.log(this.state.markerDeletionWindowOpen);
          if (this.state.markerDeletionWindowOpen === false) {
            this.addToRoute(
              e.lngLat,
              this.state.route_index,
              this.state.paths.length
            );
          }
        }, 1200);
      }
    });
  }

  removePath = (index) => {
    const data = this.state.paths[index];
    const coords = data.coordinates;
    const newFeatures = this.map.getSource("lines")["_data"].features;

    //Iterating in reverse so that modifying newFeatures while looping works
    for (let i = newFeatures.length - 1; i >= 0; i--) {
      const featObjCoords = newFeatures[i]["geometry"]["coordinates"];
      if (isEqual(featObjCoords, coords)) {
        if (i + 1 < newFeatures.length) {
          newFeatures.splice(i, 2);
        } else {
          newFeatures.splice(i, 1);
        }
      }
    }
    this.map.getSource("lines").setData({
      ...this.map.getSource("lines")["_data"],
      newFeatures,
    });
  };

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

    const newFeatures = this.map.getSource("lines")["_data"].features;
    newFeatures.push(newLine);

    this.map.getSource("lines").setData({
      ...this.map.getSource("lines")["_data"],
      newFeatures,
    });
  };

  addPopup(nodeIndex) {
    const placeholder = document.createElement("div");
    const windowContent = this.markerDeletionWindow(nodeIndex);
    ReactDOM.render(windowContent, placeholder);
    return new mapboxgl.Popup().setDOMContent(placeholder).addTo(this.map);
  }

  addMarker(obj, index) {
    // const { lng, lat } = lngLat;
    const lng = obj["end_node"]["lng"];
    const lat = obj["end_node"]["lat"];

    const nodeIndex = this.state.numMarkers;

    let new_node = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(this.addPopup(nodeIndex))
      .addTo(this.map);

    const currentMarkersInfo = this.state.markersDetailInfo;
    currentMarkersInfo[nodeIndex] = new_node;
    this.setState({ markersDetailInfo: currentMarkersInfo });

    // console.log("the current markers info is");
    // console.log(this.state.markersDetailInfo);

    const existingMakerInOrder = this.state.orderedMarkerIds;
    existingMakerInOrder.push(this.state.numMarkers);
    this.setState({ orderedMarkerIds: existingMakerInOrder });
    this.setState({ numMarkers: this.state.numMarkers + 1 });

    // console.log("the marker ids are updated");
    // console.log("current marker ids are");
    // console.log(this.state.orderedMarkerIds);
    // console.log("the node Index increased to");
    // console.log(this.state.numMarkers);

    let html_element = new_node.getElement();
    html_element.addEventListener("click", () => {
      this.setState({ markerDeletionWindowOpen: true });
      console.log("markder deletion window open`");
      console.log(this.state.markerDeletionWindowOpen);
    });

    if (!this.state.isBuildingPath) {
      //First insert_node call has been made: start_node coords == end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      this.setState({ paths: newPaths });
      this.setState({ isBuildingPath: true });
      console.log("Ran as first node");
    } else if (this.state.isBuildingPath) {
      //Second insert call has been made and start_node coords !== end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      // console.log(newPaths);
      this.setState(
        { paths: newPaths },
        this.drawPath(this.state.paths.length - 1)
      );
    }
  }

  addToRoute(lngLat, route, index) {
    console.log(lngLat, route, index);
    const { lng, lat } = lngLat;
    const body = {
      index,
      route,
      lat,
      lng,
    };
    fetch(`${ENDPOINT}/api/insertNode`, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log("There was a problem, Status code: " + response.status);
          return;
        }
        response.json().then((data) => {
          // console.log("Retrieved insertNode data is:");
          // console.log(data);
          this.addMarker(data[index], index);
        });
      })
      .catch((error) => {
        console.log("Fetch error " + error);
      });
  }

  deleteFromRoute(route, index) {
    // console.log(`deleteFromRoute route: ${route} index: ${index}`);
    const body = {
      index,
      route,
    };
    fetch(`${ENDPOINT}/api/deleteNode`, {
      method: "DELETE",
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log("There was a problem, Status code: " + response.status);
          return;
        }
        response.json().then((data) => {
          console.log("Retrieved Delete Node data is:");
          console.log(data);
          this.removeMarker(data, index);
        });
      })
      .catch((error) => {
        console.log("Fetch error " + error);
      });
  }
  removeMarker(data, index) {
    let new_paths = [];
    Object.assign(new_paths, this.state.paths);
    if (new_paths.length == 0) {
      return;
    }
    this.removePath(index);
    new_paths.splice(index, 1);
    for (const [idx, value] of Object.entries(data)) {
      console.log(idx);
      console.log(value);
      this.removePath(idx);
      new_paths[idx] = value;
      this.setState({ paths: new_paths });
      if (new_paths.length == 0) {
        return;
      }
      this.drawPath(idx);
    }
    this.setState({
      paths: new_paths,
    });
  }

  modifyRoute(lngLat, route, index) {
    const { lng, lat } = lngLat;
    const body = {
      index,
      route,
      lat,
      lng,
    };
    fetch(`${ENDPOINT}/api/modifyNode`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log("There was a problem, Status code: " + response.status);
          return;
        }
        response.json().then((data) => {
          console.log(JSON.parse(data));
          // removeMarker()
          // addMarker()
        });
      })
      .catch((error) => {
        console.log("Fetch error " + error);
      });
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
