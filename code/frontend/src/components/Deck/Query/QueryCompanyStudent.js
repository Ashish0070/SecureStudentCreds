import React from 'react';
import './Query.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import schoolABI from '../../../config/school';
import studentABI from '../../../config/student';
import requestABI from '../../../config/request';
import Web3 from 'web3';
import { withRouter } from 'react-router-dom';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');
const requestContract = new web3.eth.Contract(requestABI, '0x40CE401C4DD2f354Cef1c48541098D821B28F1c9');

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Student Address", field: "address", sortable: true, filter: true
            }, {
                headerName: "Name", field: "name", sortable: true, filter: true
            }, {
                headerName: "Request", field: "address",
                cellRendererFramework: (params) => {
                    return <div className="viewTable" onClick={() => { this.replyToCompany(params.value) }}>Request</div>
                },
                // onclick: () => { console.log('BOIS JUST GOT CLICKED'); }
            }],
            rowData: []
        }
    }

    replyToCompany = (studentAddress) => {
        Swal.fire({
            title: 'Enter the message you wish to send!',
            input: 'textarea',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Send',
            showLoaderOnConfirm: true,
            preConfirm: (text) => {
                return requestContract.methods.sendRequest(studentAddress, text).send({ from: this.props.userAddress })
                    .then(result => {
                        return true;
                    }).catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            console.log(result);
            if (result) {
                Swal.fire(
                    'Message Sent!',
                    'Your message has been sent!',
                    'success'
                )
            }
        })
    }

    getName = async (address) => {
        let result = await studentContract.methods.getUser(address).call();
        return result.name;
    }

    async componentDidMount() {
        console.log(this.props.match.params.schoolAddress);
        let addresses = await schoolContract.methods.getStudents(this.props.match.params.schoolAddress).call();
        let promises = [];
        addresses.map((address) => {
            promises.push(this.getName(address));
        });
        let names = await Promise.all(promises);
        let result = addresses.map((address, index) => {
            return {
                address,
                name: names[index]
            }
        })
        this.setState({
            rowData: result
        })
        try {
            this.refs.agGrid.api.sizeColumnsToFit()
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
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Query));