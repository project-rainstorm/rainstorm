import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import style from "./style.module.css";

Select.propTypes = {
  field: PropTypes.object,
  service: PropTypes.object,
  closeModal: PropTypes.func,
};

function Select(props) {
  const [value, setValue] = useState(props.field.value);

  const submit = () => {
    console.log("submit");
    props.closeModal();
  };

  return (
    <div>
      <div className={style.field}>
        <TextField
          label={props.field.label}
          select
          SelectProps={{
            native: true,
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {props.field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </div>
      <div className={style.btns}>
        <Button onClick={props.closeModal}>Cancel</Button>
        <Button color="primary" onClick={submit}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default Select;
