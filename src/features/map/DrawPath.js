const drawPath = (map, index, paths) => {
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

  console.log("Final Draw Map Data: ")
  console.log(map.getSource("lines")["_data"]);
};

export default drawPath;
