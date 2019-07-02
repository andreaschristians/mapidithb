import React, { Component } from "react";
import "./App.css";
import { Button, Popup, Label, Message, Table, Form } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import MapGL, { GeolocateControl, Marker } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
var markers;

class App extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        latitude: -6.9184,
        longitude: 106.6093,
        zoom: 5.5,
        datamarker: []
      },
      mapstyle: "mapbox://styles/mapbox/streets-v11",
      img: "unhere.png",
      sumdistance: 0,
      x: 0
    };
    this._StyleChange = this._StyleChange.bind(this);
    this._onClickMap = this._onClickMap.bind(this);
    this._onClick = this._onClick.bind(this);
    this._showmarker = this._showmarker.bind(this);
    this._unshowmarker = this._unshowmarker.bind(this);
  }

  componentDidMount() {
    markers = [];
  }
  _onClickMap(e) {
    let lng = parseInt(e.lngLat.lng * 10000) / 10000;
    let lat = parseInt(e.lngLat.lat * 10000) / 10000;
    document.getElementById("isilang").innerHTML =
      "Long : " + lng + " Lat : " + lat;
  }
  _StyleChange(e) {
    this.setState({
      mapstyle: e.currentTarget.value
    });
  }
  _showmarker() {
    this.setState({ img: "here.png" });
  }
  _unshowmarker() {
    this.setState({ img: "unhere.png" });
  }
  _onClick(e) {
    var n = this.state.x + 1;
    var nilai = parseInt(this.state.sumdistance);
    this.setState({ x: n });
    markers.push(
      <Marker longitude={e.lngLat.lng} latitude={e.lngLat.lat}>
        <img src="here.png" height="50px" width="50px" alt="" />
      </Marker>
    );
    if (this.state.x > 1) {
      var from = turf.point([
        this.state.datamarker[n - 2].props.longitude,
        this.state.datamarker[n - 2].props.latitude
      ]);
      var to = turf.point([
        this.state.datamarker[n - 1].props.longitude,
        this.state.datamarker[n - 1].props.latitude
      ]);
      var options = { units: "kilometers" };
      var total = parseInt(turf.distance(from, to, options) * 100) / 100;
      total = total + nilai;
      this.setState({ sumdistance: total });
    }
    console.log(this.state.sumdistance);
    this.setState({ datamarker: markers });
  }

  render() {
    return (
      <div id="Page">
        <MapGL
          style={{ width: "100%", height: "575px" }}
          mapStyle={this.state.mapstyle}
          accessToken={
            "pk.eyJ1IjoiYW5kcmVhc2NocmlzdGlhbiIsImEiOiJjanZ2cnZhMjg0NWtmNDN1aTMxcGphY21xIn0.CDEBH4hJPmAhRDOtzz73Mw"
          }
          onClick={this._onClick}
          latitude={this.state.viewport.latitude}
          longitude={this.state.viewport.longitude}
          zoom={this.state.viewport.zoom}
          onViewportChange={viewport => this.setState({ viewport })}
        >
          <GeolocateControl position="top-right" />
          {this.state.datamarker}
          <Marker longitude={0} latitude={0}>
            <img src={this.state.img} height="50px" width="50px" alt="" />
          </Marker>
          ,
          <Marker longitude={107.6065} latitude={-6.9458}>
            <img src={this.state.img} height="50px" width="50px" alt="" />
          </Marker>
        </MapGL>
        <div
          id="menu"
          style={{
            position: "fixed",
            top: "6px",
            padding: "5px",
            right: "40px"
          }}
        >
          <Button
            compact
            value="mapbox://styles/mapbox/streets-v11"
            onClick={this._StyleChange}
            size="small"
          >
            Streets
          </Button>
          <Button
            compact
            value="mapbox://styles/mapbox/satellite-v9"
            onClick={this._StyleChange}
            size="small"
          >
            Sattelite
          </Button>
          <Button
            compact
            value="mapbox://styles/mapbox/satellite-streets-v9"
            onClick={this._StyleChange}
            size="small"
          >
            Hybrid
          </Button>
          <Button
            compact
            disabled
            value=""
            onClick={this._StyleChange}
            size="small"
          >
            Terrain
          </Button>
        </div>
        <div id="Bottom">
          <img src="mapid-logo.svg" align="center" height="30px" alt="Logo" />
          <a href="https://www.mapid.io/">
            <Button compact size="small">
              <img src="geo-icon.png" height="10px" alt="Geo" />
              <img src="mapid-icon.png" height="10px" alt="Mapid" />
            </Button>
          </a>
          <Popup
            trigger={
              <Button
                compact
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
                <Button
                  size="small"
                  content="Hitung Distance"
                  onClick={this._distance}
                />
                <Button
                  size="small"
                  content="Hitung Area"
                  onClick={this._area}
                />
              </div>

              <Label style={{ display: this.state.display1 }}>
                Distance : {this.state.distance} Km
              </Label>
              <Label style={{ display: this.state.display2 }}>
                Area : {this.state.area} Km<sup>2</sup>
              </Label>
            </div>
          </Popup>
          <Popup
            trigger={
              <Button
                compact
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
          <Popup
            trigger={
              <Button
                compact
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
                compact
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
          <Button compact size="small">
            <div id="isilang" />
          </Button>
          <Label>Distance : {this.state.sumdistance}</Label>
        </div>
        <Table
          collapsing
          id="tbl"
          style={{ height: "10px", overflow: "scroll", font: "center" }}
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="3">Layer Manager</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Button
                  // onClick={this._showmarker}
                  label="ON"
                  compact
                  size="small"
                  // onMouseUp={this._unshowmarker}
                />
                <Button
                  // onClick={this._unshowmarker}
                  label="OFF"
                  compact
                  size="small"
                  // onMouseUp={this._unshowmarker}
                />
              </Table.Cell>
              <Table.Cell>NowMapidStory</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button
                  // onClick={this._showmarker}
                  label="ON"
                  compact
                  size="small"
                  // onMouseUp={this._unshowmarker}
                />
                <Button
                  // onClick={this._unshowmarker}
                  label="OFF"
                  compact
                  size="small"
                  // onMouseUp={this._unshowmarker}
                />
              </Table.Cell>
              <Table.Cell>Cctv</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button
                  // onClick={this._showmarker}
                  label="ON"
                  compact
                  size="small"
                  // onMouseUp={this._unshowmarker}
                />
                <Button
                  // onClick={this._unshowmarker}
                  label="OFF"
                  compact
                  size="small"
                  // onMouseUp={this._unshowmarker}
                />
              </Table.Cell>
              <Table.Cell>Bendungan_Indonesia</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Form.Field>
                  <Button
                    onClick={this._showmarker}
                    label="ON"
                    compact
                    size="small"
                    // onMouseUp={this._unshowmarker}
                  />
                  <Button
                    onClick={this._unshowmarker}
                    label="OFF"
                    compact
                    size="small"
                    // onMouseUp={this._unshowmarker}
                  />
                </Form.Field>
              </Table.Cell>
              <Table.Cell>Marker</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default App;
