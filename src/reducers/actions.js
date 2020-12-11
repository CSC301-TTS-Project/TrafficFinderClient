import {
  ADD_ARTICLE,
  SET_IS_BUILDING_PATH,
  SET_MARKER_DETAILS_INFO,
  SET_NUM_MARKERS,
  SET_ORDERED_MARKER_IDS,
  SET_PATHS,
} from './action-types';

export function addArticle(payload){
  return {type: ADD_ARTICLE, payload}
};

export function setIsBuildingPath(payload){
  return {type: SET_IS_BUILDING_PATH, payload}
}

export function setNumMarkers(payload){
  console.log('dispatched!');
  console.log('the dispatched data is');
  console.log(payload);

  return {
    type: SET_NUM_MARKERS,
    payload: payload,
  }
}

export function setOrderedMarkerIds(payload){
  return {
    type: SET_ORDERED_MARKER_IDS,
    payload: payload,
  }
}

export function setMarkerDetailsInfo(payload){
  return {
    type: SET_MARKER_DETAILS_INFO,
    payload: payload
  }
}

export function setPaths(payload){
  return {
    type: SET_PATHS,
    payload: payload
  }
}


