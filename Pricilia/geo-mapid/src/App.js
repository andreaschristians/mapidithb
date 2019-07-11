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
  Label,
  Segment,
  Table,
  Select
} from 'semantic-ui-react';
import { center, distance, feature, area } from '@turf/turf';
import { point, polygon, round } from '@turf/helpers';
import { randomPoint } from '@turf/random';
import Cluster from '@urbica/react-map-gl-cluster';
import DrawControl from "react-mapbox-gl-draw";
import bus_list from './bus_list.json';

var coordinates = [];
class App extends Component {
  
  constructor() {
    super() 
    this.state = {
      viewport: {
        latitude: 51.0486,
        longitude: -114.0708,
        zoom: 11
      },
      mapColor: 'mapbox://styles/mapbox/streets-v11',
      data: {
        type: "FeatureCollection",
        features: []
      },
      distance: 0,
      coordinates: [],
      area: 0,
      selected_bus: 1,
      dataGeo: null
    };
    this.updateDimensions = this.updateDimensions.bind(this); // <-- Contoh deklarasi functions/methods
    this.radioChange = this.radioChange.bind(this);
    this.setOnChange = this.setOnChange.bind(this);
    this.setInitialProperties = this.setInitialProperties.bind(this);
    this.clearTable = this.clearTable.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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

  setOnChange(data) {
    this.setState({data: data});
    console.log("tess"+this.state.data[0].coordinates);
  }

  setInitialProperties(features) {
    var i;
    var l = features[0].geometry.coordinates.length;
    if (features[0].geometry.type == "Point") {
      this.setState({
        data: {
          features: [...this.state.data.features, {features}]
        }
      });
      
      coordinates.push(<Table.Row>
        <Table.Cell>{ features[0].geometry.coordinates[0] }</Table.Cell>
        <Table.Cell>{ features[0].geometry.coordinates[1] }</Table.Cell>
      </Table.Row>);
      this.setState({coordinates: coordinates});

    } else if (features[0].geometry.type == "LineString") {
      this.setState({
        data: {
          features: features
        }
      });
      
      if (l <= 2) {
        var p1 = point(features[0].geometry.coordinates[0]);
        var p2 = point(features[0].geometry.coordinates[1])
        var result = round(distance(p1, p2, { units: 'kilometers' }));
        this.setState({ distance: result });
        for (i = 0; i < l; i++) {
          coordinates.push(<Table.Row>
            <Table.Cell>{ features[0].geometry.coordinates[i][0] }</Table.Cell>
            <Table.Cell>{ features[0].geometry.coordinates[i][1] }</Table.Cell>
          </Table.Row>);
        }
        this.setState({coordinates: coordinates});
      } else {
        for (i = 0; i < l; i++) {
          coordinates.push(<Table.Row>
            <Table.Cell>{ features[0].geometry.coordinates[i][0] }</Table.Cell>
            <Table.Cell>{ features[0].geometry.coordinates[i][1] }</Table.Cell>
          </Table.Row>);
        }
        this.setState({coordinates: coordinates});
      }
    } else if (features[0].geometry.type == "Polygon") {
      var x = features[0].geometry.coordinates[0].length;
      console.log(features[0].geometry.coordinates[0][0][0]);
      var p = polygon(features[0].geometry.coordinates);
      var a = round(area(p));
      for (i = 0; i < x; i++) {
        coordinates.push(<Table.Row>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][0] }</Table.Cell>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][1] }</Table.Cell>
        </Table.Row>);
      }
      this.setState({coordinates: coordinates, area: a});

    }
  }

  clearTable(e) {
    coordinates = [];
    this.setState({ 
      coordinates: [], 
      distance: 0,
      area: 0 
    });
  }

  updateDimensions() {
    // <-- Function bikinan sendiri untuk mengatur tampilan dimensi peta
    const height = window.innerWidth >= 992 ? window.innerHeight : 650;
    this.setState({ height: height });
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
  }

  render() {
    const changeStyle = {
      zIndex: 999,
      position: "absolute",
      background: "#fff",
      padding: "10px",
      borderRadius: "10px",
      top: "10px",
      left: "10px"
    };

    const tableStyle = {
      zIndex: 999,
      position: "absolute",
      top: "80px",
      left: "10px"
    };

    const selectStyle = {
      display: "inline-block", 
      zIndex: 999,
      position: "absolute", 
      height: "40px",
      width:"450px",
      padding: "10px",
      top:"10px", 
      left:"400px", 
      fontSize:"17px",
      border: "none",
      borderRadius: "3px",
      color: "#fff",
      background: "#6d6d6d", 
      fontStyle:"bold", outline:"none"
    };

    let items = bus_list.map((bus) => 
    <option key={bus.route_short_name} value={bus.route_short_name}>{bus.route_short_name+" - "+bus.route_long_name}</option>); 

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

        <div>
          <select 
            onChange={this.handleSelect} 
            value={this.state.value}  
            style={selectStyle}>
            {items}
          </select>
        </div>  

        <div style={tableStyle}>
          <Segment style={{overflow: 'auto', maxHeight: 200 }}>
            <Table >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Longtitude</Table.HeaderCell>
                  <Table.HeaderCell>Latitude</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                { this.state.coordinates }
              </Table.Body>
            </Table>
          </Segment>
          
          <Segment>Distance: { this.state.distance } KM</Segment>
          <Segment>Area: { this.state.area } KM<sup>2</sup></Segment>
          <Segment> 
          <Button onClick={ this.clearTable }>Clear</Button>
          </Segment>
        </div>

        <MapGL
          style = {{ width: '100%', height: '100%' }}
          mapStyle = {this.state.mapColor}
          accessToken={'pk.eyJ1IjoiY2h5cHJpY2lsaWEiLCJhIjoiY2p2dXpnODFkM3F6OTQzcGJjYWgyYmIydCJ9.h_AlGKNQW-TtUVF-856lSA'}
          latitude = {this.state.viewport.latitude}
          longitude = {this.state.viewport.longitude}
          zoom = {this.state.viewport.zoom}
          onViewportChange = {viewport => this.setState({ viewport })}
        >
          
          <GeolocateControl position='top-right' />
          <NavigationControl showCompass showZoom position='top-right' />

          <Draw
            onDrawCreate={({ features }) => {
              this.setInitialProperties(features );
            }}
          />
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

        </MapGL>  
      </div>  
    )
  }
}

export default App;
