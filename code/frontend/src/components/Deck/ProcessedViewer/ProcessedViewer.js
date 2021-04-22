import React from 'react';
import { connect } from 'react-redux';
import './ProcessedViewer.css';
import PDFViewer from './PDFViewer/PDFViewer';
import base64 from "../base64.json";
import b64toBlob from "b64-to-blob";

class ProcessedViewer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.open(`https://ipfs.io/ipfs/${this.props.preview.link}`, "_blank");
    }

    render() {
        var blob = b64toBlob(base64.base64, "data:application");
        var blobUrl = URL.createObjectURL(blob);
        return (
            <div>
                <div className="overlay"></div>
                <div className="ProcessedViewer">
                    {/* <div className="fields">
                        <span className="title">Extracted Fields</span>
                        <label for="invoiceNo">Invoice Number</label>
                        <input id="invoiceNo" value={file.processedDetails.invoiceNumber} />
                        <label for="invoiceNo">Total Amount</label>
                        <input id="invoiceNo" value={file.processedDetails.totalAmount} />
                        <label for="invoiceNo">GSTIN Number</label>
                        <input id="invoiceNo" value={file.processedDetails.gstinNo} />
                    </div> */}
                    <div className="preview" style={{ backgroundImage: `url(${blobUrl})` }}>
                        <PDFViewer url={`https://ipfs.io/ipfs/${this.props.preview.link}`} />
                        <div div className="fa-stack fa-4x crossButton" onClick={this.props.closePreview}>
                            <i class="fa fa-circle fa-stack-2x icon-background"></i>
                            <i class="fa fa-times fa-stack-1x" style={{ color: 'white' }}></i>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        files: state.files,
        preview: state.preview
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        closePreview: () => {
            dispatch({
                type: 'CLOSE_PREVIEW'
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessedViewer);