import React from 'react';
import './DetailsCard.css';
import { connect } from 'react-redux';

class DetailsCard extends React.Component {
    render() {
        return (
            <div className="DetailsCard">
                <span className="number">{this.props.number}</span>
                <span className="text">{this.props.text1}<br />{this.props.text2}</span>
                {this.props.type == 1 && <span className="text">Students<br />Added</span>}
                {this.props.type == 2 && <span className="text">Students<br />Processed</span>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        invoicesProcessed: state.invoicesProcessed
    }
}

export default connect(mapStateToProps)(DetailsCard);