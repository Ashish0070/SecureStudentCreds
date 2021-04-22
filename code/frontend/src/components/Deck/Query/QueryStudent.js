import React from 'react';
import './Query.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import studentABI from "../../../config/student";
import requestABI from '../../../config/request';
import companyABI from '../../../config/company';
import shareFilesABI from '../../../config/sharefiles';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');
const requestContract = new web3.eth.Contract(requestABI, '0x40CE401C4DD2f354Cef1c48541098D821B28F1c9');
const companyContract = new web3.eth.Contract(companyABI, '0xdAf4E46101c83F7b27383272fb114dfF3F904576');
const shareFilesContract = new web3.eth.Contract(shareFilesABI, '0x9B3DB7c5DD54e184dDC63dC67536f7372ceDeBBa');

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Company Address", field: "address", sortable: true, filter: true
            }, {
                headerName: "Name", field: "name", sortable: true, filter: true
            }, {
                headerName: "Description", field: "desc", sortable: true, filter: true,
                autoHeight: true, cellStyle: { 'white-space': 'normal' }
            }, {
                headerName: "Reply", field: "address",
                cellRendererFramework: (params) => {
                    return <div className="viewTable" onClick={() => { this.replyToCompany(params.value) }}>Reply</div>
                },
                // onclick: () => { console.log('BOIS JUST GOT CLICKED'); }
            }],
            rowData: []
        }
    }

    replyToCompany = (companyAddress) => {
        let html = '';
        this.props.studentFiles.map((file, index) => {
            html += `<label for="swal2-checkbox" class="swal2-checkbox" style="display: flex;"><input class="checkboxClass" type="checkbox" value="swal-${index}" id="swal2-checkbox-${index}" /><span class="swal2-label">${file.fileName}</span></label>`
        })
        console.log(html);
        Swal.fire({
            title: 'Select the file you want to send',
            html: html,
            showCancelButton: true,
            preConfirm: (e) => {
                let sendFiles = [];
                let inputs = document.getElementsByTagName('input');
                for (let i = 0; i < inputs.length; i++) {
                    let type = inputs[i].getAttribute('type');
                    let value = inputs[i].getAttribute('value');
                    if (type == 'checkbox' && value && value.includes('swal')) {
                        if (inputs[i].checked) {
                            sendFiles.push(parseInt(value.substr(5, 6)));
                        }
                    }
                }
                if (sendFiles.length == 0) {
                    Swal.showValidationMessage(
                        `At least choose one file!`
                    );
                    return;
                }
                console.log(sendFiles);
                console.log(companyAddress);
                console.log(this.props.userAddress);
                return shareFilesContract.methods.shareFileIndex(sendFiles, companyAddress).send({ from: this.props.userAddress })
                    .then(result => {
                        return result.data;
                    }).catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
                //TODO: ADD FILES TO SMART CONTRACT
                // return axios.post('http://localhost:8000/api/sendMessageTo', {
                //     message: text,
                //     to: '+919381872407'
                // }).then(result => {
                //     return result.data;
                // }).catch(error => {
                //     Swal.showValidationMessage(
                //         `Request failed: ${error}`
                //     )
                // })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            console.log(result);
            if (result.value) {
                Swal.fire(
                    'Message Sent!',
                    'Your message has been sent!',
                    'success'
                )
            }
        })
    }

    getName = async (address) => {
        let result = await companyContract.methods.getUser(address).call();
        return result.name;
    }

    async componentDidMount() {
        console.log('ADDRESS - ', this.props.userAddress);
        let requests = await requestContract.methods.getReceivedRequest().call({ from: this.props.userAddress });
        let files = await studentContract.methods.getFile().call({ from: this.props.userAddress });
        // let studentFiles = files.map((file) => {
        //     return 
        // })
        console.log('REQUEST - ', requests);
        console.log('FILES - ', files);
        files = files.map((file) => {
            return {
                fileName: file.title
            }
        });
        this.props.setStudentFiles(files);
        let promises = [];
        requests.map((req) => {
            promises.push(this.getName(req.sender));
        });
        let names = await Promise.all(promises);
        let result = requests.map((req, index) => {
            return {
                address: req.sender,
                name: names[index],
                desc: req.description
            }
        })
        this.setState({
            rowData: result
        })
        // console.log(allUploads);
        try {
            this.refs.agGrid.api.sizeColumnsToFit();
            this.refs.agGrid.api.resetRowHeights();
        } catch (err) {

        }

    }
    render() {
        return (
            <div
                className="ag-theme-alpine"
                style={{
                    height: '60%',
                    width: '100%'
                }}
            >
                <AgGridReact
                    ref="agGrid"
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                >
                </AgGridReact>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userID: state.userID,
        studentFiles: state.studentFiles,
        userAddress: state.userAddress
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showPreview: () => {
            dispatch({
                type: 'SHOW_PREVIEW'
            })
        },
        setStudentFiles: (studentFiles) => {
            dispatch({
                type: "SET_STUDENT_FILES",
                studentFiles: studentFiles
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Query);