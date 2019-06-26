import React, { Component } from 'react';
import MapGL, { Source, Layer, NavigationControl, GeolocateControl } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { center } from '@turf/turf';
import bus_list from './bus_list.json';
import Draw from '@urbica/react-map-gl-draw';
import { Label } from 'semantic-ui-react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
class App extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        latitude: 51.0486,
        longitude: -114.0708,
        zoom: 11
      },
      mapColor: 'mapbox://styles/mapbox/streets-v11',
      selected_bus: 1,
      dataGeo: null,
      turfCenter: null,
      turfCoord: null
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.radioChange = this.radioChange.bind(this);
  }

  radioChange(e) {
    console.log(e.currentTarget.value);
    this.setState({
      mapColor: e.currentTarget.value
    });
  }

  handleSelect(e) {
    let selection = e.target.value;
    this.setState({selected_bus: selection});

    let geojson = 'https://data.calgary.ca/resource/hpnd-riq4.geojson?route_short_name='+ this.state.selected_bus;

    fetch(geojson).then(response => response.json());
    this.setState({dataGeo: geojson});

    // this.setState({turfCenter: center(dataGeo)});
    // this.setState({turfCoord: turfCenter.geometry.coordinates});

    // this.setState({viewport: turfCoord});
  }

  render() {
    const selectStyle = {
      display: "inline-block", 
      zIndex: 999,
      position: "absolute", 
      height: "40px",
      width:"450px",
      padding: "10px",
      top:"60px", 
      left:"5px", 
      fontSize:"17px",
      border: "none",
      borderRadius: "3px",
      color: "#fff",
      background: "#6d6d6d", 
      fontStyle:"bold", outline:"none"
    };

    const radioStyle = {
      zIndex: 999,
      position: "absolute",
      background: '#fff',
      padding: '10px',
      borderRadius: '10px',
      top: '10px',
      left: '5px',
      float: 'right'
    };

    let items = bus_list.map((bus) => 
    <option key={bus.route_short_name} value={bus.route_short_name}>{bus.route_short_name+" - "+bus.route_long_name}</option>); 
    
    return(
      <div>
        <select 
          onChange={this.handleSelect} 
          value={this.state.value}  
          style={selectStyle}>
          {items}
        </select>

        <div id ='menu' style={radioStyle} >
          <input id='streets-v11' type='radio' name='rtoggle' value='mapbox://styles/mapbox/streets-v11' onChange={this.radioChange}/>
          <Label for='streets'>streets</Label>
          <input id='light-v10' type='radio' name='rtoggle' value='mapbox://styles/mapbox/light-v10' onChange={this.radioChange}/>
          <Label for='light'>light</Label>
          <input id='dark-v10' type='radio' name='rtoggle' value='mapbox://styles/mapbox/dark-v10' onChange={this.radioChange}/>
          <Label for='dark'>dark</Label>
          <input id='outdoors-v11' type='radio' name='rtoggle' value='mapbox://styles/mapbox/outdoors-v11' onChange={this.radioChange}/>
          <Label for='outdoors'>outdoors</Label>
          <input id='satellite-v9' type='radio' name='rtoggle' value='mapbox://styles/mapbox/satellite-v9' onChange={this.radioChange}/>
          <Label for='satellite'>satellite</Label>
        </div>

        <MapGL
          style = {{ width: '100%', height: '650px' }}
          mapStyle = {this.state.mapColor}
          accessToken={'pk.eyJ1IjoiY2h5cHJpY2lsaWEiLCJhIjoiY2p2dXpnODFkM3F6OTQzcGJjYWgyYmIydCJ9.h_AlGKNQW-TtUVF-856lSA'}
          
          latitude = {this.state.viewport.latitude}
          longitude = {this.state.viewport.longitude}
          zoom = {this.state.viewport.zoom}
          onViewportChange = {viewport => this.setState({ viewport })}
        >
          
          <Source id='route' type='geojson' data={this.state.dataGeo} />
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
          <GeolocateControl position='top-right' />
          <NavigationControl showCompass showZoom position='top-right' />

          <Draw/>
        </MapGL> 
      </div>
    );
  }
}
export default App;
