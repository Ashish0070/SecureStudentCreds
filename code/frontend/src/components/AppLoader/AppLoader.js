import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import "./AppLoader.css";
import "./animation.css";
import { connect } from "react-redux";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Web3 from 'web3';
import userABI from '../../config/user';
import schoolABI from '../../config/school';
import studentABI from '../../config/student';
import companyABI from '../../config/company';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const userContract = new web3.eth.Contract(userABI, '0x456757e8bCfFD2f6FA3E27af8cb96E8Fc2cdfC34');
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');
const companyContract = new web3.eth.Contract(companyABI, '0xdAf4E46101c83F7b27383272fb114dfF3F904576');
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');

class AppLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: false,
            selectedOption: ""
        }
    }

    componentDidMount = async () => {
        if (this.props.userAddress) {
            console.log('MAKING THE CALL AGAIN');
            let promises = [];
            promises.push(studentContract.methods.hasUser(this.props.userAddress).call());
            promises.push(schoolContract.methods.hasUser(this.props.userAddress).call());
            promises.push(companyContract.methods.hasUser(this.props.userAddress).call());
            let [studentExists, schoolExists, companyExists] = await Promise.all(promises);
            if (studentExists || schoolExists || companyExists) { //CHECK IF ALREADY REGISTERED
                console.log('USER EXISTS');
                let user;
                if (studentExists) {
                    user = await studentContract.methods.getUser(this.props.userAddress).call();
                } else if (schoolExists) {
                    user = await schoolContract.methods.getUser(this.props.userAddress).call();
                } else if (companyExists) {
                    user = await companyContract.methods.getUser(this.props.userAddress).call();
                }

                console.log('GET USER - ', user);
                if (user.designation == "Student") {
                    this.props.setOrg("student");
                    this.props.history.push("/student")
                } else if (user.designation == "School") {
                    this.props.setOrg("school");
                    this.props.history.push("/school")
                } else if (user.designation == "Company") {
                    this.props.setOrg("company");
                    this.props.history.push("/company")
                }
                // this.props.history.push('/school');
            } else {
                this.props.setAppLoading(false);
                this.setState({
                    showLogin: true
                })
            }
        }
    }

    // componentDidUpdate = async () => {
    //     //TODO: GET ACCOUNT DETAILS FROM SMART CONTRACT
    //     if (this.props.userAddress && this.props.appLoading) {
    //         console.log('MAKING THE CALL AGAIN');
    //         let exists = await userContract.methods.hasUser(this.props.userAddress).call();
    //         console.log('EXISTS - ', exists);
    //         if (exists) { //CHECK IF ALREADY REGISTERED
    //             console.log('USER EXISTS');
    //             let user = await userContract.methods.getUser(this.props.userAddress).call();
    //             if (user.designation == "Student") {
    //                 this.props.history.push("/student")
    //             } else if (user.designation == "School") {
    //                 this.props.history.push("/school")
    //             } else if (user.designation == "Company") {
    //                 this.props.history.push("/company")
    //             }
    //             // this.props.history.push('/school');
    //         } else {
    //             this.props.setAppLoading(false);
    //             this.setState({
    //                 showLogin: true
    //             })
    //         }
    //     }
    // }

    changeOption = (e) => {
        this.setState({
            selectedOption: e.target.value
        })
    }

    onSubmit = async () => {
        if (this.state.selectedOption == "School") {
            await schoolContract.methods.createUser(this.state.name, this.state.selectedOption).send({ from: this.props.userAddress });
            this.props.setOrg("school");
            this.props.history.push('/school');
        } else if (this.state.selectedOption == "Student") {
            await studentContract.methods.createUser(this.state.name, this.state.selectedOption).send({ from: this.props.userAddress });
            this.props.history.push('/student');
            this.props.setOrg("student");
        } else if (this.state.selectedOption == "Company") {
            await companyContract.methods.createUser(this.state.name, this.state.selectedOption).send({ from: this.props.userAddress });
            this.props.history.push('/company');
            this.props.setOrg("company");
        }
    }

    handleName = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    render() {
        return (
            <div className="loaderContainer">
                {this.props.appLoading && <CircularProgress />}
                {!this.props.appLoading && <><div>
                    <div class="animationContainer">
                        <div class="holder"><div class="box"></div></div>
                        <div class="holder"><div class="box"></div></div>
                        <div class="holder"><div class="box"></div></div>
                    </div>
                </div>
                    <FormControl id="formId">
                        <InputLabel id="demo-simple-select-label">Select an option</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.selectedOption}
                            onChange={this.changeOption}
                        >
                            <MenuItem value={"School"}>School</MenuItem>
                            <MenuItem value={"Student"}>Student</MenuItem>
                            <MenuItem value={"Company"}>Company</MenuItem>
                        </Select>
                        <TextField onChange={this.handleName} id="standard-basic" label="Name" />
                        <div onClick={this.onSubmit} className="submitButton">Let's Go!</div>
                    </FormControl>
                </>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userAddress: state.userAddress,
        appLoading: state.appLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setOrg: (org) => {
            dispatch({
                type: "SET_ORGANIZATION",
                org: org
            })
        },
        setAppLoading: (state) => {
            dispatch({
                type: "SET_APP_LOADING",
                state: state
            })
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppLoader));