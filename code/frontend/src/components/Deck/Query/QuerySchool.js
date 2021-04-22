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
import studentABI from '../../../config/student';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');
const userContract = new web3.eth.Contract(userABI, '0x456757e8bCfFD2f6FA3E27af8cb96E8Fc2cdfC34');
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');


class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Student Address", field: "address", sortable: true, filter: true
            }, {
                headerName: "Name", field: "name", sortable: true, filter: true
            }, {
                headerName: "View", field: "address",
                cellRendererFramework: (params) => {
                    return <Link to={`/school/student/${params.value}`}>view</Link>
                },
                // onclick: () => { console.log('BOIS JUST GOT CLICKED'); }
            }],
            rowData: []
        }
    }

    getName = async (address) => {
        let result = await studentContract.methods.getUser(address).call();
        return result.name;
    }

    async componentDidMount() {
        if (this.props.userAddress) {
            let addresses = await schoolContract.methods.getStudents(this.props.userAddress).call();
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
        }
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
                    height: '70%',
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