import React from "react";
import mapboxgl from "mapbox-gl";
import { getHereToken, getMapboxToken } from "./mapActions";
import "./Map.module.css";
import Menu from "../menu/Menu";
import { ENDPOINT } from "./../requests";
import ReactDOM from "react-dom";
import styles from "./Map.module.css";
import { isEqual } from "lodash";
import SelectInput from "@material-ui/core/Select/SelectInput";

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

  findMarkerIndex = (markerId) => {
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
    return deletionIndex
  }

  markerDeletionWindow = (markerId) => (
    <div className={styles.popUpContents}>
      <h3>Are you sure you want to delete the marker?</h3>
      <div className={styles.popUpContents}>
        <button
          className={styles.primaryBtn}
          onClick={() => {
            const marker = this.state.markersDetailInfo[markerId];

            marker.remove();

            // find the index of the deletion marker in the path
            let deletionIndex = this.findMarkerIndex(markerId)
            const routeId = 0;
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
        // console.log("the marker itself has been clicked is");
        console.log(this.state.markerDeletionWindowOpen);
        this.addToRoute(
          e.lngLat,
          this.state.route_index,
          this.state.paths.length
        );
      }
    });
  }

  removePath = (index, paths, matchExact=false) => {
    const data = paths[index];

    console.log("Remove path " + index)

    const { lng: end_lng, lat: end_lat } = data.end_node;
    const coords = data.coordinates;
    console.log("Initial Map data: ")
    const sourceData = this.map.getSource("lines")["_data"];
    console.log(sourceData);
    let newFeatures = [...this.map.getSource("lines")["_data"].features];
    //Iterating in reverse so that modifying newFeatures while looping works

    console.log("Pruning for: ");
    console.log(data)

    let spliceCount = 0;
    for (let i = newFeatures.length - 1; i >= 0; i--) {
      let featObjCoords = newFeatures[i]["geometry"]["coordinates"];
      if (featObjCoords.length === 0) {
        if (index === 0) {
          newFeatures.splice(i, 1);
          spliceCount++;
        }
      } else if (
        isEqual(new Set(featObjCoords), new Set(coords)) ||
        (end_lng === featObjCoords[0][0] && end_lat === featObjCoords[0][1] && !matchExact)
      ) {
        newFeatures.splice(i, 1);
        spliceCount++;
      }
    }
    console.log("SpliceCount: " + spliceCount);
    this.map.getSource("lines").setData({
      ...sourceData,
      features: newFeatures,
    });
    console.log("Final Remove Map Data: ")
    console.log(this.map.getSource("lines")["_data"]);
  };

  drawPath = (index, paths) => {
    const data = paths[index];
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

    const sourceData = this.map.getSource("lines")["_data"];
    let newFeatures = [...sourceData.features];
    newFeatures.push(newLine);

    this.map.getSource("lines").setData({
      ...sourceData,
      features: newFeatures,
    });

    console.log("Final Draw Map Data: ")
    console.log(this.map.getSource("lines")["_data"]);
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
      .setDraggable(true)
      .addTo(this.map);

    const currentMarkersInfo = this.state.markersDetailInfo;
    currentMarkersInfo[nodeIndex] = new_node;
    this.setState({ markersDetailInfo: currentMarkersInfo });

    const existingMakerInOrder = this.state.orderedMarkerIds;
    existingMakerInOrder.push(this.state.numMarkers);
    this.setState({ orderedMarkerIds: existingMakerInOrder });
    this.setState({ numMarkers: this.state.numMarkers + 1 });

    let html_element = new_node.getElement();
    html_element.addEventListener("click", () => {
      this.setState({ markerDeletionWindowOpen: true });
      console.log(nodeIndex);
    });

    new_node.on('dragend', () => {
      this.modifyRoute(new_node.getLngLat(), 0, this.findMarkerIndex(nodeIndex), (lng, lat) => {
        new_node.setLngLat([lng, lat])
      })
    });

    if (!this.state.isBuildingPath) {
      //First insert_node call has been made: start_node coords == end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      this.setState({ paths: newPaths, isBuildingPath: true });
    } else if (this.state.isBuildingPath) {
      //Second insert call has been made and start_node coords !== end_node coords
      const newPaths = this.state.paths;
      newPaths.push(obj);
      this.setState(
        { paths: newPaths },
        this.drawPath(this.state.paths.length - 1, this.state.paths)
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
          this.addMarker(data[index], index);
        });
      })
      .catch((error) => {
        console.log("Fetch error " + error);
      });
  }

  deleteFromRoute(route, index) {
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
    if (new_paths.length === 0) {
      return;
    }
    this.removePath(index, this.state.paths);
    new_paths.splice(index, 1);
    for (const [idx, value] of Object.entries(data)) {
      this.removePath(idx, this.state.paths);
      new_paths[idx] = value;
      this.setState({ paths: new_paths });
      if (new_paths.length === 0) {
        return;
      }
      this.drawPath(idx, this.state.paths);
    }
    this.setState({
      paths: new_paths,
    });
  }

  modifyRoute(lngLat, route, index, markerCoordsCallback) {
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
          console.log(data);
          let new_paths = JSON.parse(JSON.stringify(this.state.paths));
          for (let [idx, value] of Object.entries(data["segment_updates"])) {
            if (parseInt(idx) > 0) {
              console.log("Removing path: " + idx)
              this.removePath(idx, new_paths, true);
              new_paths[idx] = value;
            }
          }
          for (let [idx, value] of Object.entries(data["segment_updates"])) {
            if (parseInt(idx) > 0) {
              this.drawPath(idx, new_paths);
            }
          }
          markerCoordsCallback(data["new_node"].lng, data["new_node"].lat);
          this.setState({ paths: new_paths });
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
