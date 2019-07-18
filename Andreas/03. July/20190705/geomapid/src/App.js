//IMPORT
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
import MapGL, {
  GeolocateControl,
  Marker,
  Layer,
  Source
} from "@urbica/react-map-gl"; //Mapbox Urbica
import Geocoder from "react-mapbox-gl-geocoder";

//DATA LAYER
const databanjir1 = {
  red: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.72718612208746, -6.154339766596152],
          [106.72721825022546, -6.161750486558091],
          [106.73361175106402, -6.160728324424994],
          [106.7387201261073, -6.159067306783072],
          [106.7475553660123, -6.158140967794381],
          [106.7481324235614, -6.155170283482676],
          [106.74308830482175, -6.155042511742067],
          [106.73447796196547, -6.1547550252202825],
          [106.73107237862172, -6.155106397616194],
          [106.72718612208746, -6.154339766596152]
        ]
      ]
    }
  },
  pink: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.73285781277269, -6.160926327882834],
          [106.73285874339376, -6.161706411727565],
          [106.73207366198494, -6.16270377502893],
          [106.73224812459148, -6.163397374842475],
          [106.73198643076552, -6.163924704796273],
          [106.73163750571024, -6.1640981587041495],
          [106.73102688684628, -6.166092874422276],
          [106.72989288038224, -6.167697314239788],
          [106.72923864586909, -6.167914130051997],
          [106.72923864586909, -6.1685645769738215],
          [106.72775571434983, -6.168954844750772],
          [106.72862802700524, -6.176153065444822],
          [106.72958757094159, -6.1758928904881145],
          [106.73032903670128, -6.175632715420704],
          [106.73098327121437, -6.176153065444822],
          [106.73102688684628, -6.174938914598755],
          [106.73207366202917, -6.174418563381536],
          [106.73172473697406, -6.173854848987318],
          [106.73203004639731, -6.172640692872619],
          [106.73246620273369, -6.17272741839929],
          [106.73298959033383, -6.171730073951849],
          [106.73390551863832, -6.17120971958262],
          [106.7342544436936, -6.171860162460078],
          [106.73495229383866, -6.1709929051184815],
          [106.73530121890343, -6.171122993816027],
          [106.73582193270767, -6.170646001782501],
          [106.73560385454823, -6.170255735250819],
          [106.73586554833963, -6.169735379451126],
          [106.73643255157174, -6.170429187087706],
          [106.73734847987623, -6.169908831441134],
          [106.73778463621255, -6.17055927591521],
          [106.7385697176041, -6.170255735250819],
          [106.7377410205633, -6.169258386168693],
          [106.73808994563586, -6.168607940098099],
          [106.7385697176041, -6.169648653417582],
          [106.73904948957232, -6.169215023123286],
          [106.73979095533196, -6.168130945801167],
          [106.74031434291652, -6.168607940106966],
          [106.74061931905914, -6.167610587907305],
          [106.74118632229107, -6.16787076691395],
          [106.74170970989127, -6.168087582672371],
          [106.74240756001899, -6.166830050087185],
          [106.74415218533943, -6.166439780771995],
          [106.74410856970758, -6.165745967914518],
          [106.74319264140303, -6.16539906113691],
          [106.74227671311576, -6.165529151198555],
          [106.74188417241135, -6.164748610332225],
          [106.7424947912753, -6.164531793208667],
          [106.74184055677938, -6.164054795262615],
          [106.740750165978, -6.16457515665158],
          [106.74096824410293, -6.165266654902524],
          [106.73970339074322, -6.165353381635583],
          [106.74031400960712, -6.166871097219712],
          [106.7375662247108, -6.168605623989393],
          [106.73691199021499, -6.169689700340669],
          [106.73569075248707, -6.169169343968079],
          [106.73647583387861, -6.168302082206154],
          [106.73603967755963, -6.16596046838697],
          [106.73630137135103, -6.1650064746011],
          [106.73730453091935, -6.164356023315008],
          [106.73704283711066, -6.163445390181607],
          [106.73516736488699, -6.163228572525398],
          [106.73490567109553, -6.160930300036668],
          [106.73717368402362, -6.16014975240526],
          [106.73699922147875, -6.159759478150647],
          [106.73285781277269, -6.160926327882834]
        ]
      ]
    }
  },
  green: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.74890628935145, -6.166220648203222],
          [106.7492988300558, -6.172941916072347],
          [106.75571032813576, -6.165570198406073],
          [106.75191576803917, -6.166567554443432],
          [106.75052006778373, -6.166047195006556],
          [106.74890628935145, -6.166220648203222]
        ]
      ]
    }
  }
};
const databanjir2 = {
  red2: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.73244138558238, -6.175777656139218],
          [106.73374986292168, -6.167159231939635],
          [106.7389837722792, -6.147645301337278],
          [106.77104146712895, -6.13431037023814],
          [106.76090076773124, -6.1718749908575035],
          [106.74012868995112, -6.1843959400458175],
          [106.73162358724517, -6.187648086157765],
          [106.73244138558238, -6.175777656139218]
        ]
      ]
    }
  },
  pink2: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.71444982216627, -6.158134128188621],
          [106.71706677684921, -6.174070243635086],
          [106.71150574815567, -6.189355454928673],
          [106.70366908832625, -6.1990834992753605],
          [106.68665888289519, -6.186888112114033],
          [106.71444982216627, -6.158134128188621]
        ]
      ]
    }
  }
};
var police;
var arr = [
  [106.8544, -6.1994],
  [106.8732, -6.2041],
  [106.8468, -6.181],
  [106.8392, -6.1796],
  [106.8518, -6.1789],
  [106.8495, -6.1835],
  [106.8614, -6.1733],
  [106.8552, -6.1597],
  [106.847, -6.1569],
  [106.839, -6.1705],
  [106.8075, -6.1661],
  [106.8118, -6.181],
  [106.7981, -6.195],
  [106.803, -6.1949],
  [106.7292, -6.1461],
  [106.7384, -6.153],
  [106.7189, -6.0956],
  [106.7736, -6.1089],
  [106.7903, -6.1032],
  [106.8006, -6.1246],
  [106.8226, -6.1331],
  [106.87, -6.1347],
  [106.8802, -6.1151],
  [106.8821, -6.1135],
  [106.882, -6.1075],
  [106.8983, -6.1301],
  [106.9167, -6.1201],
  [106.9144, -6.1219],
  [106.9144, -6.1214],
  [106.8939, -6.1168],
  [106.7893, -6.174],
  [106.7996, -6.1675],
  [106.7698, -6.2171],
  [106.7649, -6.1989],
  [106.8714, -6.2466],
  [106.8654, -6.3051],
  [106.891, -6.2105],
  [106.8099, -6.2004],
  [106.802, -6.1526],
  [106.8609, -6.19],
  [106.8517, -6.2315],
  [106.8386, -6.2676],
  [106.8386, -6.2686],
  [106.8224, -6.2717],
  [106.7933, -6.2829],
  [106.7932, -6.2832],
  [106.7936, -6.2691],
  [106.7823, -6.2734],
  [106.7688, -6.2876],
  [106.7986, -6.2534],
  [106.8016, -6.2406],
  [106.7896, -6.2416],
  [106.8034, -6.2389],
  [106.8014, -6.2388],
  [106.8124, -6.2227],
  [106.8266, -6.2406],
  [106.855, -6.2438],
  [106.8557, -6.2447],
  [106.8259, -6.2113],
  [106.8684, -6.2438],
  [106.8633, -6.2146],
  [106.9175, -6.2476],
  [106.9346, -6.2217],
  [106.9406, -6.1843]
];
var showpolice;

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
      details: "none",
      inspect: "none",
      navigation: "none",
      inputarea: 1,
      inputarea_: 1,
      inputlength: 1,
      inputlength_: 1,
      outputarea: 1,
      outputarea_: 1,
      outputlength: 1,
      outputlength_: 1,
      banjir1: 0,
      banjir2: 0,
      before: {
        red: "",
        pink: "",
        green: ""
      },
      after: {
        red2: "",
        pink2: ""
      },
      arrPolice: [],
      arrshowPolice: [],
      tablepolice: "none"
    };

    //DEKLARASI FUNCTION ATAU PROCEDURE
    this._StyleChange = this._StyleChange.bind(this);
    this._onClick = this._onClick.bind(this);
    this._sum = this._sum.bind(this);
    this._converter = this._converter.bind(this);
    this._addPolice = this._addPolice.bind(this);
    this._showPolice = this._showPolice.bind(this);
  }

  // FUNCTION BAWAAN
  componentDidMount() {
    document.getElementById("isilang").innerHTML =
      "Long : 107.6093 Lat : -6.9184";
  }

  // FUNCTION
  _addPolice() {
    police = [];
    var i;
    for (i = 0; i < arr.length; i++) {
      police.push(
        <Marker longitude={arr[i][0]} latitude={arr[i][1]}>
          <Icon name="user secret" />
        </Marker>
      );
    }
    this.setState({ arrPolice: police });
  }
  _showPolice() {
    if (this.state.details === "inline-block") {
      this.setState({ tablepolice: "block" });
      showpolice = [];
      var i;
      for (i = 0; i < arr.length; i++) {
        showpolice.push(
          <Table.Row>
            <Table.Cell>{i + 1}</Table.Cell>
            <Table.Cell>{arr[i][0]}</Table.Cell>
            <Table.Cell>{arr[i][1]}</Table.Cell>
          </Table.Row>
        );
      }
    }
    this.setState({ arrshowPolice: showpolice });
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
  _sum(feat) {
    this.state.data.features.push(feat[0]);
    var i, j, a, b;
    var total = 0;
    var array = [];
    var con = this.state.data.features.length - 1;
    var arr = this.state.data.features[con].geometry.coordinates;
    this.setState({ label: [], table: "", conver: "none" });
    if (this.state.data.features[con].geometry.type === "LineString") {
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
    } else if (this.state.data.features[con].geometry.type === "Polygon") {
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
      banding = this.state.outputarea_ / value;
      hasil = banding * this.state.inputarea;
      this.setState({ outputarea: hasil });
    } else if ([name][0] === "outputarea_") {
      this.setState({ outputarea_: value });
      banding = value / this.state.inputarea_;
      hasil = banding * this.state.inputarea;
      this.setState({ outputarea: hasil });
    } else if ([name][0] === "inputlength_") {
      this.setState({ inputlength_: value });
    } else if ([name][0] === "outputlength_") {
      this.setState({ outputlength_: value });
    }
  }
  onSelected = (viewport, item) => {
    this.setState({ viewport });
    console.log("Selected: ", item);
  };

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
          {this.state.arrPolice}

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
          <Marker longitude={106.9587} latitude={-6.258}>
            <Popup
              on="click"
              pinned
              trigger={
                <Icon name="video" style={{ display: this.state.cctv }} />
              }
            >
              <img
                src="http://203.77.210.41:2000/mjpg/video.mjpg"
                width="320"
                alt=""
              />
            </Popup>
          </Marker>
          <Marker longitude={112.701} latitude={-7.2873}>
            <Popup
              on="click"
              pinned
              trigger={
                <Icon name="video" style={{ display: this.state.cctv }} />
              }
            >
              <img
                src="http://116.68.252.222:89/mjpg/video.mjpg"
                width="320"
                alt=""
              />
            </Popup>
          </Marker>

          {/* BANJIR1 */}
          {Object.entries(this.state.before).map(([layerId]) => (
            <React.Fragment key={layerId}>
              <Source id={layerId} type="geojson" data={databanjir1[layerId]} />
              <Layer
                id={layerId}
                type="fill"
                source={layerId}
                paint={{
                  "fill-color": "red",
                  "fill-opacity": this.state.banjir1
                }}
              />
            </React.Fragment>
          ))}

          {/* BANJIR2 */}
          {Object.entries(this.state.after).map(([layerId]) => (
            <React.Fragment key={layerId}>
              <Source id={layerId} type="geojson" data={databanjir2[layerId]} />
              <Layer
                id={layerId}
                type="fill"
                source={layerId}
                paint={{
                  "fill-color": "blue",
                  "fill-opacity": this.state.banjir2
                }}
              />
            </React.Fragment>
          ))}

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

          {/* SEARCH */}
          <div
            style={{
              position: "fixed",
              top: "15px",
              right: "50px",
              maxWidth: "150px",
              boxShadow: "0 0 10px 2px rgba(0,0,0,.1)",
              borderRadius: "4px"
            }}
          >
            <Geocoder
              mapboxApiAccessToken="pk.eyJ1IjoiYW5kcmVhc2NocmlzdGlhbiIsImEiOiJjanZ2cnZhMjg0NWtmNDN1aTMxcGphY21xIn0.CDEBH4hJPmAhRDOtzz73Mw"
              onSelected={this.onSelected}
              viewport={this.state.viewport}
              hideOnSelect={true}
            />
          </div>
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
              color: "white",
              opacity: "0.7"
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

        {/* DETAILS */}
        <div
          style={{
            position: "fixed",
            backgroundColor: " rgba(113, 124, 124, 0.7)",
            bottom: "40px",
            height: "155px",
            width: "100%",
            display: this.state.details,
            overflowY: "scroll"
          }}
        >
          <Table
            collapsing
            size="mini"
            style={{ display: this.state.tablepolice }}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <center>No</center>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <center>Longtitude</center>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <center>Latitude</center>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.state.arrshowPolice}</Table.Body>
          </Table>
         
          {/* CLOSE BUTTON */}
          <Button
            compact
            color="red"
            size="small"
            onClick={() =>
              this.setState({
                details: "none",
                arrshowPolice: [],
                tablepolice:"none"
              })
            }
            style={{
              position: "fixed",
              right: "-3px",
              bottom: "245px",
              color: "white",
              opacity: "0.7"
            }}
          >
            X
          </Button>

          {/* MENU DETAILS */}
          <div
            style={{
              position: "fixed",
              backgroundColor: " rgb(113, 124, 124)",
              bottom: "195px",
              width: "100%",
              display: "inline-block",
              padding: "5px"
            }}
          >
            <Form size="mini">
              <Form.Group>
                Field:
                <Form.Field control={Select} options={[]} width={2} />
                Type:
                <Form.Field
                  width={2}
                  control={Select}
                  options={[
                    { key: "a", text: "==", value: 1 },
                    { key: "b", text: "!=", value: 2 },
                    { key: "c", text: ">", value: 3 },
                    { key: "d", text: ">=", value: 4 },
                    { key: "e", text: "<", value: 5 },
                    { key: "f", text: "<=", value: 6 },
                    { key: "g", text: "include", value: 7 }
                  ]}
                />
                Value:
                <Form.Input width={2} />
              </Form.Group>
            </Form>
            <Button.Group
              compact
              size="mini"
              style={{ position: "fixed", bottom: "215px", left: "600px" }}
            >
              <Button icon="backward" />
              <Button icon="reply" />
              <Button icon="share" />
              <Button icon="arrow down" />
            </Button.Group>
          </div>
        </div>

        {/* INSPECT */}
        <div
          style={{
            position: "fixed",
            backgroundColor: " rgba(113, 124, 124, 0.7)",
            bottom: "150px",
            left: "460px",
            height: "300px",
            width: "400px",
            padding: "20px",
            display: this.state.inspect
          }}
        >
          <h3>Select layer to inspect.</h3>
          <h3>
            When this feature is active, you can click at the selected layer on
            the map to audit property data. Don'console.log(this.arrPolice)
            forget to activate layer and set icon first.
          </h3>
          <Form size="mini">
            <Form.Field>
              <Form.Group>
                <Form.Field
                  label="Layer Name: "
                  width={3}
                  placeholder="All"
                  control={Select}
                  options={[{ key: "a", text: "All", value: 1 }]}
                />
              </Form.Group>
            </Form.Field>
          </Form>
          <Button.Group
            size="mini"
            style={{ position: "fixed", bottom: "170px", left: "720px" }}
          >
            <Button
              onClick={() =>
                this.setState({
                  inspect: "none"
                })
              }
            >
              CANCEL
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  inspect: "none"
                })
              }
              color="blue"
            >
              OK
            </Button>
          </Button.Group>
        </div>

        {/* NAVIGATION */}
        <div
          style={{
            position: "fixed",
            backgroundColor: "rgba(113, 124, 124, 0.7)",
            bottom: "70px",
            right: "10px",
            height: "150px",
            width: "300px",
            display: this.state.navigation
          }}
        >
          {/* CLOSE BUTTON */}
          <Button
            compact
            color="red"
            size="small"
            onClick={() =>
              this.setState({
                navigation: "none"
              })
            }
            style={{
              position: "fixed",
              right: "7px",
              bottom: "218px",
              color: "white",
              opacity: "0.7"
            }}
          >
            X
          </Button>

          <center>NAVIGATION</center>
        </div>

        {/** CHANGE STYLE MAPBOX */}
        <div
          style={{
            position: "fixed",
            top: "9px",
            padding: "5px",
            right: "200px"
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
          <a href="https://www.mapid.io/">
            <img src="mapid-logo.svg" align="center" height="30px" alt="logo" />
          </a>
          <Button.Group size="mini" compact>
            <Button compact size="small">
              <img src="geo-icon.png" height="10px" alt="geo" />
              <img src="mapid-icon.png" height="10px" alt="mapid" />
            </Button>
            <Button
              content="Toolbox"
              icon="briefcase"
              labelPosition="left"
              onClick={() => this.setState({ display: "inline-block" })}
            />
            <Button
              content="Details"
              icon="bars"
              labelPosition="left"
              onClick={() => this.setState({ details: "inline-block" })}
            />
            <Button
              content="Inspect"
              icon="search"
              labelPosition="left"
              onClick={() => this.setState({ inspect: "inline-block" })}
            />
            <Button
              content="Navigate"
              icon="location arrow"
              labelPosition="left"
              onClick={() => this.setState({ navigation: "inline-block" })}
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
                    <Button onClick={() => this._addPolice()} icon="eye" />
                    <Button
                      onClick={() => this.setState({ arrPolice: [] })}
                      icon="eye slash"
                    />
                  </Button.Group>
                </Form.Field>
              </Table.Cell>
              <Table.Cell onClick={() => this._showPolice()}>
                Kantor Polisi
              </Table.Cell>
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
                  <Button
                    icon="eye"
                    onClick={() => this.setState({ banjir1: 0.5 })}
                  />
                  <Button
                    icon="eye slash"
                    onClick={() => this.setState({ banjir1: 0 })}
                  />
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Banjir 1990</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>
                <Button.Group compact size="mini">
                  <Button
                    icon="eye"
                    onClick={() => this.setState({ banjir2: 0.5 })}
                  />
                  <Button
                    icon="eye slash"
                    onClick={() => this.setState({ banjir2: 0 })}
                  />
                </Button.Group>
              </Table.Cell>
              <Table.Cell>Banjir 2000</Table.Cell>
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
            left: "261px",
            top: "8px",
            display: this.state.close,
            opacity: "0.7"
          }}
        >
          {"<<"}
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
            left: "-10px",
            top: "8px",
            display: this.state.open,
            opacity: "0.7"
          }}
        >
          {">>"}
        </Button>
      </div>
    );
  }
}
export default App;