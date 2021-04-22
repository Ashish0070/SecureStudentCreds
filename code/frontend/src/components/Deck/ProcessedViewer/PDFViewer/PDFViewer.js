import React from 'react';
import { Worker } from '@phuocng/react-pdf-viewer';
// Import the main component
import Viewer from '@phuocng/react-pdf-viewer';
// Import the CSS
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import base64 from "../../base64.json";
import b64toBlob from "b64-to-blob";

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var blob = b64toBlob(base64.base64, "data:application");
        var blobUrl = URL.createObjectURL(blob);
        return (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
                <Viewer fileUrl={this.props.url} />
            </Worker>
        )
    }
}

export default PDFViewer;