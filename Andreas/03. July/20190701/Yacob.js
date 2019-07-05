import React, { Component } from "react";
import "./App.css";
import MapGL, {
  NavigationControl,
  AttributionControl,
  Source,
  Layer,
  FeatureState,
  Popup
} from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Draw from "@urbica/react-map-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
  Button,
  Label,
  Grid,
  Input,
  Tab,
  Card,
  Dimmer,
  Loader,
  Segment,
  Table
} from "semantic-ui-react";
import axios from "axios";
let rows = [];
 
class App extends Component {
  constructor() {
    super();
    this.state = {
      viewportChangeMethod: "flyTo",
      viewport: {
        latitude: 37.832692,
        longitude: -122.479942,
        zoom: 16
      },
      data: {
        type: "FeatureCollection",
        features: []
      },
      lat: 37.832692, // <-- Contoh deklarasi state
      lng: -122.479942,
      zoom: 17,
      counter: 0,
      visible: true,
      modalOpen: false,
      hoveredStateId: null,
      clickedLayerCoordinate: {
        long: 0,
        lat: 0
      },
      cardColor: "red",
      layerlists: [],
      results: [],
      kumpulandata: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "asdf", desc: "zxcv" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-122.47685194015503, 37.83325962773994],
                  [-122.47678756713866, 37.83198857304299],
                  [-122.47517824172975, 37.83202246811909],
                  [-122.47522115707397, 37.8332935222321],
                  [-122.47685194015503, 37.83325962773994]
                ]
              ]
            }
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-122.47953414916992, 37.83129372055134],
                  [-122.47927665710448, 37.830514122161276],
                  [-122.47801065444946, 37.830107371905136],
                  [-122.47775316238402, 37.83105645234809],
                  [-122.47953414916992, 37.83129372055134]
                ]
              ]
            }
          }
        ]
      },
      // Left Panel Display state
      layerListPanelVisible: "inline-block",
      // Middle Panel Display state
      addFeaturePanelVisible: "none",
      // Top Panel Display state
      drawingPanelVisible: "none",
      // Add Column Display State
      addAtributeColumnVisible: "none",
      // Delete Atribute Column Display State
      deleteAtributeColumnVisible: "none",
      // Atribute Table Display State
      attributeTableVisible: "none",
      //Text Input Create Features
      createLayerName: "",
      createLayerDesc: "",
      createLayerType: "",
      insertedLayerId: "",
      // Text Input Add Column
      columnNameInput: "",
      columnDefaultValueInput: "",
      // Text Input Delete Column
      deleteColumnNameInput: "",
      //Draw Control Visible
      selectControlVisible: true,
      pointControlVisible: true,
      lineControlVisible: true,
      polygonControlVisible: true,
      trashControlVisible: true,
      mode: "simple_select",
      // Pop Up Content state
      clickedFeature: {},
      // Dimmer and Loader
      addFeaturePanelDimmerActive: false,
      mapDimmerActive: false
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.getLayersByUsername = this.getLayersByUsername.bind(this);
    this.onHover = this.onHover.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.layerOnClick = this.layerOnClick.bind(this);
    this.showLayer = this.showLayer.bind(this);
    this.hideLayer = this.hideLayer.bind(this);
    this.generateLayer = this.generateLayer.bind(this);
    this.editLayer = this.editLayer.bind(this);
    this.deleteLayer = this.deleteLayer.bind(this);
    this.editFeatureProperty = this.editFeatureProperty.bind(this);
 
    this.addFeatures = this.addFeatures.bind(this);
    this.createFeatures = this.createFeatures.bind(this);
    this.createFeaturesInputChange = this.createFeaturesInputChange.bind(this);
    this.saveFeatures = this.saveFeatures.bind(this);
    this.updateFeatures = this.updateFeatures.bind(this);
    this.cancelSaveFeatures = this.cancelSaveFeatures.bind(this);
    this.endEditFeatures = this.endEditFeatures.bind(this);
 
    this.generateTableBodyItem = this.generateTableBodyItem.bind(this);
    this.tableInputOnChange = this.tableInputOnChange.bind(this);
    this.addColumnInputChange = this.addColumnInputChange.bind(this);
    this.deleteColumnInputChange = this.deleteColumnInputChange.bind(this);
    this.saveEditedTable = this.saveEditedTable.bind(this);
    this.addTableColumn = this.addTableColumn.bind(this);
    this.deleteTableColumn = this.deleteTableColumn.bind(this);
 
    this.showAddColumnDisplay = this.showAddColumnDisplay.bind(this);
    this.hideAddColumnDisplay = this.hideAddColumnDisplay.bind(this);
    this.showDeleteColumnDisplay = this.showDeleteColumnDisplay.bind(this);
    this.hideDeleteColumnDisplay = this.hideDeleteColumnDisplay.bind(this);
    this.showAttributeTable = this.showAttributeTable.bind(this);
    this.hideAttributeTable = this.hideAttributeTable.bind(this);
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
 
  updateDimensions() {
    // <-- Function bikinan sendiri untuk mengatur tampilan dimensi peta
    const height = window.innerWidth >= 992 ? window.innerHeight : 400;
    this.setState({ height: height });
  }
 
  onHover(event) {
    if (event.features.length > 0) {
      const hoveredStateId = event.features[0].id;
      //console.log("Hover id: ", hoveredStateId);
      if (hoveredStateId !== this.state.hoveredStateId) {
        this.setState({ hoveredStateId });
      }
    }
  }
 
  onLeave(event) {
    if (this.state.hoveredStateId) {
      this.setState({ hoveredStateId: null });
    }
  }
 
  layerOnClick(event) {
    console.log("OnClick Geometry: ", event.features[0].geometry);
    console.log("OnClick Properties: ", event.features[0].properties);
    console.log("OnClick Index: ", event.features[0].id);
 
    this.setState({
      clickedLayerCoordinate: { long: event.lngLat.lng, lat: event.lngLat.lat },
      viewport: {
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
        zoom: 16
      },
      clickedFeature: event.features[0].properties
    });
  }
 
  getLayersByUsername() {
    rows = [];
    this.setState({ mapDimmerActive: true });
    axios
      .get(
        "https://hnjp62bwxh.execute-api.us-west-2.amazonaws.com/GeoDev/getlayerbyusername",
        {
          params: {
            username: "yacob89"
          }
        }
      )
      .then(response => {
        // handle success
        const layerList = response.data;
 
        var i;
        for (i = 0; i < layerList.length; i++) {
          rows.push({
            _id: layerList[i]._id,
            name: layerList[i].name,
            username: layerList[i].username,
            createdAt: layerList[i].createdAt,
            description: layerList[i].description,
            layerType: layerList[i].layer_type,
            subscriber: layerList[i].subscriber,
            geojson: layerList[i].geojson,
            arrayindex: i,
            opacity: 0.5,
            visibility: "visible"
          });
        }
        this.setState({
          layerlists: rows,
          results: rows
        });
        this.setState({ mapDimmerActive: false });
      })
      .catch(error => {
        console.log("Axios error: ", error);
        this.setState({ mapDimmerActive: false });
      });
  }
 
  addFeatures(event) {
    console.log("Add Features");
    //1. Disable semua layer yang tampil
    var temporaryLayer = this.state.layerlists;
    var i;
    for (i = 0; i < temporaryLayer.length; i++) {
      temporaryLayer[i].visibility = "none";
    }
    this.setState({ layerlists: temporaryLayer });
    //2. Menampilkan Draw Control
    //3. Ada default geojson data
    //4. Perlu ada tombol save
    //5. menampilkan add feature panel
    this.setState({ addFeaturePanelVisible: "inline-block" });
  }
 
  createFeatures(event) {
    console.log("Create Features: ", event.target.id);
    if (event.target.id === "create-point") {
      this.setState({ selectControlVisible: false });
      this.setState({ pointControlVisible: false });
      this.setState({ lineControlVisible: true });
      this.setState({ polygonControlVisible: true });
      this.setState({ createLayerType: "symbol" });
    }
    if (event.target.id === "create-line") {
      this.setState({ selectControlVisible: false });
      this.setState({ pointControlVisible: true });
      this.setState({ lineControlVisible: false });
      this.setState({ polygonControlVisible: true });
      this.setState({ createLayerType: "line" });
    }
    if (event.target.id === "create-polygon") {
      this.setState({ selectControlVisible: false });
      this.setState({ pointControlVisible: true });
      this.setState({ lineControlVisible: true });
      this.setState({ polygonControlVisible: false });
      this.setState({ createLayerType: "fill" });
    }
  }
 
  createFeaturesInputChange(event) {
    console.log("Input Change : ", event.target.value);
    if (event.target.id === "layernameInput") {
      this.setState({ createLayerName: event.target.value });
    }
    if (event.target.id === "layerdescInput") {
      this.setState({ createLayerDesc: event.target.value });
    }
  }
 
  /* Input user change handler */
 
  addColumnInputChange(event) {
    console.log("AddColumnInputChange: ", event.target.id);
    if (event.target.id === "addtablecolumn-name") {
      this.setState({ columnNameInput: event.target.value });
    }
    if (event.target.id === "addtablecolumn-defaultvalue") {
      this.setState({ columnDefaultValueInput: event.target.value });
    }
  }
 
  deleteColumnInputChange(event) {
    console.log("DeleteColumnInputChange: ", event.target.id);
    this.setState({ deleteColumnNameInput: event.target.value });
  }
 
  tableInputOnChange(event) {
    // Simpan dulu features ke variable sementara
    var temporaryProperties = this.state.data.features;
    //console.log("Datanya: ", temporaryProperties);
 
    // Mendapatkan index feature keberapa yang sedang diedit dan keynya
    console.log("Index ke berapa yang sendang diketik: ", event.target.id);
    var featureIndex = event.target.id.substr(event.target.id.indexOf("-") + 1);
    var propertyName = event.target.id.substr(0, event.target.id.indexOf("-"));
    console.log("Feature Index = ", featureIndex);
    console.log("Property Name= ", propertyName);
 
    // Ubah nilai di index tersebut
    temporaryProperties[featureIndex].properties[propertyName] =
      event.target.value;
    console.log("Perubahan data: ", temporaryProperties);
 
    // Save ke state
    this.setState({
      data: {
        type: "FeatureCollection",
        features: temporaryProperties
      }
    });
  }
 
  addTableColumn() {
    var temporaryProperties = this.state.data.features;
    var columnName = this.state.columnNameInput;
    var ol = Object.keys(temporaryProperties);
    // Ubah nilai di index tersebut
    var i;
    for (i = 0; i < ol.length; i++) {
      temporaryProperties[i].properties[
        columnName
      ] = this.state.columnDefaultValueInput;
    }
    // Save ke state
    this.setState({
      data: {
        type: "FeatureCollection",
        features: temporaryProperties
      }
    });
    this.setState({ addAtributeColumnVisible: "none" });
    this.saveEditedTable();
  }
 
  deleteTableColumn() {
    var temporaryProperties = this.state.data.features;
    console.log("Temporary properties: ", temporaryProperties);
    var columnName = this.state.deleteColumnNameInput;
    var ol = Object.keys(temporaryProperties);
    var i;
    for (i = 0; i < ol.length; i++) {
      delete temporaryProperties[i].properties[columnName];
    }
    // Save ke state
    this.setState({
      data: {
        type: "FeatureCollection",
        features: temporaryProperties
      }
    });
    this.setState({ deleteAtributeColumnVisible: "none" });
    this.saveEditedTable();
  }
 
  saveEditedTable() {
    console.log("Data yang akan diupdate: ", this.state.data);
    this.setState({ mapDimmerActive: true });
    axios
      .post(
        "https://hnjp62bwxh.execute-api.us-west-2.amazonaws.com/GeoDev/updatelayerbyid",
        { _id: this.state.insertedLayerId, geojson: this.state.data }
      )
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ mapDimmerActive: false });
      })
      .catch(error => {
        console.log("Error: ", error);
        this.setState({ mapDimmerActive: false });
      });
  }
 
  saveFeatures(event) {
    this.setState({ addFeaturePanelDimmerActive: true });
    axios
      .post(
        "https://hnjp62bwxh.execute-api.us-west-2.amazonaws.com/GeoDev/insertdefaultlayer",
        {
          name: this.state.createLayerName,
          description: this.state.createLayerDesc,
          layer_type: this.state.createLayerType,
          username: "yacob89"
        }
      )
      .then(res => {
        console.log(res);
        console.log(res.data._id);
        this.setState({ insertedLayerId: res.data._id });
        this.setState({ drawingPanelVisible: "inline-block" });
        this.setState({ addFeaturePanelVisible: "none" });
        this.setState({ addFeaturePanelDimmerActive: false });
      })
      .catch(error => {
        console.log("Error: ", error);
        this.setState({ addFeaturePanelDimmerActive: true });
      });
  }
 
  cancelSaveFeatures(event) {
    this.setState({ addFeaturePanelVisible: "none" });
  }
 
  updateFeatures(event) {
    console.log("Data yang akan diupdate: ", this.state.data);
    this.setState({ mapDimmerActive: true });
    axios
      .post(
        "https://hnjp62bwxh.execute-api.us-west-2.amazonaws.com/GeoDev/updatelayerbyid",
        { _id: this.state.insertedLayerId, geojson: this.state.data }
      )
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ mapDimmerActive: false });
      })
      .catch(error => {
        console.log("Error: ", error);
        this.setState({ mapDimmerActive: false });
      });
  }
 
  endEditFeatures(event) {
    this.setState({ drawingPanelVisible: "none" });
    this.setState({
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    this.getLayersByUsername();
  }
 
  /* LeftPanel LayerManagement Functions */
  showLayer(event) {
    console.log("Show Layer: ", event.target.id);
    var temporaryLayer = this.state.layerlists;
    temporaryLayer[event.target.id].visibility = "visible";
    this.setState({ layerlists: temporaryLayer });
  }
 
  hideLayer(event) {
    console.log("Hide Layer: ", event.target.id);
    var temporaryLayer = this.state.layerlists;
    temporaryLayer[event.target.id].visibility = "none";
    this.setState({ layerlists: temporaryLayer });
  }
 
  editLayer(event) {
    var temporaryLayer = this.state.layerlists;
    var i;
    for (i = 0; i < temporaryLayer.length; i++) {
      temporaryLayer[i].visibility = "none";
    }
    this.setState({ layerlists: temporaryLayer });
    this.setState({ drawingPanelVisible: "inline-block" });
 
    // Set initial data to edit
    this.setState({ data: temporaryLayer[event.target.id].geojson });
    // Set selected ID to current layer untuk memudahkan update ke database
    this.setState({ insertedLayerId: temporaryLayer[event.target.id]._id });
 
    if (temporaryLayer[event.target.id].layerType === "symbol") {
      this.setState({ selectControlVisible: false });
      this.setState({ pointControlVisible: false });
      this.setState({ lineControlVisible: true });
      this.setState({ polygonControlVisible: true });
      this.setState({ createLayerType: "symbol" });
    }
    if (temporaryLayer[event.target.id].layerType === "line") {
      this.setState({ selectControlVisible: false });
      this.setState({ pointControlVisible: true });
      this.setState({ lineControlVisible: false });
      this.setState({ polygonControlVisible: true });
      this.setState({ createLayerType: "line" });
    }
    if (temporaryLayer[event.target.id].layerType === "fill") {
      this.setState({ selectControlVisible: false });
      this.setState({ pointControlVisible: true });
      this.setState({ lineControlVisible: true });
      this.setState({ polygonControlVisible: false });
      this.setState({ createLayerType: "fill" });
    }
  }
 
  deleteLayer(event) {
    var temporaryLayer = this.state.layerlists;
    var deletedId = temporaryLayer[event.target.id]._id;
    this.setState({ mapDimmerActive: true });
    axios
      .delete(
        `https://hnjp62bwxh.execute-api.us-west-2.amazonaws.com/GeoDev/deletelayerbyid?_id=${deletedId}`
      )
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ mapDimmerActive: false });
        this.getLayersByUsername();
      })
      .catch(error => {
        console.log("Error: ", error);
        this.setState({ mapDimmerActive: false });
      });
  }
 
  editFeatureProperty(event) {
    var temporaryLayer = this.state.layerlists;
 
    // Set initial data to edit
    this.setState({ insertedLayerId: temporaryLayer[event.target.id]._id });
    this.setState({ data: temporaryLayer[event.target.id].geojson });
    // Show Attribute Table
    this.setState({ attributeTableVisible: "inline-block" });
    if (this.state.data.features.length > 0) {
      console.log("Isi dari table: ", this.state.data.features[0].properties);
    }
 
    // Ini boleh dihapus
    for (var i in this.state.data.features) {
      var val = this.state.data.features[i].properties;
      for (var j in val) {
        var sub_key = j;
        console.log("Sub Key: ", sub_key);
      }
    }
  }
 
  /* End of LeftPanel LayerManagement Functions */
 
  showAddColumnDisplay() {
    this.setState({ addAtributeColumnVisible: "inline-block" });
  }
  showDeleteColumnDisplay() {
    this.setState({ deleteAtributeColumnVisible: "inline-block" });
  }
  showAttributeTable() {
    this.setState({ attributeTableVisible: "inline-block" });
  }
  hideAddColumnDisplay() {
    this.setState({ addAtributeColumnVisible: "none" });
  }
  hideDeleteColumnDisplay() {
    this.setState({ deleteAtributeColumnVisible: "none" });
  }
  hideAttributeTable() {
    this.setState({ attributeTableVisible: "none" });
  }
 
  generateStyleEditor(i) {
    const assetsCardStyle = {
      marginLeft: "0px",
      marginRight: "10px"
    };
    let styleEditor;
    if (i.layerType === "fill") {
      styleEditor = (
        <Card
          key={"card-style-" + i.arrayindex}
          fluid
          color="green"
          style={assetsCardStyle}
        >
          <Card.Content>
            <Card.Header>{i.name}</Card.Header>
            <Card.Meta>{i.createdAt}</Card.Meta>
            <Card.Description>{i.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Segment.Group compact>
                <Segment>
                  Color&ensp;
                  <Button style={{ backgroundColor: "#627BC1" }}>
                    #627BC1
                  </Button>
                </Segment>
                <Segment>
                  Opacity&ensp;
                  <Button color="red">Red</Button>
                </Segment>
              </Segment.Group>
            </div>
          </Card.Content>
        </Card>
      );
    }
    if (i.layerType === "symbol") {
      styleEditor = (
        <Card
          key={"card-style-" + i.arrayindex}
          fluid
          color="green"
          style={assetsCardStyle}
        >
          <Card.Content>
            <Card.Header>{i.name}</Card.Header>
            <Card.Meta>{i.createdAt}</Card.Meta>
            <Card.Description>{i.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Label>
                23
                <Input icon placeholder="Search..." />
              </Label>
 
              <br />
              <Input iconPosition="left" placeholder="Email" />
            </div>
          </Card.Content>
        </Card>
      );
    }
    if (i.layerType === "line") {
      styleEditor = (
        <Card
          key={"card-style-" + i.arrayindex}
          fluid
          color="green"
          style={assetsCardStyle}
        >
          <Card.Content>
            <Card.Header>{i.name}</Card.Header>
            <Card.Meta>{i.createdAt}</Card.Meta>
            <Card.Description>{i.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div>
              <Label>
                23
                <Input icon placeholder="Search..." />
              </Label>
 
              <br />
              <Input iconPosition="left" placeholder="Email" />
            </div>
          </Card.Content>
        </Card>
      );
    }
    return styleEditor;
  }
 
  /* Conditional Rendering Component */
  generateLayer(i) {
    let layer;
 
    if (i.layerType === "fill") {
      layer = (
        <Layer
          id={"layer-" + i.arrayindex}
          key={i.arrayindex}
          value={"Nilai: " + i.arrayindex}
          type={i.layerType}
          source={"layer-" + i.arrayindex}
          paint={{
            "fill-color": ["get", "color"],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              i.opacity
            ]
          }}
          layout={{ visibility: i.visibility }}
          onLeave={this.onLeave}
          onClick={this.layerOnClick}
        />
      );
    }
    if (i.layerType === "symbol") {
      layer = (
        <Layer
          id={"layer-" + i.arrayindex}
          key={i.arrayindex}
          value={"Nilai: " + i.arrayindex}
          type={i.layerType}
          source={"layer-" + i.arrayindex}
          layout={{ "icon-image": "marker-15", visibility: i.visibility }}
          onLeave={this.onLeave}
          onClick={this.layerOnClick}
        />
      );
    }
    if (i.layerType === "line") {
      layer = (
        <Layer
          id={"layer-" + i.arrayindex}
          key={i.arrayindex}
          value={"Nilai: " + i.arrayindex}
          type={i.layerType}
          source={"layer-" + i.arrayindex}
          paint={{
            "line-color": "#627BC1",
            "line-width": 1,
            "line-opacity": 0.5
          }}
          layout={{ visibility: i.visibility }}
          onLeave={this.onLeave}
          onClick={this.layerOnClick}
        />
      );
    }
 
    return layer;
  }
 
  generateTableHeader() {
    let tableHeader = [];
    if (this.state.data.features.length > 0) {
      var i = this.state.data.features[0].properties;
      var ol = Object.keys(i);
      var j;
      for (j = 0; j < ol.length; j++) {
        tableHeader.push(
          <Table.HeaderCell key={"tabheadercell-" + j}>
            {Object.keys(i)[j]}
          </Table.HeaderCell>
        );
      }
      this.generateTableBody();
    }
 
    return tableHeader;
  }
 
  generateTableBody() {
    let tableBody = [];
    if (this.state.data.features.length > 0) {
      var features = this.state.data.features;
      //var ol = Object.keys(i);
      var j;
      for (j = 0; j < features.length; j++) {
        //console.log("generasi: ", Object.values(features[j])[j]);
        tableBody.push(
          <Table.Row key={"tablerowkey-" + j}>
            {this.generateTableBodyItem(j, features[j])}
          </Table.Row>
        );
      }
    }
    return tableBody;
  }
 
  generateTableBodyItem(index, feature) {
    let tableBodyItem = [];
    var ol = Object.values(feature.properties);
    var j;
    for (j = 0; j < ol.length; j++) {
      //console.log("generasi item body: ", "ke-",j," ", Object.values(feature.properties)[j]);
      tableBodyItem.push(
        <Table.Cell key={"tablecellkey-" + j}>
          <Input
            id={Object.keys(feature.properties)[j] + "-" + index}
            defaultValue={Object.values(feature.properties)[j]}
            placeholder="Search..."
            onChange={this.tableInputOnChange}
          />
        </Table.Cell>
      );
    }
    /*tableBodyItem.push(
      <Table.Cell key={"tablecell-geometry"}>
        <Input
          defaultValue={Object.values(feature.geometry)[0]}
          placeholder="Search..."
        />
      </Table.Cell>
    );*/
 
    return tableBodyItem;
  }
 
  onSelected = (viewport, item) => {
    this.setState({ viewport });
    console.log("Selected: ", item);
  };
 
  render() {
    const assetsCardStyle = {
      marginLeft: "0px",
      marginRight: "10px"
    };
 
    var footerStyle = {
      backgroundColor: "#F8F8F8",
      borderTop: "1px solid #E7E7E7",
      textAlign: "center",
      padding: "20px",
      position: "fixed",
      left: "0",
      bottom: "0",
      height: "60px",
      width: "100%"
    };
 
    var phantom = {
      display: "block",
      padding: "20px",
      height: "60px",
      width: "100%"
    };
 
    var attributeTableStyle = {
      position: "fixed",
      bottom: "60px",
      left: "0",
      width: "100%",
      display: this.state.attributeTableVisible,
      maxHeight: "195px",
      overflowY: "scroll"
    };
 
    const layerpanes = [
      {
        menuItem: "Assets",
        pane: {
          key: "tab1",
          content: (
            <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
              <Button basic color="blue" onClick={this.addFeatures}>
                Add Features
              </Button>
              {this.state.layerlists.map(i => (
                <Card
                  key={"card-layer-" + i.arrayindex}
                  fluid
                  color="blue"
                  style={assetsCardStyle}
                >
                  <Card.Content>
                    <Card.Header>{i.name}</Card.Header>
                    <Card.Meta>{i.createdAt}</Card.Meta>
                    <Card.Description>{i.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div>
                      <Button
                        id={i.arrayindex}
                        basic
                        color="green"
                        onClick={this.showLayer}
                        compact
                      >
                        Show
                      </Button>
                      <Button
                        id={i.arrayindex}
                        basic
                        color="red"
                        onClick={this.hideLayer}
                        compact
                      >
                        Hide
                      </Button>
                    </div>
                    <div>
                      <Button
                        id={i.arrayindex}
                        basic
                        color="blue"
                        onClick={this.editLayer}
                        compact
                      >
                        Edit
                      </Button>
                      <Button
                        id={i.arrayindex}
                        basic
                        color="red"
                        onClick={this.deleteLayer}
                        compact
                      >
                        Delete
                      </Button>
                    </div>
                    <Button
                      id={i.arrayindex}
                      basic
                      color="red"
                      onClick={this.editFeatureProperty}
                      compact
                    >
                      Edit Feature
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )
        }
      },
      {
        menuItem: "Style",
        pane: {
          key: "tab2",
          content: (
            <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
              {this.state.layerlists.map(i => this.generateStyleEditor(i))}
            </div>
          )
        }
      },
      {
        menuItem: "Analysis",
        pane: {
          key: "tab3",
          content: <span>Analysis</span>
        }
      },
      {
        menuItem: "Legend",
        pane: {
          key: "tab4",
          content: <span>Legend</span>
        }
      }
    ];
 
    const modalPanes = [
      {
        menuItem: "Create",
        render: () => (
          <Tab.Pane attached={false}>
            <Input
              id="layernameInput"
              placeholder="Layer Name"
              onChange={this.createFeaturesInputChange}
            />
            <Input
              id="layerdescInput"
              placeholder="Description"
              onChange={this.createFeaturesInputChange}
            />
            <Button.Group>
              <Button id="create-point" onClick={this.createFeatures}>
                Point
              </Button>
              <Button id="create-line" onClick={this.createFeatures}>
                Line
              </Button>
              <Button id="create-polygon" onClick={this.createFeatures}>
                Polygon
              </Button>
            </Button.Group>
          </Tab.Pane>
        )
      },
      {
        menuItem: "Import",
        render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>
      },
      {
        menuItem: "Assets",
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>
      }
    ];
 
    return (
      <div style={{ height: this.state.height }}>
        <Dimmer active={this.state.mapDimmerActive}>
          <Loader>Loading</Loader>
        </Dimmer>
        <MapGL
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          accessToken={
            "pk.eyJ1IjoieWFjb2I4OSIsImEiOiJjamU3dTYxOXEwMzIwMnFteHB5MGYzbzZmIn0._u0BoH4XBwpB7EaYN8Xb2g"
          }
          latitude={this.state.viewport.latitude}
          longitude={this.state.viewport.longitude}
          zoom={this.state.viewport.zoom}
          onViewportChange={viewport => this.setState({ viewport })}
          attributionControl={false}
          viewportChangeMethod={this.state.viewportChangeMethod}
        >
          <NavigationControl showCompass showZoom position="top-right" />
          <AttributionControl
            compact={false}
            position="bottom-right"
            customAttribution="&#9400; mapid.io"
          />
          <Draw
            mode={this.state.mode}
            onDrawModeChange={({ mode }) => this.setState({ mode })}
            data={this.state.data}
            onChange={data => this.setState({ data })}
            combineFeaturesControl={false}
            uncombineFeaturesControl={false}
            pointControl={false}
            lineStringControl={false}
            polygonControl={false}
            trashControl={this.state.trashControlVisible}
          />
          <Popup
            longitude={this.state.clickedLayerCoordinate.long}
            latitude={this.state.clickedLayerCoordinate.lat}
            closeButton={false}
            closeOnClick={false}
          >
            <Grid columns="two" divided>
              <Grid.Row>
                <Grid.Column>Key</Grid.Column>
                <Grid.Column>Value</Grid.Column>
              </Grid.Row>
 
              <Grid.Row>
                <Grid.Column>
                  <Input transparent defaultValue={"color"} />
                </Grid.Column>
                <Grid.Column>
                  <Input transparent defaultValue={"Value"} />
                </Grid.Column>
              </Grid.Row>
 
              <Grid.Row>
                <Grid.Column>
                  <Input transparent defaultValue={"opacity"} />
                </Grid.Column>
                <Grid.Column>
                  <Input transparent defaultValue={"Value"} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Popup>
 
          {this.state.layerlists.map(i => (
            <div key={"source-" + i.arrayindex}>
              <Source
                id={"layer-" + i.arrayindex}
                type="geojson"
                data={i.geojson}
                generateId={true}
              />
              {this.generateLayer(i)}
              {this.state.hoveredStateId && (
                <FeatureState
                  id={this.state.hoveredStateId}
                  source={"layer-" + i.arrayindex}
                  state={{ hover: true }}
                />
              )}
            </div>
          ))}
 
          <div
            style={{
              position: "fixed",
              top: "10px",
              left: "10px",
              display: "inline-block",
              height: "100%"
            }}
          >
            <Tab
              menu={{
                secondary: true,
                pointing: true,
                inverted: true,
                color: "blue"
              }}
              panes={layerpanes}
              renderActiveOnly={false}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "400px",
              display: this.state.addFeaturePanelVisible
            }}
          >
            <Card>
              <Dimmer active={this.state.addFeaturePanelDimmerActive}>
                <Loader>Loading</Loader>
              </Dimmer>
              <Card.Content>
                <Card.Header>Add New Feature</Card.Header>
                <Card.Meta>
                  <span className="date">Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                  <Tab
                    menu={{ secondary: true, pointing: true }}
                    panes={modalPanes}
                  />
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button
                  basic
                  color="green"
                  content="OK"
                  onClick={this.saveFeatures}
                />
                <Button
                  basic
                  color="red"
                  content="Cancel"
                  onClick={this.cancelSaveFeatures}
                />
              </Card.Content>
            </Card>
          </div>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "50px",
              display: this.state.drawingPanelVisible
            }}
          >
            <Button.Group>
              <Button
                disabled={this.state.selectControlVisible}
                onClick={this.endEditFeatures}
              >
                Back To Layer Mode
              </Button>
              <Button
                disabled={this.state.selectControlVisible}
                onClick={this.updateFeatures}
              >
                Save
              </Button>
              <Button
                disabled={this.state.selectControlVisible}
                onClick={() => this.setState({ mode: "simple_select" })}
              >
                Select
              </Button>
              <Button
                disabled={this.state.pointControlVisible}
                onClick={() => this.setState({ mode: "draw_point" })}
              >
                Point
              </Button>
              <Button
                disabled={this.state.lineControlVisible}
                onClick={() => this.setState({ mode: "draw_line_string" })}
              >
                Line
              </Button>
              <Button
                disabled={this.state.polygonControlVisible}
                onClick={() => this.setState({ mode: "draw_polygon" })}
              >
                Polygon
              </Button>
            </Button.Group>
          </div>
          <div
            id="addcolumnconfirm"
            style={{
              position: "absolute",
              top: "200px",
              right: "0px",
              display: this.state.addAtributeColumnVisible
            }}
          >
            <Card>
              <Card.Content>
                <Card.Header>Add New Column</Card.Header>
                <Card.Meta>
                  <span className="date">Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                  <Input
                    id="addtablecolumn-name"
                    placeholder="Column Name"
                    onChange={this.addColumnInputChange}
                  />
                  <Input
                    id="addtablecolumn-defaultvalue"
                    placeholder="Default Value"
                    onChange={this.addColumnInputChange}
                  />
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button
                  basic
                  color="green"
                  content="OK"
                  onClick={this.addTableColumn}
                />
                <Button
                  basic
                  color="red"
                  content="Cancel"
                  onClick={this.hideAddColumnDisplay}
                />
              </Card.Content>
            </Card>
          </div>
          <div
            id="deletecolumnconfirm"
            style={{
              position: "absolute",
              top: "200px",
              right: "400px",
              display: this.state.deleteAtributeColumnVisible
            }}
          >
            <Card>
              <Card.Content>
                <Card.Header>Delete Column</Card.Header>
                <Card.Meta>
                  <span className="date">Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                  <Input
                    id="deletetablecolumn-name"
                    placeholder="Column Name"
                    onChange={this.deleteColumnInputChange}
                  />
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button
                  basic
                  color="green"
                  content="OK"
                  onClick={this.deleteTableColumn}
                />
                <Button
                  basic
                  color="red"
                  content="Cancel"
                  onClick={this.hideDeleteColumnDisplay}
                />
              </Card.Content>
            </Card>
          </div>
          <div
            style={{
              position: "fixed",
              right: "0px",
              bottom: "260px",
              display: this.state.attributeTableVisible
            }}
          >
            <Button onClick={this.hideAttributeTable}>Hide Table</Button>
            <Button onClick={this.saveEditedTable}>Save Data</Button>
            <Button onClick={this.showAddColumnDisplay}>Add Column</Button>
            <Button onClick={this.showDeleteColumnDisplay}>
              Delete Column
            </Button>
          </div>
          <div id="tabelatribut" style={attributeTableStyle}>
            <Table singleLine color={"blue"}>
              <Table.Header>
                <Table.Row>{this.generateTableHeader()}</Table.Row>
              </Table.Header>
 
              <Table.Body>{this.generateTableBody()}</Table.Body>
            </Table>
          </div>
          <div id="footer">
            <div style={phantom} />
            <div style={footerStyle} />
          </div>
        </MapGL>
      </div>
    );
  }
}
 
export default App;