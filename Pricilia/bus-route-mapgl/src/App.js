import React, { Component } from 'react';
import MapGL, { CustomLayer, Source, Layer } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import logo from './logo.svg';
import './App.css';
import { center } from '@turf/turf';
import bus_list from './bus_list.json';
import { MapboxLayer } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
class App extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        latitude: 51.0486,
        longitude: -114.0708,
        zoom: 11
      },
      selected_bus: 1,
      data: null
    };
    // this.handleSelect = this.handleSelect.bind(this);
  }

  // handleSelect(e) {
  //   let selection = e.target.value;

  //   this.setState({selected_bus: selection}, () => {
  //     let geojson = 'https://data.calgary.ca/resource/hpnd-riq4.geojson?route_short_name='+this.state.selected_bus 

  //     fetch(geojson)
  //       .then(response => response.json())
  //       .then(data => {
  //         let turf_center = center(data);
  //         let center_coord = turf_center.geometry.coordinates;

  //         const newVewport = {
  //           ...this.state.viewport,
  //           latitude: turf_center.latitude,
  //           longitude: turf_center.longitude,
  //           zoom: 12
  //         };
          
  //         this.setState({ viewport: newVewport });
  //         console.log(turf_center);
  //       })
  //       this.setState({data: geojson});
  //   });
  // }

  render() {
    let items = bus_list.map((bus) => 
    <option key={bus.route_short_name} value={bus.route_short_name}>{bus.route_short_name+" - "+bus.route_long_name}</option>); 
    
    const myDeckLayer = new MapboxLayer({
      id: 'my-scatterplot',
      type: ScatterplotLayer,
      data: [{ position: [-74.5, 40], size: 1000 }],
      getPosition: d => d.position,
      getRadius: d => d.size,
      getColor: [255, 0, 0]
    });

      let geojson = 'https://data.calgary.ca/resource/hpnd-riq4.geojson?route_short_name=1'

      fetch(geojson)
        .then(response => response.json())
    
    return(
      <div>
        <select onChange={this.handleSelect} 
          value={this.state.value}  
          style={{display: "inline-block", 
          zIndex: 999,
          position: "absolute", 
          height: "40px",
          width:"450px",
          padding: "10px",
          top:"40px", 
          left:"40px", 
          fontSize:"17px",
          border: "none",
          borderRadius: "3px",
          color: "#fff",
          background: "#6d6d6d", 
          fontStyle:"bold", outline:"none"}}>
            {items}
          </select>
          
        <MapGL
          style = {{ width: '100%', height: '650px' }}
          mapStyle = {'mapbox://styles/mapbox/streets-v11'}
          accessToken={'pk.eyJ1IjoiY2h5cHJpY2lsaWEiLCJhIjoiY2p2dXpnODFkM3F6OTQzcGJjYWgyYmIydCJ9.h_AlGKNQW-TtUVF-856lSA'}
          
          latitude = {this.state.viewport.latitude}
          longitude = {this.state.viewport.longitude}
          zoom = {this.state.viewport.zoom}
          onViewportChange = {viewport => this.setState({ viewport })}
        >
          
          <Source id='route' type='geojson' data={geojson} />
          <Layer
            id='route'
            type='line'
            source='route'
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#888',
              'line-width': 8
            }}
          />
        </MapGL> 
      </div>
    );
  }
}
export default App;
