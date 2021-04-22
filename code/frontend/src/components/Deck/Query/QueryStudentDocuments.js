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
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Title", field: "title", sortable: true, filter: true
            }, {
                headerName: "Description", field: "desc", sortable: true, filter: true
            }, {
                headerName: "File", field: "link",
                cellRendererFramework: function (params) {
                    return <a href={`https://ipfs.io/ipfs/${params.value}`} target="_blank">View</a>
                },
            }],
            rowData: []
        }
    }

    async componentDidMount() {
        console.log(this.props.userAddress);
        let files = await studentContract.methods.getFile().call({ from: this.props.userAddress });
        console.log('SHARED FILES = ', files);
        let result = files.map((file, index) => {
            return {
                title: file.title,
                desc: file.description,
                link: file.ipfsHash
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

export default connect(mapStateToProps, mapDispatchToProps)(Query);