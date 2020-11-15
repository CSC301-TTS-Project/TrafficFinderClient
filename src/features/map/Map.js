import React from 'react';
import mapboxgl from 'mapbox-gl';
import { getHereToken, getMapboxToken } from './mapActions';
import "./Map.module.css";
import Menu from "../menu/Menu"


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
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
  }
  componentWillUnmount() {
    this.map.remove()
  }
  render() {
    return <div className={'map'} ref={e => (this.container = e)} >
      <Menu/>

    </div>
  }
}

export default Map
