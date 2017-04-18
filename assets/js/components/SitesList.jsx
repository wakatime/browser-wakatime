var React = require('react');

var SitesList = React.createClass({

    getDefaultProps: function () {
        return {
            placeholder: 'http://google.com'
        };
    },

    _handleChange: function (event) {
        var sites = event.target.value;

        this.props.handleChange(sites);
    },

    render: function () {

        return (
            <div className="form-group">
                <label htmlFor="sites" className="col-lg-2 control-label">{this.props.label}</label>

                <div className="col-lg-10">
                    <textarea className="form-control" rows="3" ref="sites" onChange={this._handleChange}
                        placeholder={this.props.placeholder} value={this.props.sites}></textarea>
                    <span className="help-block">{this.props.helpText}
                        <br/>
                        One line per site.</span>
                </div>
            </div>
        );
    }
});

module.exports = SitesList;
