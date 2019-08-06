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
import './style.css';
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Marker,
  CustomLayer,
  Source,
  Layer
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
  Label,
  Input
} from 'semantic-ui-react';
import { center, distance, area, buffer } from '@turf/turf';
import { point, polygon, round } from '@turf/helpers';
import { polices } from './polices.js';
import { cctv } from './cctv.js';
import Geocoder from "react-mapbox-gl-geocoder";
import { MapboxLayer } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
/* Public variable */
var coordinates = [];
var policestat = [];
var cctvmarker = [];
var polycoords = [];
var linecoords = [];
var bufferPoint = null;
var buffcount = -1;
var buffdatapoint = [];
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h5cHJpY2lsaWEiLCJhIjoiY2p2dXpnODFkM3F6OTQzcGJjYWgyYmIydCJ9.h_AlGKNQW-TtUVF-856lSA';

class App extends Component {
  constructor() {
    super() 
    /* Deklarasi state */
    this.state = {
      viewport: {
        latitude: -6.9184,
        longitude: 107.6093,
        zoom: 11
      },
      mapColor: 'mapbox://styles/mapbox/streets-v11',
      data: {
        type: "FeatureCollection",
        features: []
      },
      distance: 0,
      coordinates: [],
      distancecoord: [],
      areacoord: [],
      area: 0,
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
      current: 0,
      activeItem: '',
      mode: 'simple_select',
      polycoords: [],
      linecoords: [],
      selectedUnit: 'km',
      selectedUnitArea: 'km',
      searchResultLayer: null,
      bufferPoint: null,
      buffpoint: {
        type: "FeatureCollection",
        features: []
      },
      defaultpoint: 1,
      buffdatapoint: [],
      currenbuffer: null,
      currentbufferunit: 'kilometers'
    };
    /* Deklarasi method */
    this.updateDimensions = this.updateDimensions.bind(this); // <-- Mengatur dimensi peta
    this.mapStyleChange = this.mapStyleChange.bind(this); // <-- Ubah style map
    this.setInitialProperties = this.setInitialProperties.bind(this); // <-- Mengambil feature utk menghitung total distance, besar area, menampilkan koordinat, 
    this.onSelectIconViews = this.onSelectIconViews.bind(this); // <-- Ubah icon pada menu layer manegement
    this.renderListLayer = this.renderListLayer.bind(this); // <-- Menampilkan layer tertentu
    this.convertUnit = this.convertUnit.bind(this); // <-- Menampilkan total distance berdasarkan unit yg dipilih
    this.convertUnitArea = this.convertUnitArea.bind(this); // <-- Menampilkan besar area berdasarkan unit yg dipilih
    this.resetData = this.resetData.bind(this); // <-- Reset state
    this.onSelected = this.onSelected.bind(this);
    this.currentBufferPoint = this.currentBufferPoint.bind(this);
    this.convertBufferPointUnit = this.convertBufferPointUnit.bind(this);
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
  
  renderListLayer() {
    // <-- Function menampilkan list menu Layer Management
    return this.state.layerMenu.map(el =>
      <List.Item key={ el.id }>
        <Icon link name={ el.isSelected ? 'eye' : el.icon }
              onClick={ this.onSelectIconViews.bind(this, el.id) } />
        <List.Content>{ el.name }</List.Content>
      </List.Item>
    );
  }

  onSelectIconViews(index) {
    // <-- Function mengubah icon yang dipilih pada menu Layer Management
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
    // <-- Function menampilkan koordinat, menghitung distance, menghitung total area
    console.log("Features", features);
    var i;
    this.state.data.features.push(features[0]);
    console.log("Total coordinates: ", features[0].geometry.coordinates.length);
    var count = this.state.data.features.length - 1;
    var temp = this.state.data.features[count].geometry.coordinates;
    var result = 0;
    var dist = [];
    var arr = [];
    if (features[0].geometry.type === "Point") {
      coordinates.push(<Table.Row>
        <Table.Cell>{ features[0].geometry.coordinates[0] }</Table.Cell>
        <Table.Cell>{ features[0].geometry.coordinates[1] }</Table.Cell>
      </Table.Row>);
      this.setState({coordinates: coordinates});
      buffcount++;
      this.currentBufferPoint(features, buffcount);
      console.log("Coordinates: ", coordinates);
    } else if (features[0].geometry.type === "LineString") {
      for(i=1; i<temp.length; i++) {
        var p1 = point([temp[i -1][0], temp[i-1][1]]);
        var p2 = point([temp[i][0], temp[i][1]]);
        result += round(distance(p1, p2, { units: 'kilometers' }));
      }
      console.log("Distances: ", result);
      dist.push(result);
      dist.push(result * 3280.84);
      dist.push(result * 1000);
      this.setState({ distance: result, distancecoord: dist });

      for (i = 0; i < temp.length; i++) {
        linecoords.push(<Table.Row>
          <Table.Cell>{ features[0].geometry.coordinates[i][0] }</Table.Cell>
          <Table.Cell>{ features[0].geometry.coordinates[i][1] }</Table.Cell>
        </Table.Row>);
      }
      this.setState({linecoords: linecoords});
      
    } else if (features[0].geometry.type === "Polygon") {
      var p = polygon(temp);
      var a = round(area(p)) / 1000;

      for (i = 0; i < temp[0].length; i++) {
        polycoords.push(<Table.Row>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][0] }</Table.Cell>
          <Table.Cell>{ features[0].geometry.coordinates[0][i][1] }</Table.Cell>
        </Table.Row>);
      }
      arr.push(a);
      arr.push(a * 100);
      console.log(arr[1]);
      this.setState({polycoords: polycoords, area: a, areacoord: arr});
    }
  }

  currentBufferPoint(features, count) {
    const temp = buffer(features[0].geometry, 1, {units: this.state.currentbufferunit });
    console.log("Buffer: ", temp);
    console.log("Features: ", features[0].geometry);
    console.log("Count: ", count);
    this.state.buffpoint.features.push(features[0].geometry);
    console.log("Buffer point features: ", this.state.buffpoint);
    console.log("Current buffer: ", this.state.buffpoint.features[count]);

    bufferPoint = (
      <React.Fragment>
        <Source id='points' type='geojson' data={temp} />
        <Layer
          id='points'
          type='fill'
          source='points'
          paint={{
            
            'fill-color': '#1978c8',
            'fill-opacity': 0.5
          }}
        />
      </React.Fragment>
    );
    this.setState({bufferPoint: bufferPoint});
   
  }

  convertUnit(e, data) {
    // <-- Function menampilkan total distance berdasarkan unit yg dipilih
    console.log("Selected unit:", data.value);
    var temp = this.state.distance; 
    if (temp !== 0) {
      if (data.value === 'feet') {
        this.setState({distance: this.state.distancecoord[1], selectedUnit: 'feet'});
      } else if (data.value === 'm') {
        this.setState({distance: this.state.distancecoord[2], selectedUnit: 'm'});
      } else {
        this.setState({distance: this.state.distancecoord[0], selectedUnit: 'km'});
      }
    }
  }

  convertUnitArea(e, data) {
    // <-- Function menampilkan besar area berdasarkan unit yg dipilih
    console.log("Selected unit:", data.value);
    var temp = this.state.area; 
    if (temp !== 0) {
      if (data.value === 'ha') {
        console.log("ha");
        this.setState({area: this.state.areacoord[1], selectedUnitArea: 'ha'});
      } else {
        this.setState({area: this.state.areacoord[0], selectedUnitArea: 'km'});
      }
    }
  }

  convertBufferPointUnit(e, data) {
    // <-- Function menampilkan besar area berdasarkan unit yg dipilih
    console.log("Selected unit:", data.value);
      if (data.value === 'km') {
        this.setState({currentbufferunit: 'kilometers'});
      } else if (data.value === 'miles') {
        this.setState({currentbufferunit: 'miles'});
      } else {
        this.setState({currentbufferunit: 'm'});
      }
  }
  

  mapStyleChange(e) {
    // <-- Function mengubah style dari map
    console.log("Selected style:", e.currentTarget.value);
    this.setState({
      mapColor: e.currentTarget.value
    });
  }

  currentShowToolbox(index, name, mode)  {
    // <-- Function menampilkan toolbox yg dipilih
    console.log("Selected toolbox:", index);
    this.resetData();
    this.setState({
      current: index,
      activeItem: name,
      mode: mode
    });
  }

  resetData() {
    // <-- Function reset state
    this.setState({
      coordinates: [], 
      distance: 0,
      area: 0,
      distancecoord: [],
      areacoord: [],
      polycoords: [],
      linecoords: [],
      data: {
        type: "FeatureCollection",
        features: []
      }});
  }
  
  onSelected (viewport, item) {
    this.setState({ viewport: viewport });
    console.log("Selected: ", item);
    console.log("Center: ", item.center);
    console.log("Viewport: ", viewport);
    console.log("L")
    // this.setState({
    //   searchResultLayer: new MapboxLayer({
    //     id: "search-result",
    //     type: ScatterplotLayer,
    //     data: [{ position: item.center, size: 1000 }],
    //     getPosition: d => d.position,
    //     getRadius: d => d.size,
    //     getColor: [255, 0, 0]
    //   })
    // });
  };

  render() {
    // <-- Style untuk menu ubah map
    const changeMapStyle = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      right: "60px"
    };

    // <-- Style untuk menu layer management
    const layerManagement = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      background: '#dcddde'
    };

    // <-- Style untuk menu toolbox
    const toolBoxTab = {
      zIndex: 999,
      position: "fixed",
      top: "250px",
      width: "260px",
      height: "300px",
      background:"#d8d8d8" 
    };

    // <-- State untuk menu toolbox
    const { activeItem } = this.state;
    
    // <-- Options unit untuk distance
    const unitOptions = [
      { key: 'km', value: 'km', text: 'km' },
      { key: 'feet', value: 'feet', text: 'feet' },
      { key: 'm', value: 'm', text: 'm' },
    ];

    // <-- Options unit untuk area
    const unitAreaOptions = [
      { key: 'km', value: 'km', text: 'km' },
      { key: 'ha', value: 'ha', text: 'ha' }
    ];

    const bufferAreaOptions = [
      { key: 'km', value: 'km', text: 'km' },
      { key: 'miles', value: 'miles', text: 'miles' },
      { key: 'm', value: 'm', text: 'm' }
    ];

    const myDeckLayer = new MapboxLayer({
      id: 'my-scatterplot',
      type: ScatterplotLayer,
      data: [{ position: [-74.5, 40], size: 100000 }],
      getPosition: d => d.position,
      getRadius: d => d.size,
      getColor: [255, 0, 0]
    });

    const data = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [107.51145301514077, -6.882612239477638]
      }
    };
    return ( 
    // <-- User interface
      <div class="map-container" 
        style={{ 
          height: this.state.height }}>
        
        {/* <div id='menu'
          style={changeMapStyle}>
          <Button.Group>
            <Button 
              value='mapbox://styles/mapbox/streets-v11' 
              onClick={this.mapStyleChange}>Streets
            </Button>
            <Button 
              value='mapbox://styles/mapbox/light-v10' 
              onClick={this.mapStyleChange}>Light
            </Button>
            <Button 
              value='mapbox://styles/mapbox/dark-v10' 
              onClick={this.mapStyleChange}>Dark
            </Button>
            <Button 
              value='mapbox://styles/mapbox/outdoors-v11' 
              onClick={this.mapStyleChange}>Outdoors
            </Button>
            <Button 
              value='mapbox://styles/mapbox/satellite-v9' 
              onClick={this.mapStyleChange}>Satellite
            </Button>
          </Button.Group>
        </div> */}

        <div style={layerManagement}>
       
          Layer Management
          <Segment tertiary basic
            style={{
              overflow: 'auto', 
              maxHeight: 200, 
              width: 260}}>
            <List >
              {this.renderListLayer()}
            </List>
          </Segment>
        </div>

        <div style={toolBoxTab}>
          <Menu 
            borderless 
            style={{
              overflow: 'auto', 
              width: 260}}>
            <Menu.Item 
              name='elevation' 
              active={activeItem === 'elevation'} 
              onClick={this.currentShowToolbox.bind(this, 1, 'elevation', 'draw_point')}> 
              <Image 
                src={elevation} 
                size='mini'/>
            </Menu.Item>
            <Menu.Item 
              name='conversion' 
              active={activeItem === 'conversion'} 
              onClick={this.currentShowToolbox.bind(this, 2, 'conversion', 'simple_select')}> 
              <Image 
                src={converter} 
                size='mini'/>
            </Menu.Item>
            <Menu.Item 
              name='distance' 
              active={activeItem === 'distance'} 
              onClick={this.currentShowToolbox.bind(this, 3, 'distance', 'draw_line_string')}> 
              <Image 
                src={distances} 
                size='mini'/>
            </Menu.Item>
            <Menu.Item 
              name='area' 
              active={activeItem === 'area'} 
              onClick={this.currentShowToolbox.bind(this, 4, 'area', 'draw_polygon')}> 
              <Image 
                src={areas} 
                size='mini'/>
            </Menu.Item>
            <Menu.Item 
              name='bufferpoint' 
              active={activeItem === 'bufferpoint'} 
              onClick={this.currentShowToolbox.bind(this, 5, 'bufferpoint', 'draw_point')}> 
              <Image 
                src={bufferpoint} 
                size='mini'/>
            </Menu.Item>
            <Menu.Item 
              name='bufferline' 
              active={activeItem === 'bufferline'} 
              onClick={this.handleChange}> 
              <Image 
                src={bufferline} 
                size='mini'/>
            </Menu.Item>
            <Menu.Item 
              name='layer' 
              active={activeItem === 'layer'}> 
              <Image 
                src={layer} 
                size='mini'/>
            </Menu.Item>
          </Menu>

          <div style={{display: this.state.current === 1 ? 'block' : 'none'}}>
          <Segment 
            style={{
              overflow: 'auto', 
              maxHeight: 100, 
              width: 260 }}>
            <Table stackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Longtitude</Table.HeaderCell>
                  <Table.HeaderCell>Latitude</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.coordinates}
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
            <div style={{height: 110}}>
            <Segment 
              style={{
                overflow: 'auto', 
                maxHeight: 100, 
                width: 260 }}>
              <Table >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Longtitude</Table.HeaderCell>
                    <Table.HeaderCell>Latitude</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.linecoords}
                </Table.Body>
              </Table>  
            </Segment>
            </div>
              Unit:
            <Dropdown
              placeholder='Unit'
              fluid
              search
              selection
              options={unitOptions}
              onChange={this.convertUnit}
            />
            <div> Calculated:  {this.state.distance} {this.state.selectedUnit} </div>
          </div>

          <div style={{display: this.state.current === 4 ? 'block' : 'none'}}>
            <div style={{height: 110}}>
            <Segment 
              style={{
                overflow: 'auto', 
                maxHeight: 100, 
                width: 260 }}>
              <Table stackable >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Longtitude</Table.HeaderCell>
                    <Table.HeaderCell>Latitude</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.polycoords}
                </Table.Body>
              </Table>  
            </Segment >
            </div>
            Unit:
            <Dropdown
              placeholder='Unit'
              fluid
              search
              selection
              options={unitAreaOptions}
              onChange={this.convertUnitArea}
            />
            <div> Calculated: { this.state.area } {this.state.selectedUnitArea}<sup style={{display: this.state.selectedUnitArea === 'km' ? 'inline' : 'none'}}>2</sup>
            </div>
          </div>

          <div style={{display: this.state.current === 5 ? 'block' : 'none' }}>
            <div style={{height: 125}}>
            <Segment 
              style={{
                overflow: 'auto', 
                maxHeight: 120, 
                maxwidth: 260 }}>
              <Table stackable >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Longtitude</Table.HeaderCell>
                    <Table.HeaderCell>Latitude</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.coordinates}
                </Table.Body>
              </Table>  
            </Segment>
            </div>
            <div>
              Radius: <Input  placeholder='1' /> 
              Buffer Unit: <Dropdown
              placeholder='Unit'
              fluid
              search
              selection
              options={bufferAreaOptions}
              onChange={this.convertBufferPointUnit}
              size='mini'
            />
            </div>
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
          {/* <NavigationControl showCompass showZoom position='top-right' />
           */}
          <Draw
            onDrawCreate={({ features }) => {
              this.setInitialProperties(features);
            }}
            mode={this.state.mode}
            onDrawModeChange={({ mode }) => this.setState({ mode })}
          />

          <div style={{position: 'absolute',width: 300, top: 10, right: 50}}>
            <Geocoder
              mapboxApiAccessToken= {MAPBOX_TOKEN}
              onSelected={this.onSelected}
              viewport={this.state.viewport}
              hideOnSelect={true}
              transitionDuration={1000}
            />
            {this.state.bufferPoint }
          </div>
          
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
