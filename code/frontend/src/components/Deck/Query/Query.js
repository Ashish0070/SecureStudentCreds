import React from 'react';
import './Query.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
import axios from 'axios';
import Web3 from 'web3';
import studentABI from "../../../config/student";
import { withRouter } from "react-router-dom";
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Filename", field: "name", sortable: true, filter: true
            }, {
                headerName: "Description", field: "desc", sortable: true, filter: true
            }, {
                headerName: "Link", field: "link",
                cellRendererFramework: function (params) {
                    return <div className="viewTable" onClick={() => { props.showPreview(params.value) }}>View File</div>
                },
                // onclick: () => { console.log('BOIS JUST GOT CLICKED'); }
            }],
            rowData: []
        }
    }
    async componentDidMount() {
        let files = await studentContract.methods.getFile().call({ from: this.props.match.params.studentAddress });
        console.log('FILES - ', files);
        this.props.setKey('studentFilesCount', files.length);
        let result = files.map((file) => {
            return {
                name: file.title,
                desc: file.description,
                link: file.ipfsHash
            }
        });
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
        userID: state.userID
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showPreview: (link) => {
            dispatch({
                type: 'SHOW_PREVIEW',
                link: link
            })
        },
        setKey: (key, value) => {
            dispatch({
                type: "SET_KEY",
                value: value,
                key: key
            })
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Query));