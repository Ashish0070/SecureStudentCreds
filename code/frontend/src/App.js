import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Deck from './components/Deck/Deck';
import Web3 from 'web3';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import AppLoader from './components/AppLoader/AppLoader';
import userABI from './config/user';
import schoolABI from './config/school';
import studentABI from './config/student';
import companyABI from './config/company';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const Web3Context = React.createContext(web3);
const userContract = new web3.eth.Contract(userABI, '0x456757e8bCfFD2f6FA3E27af8cb96E8Fc2cdfC34');
const studentContract = new web3.eth.Contract(studentABI, '0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b');
const companyContract = new web3.eth.Contract(companyABI, '0xdAf4E46101c83F7b27383272fb114dfF3F904576');
const schoolContract = new web3.eth.Contract(schoolABI, '0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noAccount: false,
      noMetaMask: false
    }
  }
  componentWillMount() {
    if (!this.props.org && window.location.pathname != '/') {
      this.props.history.push('/');
    }
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    try {
      await window.ethereum.enable();
    } catch (err) {
      this.setState({
        noMetaMask: true
      });
      return;
    }
    const accounts = await web3.eth.getAccounts();
    if (accounts.length == 0) {
      this.setState({
        noAccount: true
      })
      return;
    } else {
      this.props.setUserAddress(accounts[0]);
      let promises = [];
      promises.push(studentContract.methods.hasUser(this.props.userAddress).call());
      promises.push(schoolContract.methods.hasUser(this.props.userAddress).call());
      promises.push(companyContract.methods.hasUser(this.props.userAddress).call());
    }
    var accountInterval = setInterval(async () => {
      // Check if account has changed
      const accounts = await web3.eth.getAccounts();
      if (accounts[0] !== this.props.userAddress) {
        let userAddress = accounts[0];
        // Call some function to update the UI with the new account
        this.props.setAppLoading(true);
        this.changeAccount(userAddress);
      }
    }, 100);
  }

  changeAccount = (userAddress) => {
    this.props.setUserAddress(userAddress);
    this.props.setOrg('');
    this.props.history.push('/');
  }

  render() {
    return (
      <Web3Context.Provider>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={() => <AppLoader key={this.props.userAddress} />} />
          <Route path="/school">
            {this.state.noAccount && <div>You need to create a MetaMask account before you start using this app!</div>}
            {this.state.noMetaMask && <div>You need to install MetaMask before using the app!</div>}
            {!this.state.noMetaMask && !this.state.noAccount && <div className="DeckWrapper">
              <Sidebar />
              <Deck />
            </div>}
          </Route>
          <Route path="/student">
            {this.state.noAccount && <div>You need to create a MetaMask account before you start using this app!</div>}
            {this.state.noMetaMask && <div>You need to install MetaMask before using the app!</div>}
            {!this.state.noMetaMask && !this.state.noAccount && <div className="DeckWrapper">
              <Sidebar />
              <Deck />
            </div>}
          </Route>
          <Route path="/company">
            {this.state.noAccount && <div>You need to create a MetaMask account before you start using this app!</div>}
            {this.state.noMetaMask && <div>You need to install MetaMask before using the app!</div>}
            {!this.state.noMetaMask && !this.state.noAccount && <div className="DeckWrapper">
              <Sidebar />
              <Deck />
            </div>}
          </Route>
        </div>
      </Web3Context.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userAddress: state.userAddress,
    org: state.org,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserAddress: (userAddress) => {
      dispatch({
        type: 'SET_USER_ADDRESS',
        userAddress: userAddress
      })
    },
    setAppLoading: (state) => {
      dispatch({
        type: "SET_APP_LOADING",
        state: state
      })
    },
    setOrg: (org) => {
      dispatch({
        type: "SET_ORGANIZATION",
        org: org
      })
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
