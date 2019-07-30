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
  Image,
  Icon,
  List,
  Segment,
  Form,
  Dropdown,
  Label
} from 'semantic-ui-react';
import { center, distance, feature, area } from '@turf/turf';
import { point, polygon, round } from '@turf/helpers';
import { polices } from './polices.js';
import { cctv } from './cctv.js';

var coordinates = [];
var policestat = [];
var cctvmarker = [];
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
      linecoords: [],
      selectedUnit: 'kilometers'
    };
    this.updateDimensions = this.updateDimensions.bind(this); // <-- Contoh deklarasi functions/methods
    this.mapStyleChange = this.mapStyleChange.bind(this);
    this.setOnChange = this.setOnChange.bind(this);
    this.setInitialProperties = this.setInitialProperties.bind(this);
    this.onSelectIconViews = this.onSelectIconViews.bind(this);
    this.renderListLayer = this.renderListLayer.bind(this);
    this.convertUnit = this.convertUnit.bind(this); 
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
    var i;
    if(temp[index].name === 'Kantor_Polisi') {
      if(temp[index].isSelected) {
        policestat = [];
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
    } else if (temp[index].name === 'Cctv') {
      if(temp[index].isSelected) {
        cctvmarker = [];
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
    this.state.data.features.push(features[0]);
    console.log(features[0].geometry.coordinates.length);
    var count = this.state.data.features.length - 1;
    var temp = this.state.data.features[count].geometry.coordinates;
    var result = 0;
    
    if (features[0].geometry.type === "Point") {
      coordinates.push(<Table.Row>
        <Table.Cell>{ features[0].geometry.coordinates[0] }</Table.Cell>
        <Table.Cell>{ features[0].geometry.coordinates[1] }</Table.Cell>
      </Table.Row>);
      this.setState({coordinates: coordinates});

    } else if (features[0].geometry.type === "LineString") {
     
      for(i=1; i< temp.length; i++) {
        var p1 = point([temp[i -1][0], temp[i-1][1]]);
        var p2 = point([temp[i][0], temp[i][1]]);
        result += round(distance(p1, p2, { units: 'kilometers' }));
      }
      this.setState({ distance: result });

      for (i = 0; i < temp.length; i++) {
        linecoords.push(<Table.Row>
          <Table.Cell>{ features[0].geometry.coordinates[i][0] }</Table.Cell>
          <Table.Cell>{ features[0].geometry.coordinates[i][1] }</Table.Cell>
        </Table.Row>);
      }
      this.setState({linecoords: linecoords});
      
    } else if (features[0].geometry.type === "Polygon") {
      var p = polygon(temp);
      var a = round(area(p));
      for (i = 0; i < temp[0].length; i++) {
        polycoords.push(<Table.Row>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][0] }</Table.Cell>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][1] }</Table.Cell>
        </Table.Row>);
      }
      this.setState({polycoords: polycoords, area: a});
    }
  }

  convertUnit(e, data) {
    console.log(data.value);
    var temp = this.state.distance; 
    if(temp !== 0) {
      if(data.value === 'feet') {
        temp = temp * 3280.84;
        this.setState({distance: temp, selectedUnit: 'feet'});
      }
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
    const changeMapStyle = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      right: "60px"
    };

    const layerManagement = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      background: '#e0e1e2'
    };

    const toolBoxTab = {
      zIndex: 999,
      position: "fixed",
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
        <div id ='menu' style={changeMapStyle} >
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

        <div style={layerManagement}>
          Layer Management
          <Segment style={{overflow: 'auto', maxHeight: 200, width: 260}}>
           
            <List >
              { this.renderListLayer() }
            </List>
          </Segment>
        </div>

        <div style={toolBoxTab}>
          <Menu borderless style={{overflow: 'auto', width: 260}}>
          
            <Menu.Item 
              name='elevation' 
              active={activeItem === 'elevation'} 
              onClick={ this.currentShowToolbox.bind(this, 1, 'elevation', 'draw_point') }> 
              <Image src={ elevation } size='mini' />
            </Menu.Item>
            <Menu.Item 
              name='conversion' 
              active={activeItem === 'conversion'} 
              onClick={ this.currentShowToolbox.bind(this, 2, 'conversion', 'simple_select')}> 
              <Image src={ converter } size='mini' />
            </Menu.Item>
            <Menu.Item 
              name='distance' 
              active={activeItem === 'distance'} 
              onClick={ this.currentShowToolbox.bind(this, 3, 'distance', 'draw_line_string')}> 
              <Image src={ distances } size='mini' />
            </Menu.Item>
            <Menu.Item 
              name='area' 
              active={activeItem === 'area'} 
              onClick={ this.currentShowToolbox.bind(this, 4, 'area', 'draw_polygon')}> 
              <Image src={ areas } size='mini' />
            </Menu.Item>
            <Menu.Item 
              name='bufferpoint' 
              active={activeItem === 'bufferpoint'} 
              onClick={ this.currentShowToolbox.bind(this, 5, 'bufferpoint', 'draw_point')}> 
              <Image src={ bufferpoint } size='mini' />
            </Menu.Item>
            <Menu.Item 
              name='bufferline' 
              active={activeItem === 'bufferline'} 
              onClick={ this.handleChange }> 
              <Image src={ bufferline } size='mini' />
            </Menu.Item>
            <Menu.Item 
              name='layer' 
              active={activeItem === 'layer'} 
              > 
              <Image src={ layer } size='mini' />
            </Menu.Item>
          </Menu>

          <div style={{display: this.state.current === 1 ? 'block' : 'none'}}>
          <Segment style={{overflow: 'auto', maxHeight: 100, width: 260 }}>
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
          </Segment> 
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
              defaultValue='km'
              options={unitOptions}
              onChange={this.convertUnit}
            />
            Calculated:  { this.state.distance } { this.state.selectedUnit }
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
            <Segment style={{overflow: 'auto', maxHeight: 100, width: 260 }}>
              <Table stackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Longtitude</Table.HeaderCell>
                    <Table.HeaderCell>Latitude</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
              </Table>  
            </Segment>
            <Form size='mini'>
              <Form.Group widths='equal'>
                <Form.Field label='Radius' control='input' placeholder='1' />
                <Form.Field label='Buffer Unit' control='input' placeholder='' />
              </Form.Group>
            </Form>  
          </div>
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
        <Menu fluid widths={7} borderless stackable>
          <Menu.Item>
            <Image src={ logo } width='15%'/>
          </Menu.Item>
          <Menu.Item>
            <Image src={ geo }  width='55%'/> 
            <Image src={ mapid }  width='60%'/> 
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
