import React from "react";
import PropTypes from "prop-types";

export default class InputField extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    return (
      <div>
        <p>{this.props.label}</p>
        <input
          type="text"
          value={this.props.value}
          onChange={e => this.props.onChange()}
        />
      </div>
    );
  }
}
