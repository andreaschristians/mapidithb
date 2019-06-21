import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { Button, Popup, Label } from "semantic-ui-react";
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
      clat: 0
    }
  };
  _onClickMap(e) {
    console.log(e.lngLat);
    let lat = e.lnglat;
    // var lng = e.longitude;
    // this.setState({ clong: lng });
    this.setState({ clat: lat });
  }
  _area() {
    var polygon = turf.polygon([[[103, -6], [103, -2], [104, -7], [103, -6]]]);
    var areas = parseInt(turf.area(polygon) * 100) / 100;
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
          onClick={this._onClickMap}
          mapStyle={this.state.MapChange}
          onViewportChange={viewport => this.setState({ viewport })}
        >
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
            latitude={-6.534343}
            longitude={106.9999}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="B">
              <img src="here.png" height="50px" width="50px" alt="here" />
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
              <img src="here.png" height="50px" width="50px" alt="here" />
            </div>
          </Marker>
          <Marker
            latitude={-2}
            longitude={103}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="B area">
              <img src="here.png" height="50px" width="50px" alt="here" />
            </div>
          </Marker>
          <Marker
            latitude={-7}
            longitude={104}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div className="C area">
              <img src="here.png" height="50px" width="50px" alt="here" />
            </div>
          </Marker>
          <LineTo from="A area" to="B area" />
          <LineTo from="B area" to="C area" />
          <LineTo from="C area" to="A area" />
        </ReactMapGL>
        <div id="menu" style={{ position: "fixed", top: "0" }}>
          <input
            type="radio"
            value="mapbox://styles/mapbox/streets-v11"
            onChange={this._StyleChange}
          />
          <Label for="streets">streets</Label>
          <input
            type="radio"
            value="mapbox://styles/mapbox/light-v10"
            onChange={this._StyleChange}
          />
          <Label for="light">light</Label>
          <input
            type="radio"
            value="mapbox://styles/mapbox/dark-v10"
            onChange={this._StyleChange}
          />
          <Label for="dark">dark</Label>
          <input
            type="radio"
            value="mapbox://styles/mapbox/outdoors-v11"
            onChange={this._StyleChange}
          />
          <Label for="outdoors">outdoors</Label>
        </div>
        <div id="Bottom">
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
                {this.state.distance}
              </Label>
              <Label style={{ display: "inline-block" }}>
                {this.state.area}
              </Label>
            </div>
          </Popup>
        </div>
      </div>
    );
  }
}
export default App;
