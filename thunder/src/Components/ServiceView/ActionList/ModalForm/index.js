import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import style from "./style.module.css";

ModalForm.propTypes = {
  trigger: PropTypes.object,
  onClose: PropTypes.func,
  btnText: PropTypes.string,
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
            <div className={style.inner}>{props.children}</div>
            <div className={style.btns}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button color="primary" onClick={handleClose}>
                {props.btnText ? props.btnText : "Done"}
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalForm;
