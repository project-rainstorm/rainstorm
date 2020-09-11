import React from "react";
import PropTypes from "prop-types";
import style from './style.css';
import classnames from 'classnames';

export default class Modal extends React.Component {
  static propTypes = {
    trigger: PropTypes.object,
    onClose: PropTypes.func,
    title: PropTypes.string
  };

  state = {
    show: false
  };

  handleClose = () => {
    this.setState({ show: false });
    this.props.onClose();
  };

  showModal = () => {
    this.setState({ show: true });
  };

  render() {
    const { show } = this.state;
    const showHideClassName = show
      ? style.displayBlock
      : style.displayNonw

    return (
      <div>
        <div className={classnames(style.modal, showHideClassName)}>
          <section className={style.modalMain}>
            {this.props.children}
            <button onClick={this.handleClose}>Close</button>
          </section>
        </div>
        <button type="button" onClick={this.showModal}>
          Open
        </button>
      </div>
    );
  }
}
