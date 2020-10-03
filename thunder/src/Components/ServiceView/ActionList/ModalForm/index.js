import React from "react";
import PropTypes from "prop-types";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import style from "./style.module.css";

ModalForm.propTypes = {
  trigger: PropTypes.object,
  onClose: PropTypes.func,
  btnText: PropTypes.string,
  children: PropTypes.node,
};

function ModalForm(props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onClose && props.onClose();
  };

  const modalBody = React.Children.map(props.children, (child) => {
    // If it's just dom element (like div) don't pass closeModal
    if (!child || typeof child.type === "string") {
      return child;
    }
    return React.cloneElement(child, { closeModal: handleClose });
  });

  return (
    <div>
      <div onClick={handleOpen}>{props.trigger}</div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={style.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={style.paper}>
            <div className={style.inner}>{modalBody}</div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalForm;
