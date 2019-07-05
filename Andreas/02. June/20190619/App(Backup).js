import React, { Component } from "react";
import "./App.css";
import ReactMapGL, { Marker, GeolocateControl } from "react-map-gl";
import {
  Button,
  Message,
  Popup,
  Table,
  Checkbox,
  Label
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import LineTo from "react-lineto";
import * as turf from "@turf/turf";

class App extends Component {
  constructor() {
    super();
    this._distance = this._distance.bind(this);
  }

  state = {
    viewport: {
      width: window.innerWidth,
      height: 572,
      latitude: -6.9184,
      longitude: 107.6093,
      zoom: 8.69,
      distance: 0,
      visible:"none"
    }
  };

  _distance() {
    var from = turf.point([-75.343, 39.984]);
    var to = turf.point([-75.534, 39.123]);
    var options = { units: "kilometers" };
    var distances = turf.distance(from, to, options);
    this.setState({ distance: distances });
  }
  _onClickMap(e) {
    console.log(e.lngLat);
    let lnglat = e.lngLat;
    // let split = lnglat.split(',',2)s
    // split[0] = split[0].substring(7, 14);
    // split[1] = split[1].substring(6, 13);
    // document.getElementById('isi').innerHTML = "Long : " + split[0] + " Lang : " + split[1];
    // document.getElementById('isilang').innerHTML = lnglat;
  }
  _streetMap() {
    // document.getElementById('mapstyle').innerHTML = "'mapbox://styles/mapbox/streets-v9'";
  }

  render() {
    const { viewport } = this.state;
    return (
      <div id="Page">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={
            "pk.eyJ1IjoiYW5kcmVhc2NocmlzdGlhbiIsImEiOiJjanZ2cnZhMjg0NWtmNDN1aTMxcGphY21xIn0.CDEBH4hJPmAhRDOtzz73Mw"
          }
          onClick={this._onClickMap}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={viewport => this.setState({ viewport })}
        >
          <div id="locate">
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />
          </div>
          <Marker
            latitude={-6.9494343}
            longitude={107.62099}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="A">
              <img src="here.png" height="50px" width="50px" alt="here" />
            </div>
          </Marker>
          <Marker
            latitude={3.534343}
            longitude={116.9999}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="B">
              <img src="here.png" height="50px" width="50px" alt="here" />
            </div>
          </Marker>
          <LineTo from="A" to="B" />
        </ReactMapGL>
        <div id="StyleMaps">
          <Button.Group id="menu" size="small">
            <Button value="streets-v11" onClick={this._streetMap}>
              Streets
            </Button>
            <Button id="satellite-v9" value="satellite">
              Satellite
            </Button>
            <Button id="satellite-streets-v9" value="hybrid">
              Hybrid
            </Button>
            <Button id="streets-v9" value="light">
              Terrain
            </Button>
          </Button.Group>
        </div>
        <div id="Bottom">
          <img src="mapid-logo.svg" align="center" height="30px" alt="Logo" />
          <a href="https://www.mapid.io/">
            <Button id="Bawah" size="small">
              <img src="geo-icon.png" height="10px" alt="Geo" />
              <img src="mapid-icon.png" height="10px" alt="Mapid" />
            </Button>
          </a>
          <Popup
            trigger={
              <Button
                id="Bawah"
                size="small"
                content="Toolbox"
                icon="briefcase"
                labelPosition="left"
              />
            }
            on="click"
            className="login-popup"
          >
            <div id="tools" className="popup-main">
              <div id="buttontools">
                <Button size="small">Elevation</Button>
                <Button size="small">Conversion</Button>
                <Button size="small">Distance</Button>
                <Button size="small">Area</Button>
                <Button size="small">Buffer Point</Button>
                <Button size="small">Buffer Line</Button>
                <Button size="small">Layer Interaction</Button>
              </div>
            </div>
          </Popup>
          <Popup
            trigger={
              <Button
                id="Bawah"
                size="small"
                content="Details"
                icon="bars"
                labelPosition="left"
              />
            }
            on="click"
            className="login-popup"
          >
            <div className="popup-main">
              <Message attached="bottom">This is Details</Message>
            </div>
          </Popup>

          <Button size="small" content="Hitung" onClick={this._distance} />
          <Label style={{display:"inline-block"}}>{this.state.distance}</Label>

          <Popup
            trigger={
              <Button
                id="Bawah"
                size="small"
                content="Inspect"
                icon="search"
                labelPosition="left"
              />
            }
            on="click"
            className="login-popup"
          >
            <div className="popup-main">
              <Message attached="bottom">This is Inspect</Message>
            </div>
          </Popup>
          <Popup
            trigger={
              <Button
                id="Navigation"
                size="small"
                content="Navigate"
                icon="location arrow"
                labelPosition="left"
              />
            }
            on="click"
            className="login-popup"
          >
            <div id="show_nav">
              <Message attached="bottom">This is Navigation</Message>
            </div>
          </Popup>

          <Button id="Bawah" size="small" content="Langtitude">
            <div id="isilang" />
          </Button>
        </div>
        
        <Table
          collapsing
          id="tbl"
          style={{ height: "10px", overflow: "scroll" }}
        >
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
              <Table.Cell>Cctv</Table.Cell>
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
export default App;
