import {isEqual} from 'lodash';

const removePath = (map, index, paths, matchExact = false) => {
  const data = paths[index];

  console.log("Remove path " + index)

  const { lng: end_lng, lat: end_lat } = data.end_node;
  const coords = data.coordinates;
  console.log("Initial Map data: ")
  const sourceData = map.getSource("lines")["_data"];
  console.log(sourceData);
  let newFeatures = [...map.getSource("lines")["_data"].features];
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
  map.getSource("lines").setData({
    ...sourceData,
    features: newFeatures,
  });
  console.log("Final Remove Map Data: ")
  console.log(map.getSource("lines")["_data"]);
};

export default removePath;
