import React from "react";
import "./Student.css";
import Dropzone from 'react-dropzone-uploader';
import UploadCard from "../UploadCard/UploadCard";
import DetailsCard from "../DetailsCard/DetailsCard";
import Query from "../Query/Query";
import { connect } from "react-redux";
// import FileCard from "../FileCard/FileCard";

class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="studentContainer">
                <div className="topRow">
                    <DetailsCard text1={"Uploaded"} text2={"Documents"} number={this.props.studentFilesCount} />
                    <UploadCard studentPage={true} />
                </div>
                <Query />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        studentFilesCount: state.studentFilesCount
    }
}

export default connect(mapStateToProps)(Student);