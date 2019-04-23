var React = require('react');
var reactCreateClass = require('create-react-class');
var classNames = require('classnames');

var Alert = reactCreateClass({

    render: function() {
        return(
            <div className={classNames('alert', 'alert-' + this.props.type)}>{this.props.text}</div>
        );
    }

});

module.exports = Alert;
