import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { connect } from "react-redux";

class Sidebar extends React.Component {
    render() {
        let listJSX = [];
        if (this.props.org == 'school') {
            listJSX = [
                <li className="menuItem"><NavLink exact to="/school" activeClassName="active"><i class="fa fa-bar-chart" aria-hidden="true"></i>Dashboard</NavLink></li>
            ]
        } else if (this.props.org == 'student') {
            listJSX = [
                <li className="menuItem"><NavLink exact to="/student" activeClassName="active"><i class="fa fa-bar-chart" aria-hidden="true"></i>Dashboard</NavLink></li>,
                <li className="menuItem"><NavLink exact to="/student/documents" activeClassName="active"><i class="fa fa-files-o" aria-hidden="true"></i>Documents</NavLink></li>
            ]
        } else if (this.props.org == 'company') {
            listJSX = [
                <li className="menuItem"><NavLink exact to="/company" activeClassName="active"><i class="fa fa-bar-chart" aria-hidden="true"></i>Dashboard</NavLink></li>,
                <li className="menuItem"><NavLink exact to="/company/requests" activeClassName="active"><i class="fa fa-paper-plane" aria-hidden="true"></i>Requests</NavLink></li>
            ]
        }
        return (
            <div className="Sidebar">
                <ul className="menuList">
                    {listJSX}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        org: state.org
    }
}

export default connect(mapStateToProps)(Sidebar);