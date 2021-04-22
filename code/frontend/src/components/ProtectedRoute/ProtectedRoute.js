import { connect } from 'react-redux';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

class ProtectedRoute extends React.Component {
    render() {
        const { component: Component, ...props } = this.props;
        console.log('THESE ARE ORG', this.props.org);
        return (
            <Route
                {...props}
                render={props => (
                    this.props.org ?
                        <Component {...props} /> :
                        <Redirect to='/' />
                )}
            />
        )
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
        setAuthDone: (state) => {
            dispatch({
                type: "SET_AUTH_DONE",
                authDone: state
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);