import React from 'react';
import './App.css';
import { Component } from 'react';
import ReactMapGL from 'react-map-gl';

class Map extends Component {

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  render() {

    return (

      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={'pk.eyJ1IjoiYW5kcmVhc2NocmlzdGlhbiIsImEiOiJjanZ2cnZhMjg0NWtmNDN1aTMxcGphY21xIn0.CDEBH4hJPmAhRDOtzz73Mw'}
        onViewportChange={(viewport) => this.setState({ viewport })}
      />
    );
  }
}
export default Map;
