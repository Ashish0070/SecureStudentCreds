import React from 'react';
import './UploadCard.css';
import { connect } from 'react-redux';

class UploadCard extends React.Component {
    render() {
        return (
            <div style={{ marginLeft: this.props.studentPage ? '5%' : '' }} onClick={() => { this.props.toggleUploader(true) }} className="UploadCard">
                <input id="myInput" type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }} />
                <i className="fa fa-upload image" aria-hidden="true"></i>
                <span className="text">Upload<br />{this.props.studentPage ? "Documents" : "Students CSV"}</span>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleUploader: (toggle) => {
            dispatch({
                type: 'TOGGLE_UPLOADER',
                toggle: toggle
            })
        }
    }
}

export default connect(undefined, mapDispatchToProps)(UploadCard);