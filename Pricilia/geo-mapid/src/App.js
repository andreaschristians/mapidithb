import React, { Component } from 'react';
import logo from './mapid-logo.png';
import geo from './geo-icon.png';
import mapid from './mapid-icon.png';
import elevation from './elevation.png';
import converter from './converter.png';
import distances from './distance.png';
import areas from './area.png';
import bufferpoint from './bufferpoint.png';
import bufferline from './bufferline.png';
import layer from './layer.png';
import './App.css';
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Marker
} from '@urbica/react-map-gl';
import Draw from '@urbica/react-map-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {
  Button,
  Table,
  Menu,
  Header,
  Image,
  Icon,
  List,
  Rail,
  Placeholder,
  Segment,
  Sidebar,
  Tab,
  Popup,
  Card,
  Form,
  Dropdown
} from 'semantic-ui-react';
import { center, distance, feature, area } from '@turf/turf';
import { point, polygon, round } from '@turf/helpers';
import DrawControl from "react-mapbox-gl-draw";
import { polices } from './polices.js';
import { cctv } from './cctv.js';

var coordinates = [];
var policestat = [];
var cctvmarker = [];
var tabElv = [];
var tabConv = [];
var polycoords = [];
var linecoords = [];
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h5cHJpY2lsaWEiLCJhIjoiY2p2dXpnODFkM3F6OTQzcGJjYWgyYmIydCJ9.h_AlGKNQW-TtUVF-856lSA';

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
      dataGeo: null,
      bColor: '',
      icon: 'eye slash',
      layerMenu: [
        {
          id: 0,
          name: 'NowMapidStory',
          icon: 'eye slash'
        },
        {
          id: 1,
          name: 'Cctv',
          icon: 'eye slash'
        },
        {
          id: 2,
          name: 'Reklamasi_Teluk_Jakarta',
          icon: 'eye slash'
        },
        {
          id: 3,
          name: 'Titik_Banjir_Jakarta_2014',
          icon: 'eye slash'
        },
        {
          id: 4,
          name: 'Tanjung_Duren',
          icon: 'eye slash'
        },
        {
          id: 5,
          name: 'Survey_Tanjung_Duren',
          icon: 'eye slash'
        },
        {
          id: 6,
          name: 'Kantor_Polisi',
          icon: 'eye slash'
        },
        {
          id: 7,
          name: 'Banjir_September_2016',
          icon: 'eye slash'
        },
        {
          id: 8,
          name: 'Banjir_September_2017',
          icon: 'eye slash'
        }
      ],
      showpolice: [],
      showcctv: [],
      visible: false,
      visibility: false,
      current: 0,
      activeItem: '',
      mode: 'simple_select',
      polycoords: [],
      linecoords: []
    };
    this.updateDimensions = this.updateDimensions.bind(this); // <-- Contoh deklarasi functions/methods
    this.mapStyleChange = this.mapStyleChange.bind(this);
    this.setOnChange = this.setOnChange.bind(this);
    this.setInitialProperties = this.setInitialProperties.bind(this);
    this.onSelectIconViews = this.onSelectIconViews.bind(this);
    this.renderListLayer = this.renderListLayer.bind(this);
    
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

  updateDimensions(viewport) {
    // <-- Function bikinan sendiri untuk mengatur tampilan dimensi peta
    const height = window.innerWidth >= 992 ? window.innerHeight : 650;
    this.setState({ 
      height: height,
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  setOnChange(data) {
    this.setState({data: data});
    console.log("tess"+this.state.data[0].coordinates);
  }

  renderListLayer() {
    return this.state.layerMenu.map(el =>
      <List.Item key={ el.id }>
        <Icon name={ el.isSelected ? 'eye' : el.icon }
              onClick={ this.onSelectIconViews.bind(this, el.id) } />
        <List.Content>{ el.name }</List.Content>
      </List.Item>
    );
  }

  onSelectIconViews(index) {
    console.log("Selected index: ", index);
    let temp = this.state.layerMenu;
    temp[index].isSelected = temp[index].isSelected ? false : true;
    console.log(temp[index].name);

    if(temp[index].name == 'Kantor_Polisi') {
      if(temp[index].isSelected) {
        policestat = [];
        var i;
        for (i=0; i<polices.length; i++) {
          policestat.push(
            <Marker longitude={polices[i][0]} latitude={polices[i][1]}>
              <Icon name="building" />
            </Marker>
          );
        }
        this.setState({showpolice: policestat});
      } else {
        this.setState({showpolice: []});
      }
    } else if (temp[index].name == 'Cctv') {
      if(temp[index].isSelected) {
        cctvmarker = [];
        var i;
        for (i=0; i<cctv.length; i++) {
          cctvmarker.push(
            <Marker longitude={cctv[i][0]} latitude={cctv[i][1]}>
              <Icon name="video" />
            </Marker>
          );
        }
        this.setState({showcctv: cctvmarker});
      } else {
        this.setState({showcctv: []});
      }
    }
    this.setState({
      layerMenu: temp
    });
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
        console.log(features[0].geometry.coordinates[0]);
        console.log(features[0].geometry.coordinates[1]);
        var p1 = point(features[0].geometry.coordinates[0]);
        var p2 = point(features[0].geometry.coordinates[1])
        var result = round(distance(p1, p2, { units: 'kilometers' }));
        this.setState({ distance: result });
        for (i = 0; i < l; i++) {
          linecoords.push(<Table.Row>
            <Table.Cell>{ features[0].geometry.coordinates[i][0] }</Table.Cell>
            <Table.Cell>{ features[0].geometry.coordinates[i][1] }</Table.Cell>
          </Table.Row>);
        }
        this.setState({linecoords: linecoords});
      } else {
        for (i = 0; i < l; i++) {
          linecoords.push(<Table.Row>
            <Table.Cell>{ features[0].geometry.coordinates[i][0] }</Table.Cell>
            <Table.Cell>{ features[0].geometry.coordinates[i][1] }</Table.Cell>
          </Table.Row>);
        }
        this.setState({linecoords: linecoords});
      }
    } else if (features[0].geometry.type == "Polygon") {
      
      var x = features[0].geometry.coordinates[0].length;
      console.log(features[0].geometry.coordinates[0][0][0]);
      var p = polygon(features[0].geometry.coordinates);
      var a = round(area(p));
      for (i = 0; i < x; i++) {
        polycoords.push(<Table.Row>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][0] }</Table.Cell>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][1] }</Table.Cell>
        </Table.Row>);
      }
      this.setState({polycoords: polycoords, area: a});
    }
  }

  mapStyleChange(e) {
    console.log(e.currentTarget.value);
    this.setState({
      mapColor: e.currentTarget.value
    });
  }
  
  currentShowToolbox(index, name, mode)  {
    console.log(index);
    console.log(name);
    this.setState({
      current: index,
      activeItem: name,
      mode: mode
    })
  }

  render() {
    const changeStyle = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      right: "60px"
    };

    const tableStyle = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      background: '#e0e1e2'
    };

    const tableStyles = {
      zIndex: 999,
      position: "absolute",
      top: "250px",
      width: "260px",
      height: "300px",
      background:"#d8d8d8" 
    };

    const { activeItem } = this.state
    
    const unitOptions = [
      { key: 'km', value: 'km', text: 'km' },
      { key: 'feet', value: 'feet', text: 'feet' },
      { key: 'm', value: 'm', text: 'm' },
    ]

    return ( 
      <div class = "map-container" style={{ height: this.state.height }}>
        <div id ='menu' style={changeStyle} >
          <Button.Group>
            <Button 
              value='mapbox://styles/mapbox/streets-v11' 
              onClick={ this.mapStyleChange }>Streets
            </Button>
            <Button 
              value='mapbox://styles/mapbox/light-v10' 
              onClick={ this.mapStyleChange }>Light
            </Button>
            <Button 
              value='mapbox://styles/mapbox/dark-v10' 
              onClick={ this.mapStyleChange }>Dark
            </Button>
            <Button 
              value='mapbox://styles/mapbox/outdoors-v11' 
              onClick={ this.mapStyleChange }>Outdoors
            </Button>
            <Button 
              value='mapbox://styles/mapbox/satellite-v9' 
              onClick={ this.mapStyleChange }>Satellite
            </Button>
          </Button.Group>
        </div>

        <div style={tableStyle}>
          <Segment style={{overflow: 'auto', maxHeight: 200, width: 260}}>
            <List >
              { this.renderListLayer() }
            </List>
          </Segment>
        </div>

        <div style={tableStyles}>
          <Menu borderless style={{overflow: 'auto', width: 260}}>
            <Popup
              trigger={
                <Menu.Item 
                  name='elevation' 
                  active={activeItem === 'elevation'} 
                  onClick={ this.currentShowToolbox.bind(this, 1, 'elevation', 'draw_point') }> 
                  <Image src={ elevation } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Elevation
              </Popup.Content>
            </Popup>
            <Popup
              trigger={
                <Menu.Item 
                  name='conversion' 
                  active={activeItem === 'conversion'} 
                  onClick={ this.currentShowToolbox.bind(this, 2, 'conversion')}> 
                  <Image src={ converter } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Conversion
              </Popup.Content>
            </Popup>
            <Popup
              trigger={
                <Menu.Item 
                  name='distance' 
                  active={activeItem === 'distance'} 
                  onClick={ this.currentShowToolbox.bind(this, 3, 'distance', 'draw_line_string')}> 
                  <Image src={ distances } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Distance
              </Popup.Content>
            </Popup>
            <Popup
              trigger={
                <Menu.Item 
                  name='area' 
                  active={activeItem === 'area'} 
                  onClick={ this.currentShowToolbox.bind(this, 4, 'area', 'draw_polygon')}> 
                  <Image src={ areas } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Area
              </Popup.Content>
            </Popup>
            <Popup
              trigger={
                <Menu.Item 
                  name='bufferpoint' 
                  active={activeItem === 'bufferpoint'} 
                  onClick={ this.currentShowToolbox.bind(this, 5, 'bufferpoint', 'draw_point')}> 
                  <Image src={ bufferpoint } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Buffer Point
              </Popup.Content>
            </Popup>
            <Popup
              trigger={
                <Menu.Item 
                  name='bufferline' 
                  active={activeItem === 'bufferline'} 
                  onClick={ this.handleChange }> 
                  <Image src={ bufferline } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Buffer Line
              </Popup.Content>
            </Popup>
            <Popup
              trigger={
                <Menu.Item 
                  name='layer' 
                  active={activeItem === 'layer'} 
                  > 
                  <Image src={ layer } size='mini' />
                </Menu.Item>
              }
              size='mini'
              position='top center'
            >
              <Popup.Content>
                Layer
              </Popup.Content>
            </Popup>
            
        </Menu>

        <div style={{display: this.state.current === 1 ? 'block' : 'none'}}>
        <Table stackable>
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
        </div>
         
        <div style={{display: this.state.current === 2 ? 'block' : 'none'}}>
          <Form size='mini'>
            Convert Area
            <Form.Group widths='equal'>
              <Form.Field label='' control='input' placeholder='1' />
              <Form.Field label='' control='input' placeholder='' />
            </Form.Group>
          </Form>   
          <Form size='mini'>
            Convert Length
            <Form.Group widths='equal'>
              <Form.Field label='' control='input' placeholder='1' />
              <Form.Field label='' control='input' placeholder='' />
            </Form.Group>
          </Form>   
        </div>

        <div style={{display: this.state.current === 3 ? 'block' : 'none', }}>
        <Segment style={{overflow: 'auto', maxHeight: 100, width: 260 }}>
          <Table >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Longtitude</Table.HeaderCell>
                <Table.HeaderCell>Latitude</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { this.state.linecoords }
            </Table.Body>
          </Table>  
          </Segment>
          Unit:
          <Dropdown
            placeholder='Unit'
            fluid
            search
            selection
            options={unitOptions}
          />
          Calculated:  { this.state.distance }
        </div>

        <div style={{display: this.state.current === 4 ? 'block' : 'none'}}>
          <Segment style={{overflow: 'auto', maxHeight: 100, width: 260 }}>
          <Table stackable >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Longtitude</Table.HeaderCell>
                <Table.HeaderCell>Latitude</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { this.state.polycoords }
            </Table.Body>
          </Table>  
          </Segment >
          Unit:
          <Dropdown
            placeholder='Unit'
            fluid
            search
            selection
            options={unitOptions}
          />
          Calculated: { this.state.area } 

        </div>

        <div style={{display: this.state.current === 5 ? 'block' : 'none'}}>
          <Table stackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Longtitude</Table.HeaderCell>
                <Table.HeaderCell>Latitude</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>  

          <Form size='mini'>
            <Form.Group widths='equal'>
              <Form.Field label='Radius' control='input' placeholder='1' />
              <Form.Field label='Buffer Unit' control='input' placeholder='' />
            </Form.Group>
          </Form>  
        </div>


          {/* <Segment style={{overflow: 'auto', maxHeight: 200 }}>
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
          </Segment> */}
        </div>


        <MapGL
          style = {{ width: '100%', height: '91.5%' }}
          mapStyle = {this.state.mapColor}
          accessToken={ MAPBOX_TOKEN }
          latitude = {this.state.viewport.latitude}
          longitude = {this.state.viewport.longitude}
          zoom = {this.state.viewport.zoom}
          onViewportChange={viewport => this.setState({ viewport })}
        >
          {this.state.showpolice}
          {this.state.showcctv}
          
          <GeolocateControl position='top-right' />
          <NavigationControl showCompass showZoom position='top-right' />
          
          <Draw
            onDrawCreate={({ features }) => {
              this.setInitialProperties(features);
            }}
            mode={this.state.mode}
            onDrawModeChange={({ mode }) => this.setState({ mode })}
            
          />
        </MapGL> 

        <div>
        <Menu fluid widths={7} borderless>
          <Menu.Item>
            <img src={ logo } />
          </Menu.Item>
          <Menu.Item>
            <img src={ geo } height='60%' width='60%'/> 
            <img src={ mapid } height='60%' width='60%'/> 
          </Menu.Item>
          <Menu.Item name='Toolbox'  onClick={this.handleShowClick}/>
          <Menu.Item name='Details'  onClick={this.handleItemClick} />
          <Menu.Item name='Inspect'  onClick={this.handleItemClick} />
          <Menu.Item name='Navigate'  onClick={this.handleItemClick} />
          <Menu.Item name='Navigate'  onClick={this.handleItemClick} />
        </Menu>
        </div>
      </div>  
    )
  }
}


export default App;
