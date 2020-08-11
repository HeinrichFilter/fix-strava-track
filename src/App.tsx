import React, { useEffect, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngTuple } from "leaflet";

function App() {
  // const onDrop = useCallback((acceptedFiles) => {
  //   // Do something with the files
  //   console.log("dropped");
  // }, []);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone(/*{ onDrop }*/);
  const [xml, setXml] = useState<HTMLElement>();
  //const [, setXmlChanged] = useState({});
  const position: LatLngTuple = [51.505, -0.09];

  const zoom = 13;

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    console.log("Accepted files changed");
    async function getFileText() {
      if (acceptedFiles.length < 1) return;
      const firstAccpetedFile = acceptedFiles[0];
      const xml = await firstAccpetedFile.text();
      let domparser = new DOMParser();
      const xmlDoc = domparser.parseFromString(xml, "text/xml");
      //.querySelectorAll("trkpt > time")
      console.log(xmlDoc);
      setXml(xmlDoc.documentElement);
    }

    getFileText();
  }, [acceptedFiles]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fix Strava track</h1>
      </header>
      <br />
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      <Map center={position as LatLngTuple} zoom={zoom} style={{ height: "100%" }}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
      <pre>
        {[...(xml?.querySelectorAll("trkpt") || ([] as any))].map((trkpt: Element, i) => (
          <p key={i}>
            {i} {trkpt.getAttribute("lat")}
            <button
              onClick={(e) => {
                //if (trkpt === null) return;
                trkpt.parentNode?.removeChild(trkpt);
                //setXmlChanged({});
                setXml(xml?.cloneNode(true) as HTMLScriptElement);
                console.log(e);
              }}
            >
              Delete
            </button>
          </p>
        ))}
      </pre>
    </div>
  );
}

export default App;
