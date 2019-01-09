var React = require('react');
var reactCreateClass = require('create-react-class');
var classNames = require('classnames');

var Alert = reactCreateClass({

    propTypes: {
        type: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
    },

    render: function() {
        return(
            <div className={classNames('alert', 'alert-' + this.props.type)}>{this.props.text}</div>
        );
    }

});

module.exports = Alert;
