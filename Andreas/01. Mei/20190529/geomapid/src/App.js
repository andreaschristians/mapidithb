import React, { Component } from "react";
import './App.css'; 
import { Button, Message, Popup, Table, Checkbox } from 'semantic-ui-react'

class App extends Component {
  constructor() {
    super();
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

  render() {
    return (
      <div id="Page" >
        <div id="StyleMaps">
          <Button.Group id="menu" size="small">
            <Button value="streets">Streets</Button>
            <Button value="satellite">Satellite</Button>
            <Button value="dark">Hybrid</Button>
            <Button value="light">Terrain</Button>
          </Button.Group>
        </div>
        <div id="Bottom">
          <img src="mapid-logo.svg" align="center" height="30px" alt="Logo"></img>
          <a href="https://www.mapid.io/"><Button id="Bawah" size="small">
            <img src="geo-icon.png" height="10px" alt="Geo"></img>
            <img src="mapid-icon.png" height="10px" alt="Mapid"></img>
          </Button></a>
          <Popup trigger={<Button id="Bawah" size="small" content='Toolbox' icon='briefcase' labelPosition='left'></Button>} on='click' className='login-popup'>
            <div className='popup-main'>
              <Message attached='bottom'>
                This is Toolbox, but Coming soon!!
              </Message>
            </div>
          </Popup>
          <Popup trigger={<Button id="Bawah" size="small" content='Details' icon='bars' labelPosition='left'></Button>} on='click' className='login-popup'>
            <div className='popup-main'>
              <Message attached='bottom'>
                This is Details
              </Message>
            </div>
          </Popup>
          <Popup trigger={<Button id="Bawah" size="small" content='Inspect' icon='search' labelPosition='left'></Button>} on='click' className='login-popup'>
            <div className='popup-main'>
              <Message attached='bottom'>
                This is Inspect
              </Message>
            </div>
          </Popup>
          <Popup trigger={<Button id="Navigation" size="small" content='Navigate' icon='location arrow' labelPosition='left'></Button>} on='click' className='login-popup'>
            <div id='show_nav'>
              <Message attached='bottom'>
                This is Navigation
              </Message>
            </div>
          </Popup>

          <Button id="Bawah" size="small" content='Langtitude'><div id="isi"></div></Button>
        </div>
        <Table collapsing id="tbl" style={{"height": "10px", "overflow": "scroll"}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Layer Manager</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>NowMapidStory</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>CCTV</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>Bendungan_Indonesia</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>Survey_Tanjung_Duren</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>NowMapidStory</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>CCTV</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>Bendungan_Indonesia</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox slider />
              </Table.Cell>
              <Table.Cell>Survey_Tanjung_Duren</Table.Cell>
            </Table.Row>
          </Table.Body>

        </Table>
      </div>

    );
  }
}
// //MapBox
// mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVhc2NocmlzdGlhbiIsImEiOiJjanZ2cnZhMjg0NWtmNDN1aTMxcGphY21xIn0.CDEBH4hJPmAhRDOtzz73Mw';
// var map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v11',
//   center: [107.6503, -6.951],
//   zoom: 10.8
// });

// //LongLat
// map.on('mousemove', function (e) {
//   var lnglat = JSON.stringify(e.lngLat);
//   var split = lnglat.split(',')
//   split[0] = split[0].substring(7, 14);
//   split[1] = split[1].substring(6, 13);
//   document.getElementById('isi').innerHTML = "Long : " + split[0] + " Lang : " + split[1];
// });

// //Search
// map.addControl(new MapboxGeocoder({
//   accessToken: mapboxgl.accessToken,
//   mapboxgl: mapboxgl
// }));

// //Location
// map.addControl(new mapboxgl.GeolocateControl({
//   positionOptions: {
//     enableHighAccuracy: true
//   },
//   trackUserLocation: true
// }));

// //Direction
// map.addControl(new MapboxDirections({
//   accessToken: mapboxgl.accessToken
// }), 'bottom-right');

// //Ganti Style
// var layerList = document.getElementById('menu');
// var inputs = layerList.getElementsByTagName('input');
// function switchLayer(layer) {
//   var layerId = layer.target.id;
//   map.setStyle('mapbox://styles/mapbox/' + layerId);
// }
// for (var i = 0; i < inputs.length; i++) {
//   inputs[i].onclick = switchLayer;
// }

export default App;
