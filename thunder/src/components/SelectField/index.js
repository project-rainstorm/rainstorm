import React from "react";
import PropTypes from "prop-types";

export default class SelectField extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array
  };

  render() {
    return (
      <div>
        <p>{this.props.label}</p>
        <select value={this.props.value} onChange={e => this.props.onChange()}>
          {this.props.options.map(option => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }
}
