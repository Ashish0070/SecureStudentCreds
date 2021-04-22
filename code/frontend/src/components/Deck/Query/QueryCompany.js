import React from 'react';
import './Query.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import schoolABI from '../../../config/school';
import userABI from '../../../config/user';
import Web3 from 'web3';
import requestABI from '../../../config/request';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');
const userContract = new web3.eth.Contract(userABI, '0x456757e8bCfFD2f6FA3E27af8cb96E8Fc2cdfC34');
const requestContract = new web3.eth.Contract(requestABI, '0x40CE401C4DD2f354Cef1c48541098D821B28F1c9');

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "School Address", field: "address", sortable: true, filter: true
            }, {
                headerName: "Name", field: "name", sortable: true, filter: true
            }, {
                headerName: "View", field: "address",
                cellRendererFramework: (params) => {
                    return <Link to={`/company/student/${params.value}`}>view</Link>
                },
                // onclick: () => { console.log('BOIS JUST GOT CLICKED'); }
            }],
            rowData: []
        }
    }

    getName = async (address) => {
        let result = await schoolContract.methods.getUser(address).call();
        return result.name;
    }

    async componentDidMount() {
        console.log('SCHOOLS - ', this.props.userAddress);
        let addresses = await schoolContract.methods.getSchools().call({ from: this.props.userAddress });
        let sentReqs = await requestContract.methods.getSentRequest().call({ from: this.props.userAddress })
        console.log(addresses);
        console.log(sentReqs);
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
        // console.log(allUploads);
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
                    height: '50%',
                    width: '100%',
                    marginTop: '2%'
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

export default connect(mapStateToProps, mapDispatchToProps)(Query);