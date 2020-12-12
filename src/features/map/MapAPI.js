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

export const getRoute = (authToken) => {
  authenticatedFetch(`${ENDPOINT}/api/getRoute`, authToken, {
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
          return pathNodes;
        });
      }
    })
    .catch((error) => {
      console.log("Could not get route data: " + error);
      return null;
    });
};
