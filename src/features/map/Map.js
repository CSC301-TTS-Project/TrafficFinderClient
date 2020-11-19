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

    // add markers/nodes

    this.map.on("click", (e) => {
      this.addMarker(e.lngLat);
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

    //Add Feature object to features array to add points
    // Example new line uncomment when needed
    // const newLine = {
    //   type: "Feature",
    //   properties: {
    //     // color: "#B5B5FE" // soft purple
    //     color: "#9A21F9", // stronger purple
    //   },
    //   geometry: {
    //     type: "LineString",
    //     coordinates: [
    //       [-79.38673711108461, 43.66996947185447],
    //       [-79.38304639148025, 43.66133919773779],
    //     ],
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
  addMarker(lngLat) {
    const { lng, lat } = lngLat;
    console.log("selected lng: ", lng);
    console.log("selected lat: ", lat);

    if (!this.state.isBuildingPath) {
      new mapboxgl.Marker()
        .setLngLat([-79.38673711108461, 43.66996947185447])
        .addTo(this.map);
      //First insert_node call has been made: start_node coords == end_node coords
      this.setState({ isBuildingPath: true });
    } else if (this.state.isBuildingPath) {
      new mapboxgl.Marker()
        .setLngLat([-79.38304639148025, 43.66133919773779])
        .addTo(this.map);
      //Second insert call has been made and start_node coords !== end_node coords
      const newPaths = this.state.paths;
      newPaths.push({
        start_node: {
          id: 30326191,
          lat: 43.75079,
          lng: -79.63473,
        },
        end_node: {
          id: 863384075,
          lat: 43.74475,
          lng: -79.61023,
        },
        coordinates: [
          [
            [-79.63473, 43.75079],
            [-79.63478, 43.75069],
            [-79.63493, 43.75023],
            [-79.63525, 43.74928],
            [-79.63449, 43.74915],
            [-79.63422, 43.7491],
            [-79.63408, 43.74907],
            [-79.63368, 43.74901],
            [-79.63318, 43.74886],
            [-79.63295, 43.74863],
            [-79.63243, 43.74774],
            [-79.63183, 43.74789],
            [-79.63147, 43.74798],
            [-79.63134, 43.74801],
            [-79.63111, 43.74806],
            [-79.63092, 43.7481],
            [-79.63076, 43.74813],
            [-79.63061, 43.74815],
            [-79.63048, 43.74817],
            [-79.63039, 43.74818],
            [-79.63025, 43.74819],
            [-79.6301, 43.7482],
            [-79.62987, 43.74821],
            [-79.62969, 43.74821],
            [-79.6295, 43.7482],
            [-79.62934, 43.74819],
            [-79.62912, 43.74817],
            [-79.62887, 43.74814],
            [-79.62865, 43.74811],
            [-79.62848, 43.74808],
            [-79.62822, 43.74803],
            [-79.62745, 43.74789],
            [-79.62683, 43.74778],
            [-79.62615, 43.74766],
            [-79.62579, 43.74759],
            [-79.62569, 43.74757],
            [-79.62502, 43.74745],
            [-79.6242, 43.7473],
            [-79.62307, 43.7471],
            [-79.62286, 43.74707],
            [-79.62265, 43.74703],
            [-79.62235, 43.74698],
            [-79.62196, 43.74691],
            [-79.62134, 43.74678],
            [-79.6211, 43.74673],
            [-79.62073, 43.74666],
            [-79.62018, 43.74656],
            [-79.61954, 43.74645],
            [-79.61926, 43.7464],
            [-79.61883, 43.74632],
            [-79.61836, 43.74623],
            [-79.61781, 43.74613],
            [-79.61677, 43.74594],
            [-79.61652, 43.74589],
            [-79.61626, 43.74584],
            [-79.61602, 43.7458],
            [-79.61533, 43.74569],
            [-79.61491, 43.74562],
            [-79.61428, 43.74551],
            [-79.6138, 43.74541],
            [-79.61349, 43.74535],
            [-79.6126, 43.74518],
            [-79.61183, 43.74504],
            [-79.61096, 43.74488],
            [-79.61023, 43.74475],
          ],
        ],
      });
      this.setState({ paths: newPaths }, this.drawPath);
    }
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
