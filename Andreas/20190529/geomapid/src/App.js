import React from 'react';
import './App.css';
import { Button, Input } from 'semantic-ui-react'

function App() {
  return (
    <div id="Page">
      <div id="StyleMaps">
        <Button.Group>
          <Button>Streets</Button>
          <Button>Satelite</Button>
          <Button>Hybrid</Button>
          <Button>Terrain</Button>
        </Button.Group>
      </div>
      <div id="Bottom">
        <img src="mapid-logo.svg" align="center" height="30px" alt="Logo" padding="5px"></img>
        <Button id="Bawah" onClick="https://www.mapid.io/">
          <img src="geo-icon.png" height="10px" alt="Geo"></img>
          <img src="mapid-icon.png" height="10px" alt="Mapid"></img>
        </Button>
        <Button id="Bawah" content='Toolbox' icon='briefcase' labelPosition='left'></Button>
        <Button id="Bawah" content='Details' icon='bars' labelPosition='left'></Button>
        <Button id="Bawah" content='Inspect' icon='search' labelPosition='left'></Button>
        <Button id="Bawah" content='Navigate' icon='location arrow' labelPosition='left'></Button>
        <Button id="Bawah" size="Large" content='Langtitude'><div id="isi"></div></Button>
      </div>
    </div>
  );
}

export default App;
