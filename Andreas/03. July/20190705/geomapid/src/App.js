import "./App.css"; //CSS page
import * as turf from "@turf/turf"; //Tools bantuan untuk hitung distance dll
import "mapbox-gl/dist/mapbox-gl.css"; //CSS mapbox
import React, { Component } from "react"; //React
import "semantic-ui-css/semantic.min.css"; //CSS Sematic
import Draw from "@urbica/react-map-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Button, Label, Table, Form } from "semantic-ui-react"; //Tools bantuan untuk UI
import MapGL, { GeolocateControl, Marker } from "@urbica/react-map-gl"; //Mapbox Urbica

class App extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        //untuk di Mapbox
        latitude: -6.9184,
        longitude: 107.6093,
        zoom: 5.5
      },
      data: {
        type: "FeatureCollection",
        features: []
      },
      mapstyle: "mapbox://styles/mapbox/streets-v11",
      unshowmarker: "unhere.png",
      unshowmarkercctv: "unhere.png",
      arrTbl: [],
      label: [],
      layer: "0.5em",
      display: "none",
      mode: "simple_select",
      close: "inline-block",
      open: "none",
      table: "none",
      conver: "none"
    };
    this._StyleChange = this._StyleChange.bind(this);
    this._onClick = this._onClick.bind(this);
    this._sum = this._sum.bind(this);
    this._showmarker = this._showmarker.bind(this);
    this._unshowmarker = this._unshowmarker.bind(this);
    // this._unshowtable = this._unshowtable.bind(this);
    this._unshowlayer = this._unshowlayer.bind(this);
    this._showlayer = this._showlayer.bind(this);
    this._showmarkerCCTV = this._showmarkerCCTV.bind(this);
    this._unshowmarkerCCTV = this._unshowmarkerCCTV.bind(this);
    this._disp = this._disp.bind(this);
    this._undisp = this._undisp.bind(this);
    this._mode = this._mode.bind(this);
    this._modearea = this._modearea.bind(this);
    this._converter = this._converter.bind(this);
  }
  componentDidMount() {
    document.getElementById("isilang").innerHTML =
      "Long : 107.6093 Lat : -6.9184";
  }
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
  _showmarker() {
    this.setState({ unshowmarker: "here.png" });
  }
  _unshowmarker() {
    this.setState({ unshowmarker: "unhere.png" });
  }
  _showmarkerCCTV() {
    this.setState({
      unshowmarkercctv: "http://202.58.207.176:8090/mjpg/video.mjpg"
    });
  }
  _unshowmarkerCCTV() {
    this.setState({ unshowmarkercctv: "unhere.png" });
  }
  _disp() {
    this.setState({ display: "inline-block" });
  }
  _undisp() {
    this.setState({
      display: "none",
      arrTbl: [],
      label: [],
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
  }
  _unshowlayer() {
    this.setState({ layer: "-265px", close: "none", open: "inline-block" });
  }
  _showlayer() {
    this.setState({ layer: "0.5em", close: "inline-block", open: "none" });
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
    } else {
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
    }
    this.setState({ arrTbl: array, mode: "simple_select" });
  }
  _mode() {
    this.setState({ mode: "draw_line_string" });
  }
  _modearea() {
    this.setState({ mode: "draw_polygon" });
  }
  _converter() {
    this.setState({ conver: "inline-block", table: "none", label: [] });
  }
  render() {
    return (
      <div id="Page">
        {/* mapbox */}
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
          <GeolocateControl position="top-right" /> {/* get my location */}
          <Marker longitude={0} latitude={0}>
            {" "}
            {/* marker hardcode */}
            <img
              src={this.state.unshowmarker}
              height="50px"
              width="50px"
              alt=""
            />
          </Marker>
          <Marker longitude={107.60654} latitude={-6.9459}>
            <img
              src={this.state.unshowmarker}
              height="50px"
              width="50px"
              alt=""
            />
          </Marker>
          <Marker longitude={115.1244} latitude={-8.6543}>
            <img src={this.state.unshowmarkercctv} width="320" alt="" />
          </Marker>
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
        <div
          id="tools"
          style={{
            display: this.state.display,
            overflow: "scroll",
            float: "left"
          }}
        >
          <Button
            compact
            color="red"
            size="small"
            onClick={this._undisp}
            style={{
              position: "fixed",
              left: "253px",
              bottom: "297px",
              color: "white"
            }}
          >
            X
          </Button>
          <div
            style={{
              height: "50px",
              "overflow-x": "scroll",
              display: "linear"
            }}
          >
            <Button.Group>
              <Button compact size="small">
                <img src="elevation.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small" onClick={this._converter}>
                <img src="converter.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small" onClick={this._mode}>
                <img src="direction.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small" onClick={this._modearea}>
                <img src="area.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small">
                <img src="bufferpoint.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small">
                <img src="bufferline.png" width="20px" height="20px" alt="" />
              </Button>
              <Button compact size="small">
                <img src="layer.png" width="20px" height="20px" alt="" />
              </Button>
            </Button.Group>
          </div>
          <div
            style={{
              "background-color": "red",
              position: "fixed",
              bottom: "60px",
              height: "180px",
              width: "265px",
              display: this.state.conver
            }}
          >
            <form>
              <Label>Area</Label>
            </form>
          </div>
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
          {this.state.label}
        </div>
        {/** button change style map box */}
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
            value="mapbox://styles/mapbox/navigation-preview-day-v2"
            onClick={this._StyleChange}
            size="small"
          >
            Preview
          </Button>
        </div>

        <div id="Bottom">
          {/** button navigasi bawah */}
          <img src="mapid-logo.svg" align="center" height="30px" alt="logo" />
          <a href="https://www.mapid.io/">
            <Button compact size="small">
              <img src="geo-icon.png" height="10px" alt="geo" />
              <img src="mapid-icon.png" height="10px" alt="mapid" />
            </Button>
          </a>
          <Button
            compact
            size="small"
            content="Toolbox"
            icon="briefcase"
            labelPosition="left"
            onClick={this._disp}
          />
          <Button
            compact
            disabled
            size="small"
            content="Details"
            icon="bars"
            labelPosition="left"
          />
          <Button
            compact
            disabled
            size="small"
            content="Inspect"
            icon="search"
            labelPosition="left"
          />
          <Button
            compact
            disabled
            size="small"
            content="Navigate"
            icon="location arrow"
            labelPosition="left"
          />
          <Label id="isilang" />
        </div>

        <Button
          compact
          color="blue"
          size="small"
          onClick={this._unshowlayer}
          style={{
            position: "fixed",
            left: "271px",
            top: "8px",
            display: this.state.close
          }}
        >
          ~
        </Button>
        <Button
          compact
          color="blue"
          size="small"
          onClick={this._showlayer}
          style={{
            position: "fixed",
            left: "0",
            top: "8px",
            display: this.state.open
          }}
        >
          ...
        </Button>
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
                  <Button.Group compact size="small">
                    <Button onClick={this._showmarker}>ON</Button>
                    <Button onClick={this._unshowmarker}>OFF</Button>
                  </Button.Group>
                </Form.Field>
              </Table.Cell>
              <Table.Cell>Marker</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="small">
                  <Button onClick={this._showmarkerCCTV}>ON</Button>
                  <Button onClick={this._unshowmarkerCCTV}>OFF</Button>
                </Button.Group>
              </Table.Cell>
              <Table.Cell>CCTV</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="small">
                  <Button disabled>ON</Button>
                  <Button disabled>OFF</Button>
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Banjir</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="small">
                  <Button disabled>ON</Button>
                  <Button disabled>OFF</Button>
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Bendungan</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}
export default App;
