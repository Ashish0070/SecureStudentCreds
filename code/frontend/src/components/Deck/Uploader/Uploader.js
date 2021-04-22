import React from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import './Uploader.css';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Web3 from 'web3';
import schoolABI from '../../../config/school';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: {}
        }
    }

    componentDidMount = () => {
        if (!this.props.filesUploaded[this.props.meta.id]) {
            this.props.addFileNew(this.props.meta.id);
        }
    }

    render() {
        return (
            <div className="fileNameContainer">
                <span>{this.props.meta.name}</span>
                <TextField onChange={(e) => { this.props.changeFileName(this.props.meta.id, e) }} id="standard-basic" label="Filename" />
                <TextField onChange={(e) => { this.props.changeFileDesc(this.props.meta.id, e) }} id="standard-basic" label="Description" />
            </div>
        )
    }
}

const mapStateToPropsTwo = (state) => {
    return {
        filesUploaded: state.filesUploaded
    }
}

const mapDispatchToPropsTwo = (dispatch) => {
    return {
        changeFileName: (id, e) => {
            dispatch({
                type: "CHANGE_FILE_NAME",
                value: e.target.value,
                id
            })
        },
        changeFileDesc: (id, e) => {
            dispatch({
                type: "CHANGE_FILE_DESC",
                value: e.target.value,
                id
            })
        },
        addFileNew: (id) => {
            dispatch({
                type: "ADD_FILE_NEW",
                id
            })
        }
    }
}

const PreviewConnected = connect(mapStateToPropsTwo, mapDispatchToPropsTwo)(Preview);

class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: {}
        }
    }
    getUploadParams = () => {
        return { url: 'https://httpbin.org/post' }
    }

    handleChangeStatus = ({ meta }, status) => {
        console.log(status, meta)
    }

    fileNameChange = (id, e) => {
        let fileObj = {};
        if (this.state.files[id]) {
            fileObj = this.state.files[id];
        }
        fileObj.fileName = e.target.value;
        console.log(id, fileObj);
        this.setState = {
            files: {
                ...this.state.files,
                id: fileObj
            }
        }
    }
    fileDescChange = (id, e) => {
        let fileObj = {};
        if (this.state.files[id]) {
            fileObj = this.state.files[id];
        }
        fileObj.fileDesc = e.target.value;
        this.setState = {
            file: {
                ...this.state.files,
                id: fileObj
            }
        }
    }

    // submitFile = async (file, fileID) => {
    //     const filesData = new FormData();
    //     filesData.append('userID', this.props.userID);
    //     filesData.append('fileID', fileID);
    //     filesData.append(file.meta.name, file.file);
    //     this.props.addFile(fileID, file);
    //     let result = await axios({
    //         method: "POST",
    //         url: "http://localhost:8000/api/upload",
    //         data: filesData,
    //         headers: {
    //             'Content-Type': 'multipart/form-data; boundary=${form._boundary}'
    //         }
    //     });
    //     console.log(result);
    //     this.props.updateFile(result.data);
    // }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    toBuffer = file => new Promise((resolve, reject) => {
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => resolve(Buffer(reader.result));
        reader.onerror = error => reject(error);
    });

    handleSubmit = async (files, allFiles) => {
        console.log(files.map(f => f.meta.name));
        let promises = [];
        files.map(async (file) => {
            let buffer = await this.toBuffer(file.file);
            console.log(buffer);
            promises.push(ipfs.files.add(buffer));
            let { hide } = cogoToast.loading('Get ipfs hash...', {
                hideAfter: 0,
                onClick: () => {
                    hide();
                },
            });
            let result = await ipfs.files.add(buffer);
            hide();
            console.log('HASH - ', result[0].hash);
            let hide2 = cogoToast.loading('Uploading to blockchain...', {
                hideAfter: 0,
                onClick: () => {
                    hide();
                },
            });
            let fileName = this.props.filesUploaded[file.meta.id].fileName;
            let fileDesc = this.props.filesUploaded[file.meta.id].fileDesc;
            await schoolContract.methods.uploadFileSchool(result[0].hash, fileName, fileDesc, this.props.match.params.studentAddress).send({ from: this.props.userAddress })
            hide2.hide();
            cogoToast.success("File is on blockchain!");
            this.props.toggleUploader(false);
        });
        allFiles.forEach(f => f.remove());
    }
    render() {
        return (
            <div>
                <div className="overlay"></div>
                <div className="uploader">
                    <div className="header">
                        <i onClick={() => { this.props.toggleUploader(false) }} style={{ color: 'white', marginRight: '2%', cursor: 'pointer' }} class="fa fa-times"></i>
                    </div>
                    <Dropzone
                        onChangeStatus={this.handleChangeStatus}
                        PreviewComponent={PreviewConnected}
                        onSubmit={this.handleSubmit}
                        styles={{ dropzone: { width: '100%', height: '95%', borderRadius: '2%', overflow: 'hidden', backgroundColor: 'white', borderRadius: '2%', border: 0, overflowY: 'scroll' } }}
                        inputContent="Upload or Drag Documents"
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.userID,
        files: state.files,
        filesUploaded: state.filesUploaded,
        userAddress: state.userAddress
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleUploader: (toggle) => {
            dispatch({
                type: 'TOGGLE_UPLOADER',
                toggle: toggle
            })
        },
        addFile: (fileID, file) => {
            dispatch({
                type: 'ADD_FILE',
                fileID: fileID,
                file: file
            })
        },
        updateFile: (fileData) => {
            dispatch({
                type: 'UPDATE_FILE',
                fileData: fileData
            })
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Uploader));