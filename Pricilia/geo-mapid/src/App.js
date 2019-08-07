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
  Input,
  Loader,
  Container
} from 'semantic-ui-react';
import { center, distance, area, buffer } from '@turf/turf';
import { point, polygon, round } from '@turf/helpers';
import Geocoder from "react-mapbox-gl-geocoder";
import axios from "axios";

/* Public variable */
var coordinates = [];
var reklamasi;
var banjir;
var polycoords = [];
var linecoords = [];
var bufferPoint = null;
var buffcount = -1;
var rows;
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h5cHJpY2lsaWEiLCJhIjoiY2p2dXpnODFkM3F6OTQzcGJjYWgyYmIydCJ9.h_AlGKNQW-TtUVF-856lSA';

class App extends Component {
  constructor() {
    super() 
    /* Deklarasi state */
    this.state = {
      isLoading: true,
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
      showreklamasi: null,
      showbanjir: null,
      distance: 0,
      coordinates: [],
      distancecoord: [],
      areacoord: [],
      area: 0,
      bColor: '',
      icon: 'eye slash',
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
      currentbufferunit: 'kilometers',
      menulayer: [],
      datajson: []
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
    this.getLayersByUsername = this.getLayersByUsername.bind(this);
  }
  
  componentWillMount() {
    // <-- Event Method bawaan react
    this.updateDimensions();
    
  }

  componentDidMount() {
    // <-- Event Method bawaan react
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.getLayersByUsername();
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
  
  getLayersByUsername() {
    rows = [];
    axios
      .get(
        "https://hnjp62bwxh.execute-api.us-west-2.amazonaws.com/GeoDev/getlayerbyusername",
        {
          params: {
            username: "andreas_ithb"
          }
        }
      ).then(response => {
        // handle success
        console.log("Geo Data: ", response.data);
        const list = response.data;
        var input = [];
        var i, j, k;
        for(i=0; i<list.length; i++) {
          rows.push({
            _id: list[i]._id,
            name: list[i].name,
            username: list[i].username,
            createdAt: list[i].createdAt,
            description: list[i].description,
            layer_type: list[i].layer_type,
            subscriber: list[i].subscriber,
            geojson: list[i].geojson,
            arrayindex: i,
            opacity: 0.5,
            visibility: "visible"
          });
        }
        this.setState({ menulayer: rows });
        for(j=0; j<rows.length; j++) {
          for(k=0; k<rows[j].geojson.features.length; k++) {
            input.push(
              rows[j].geojson.features[k]
            );
          }
        }
        this.setState({ datajson: input, isLoading: false });
      }).catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
  }

  renderListLayer() {
    // <-- Function menampilkan list menu Layer Management
    console.log("Rows: ", this.state.menulayer);
    console.log("Username: ", this.state.menulayer[0].username);
    if(!this.state.isLoading) {
      return this.state.menulayer.map(el =>
        <List.Item key={ el.arrayindex }>
          {/* <Icon link name='eye'/> */}
          <Icon link name={ el.isSelected ? 'eye' : 'eye slash'}
                onClick={ this.onSelectIconViews.bind(this, el.arrayindex) } />
          <List.Content>{ el.name }</List.Content>
        </List.Item>
      );
    } 
  }

  onSelectIconViews(index) {
    // <-- Function mengubah icon yang dipilih pada menu Layer Management
    console.log("Selected index: ", index);
    let temp = this.state.menulayer;
    temp[index].isSelected = temp[index].isSelected ? false : true;
   var i;

    if (temp[index].arrayindex == 0) {
      console.log(temp[index].name);
      if(temp[index].isSelected) {
        console.log(temp[index].geojson.features.properties); 

        reklamasi = null; 
        reklamasi = ( 
          <React.Fragment>
          <Source id='reklamasi' type='geojson' data={temp[index].geojson} />
          <Layer
            id='reklamasi'
            type='fill'
            source='reklamasi'
            paint={{
              'fill-color': "#627BC1",
              'fill-opacity': 0.5
            }}
          />
        </React.Fragment>
      )
        this.setState({showreklamasi: reklamasi });
      } else {
        this.setState({showreklamasi: null });
      }
    }
    
    if (temp[index].arrayindex == 1) {
      console.log(temp[index].name);
      if(temp[index].isSelected) {
        console.log(temp[index].geojson);
        banjir = null;
        
        banjir = ( 
          <React.Fragment>
          <Source id='banjir' type='geojson' data={temp[index].geojson} />
          <Layer
            id='banjir'
            type='circle'
            source='banjir'
            paint={{
              'circle-color': "red"
            }}
          />
        </React.Fragment>
      )
        this.setState({showbanjir: banjir });
      } else {
        this.setState({showbanjir: null });
      }
    }
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
    console.log("Selected: ", item);
    console.log("Viewport: ", viewport);
    this.setState({ 
      viewport: {
        latitude: viewport.latitude,
        longitude: viewport.longitude,
        zoom: 4
      }
    });
  };

  render() {
    // <-- Style untuk menu ubah map
    if (this.state.isLoading) {
      return <Container>
                <Loader size='massive' active inline='centered' /> 
              </Container>
    }
    const changeMapStyle = {
      zIndex: 999,
      position: "absolute",
      top: "10px",
      right: "200px"
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

    return ( 
    // <-- User interface
      
      <div class="map-container" 
        style={{ 
          height: this.state.height }}>
       
        <div id='menu'
          style={changeMapStyle}>
          <Button.Group size='mini'>
            <Button 
              value='mapbox://styles/mapbox/streets-v11' 
              onClick={this.mapStyleChange}>Streets
            </Button>
            <Button 
              value='mapbox://styles/mapbox/satellite-v9' 
              onClick={this.mapStyleChange}>Satellite
            </Button>
            <Button 
              value='mapbox://styles/mapbox/satellite-v9' 
              onClick={this.mapStyleChange}>Hybrid
            </Button>
            <Button 
              value='mapbox://styles/mapbox/outdoors-v11' 
              onClick={this.mapStyleChange}>Terrain
            </Button>
          </Button.Group>
        </div>

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
          {this.state.showreklamasi}
          {this.state.showbanjir}
          
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

          <div style={{position: 'absolute', top: 10, right: 50}}>
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
