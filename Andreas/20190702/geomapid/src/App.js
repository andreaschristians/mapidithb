import "./App.css"; //CSS page
import * as turf from "@turf/turf"; //Tools bantuan untuk hitung distance dll
import "mapbox-gl/dist/mapbox-gl.css"; //CSS mapbox
import React, { Component } from "react"; //React
import "semantic-ui-css/semantic.min.css"; //CSS Sematic
import { Button, Popup, Label, Message, Table, Form } from "semantic-ui-react"; //Tools bantuan untuk UI
import MapGL, {
  GeolocateControl,
  Marker,
  Source,
  Layer
} from "@urbica/react-map-gl"; //Mapbox Urbica

var point; //Tampung point saat diclick (distance)
var coord; //Tampung coordinate untuk buat line (distance)

class App extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        //untuk di Mapbox
        latitude: -6.9184,
        longitude: 107.6093,
        zoom: 5.5,
        arrPoint: [] //point yang di tampilkan untuk distance
      },
      mapstyle: "mapbox://styles/mapbox/streets-v11",
      unshowmarker: "unhere.png",
      sumdistance: 0.0,
      counter: 0,
      arrCoord: []
    };
    this._StyleChange = this._StyleChange.bind(this);
    this._onClickMap = this._onClickMap.bind(this);
    this._onClick = this._onClick.bind(this);
    this._showmarker = this._showmarker.bind(this);
    this._unshowmarker = this._unshowmarker.bind(this);
    this._clearMaps = this._clearMaps.bind(this);
  }

  componentDidMount() {
    point = []; //inisialisasi
    coord = []; //inisialisasi
    document.getElementById("isilang").innerHTML =
      "Long : 107.6093 Lat : -6.9184";
  }
  _onClickMap(e) {
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
  _clearMaps() {
    var clear = [];
    var del = 0;
    point = [];
    coord = [];
    this.setState({ arrCoord: clear });
    this.setState({ arrPoint: clear });
    this.setState({ counter: del });
    this.setState({ sumdistance: del });
  }
  _onClick(e) {
    let lng = parseInt(e.lngLat.lng * 10000) / 10000;
    let lat = parseInt(e.lngLat.lat * 10000) / 10000;
    document.getElementById("isilang").innerHTML =
      "Long : " + lng + " Lat : " + lat;
    //procedure untuk menghitung distance dan tampilannya
    var n = this.state.counter + 1; //counter array
    var nilai =this.state.sumdistance; //tampungan nilai distance sebelumnya
    this.setState({ counter: n }); //update counter ke variable global
    point.push(
      //input marker dan tampilan point ke array
      <Marker longitude={e.lngLat.lng} latitude={e.lngLat.lat}>
        <img src="dot.png" height="10px" width="10px" alt="" />
      </Marker>
    );
    if (this.state.counter > 1) {
      //hitung distance baru ada ketika sudah ada 2 data
      var from = turf.point([
        //data 1
        this.state.arrPoint[n - 2].props.longitude,
        this.state.arrPoint[n - 2].props.latitude
      ]);
      var to = turf.point([
        //data 2
        this.state.arrPoint[n - 1].props.longitude,
        this.state.arrPoint[n - 1].props.latitude
      ]);
      var options = { units: "kilometers" }; //satuan perhitungan
      var total = turf.distance(from, to, options); //menghitung jarak data 1 dan 2
      console.log(total);
      total = total + nilai; //menambahkan dengan data distance yang ada sebelumnya
      this.setState({ sumdistance: total }); //update nilai distance
      console.log(total);
    }
    coord.push([e.lngLat.lng, e.lngLat.lat]); //input data coordinate untuk membuat line
    this.setState({ arrCoord: coord }); //update coordinate untuk tampilan line
    this.setState({ arrPoint: point }); //update point untuk tampilan point
  }

  render() {
    const data = {
      //data coordinate untuk menampilkan line
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: this.state.arrCoord //ambil dari data yang ada dari procedure _onClick
      }
    };

    return (
      <div id="Page">{/* mapbox */}
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
          <GeolocateControl position="top-right" />   {/* get my location */}  
          {this.state.arrPoint}                       {/* munculin point */}
          <Marker longitude={0} latitude={0}>         {/* marker hardcode */}
            <img
              src={this.state.unshowmarker}
              height="50px"
              width="50px"
              alt=""
            />
          </Marker>
          ,
          <Marker longitude={107.60654} latitude={-6.9459}>
            <img
              src={this.state.unshowmarker}
              height="50px"
              width="50px"
              alt=""
            />
          </Marker>
          <Source id="route" type="geojson" data={data} />
          {/* munculin line */}
          <Layer                  
            id="route"
            type="line"
            source="route"
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            paint={{
              "line-color": "#888",
              "line-width": 2
            }}
          />
        </MapGL>
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
            disabled
            value=""
            onClick={this._StyleChange}
            size="small"
          >
            Terrain
          </Button>
        </div>
        <div id="Bottom">   {/** button navigasi bawah */}
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
          <Button compact size="small" onClick={this._clearMaps}>
            Clear Maps
          </Button>
          <Label>
            Distance : {parseInt(this.state.sumdistance * 100) / 100} KM
          </Label>
        </div>
        <Table
          collapsing
          id="tbl"
          style={{ height: "10px", overflow: "scroll"}}
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="3"><center>Layer Manager</center></Table.HeaderCell>
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
                  <Button disabled>ON</Button>
                  <Button disabled>OFF</Button>
                </Button.Group>
              </Table.Cell>
              <Table.Cell>NowMapidStory</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="small">
                  <Button disabled>ON</Button>
                  <Button disabled>OFF</Button>
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Cctv</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="small">
                  <Button disabled>ON</Button>
                  <Button disabled>OFF</Button>
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Bendungan_Indonesia</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default App;
