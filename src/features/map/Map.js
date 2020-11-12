import React from 'react';
import mapboxgl from 'mapbox-gl';
import { getHereToken, getMapboxToken } from './mapActions';
import "./Map.module.css";


mapboxgl.accessToken = getMapboxToken();

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 43.6532,
      lng: -79.3832,
      zoom: 15
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
  }
  componentWillUnmount() {
    this.map.remove()
  }
  render() {
    return <div className={'map'} ref={e => (this.container = e)} />
  }
}

export default Map
