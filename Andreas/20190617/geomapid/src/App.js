import React, { Component } from "react";
import ReactMapGL, { Marker, GeolocateControl } from "react-map-gl";
import {
  Button,
  Popup,
  Label,
  Table,
  Message,
  Checkbox,
  Form
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import LineTo from "react-lineto";
import * as turf from "@turf/turf";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this._distance = this._distance.bind(this);
    this._area = this._area.bind(this);
    this._StyleChange = this._StyleChange.bind(this);
    this._onClickMap = this._onClickMap.bind(this);
    this._showmarker = this._showmarker.bind(this);
    this._unshowmarker = this._unshowmarker.bind(this);
  }

  state = {
    viewport: {
      width: window.innerWidth,
      height: 572,
      latitude: -6.9184,
      longitude: 106.6093,
      zoom: 4.69,
      area: 0,
      distance: 0,
      MapChange: "mapbox://styles/mapbox/streets-v11",
      clat: 0,
      img: "unhere.png"
    }
  };
  _showmarker() {
    this.setState({ img: "here.png" });
  }
  _unshowmarker() {
    this.setState({ img: "unhere.png" });
  }
  _onClickMap(e) {
    let lng = parseInt(e.lngLat[0] * 10000) / 10000;
    let lat = parseInt(e.lngLat[1] * 10000) / 10000;
    document.getElementById("isilang").innerHTML =
      "Long : " + lng + " Lat : " + lat;
  }
  _area() {
    var polygon = turf.polygon([[[103, -6], [103, -2], [104, -7], [103, -6]]]);
    var areas = parseInt(turf.area(polygon) / 10763.91) / 100;
    this.setState({ area: areas });
  }

  _distance() {
    var from = turf.point([107.62099, -6.9494343]);
    var to = turf.point([106.9999, -6.534343]);
    var options = { units: "kilometers" };
    var distances = parseInt(turf.distance(from, to, options) * 100) / 100;
    this.setState({ distance: distances });
  }

  _StyleChange(e) {
    console.log(e.currentTarget.value);
    this.setState({
      MapChange: e.currentTarget.value
    });
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
          onHover={this._onClickMap}
          mapStyle={this.state.MapChange}
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
            display={"false"}
          >
            <div className="A">
              <img src={this.state.img} height="50px" width="50px" alt="" />
            </div>
          </Marker>
          <Marker
            latitude={-6.534343}
            longitude={106.9999}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="B">
              <img src={this.state.img} height="50px" width="50px" alt="" />
            </div>
          </Marker>
          <LineTo from="A" to="B" />

          <Marker
            latitude={-6}
            longitude={103}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="A area">
              <img src={this.state.img} height="50px" width="50px" alt="" />
            </div>
          </Marker>
          <Marker
            latitude={-2}
            longitude={103}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="B area">
              <img src={this.state.img} height="50px" width="50px" alt="" />
            </div>
          </Marker>
          <Marker
            latitude={-7}
            longitude={104}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="C area">
              <img src={this.state.img} height="50px" width="50px" alt="" />
            </div>
          </Marker>
          <LineTo from="A area" to="B area" />
          <LineTo from="B area" to="C area" />
          <LineTo from="C area" to="A area" />
        </ReactMapGL>
        <div
          id="menu"
          style={{ position: "fixed", top: "6px", padding: "5px", left: "40px" }}
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
            value="mapbox://styles/mapbox/terrain-v2"
            onClick={this._StyleChange}
            size="small"
          >
            Terrain
          </Button>
        </div>
        <div id="Bottom">
          <img src="mapid-logo.svg" align="center" height="30px" alt="Logo" />
          <a href="https://www.mapid.io/">
            <Button compact id="Bawah" size="small">
              <img src="geo-icon.png" height="10px" alt="Geo" />
              <img src="mapid-icon.png" height="10px" alt="Mapid" />
            </Button>
          </a>
          <Popup
            trigger={
              <Button
                compact
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

              <Label style={{ display: "inline-block" }}>
                Distance : {this.state.distance} Km
              </Label>
              <Label style={{ display: "inline-block" }}>
                Area : {this.state.area} Km<sup>2</sup>
              </Label>
            </div>
          </Popup>{" "}
          <Popup
            trigger={
              <Button
                compact
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
          <Popup
            trigger={
              <Button
                compact
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
                compact
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
          <Button compact id="Bawah" size="small">
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
              </Table.Cell>
              <Table.Cell>NowMapidStory</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
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
              </Table.Cell>
              <Table.Cell>Cctv</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
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
