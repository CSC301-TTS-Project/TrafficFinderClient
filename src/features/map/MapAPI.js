import { isEqual } from "lodash";
import { ENDPOINT, authenticatedFetch } from "../requests";

export const drawPath = (map, index, paths) => {
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

  const sourceData = map.getSource("lines")["_data"];
  let newFeatures = [...sourceData.features];
  newFeatures.push(newLine);

  map.getSource("lines").setData({
    ...sourceData,
    features: newFeatures,
  });

  console.log("Final Draw Map Data: ");
  console.log(map.getSource("lines")["_data"]);
};

export const removePath = (map, index, paths, matchExact = false) => {
  const data = paths[index];

  console.log("Remove path " + index);

  const { lng: end_lng, lat: end_lat } = data.end_node;
  const coords = data.coordinates;
  console.log("Initial Map data: ");
  const sourceData = map.getSource("lines")["_data"];
  console.log(sourceData);
  let newFeatures = [...map.getSource("lines")["_data"].features];
  //Iterating in reverse so that modifying newFeatures while looping works

  console.log("Pruning for: ");
  console.log(data);

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
      (end_lng === featObjCoords[0][0] &&
        end_lat === featObjCoords[0][1] &&
        !matchExact)
    ) {
      newFeatures.splice(i, 1);
      spliceCount++;
    }
  }
  console.log("SpliceCount: " + spliceCount);
  map.getSource("lines").setData({
    ...sourceData,
    features: newFeatures,
  });
  console.log("Final Remove Map Data: ");
  console.log(map.getSource("lines")["_data"]);
};

export const getRoute = (app)=> {
  authenticatedFetch(`${ENDPOINT}/api/getRoute`, app.props.usrAuthToken, {
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
            app.insertNode(pathNodes[i]);
          }
        });
      }
    })
    .catch((error) => {
      console.log("Could not get route data: " + error);
      return null;
    });
};

export const getAPIKeys=  (app) => {
  authenticatedFetch(`${ENDPOINT}/api/getKeys`, app.props.usrAuthToken, {
  method: "GET",
})
  .then((response) => {
    if (response.status !== 200) {
      console.log("Internal error, status code: " + response.status);
    } else {
      response.json().then((data) => {
        app.mapCreation(data["MAPBOX_PUBLIC_KEY"]);
      });
    }
  })
  .catch((error) => {
    console.log("Could not fetch API keys: " + error);
  });
}

export const insertNode = (app,body, index) => {
  authenticatedFetch(`${ENDPOINT}/api/insertNode`, app.props.usrAuthToken, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status !== 200) {
        console.log("There was a problem, Status code: " + response.status);
        return;
      }
      response.json().then((data) => {
        app.insertNode(data[index], index);
      });
    })
    .catch((error) => {
      console.log("Fetch error " + error);
    });
}

export const deleteNode = (app,body, index) => {
  authenticatedFetch(`${ENDPOINT}/api/deleteNode`, app.props.usrAuthToken, {
    method: "DELETE",
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status !== 200) {
        console.log("There was a problem, Status code: " + response.status);
        return;
      }
      response.json().then((data) => {
        app.removeNode(data, index);
      });
    })
    .catch((error) => {
      console.log("Fetch error " + error);
    });
}

export const modifyNode = (app, body, markerCoordsCallback)=> {
  authenticatedFetch(`${ENDPOINT}/api/modifyNode`, app.props.usrAuthToken, {
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
        let new_paths = JSON.parse(JSON.stringify(app.state.paths));
        for (let [idx, value] of Object.entries(data["segment_updates"])) {
          if (parseInt(idx) > 0) {
            console.log("Removing path: " + idx);
            removePath(app.map, idx, new_paths, true);
            new_paths[idx] = value;
          }
        }
        for (let [idx, value] of Object.entries(data["segment_updates"])) {
          if (parseInt(idx) > 0) {
            drawPath(app.map, idx, new_paths);
          }
        }
        markerCoordsCallback(data["new_node"].lng, data["new_node"].lat);
        app.setState({ paths: new_paths });
      });
    })
    .catch((error) => {
      console.log("Fetch error " + error);
    });
}