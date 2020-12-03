import React from "react";
import mapboxgl from "mapbox-gl";
import {
    getHereToken,
    getMapboxToken
} from "./mapActions";
import "./Map.module.css";
import Menu from "../menu/Menu";
import {
    ENDPOINT
} from "./../requests";

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
            fetch(`${ENDPOINT}/api/getRoute`, {
                    method: "POST",
                    //Fetch first and only route on map
                    body: JSON.stringify({
                        route: 0
                    }),
                })
                .then((response) => {
                    if (response.status !== 200) {
                        console.log("Internal error, status code: " + response.status);
                    } else {
                        response.json().then((data) => {
                            const pathNodes = data;
                            for (let i = 0; i < pathNodes.length; i++) {
                                this.addMarker(pathNodes[i], i);
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.log("Could not get route data: " + error);
                });
        });

        this.map.on("mousedown", (e) => {
            if (e.originalEvent.button === 0) {
                this.addToRoute(
                    e.lngLat,
                    this.state.route_index,
                    this.state.paths.length
                );
            } else {
                this.deleteFromRoute(this.state.route_index, 0);
            }
        });
    }

    removePath = (index) => {
        const data = this.state.paths[index];
        const coords = data.coordinates;
        const newLine = {
            type: "Feature",
            properties: {
                color: "#000000",
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

    drawPath = (index) => {
        const data = this.state.paths[index];
        const coords = data.coordinates;
        const newLine = {
            type: "Feature",
            properties: {
                color: "#9A21F9",
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

    addMarker(nodeObj, index) {
        // const { lng, lat } = lngLat;
        const lng = nodeObj["end_node"]["lng"];
        const lat = nodeObj["end_node"]["lat"];

        if (!this.state.isBuildingPath) {
            let new_node = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(this.map);
            let html_element = new_node.getElement();
            html_element.addEventListener("click", () => {
                console.log("Want to delete Node: " + index);
                this.deleteFromRoute(this.state.route_index, index);
            });
            //First insert_node call has been made: start_node coords == end_node coords
            const newPaths = this.state.paths;
            newPaths.push(nodeObj);
            this.setState({
                paths: newPaths
            });
            this.setState({
                isBuildingPath: true
            });
            console.log("Ran as first node");
        } else if (this.state.isBuildingPath) {
            new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
            //Second insert call has been made and start_node coords !== end_node coords
            const newPaths = this.state.paths;
            newPaths.push(nodeObj);

            this.setState({
                    paths: newPaths
                },
                this.drawPath(this.state.paths.length - 1)
            );
        }
    }

    addToRoute(lngLat, route, index) {
        const {
            lng,
            lat
        } = lngLat;
        const body = {
            index,
            route,
            lat,
            lng,
        };
        console.log(`${ENDPOINT}/api/insertNode`)
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
        let new_paths = this.state.paths;
        if (new_paths.length == 0) {
            return;
        }
        this.removePath(index);
        new_paths.splice(index, 1);
        let to_change = index;
        let j = 0;
        for (let i = 0; i < this.state.paths.length; i++) {
            console.log(new_paths[i]);
            if (i === to_change - 1) {
                console.log(data[to_change]);
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
        this.setState({
            paths: new_paths
        });
        if (new_paths.length == 0) {
            return;
        }
        this.drawPath(j);
    }

    modifyRoute(lngLat, route, index) {
        const {
            lng,
            lat
        } = lngLat;
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
        return ( <
            div className = {
                "map"
            }
            ref = {
                (e) => (this.container = e)
            } >
            <
            Menu / >
            <
            /div>
        );
    }
}

export default Map;
