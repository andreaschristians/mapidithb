import "./App.css"; //CSS page
import * as turf from "@turf/turf"; //Tools bantuan untuk hitung distance dll
import "mapbox-gl/dist/mapbox-gl.css"; //CSS mapbox
import React, { Component } from "react"; //React
import "semantic-ui-css/semantic.min.css"; //CSS Sematic
import Draw from "@urbica/react-map-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
  Button,
  Label,
  Table,
  Form,
  Popup,
  Icon,
  Select
} from "semantic-ui-react"; //Tools bantuan untuk UI
import MapGL, { GeolocateControl, Marker } from "@urbica/react-map-gl"; //Mapbox Urbica

class App extends Component {
  // INISIALISASI UTAMA
  constructor() {
    super();

    // INISIALISASI
    this.state = {
      viewport: {
        latitude: -6.9184,
        longitude: 107.6093,
        zoom: 5.5
      },
      data: {
        type: "FeatureCollection",
        features: []
      },
      mapstyle: "mapbox://styles/mapbox/streets-v11",
      arrTbl: [],
      label: [],
      layer: "0.5em",
      display: "none",
      close: "inline-block",
      police: "none",
      cctv: "none",
      open: "none",
      table: "none",
      conver: "none",
      inputarea: 1,
      inputarea_: 1,
      inputlength: 1,
      inputlength_: 1,
      outputarea: 1,
      outputarea_: 1,
      outputlength: 1,
      outputlength_: 1
    };

    //DEKLARASI FUNCTION ATAU PROCEDURE
    this._StyleChange = this._StyleChange.bind(this);
    this._onClick = this._onClick.bind(this);
    this._sum = this._sum.bind(this);
    this._converter = this._converter.bind(this);
  }

  // FUNCTION BAWAAN
  componentDidMount() {
    document.getElementById("isilang").innerHTML =
      "Long : 107.6093 Lat : -6.9184";
  }

  // FUNCTION
  _onClick(e) {
    //procedure untuk hover get coordinate
    //menghilangkan koma yang banyak di belakang angka
    let lng = parseInt(e.lngLat.lng * 10000) / 10000;
    let lat = parseInt(e.lngLat.lat * 10000) / 10000;
    document.getElementById("isilang").innerHTML =
      "Long : " + lng + " Lat : " + lat;
  }
  _StyleChange(e) {
    //procedure untuk change style maps
    this.setState({
      mapstyle: e.currentTarget.value
    });
  }
  _sum(feat) {
    if (this.state.data.features.length === 0) {
      this.state.data.features.unshift(feat[0]);
    } else {
      if (this.state.data.features[0].id !== feat[0].id) {
        this.state.data.features.unshift(feat[0]);
      }
    }
    var arr = this.state.data.features[0].geometry.coordinates;
    var i, j, a, b;
    var total = 0;
    var array = [];
    this.setState({ label: [], table: "", conver: "none" });
    if (this.state.data.features[0].geometry.type === "LineString") {
      for (i = 1; i < arr.length; i++) {
        var from = turf.point([arr[i - 1][0], arr[i - 1][1]]);
        var to = turf.point([arr[i][0], arr[i][1]]);
        var options = { units: "kilometers" }; //satuan perhitungan
        total += turf.distance(from, to, options); //menghitung jarak data 1 dan 2
        total = parseInt(total * 100) / 100;
      }
      for (j = 0; j < arr.length; j++) {
        a = parseInt(arr[j][0] * 10000) / 10000;
        b = parseInt(arr[j][1] * 10000) / 10000;
        array.push(
          <Table.Row collapsing>
            <Table.Cell>{a}</Table.Cell>
            <Table.Cell>{b}</Table.Cell>
          </Table.Row>
        );
      }
      this.setState({ label: <Label>Distance : {total} Km</Label> });
    } else if (this.state.data.features[0].geometry.type === "Polygon") {
      var polygon = turf.polygon(arr);
      total = parseInt(turf.area(polygon) / 10763.91) / 100;
      for (i = 1; i < arr[0].length; i++) {
        a = parseInt(arr[0][i - 1][0] * 10000) / 10000;
        b = parseInt(arr[0][i - 1][1] * 10000) / 10000;
        array.push(
          <Table.Row collapsing>
            <Table.Cell>{a}</Table.Cell>
            <Table.Cell>{b}</Table.Cell>
          </Table.Row>
        );
        this.setState({
          label: (
            <Label>
              Area : {total} Km<sup>2</sup>
            </Label>
          )
        });
      }
    } else {
      a = parseInt(arr[0] * 10000) / 10000;
      b = parseInt(arr[1] * 10000) / 10000;
      array.push(
        <Table.Row collapsing>
          <Table.Cell>{a}</Table.Cell>
          <Table.Cell>{b}</Table.Cell>
        </Table.Row>
      );
      console.log(arr);
    }
    this.setState({ arrTbl: array, mode: "simple_select" });
  }
  _converter(e, { name, value }) {
    var banding, hasil;
    if ([name][0] === "inputarea") {
      this.setState({ inputarea: value });
      banding = this.state.outputarea_ / this.state.inputarea_;
      hasil = banding * value;
      this.setState({ outputarea: hasil });
    } else if ([name][0] === "inputlength") {
      this.setState({ inputlength: value });
      banding = this.state.outputlength_ / this.state.inputlength_;
      hasil = banding * value;
      this.setState({ outputlength: hasil });
    } else if ([name][0] === "inputarea_") {
      this.setState({ inputarea_: value });
    } else if ([name][0] === "outputarea_") {
      this.setState({ outputarea_: value });
    } else if ([name][0] === "inputlength_") {
      this.setState({ inputlength_: value });
    } else if ([name][0] === "outputlength_") {
      this.setState({ outputlength_: value });
    }
  }

  // TAMPILAN UI
  render() {
    return (
      // PAGE
      <div id="Page">
        {/* MAPBOX AND DRAW */}
        <MapGL
          style={{ width: "100%", height: "576px" }}
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
          {/* MY LOCATION */}
          <GeolocateControl position="top-right" />

          {/* POLICE */}
          <Marker longitude={106.8258} latitude={-6.2347}>
            <Icon name="user secret" style={{ display: this.state.police }} />
          </Marker>
          <Marker longitude={106.7767} latitude={-6.2785}>
            <Icon name="user secret" style={{ display: this.state.police }} />
          </Marker>

          {/* CCTV */}
          <Marker longitude={115.1244} latitude={-8.6543}>
            <Popup
              on="click"
              pinned
              trigger={
                <Icon name="video" style={{ display: this.state.cctv }} />
              }
            >
              <img
                src="http://202.58.207.176:8090/mjpg/video.mjpg"
                width="320"
                alt=""
              />
            </Popup>
          </Marker>
          <Marker longitude={107.505} latitude={-6.8432}>
            <Popup
              on="click"
              pinned
              trigger={
                <Icon name="video" style={{ display: this.state.cctv }} />
              }
            >
              <img
                src="http://210.23.68.3:84/mjpg/video.mjpg"
                width="320"
                alt=""
              />
            </Popup>
          </Marker>

          {/* DRAW PROPERTIES */}
          <Draw
            data={this.state.data}
            mode={this.state.mode}
            onDrawCreate={({ features }) => this._sum(features)}
            onDrawUpdate={({ features }) => this._sum(features)}
            combineFeaturesControl={false}
            uncombineFeaturesControl={false}
            lineStringControl={false}
            pointControl={false}
            polygonControl={false}
            trashControl={false}
          />
        </MapGL>

        {/* TOOLBOXS */}
        <div
          id="tools"
          style={{
            display: this.state.display,
            overflowY: "scroll",
            float: "left"
          }}
        >
          {/* CLOSE BUTTON */}
          <Button
            compact
            color="red"
            size="small"
            onClick={() =>
              this.setState({
                display: "none",
                arrTbl: [],
                label: [],
                data: {
                  type: "FeatureCollection",
                  features: []
                }
              })
            }
            style={{
              position: "fixed",
              left: "253px",
              bottom: "297px",
              color: "white"
            }}
          >
            X
          </Button>

          {/* MENU TOOLBOXS */}
          <div
            style={{
              height: "50px",
              overflowX: "scroll",
              display: "linear"
            }}
          >
            <Button.Group>
              <Button
                compact
                size="small"
                onClick={() => this.setState({ mode: "draw_point" })}
              >
                <img src="elevation.png" width="20px" height="20px" alt="" />
              </Button>
              <Button
                compact
                size="small"
                onClick={() =>
                  this.setState({
                    conver: "inline-block",
                    table: "none",
                    label: []
                  })
                }
              >
                <img src="converter.png" width="20px" height="20px" alt="" />
              </Button>
              <Button
                compact
                size="small"
                onClick={() => this.setState({ mode: "draw_line_string" })}
              >
                <img src="direction.png" width="20px" height="20px" alt="" />
              </Button>
              <Button
                compact
                size="small"
                onClick={() => this.setState({ mode: "draw_polygon" })}
              >
                <img src="area.png" width="20px" height="20px" alt="" />
              </Button>
              <Button
                compact
                size="small"
                onClick={() => this.setState({ mode: "draw_point" })}
              >
                <img src="bufferpoint.png" width="20px" height="20px" alt="" />
              </Button>
              <Button
                compact
                size="small"
                onClick={() => this.setState({ mode: "draw_line_string" })}
              >
                <img src="bufferline.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small">
                <img src="layer.png" width="20px" height="20px" alt="" />
              </Button>
            </Button.Group>
          </div>

          {/* CONVERTER FORM */}
          <div
            style={{
              backgroundColor: "white",
              position: "fixed",
              bottom: "60px",
              height: "180px",
              width: "250px",
              left: "20px",
              padding: "10px",
              overflowY: "scroll",
              display: this.state.conver
            }}
          >
            <Form size="mini">
              <Form.Field>
                <label>Convert Area</label>
                <Form.Group>
                  <Form.Input
                    placeholder="1"
                    width={10}
                    name="inputarea"
                    value={this.inputarea}
                    onChange={this._converter}
                  />
                  <Form.Field
                    placeholder="km²"
                    control={Select}
                    name="inputarea_"
                    onChange={this._converter}
                    width={5}
                    options={[
                      { key: "k", text: "km²", value: 1 },
                      { key: "m", text: "m²", value: 1000000 },
                      { key: "c", text: "cm²", value: 10000000000 }
                    ]}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Input
                    readOnly
                    placeholder={this.state.outputarea}
                    width={10}
                  />
                  <Form.Field
                    placeholder="km²"
                    control={Select}
                    name="outputarea_"
                    onChange={this._converter}
                    width={5}
                    options={[
                      { key: "k", text: "km²", value: 1 },
                      { key: "m", text: "m²", value: 1000000 },
                      { key: "c", text: "cm²", value: 10000000000 }
                    ]}
                  />
                </Form.Group>
              </Form.Field>
              <Form.Field>
                <label>Convert Length</label>
                <Form.Group>
                  <Form.Input
                    placeholder="1"
                    width={10}
                    name="inputlength"
                    value={this.inputlength}
                    onChange={this._converter}
                  />
                  <Form.Field
                    placeholder="km"
                    control={Select}
                    name="inputlength_"
                    onChange={this._converter}
                    width={5}
                    options={[
                      { key: "k", text: "km", value: 1 },
                      { key: "m", text: "meters", value: 1000 },
                      { key: "c", text: "cm", value: 100000 }
                    ]}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Input
                    readOnly
                    placeholder={this.state.outputlength}
                    width={10}
                  />
                  <Form.Field
                    placeholder="km"
                    control={Select}
                    name="outputlength_"
                    onChange={this._converter}
                    width={5}
                    options={[
                      { key: "k", text: "km", value: 1 },
                      { key: "m", text: "meters", value: 1000 },
                      { key: "c", text: "cm", value: 100000 }
                    ]}
                  />
                </Form.Group>
              </Form.Field>
            </Form>
          </div>

          {/* TABLE LONGLAT */}
          <Table
            collapsing
            id="tbl"
            style={{ top: "80px", display: this.state.table }}
            size="small"
            celled
            structured
          >
            <Table.Header />
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell>
                  <center>longitude</center>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <center>Langtitude</center>
                </Table.HeaderCell>
              </Table.Row>
              {this.state.arrTbl}
            </Table.Body>
          </Table>

          {/* HASIL AREA DISTANCE */}
          {this.state.label}
        </div>

        {/** CHANGE STYLE MAPBOX */}
        <div
          style={{
            position: "fixed",
            top: "9px",
            padding: "5px",
            right: "40px"
          }}
        >
          <Button.Group size="mini">
            <Button
              compact
              value="mapbox://styles/mapbox/streets-v11"
              onClick={this._StyleChange}
            >
              Streets
            </Button>
            <Button
              compact
              value="mapbox://styles/mapbox/satellite-v9"
              onClick={this._StyleChange}
            >
              Sattelite
            </Button>
            <Button
              compact
              value="mapbox://styles/mapbox/satellite-streets-v9"
              onClick={this._StyleChange}
            >
              Hybrid
            </Button>
            <Button
              compact
              value="mapbox://styles/mapbox/navigation-preview-day-v2"
              onClick={this._StyleChange}
            >
              Preview
            </Button>
          </Button.Group>
        </div>

        {/* BUTTON NAVIGATION */}
        <div id="Bottom">
          <img src="mapid-logo.svg" align="center" height="30px" alt="logo" />
          <Button.Group size="mini" compact>
            <Button compact size="small">
              <a href="https://www.mapid.io/">
                <img src="geo-icon.png" height="10px" alt="geo" />
                <img src="mapid-icon.png" height="10px" alt="mapid" />
              </a>
            </Button>
            <Button
              content="Toolbox"
              icon="briefcase"
              labelPosition="left"
              onClick={() => this.setState({ display: "inline-block" })}
            />
            <Button
              disabled
              content="Details"
              icon="bars"
              labelPosition="left"
            />
            <Button
              disabled
              content="Inspect"
              icon="search"
              labelPosition="left"
            />
            <Button
              disabled
              content="Navigate"
              icon="location arrow"
              labelPosition="left"
            />
            <Button id="isilang" />
          </Button.Group>
        </div>

        {/* TABLE LAYER */}
        <Table
          collapsing
          id="tbl"
          style={{
            left: this.state.layer
          }}
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="3">
                <center>Layer Manager</center>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Form.Field>
                  <Button.Group compact size="mini">
                    <Button
                      onClick={() => this.setState({ police: "block" })}
                      icon="eye"
                    />
                    <Button
                      onClick={() => this.setState({ police: "none" })}
                      icon="eye slash"
                    />
                  </Button.Group>
                </Form.Field>
              </Table.Cell>
              <Table.Cell>Kantor Polisi</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="mini">
                  <Button
                    icon="eye"
                    onClick={() =>
                      this.setState({
                        cctv: "block"
                      })
                    }
                  />
                  <Button
                    icon="eye slash"
                    onClick={() => this.setState({ cctv: "none" })}
                  />
                </Button.Group>
              </Table.Cell>
              <Table.Cell>CCTV</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="mini">
                  <Button disabled icon="eye" />
                  <Button disabled icon="eye slash" />
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Banjir</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="mini">
                  <Button disabled icon="eye" />
                  <Button disabled icon="eye slash" />
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Bendungan</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {/* HIDE TABLE LAYER */}
        <Button
          compact
          color="blue"
          size="small"
          onClick={() =>
            this.setState({
              layer: "-265px",
              close: "none",
              open: "inline-block"
            })
          }
          style={{
            position: "fixed",
            left: "271px",
            top: "8px",
            display: this.state.close
          }}
        >
          ~
        </Button>

        {/* SHOW TABLE LAYER */}
        <Button
          compact
          color="blue"
          size="small"
          onClick={() =>
            this.setState({
              layer: "0.5em",
              close: "inline-block",
              open: "none"
            })
          }
          style={{
            position: "fixed",
            left: "0",
            top: "8px",
            display: this.state.open
          }}
        >
          ...
        </Button>
      </div>
    );
  }
}
export default App;
