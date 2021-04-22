import React from 'react';
import { connect } from 'react-redux';
import './Navbar.css';
import profilePic from '../../assets/img/profilePic.jpg'

class Navbar extends React.Component {
    render() {
        let title = '';
        if (this.props.org) {
            console.log(this.props.org);
            title = this.props.org.charAt(0).toUpperCase() + this.props.org.slice(1)
        }
        return (
            <div className="Navbar">
                <span className="title">{title}<span style={{ fontWeight: '500' }}> Dashboard</span></span>
                {/* <img src={profilePic} className="profilePic" /> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        org: state.org
    }
}

export default connect(mapStateToProps)(Navbar);