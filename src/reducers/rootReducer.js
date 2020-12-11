import {
  ADD_ARTICLE, SET_MARKER_DETAILS_INFO,
  SET_NUM_MARKERS,
  SET_ORDERED_MARKER_IDS,
  SET_PATHS,
} from './action-types';

const initialState = {
  articles: [],

  routeIndex: 0,
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

function rootReducer(state=initialState, action){
  if (action.type === SET_NUM_MARKERS){
    return Object.assign({}, state, {
      numMarkers: action.payload
    });
  }
  if (action.type === SET_ORDERED_MARKER_IDS){
    return Object.assign({}, state, {
      orderedMarkerIds: action.payload
    });
  }
  if (action.type === SET_MARKER_DETAILS_INFO){
    return Object.assign({}, state, {
      markersDetailInfo: action.payload
    });
  }
  if (action.type === SET_PATHS){
    return Object.assign({}, state, {
      paths: action.payload
    });
  }
  return state;
};

export default rootReducer;
