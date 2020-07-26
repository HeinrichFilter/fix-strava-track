import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";

function App() {
  // const onDrop = useCallback((acceptedFiles) => {
  //   // Do something with the files
  //   console.log("dropped");
  // }, []);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone(/*{ onDrop }*/);
  const [xml, setXml] = useState<string>();

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
      setXml(await firstAccpetedFile.text());
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
      <pre>{xml}</pre>
    </div>
  );
}

export default App;
