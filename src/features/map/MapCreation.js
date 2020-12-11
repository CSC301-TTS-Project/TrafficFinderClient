import React from "react";
import mapboxgl from "mapbox-gl";
import "./Map.module.css";
import Menu from "../menu/Menu";
import { ENDPOINT } from "./../requests";
import ReactDOM from "react-dom";
import styles from "./Map.module.css";
import { isEqual } from "lodash";
import SelectInput from "@material-ui/core/Select/SelectInput";

export default function removeMarker(data, index) {
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

