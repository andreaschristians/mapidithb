import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapGL, {
  NavigationControl,
  AttributionControl,
  Source,
  Layer,
  FeatureState,
  Popup, 
  GeolocateControl,
  Marker
} from '@urbica/react-map-gl';
import Draw from '@urbica/react-map-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {
  Button,
  Icon,
  Label,
  Grid,
  Segment,
  Input,
  Table,
  Tab,
  List,
  Image,
  Card,
  Sidebar,
  Menu,
  Header,
  Modal,
  Form, 
  Radio
} from 'semantic-ui-react';
import { randomPoint } from '@turf/random';
import Cluster from '@urbica/react-map-gl-cluster';
import DrawControl from "react-mapbox-gl-draw";

class App extends Component {
  
  constructor() {
    super() 
    this.state = {
      viewport: {
        latitude: 37.78,
        longitude: -122.41,
        zoom: 11
      },
      mapColor: 'mapbox://styles/mapbox/streets-v11',
      currentPos: null,
      features: []
    };
    this.updateDimensions = this.updateDimensions.bind(this); // <-- Contoh deklarasi functions/methods
    this.radioChange = this.radioChange.bind(this);
    this.getPosition = this.getPosition.bind(this);


    // const { point } = require('@turf/helpers');
    // const distance = require('@turf/distance').default;
    
    // let pt1 = point([8.534860, 11.999970]);
    // let pt2 = point([3.39467, 6.45407]);
    // let result = distance(pt1, pt2, { units: 'kilometers' });
    
    // console.log(`Distance : ${result} KM`);
  }

  componentWillMount() {
    // <-- Event Method bawaan react
    this.updateDimensions();
  }

  componentDidMount() {
    // <-- Event Method bawaan react
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    // <-- Event Method bawaan react
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    // <-- Function bikinan sendiri untuk mengatur tampilan dimensi peta
    const height = window.innerWidth >= 992 ? window.innerHeight : 400;
    this.setState({ height: height });
  }
  
  radioChange(e) {
    console.log(e.currentTarget.value);
    this.setState({
      mapColor: e.currentTarget.value
    });
  }
  
  getPosition(e) {
    this.setState({ currentPos: e.latlng });
  }

  render() {
    const position = [this.state.viewport.latitude, this.state.viewport.longitude];
    const changeStyle = {
      zIndex: 999,
      position: "absolute",
      background: '#fff',
      padding: '10px',
      borderRadius: '10px',
      marginTop: '10px',
      marginLeft: '5px'
    };

    const style = {
      width: '20px',
      height: '20px',
      color: '#fff',
      background: '#1978c8',
      borderRadius: '20px',
      textAlign: 'center'
    };

    const bbox = [-160, -70, 160, 70];
    const points = randomPoint(50, { bbox }).features;
    points.forEach((point, index) => (point.id = index));

    const ClusterMarker = ({ longitude, latitude, pointCount }) => (
      <Marker longitude={longitude} latitude={latitude}>
        <div style={{ ...style, background: '#f28a25' }}>{pointCount}</div>
      </Marker>
    );

    return ( 

      <div class = "map-container" style={{ height: this.state.height }}>
        <div id ='menu' style={changeStyle} >
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

          <GeolocateControl position='top-right' />
          <NavigationControl showCompass showZoom position='top-right' />

          <Cluster radius={40} extent={512} nodeSize={64} component={ClusterMarker}>
            {points.map(point => (
              <Marker
                key={point.id}
                longitude={point.geometry.coordinates[0]}
                latitude={point.geometry.coordinates[1]}
              >
                <div style={style} />
              </Marker>
            ))}
          </Cluster> 

          <Draw
            onDrawCreate={({features}) => this.setState({features})}
            onDrawUpdate={({features}) => this.setState({features})}
          />
        </MapGL>  
        
      </div>  
    )
  }

}

export default App;
