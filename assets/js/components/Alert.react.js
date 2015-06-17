var React = require('react');
var ReactAddons = require('react/addons');
var ReactCSSTransitionGroup = ReactAddons.addons.CSSTransitionGroup;
var classNames = require('classnames');

var Alert = React.createClass({

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