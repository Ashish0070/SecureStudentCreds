import React from 'react';
import './Deck.css';
import Uploader from './Uploader/Uploader';
import ProcessedViewer from './ProcessedViewer/ProcessedViewer';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Query from './Query/Query';
import QueryStudent from './Query/QueryStudent';
import QueryCompany from './Query/QueryCompany';
import QueryCompanyStudent from './Query/QueryCompanyStudent';
import QueryStudentDocuments from './Query/QueryStudentDocuments';
import QueryCompanyRequests from './Query/QueryCompanyRequests';
import QuerySharedFiles from './Query/QuerySharedFiles';
import QuerySchool from './Query/QuerySchool';
import InvoiceViewer from './Chatbot/InvoiceViewer/InvoiceViewer';
import Student from './Student/Student';
import TextField from '@material-ui/core/TextField';
import Web3 from 'web3';
import schoolABI from '../../config/school';
import userABI from '../../config/user';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');
const userContract = new web3.eth.Contract(userABI, '0x456757e8bCfFD2f6FA3E27af8cb96E8Fc2cdfC34');


class Deck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentAddress: ''
        }
    }
    addressChange = (e) => {
        this.setState({
            studentAddress: e.target.value
        })
    }
    addStudent = async (e) => {
        try {
            console.log('student add - ', this.state.studentAddress);
            console.log('school add - ', this.props.userAddress);
            await schoolContract.methods.addStudent(this.state.studentAddress).send({ from: this.props.userAddress });
        } catch (err) {
            console.error(err);
        }

    }

    render() {
        return (
            <div className="Deck">
                <Switch>
                    <Route exact path="/school">
                        <div className="headerRow">
                            {/* <DetailsCard text1={"Students"} text2={"Added"} /> */}
                            {/* <DetailsCard text1={"Students"} text2={"Processed"} /> */}
                            {/* <UploadCard /> */}
                            {/* <DownloadCard /> */}
                        </div>
                        {this.props.uploaderOpen == true && <Uploader />}
                        {this.props.previewShow == true && <ProcessedViewer />}
                        {/* <ProcessedViewer /> */}
                        <div className="addContainer">
                            <TextField onChange={this.addressChange} id="standard-basic" label="Address of Student" />
                            <div onClick={this.addStudent} className="addButton">Add</div>
                        </div>
                        <QuerySchool key={this.props.userAddress} />
                    </Route>
                    <Route path="/school/student/:studentAddress">
                        <Student />
                        {this.props.previewShow == true && <ProcessedViewer />}
                        {this.props.uploaderOpen == true && <Uploader />}
                        {this.props.supportDisplay.display == true && <InvoiceViewer />}
                    </Route>
                    <Route exact path="/student">
                        <QueryStudent key={this.props.userAddress} />
                    </Route>
                    <Route path="/student/documents">
                        <QueryStudentDocuments key={this.props.userAddress} />
                        {this.props.previewShow == true && <ProcessedViewer />}
                    </Route>
                    <Route exact path="/company">
                        <QueryCompany />
                    </Route>
                    <Route path="/company/student/:schoolAddress">
                        <QueryCompanyStudent />
                    </Route>
                    <Route path="/company/requests/student/:studentAddress">
                        <QuerySharedFiles key={this.props.userAddress} />
                    </Route>
                    <Route path="/company/requests/">
                        <QueryCompanyRequests key={this.props.userAddress} />
                    </Route>
                    <Route path="/query">
                        <Query />
                    </Route>
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        uploaderOpen: state.uploaderOpen,
        previewShow: state.preview.show,
        supportDisplay: state.supportDisplay,
        userAddress: state.userAddress
    }
}

export default connect(mapStateToProps)(Deck);