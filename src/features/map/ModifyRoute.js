import {ENDPOINT} from '../requests';
import removePath from './RemovePath';
import {connect} from 'react-redux';
import {
  setMarkerDetailsInfo,
  setNumMarkers,
  setOrderedMarkerIds,
  setPaths,
} from '../../reducers/actions';
import drawPath from './DrawPath';

const modifyRoute = (map, lngLat, route, index, markerCoordsCallback) => {
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
        let new_paths = JSON.parse(JSON.stringify(this.props.paths));
        for (let [idx, value] of Object.entries(data["segment_updates"])) {
          if (parseInt(idx) > 0) {
            console.log("Removing path: " + idx)
            removePath(map, idx, new_paths, true);
            new_paths[idx] = value;
          }
        }
        for (let [idx, value] of Object.entries(data["segment_updates"])) {
          if (parseInt(idx) > 0) {
            drawPath(map, idx, new_paths);
          }
        }
        markerCoordsCallback(data["new_node"].lng, data["new_node"].lat);
        this.props.setPaths(new_paths);
      });
    })
    .catch((error) => {
      console.log("Fetch error " + error);
    });
};

const mapStateToProps = state => {
  return {
    paths: state.paths,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    setPaths: paths => dispatch(setPaths(paths)),
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(modifyRoute);
