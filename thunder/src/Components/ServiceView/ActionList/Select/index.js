import React, { useState } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import style from "./style.module.css";

Select.propTypes = {
  field: PropTypes.object,
  service: PropTypes.object,
  setService: PropTypes.func,
  closeModal: PropTypes.func
};

function Select(props) {
  const [value, setValue] = useState(props.field.value || props.field.default);

  const submit = () => {
    let field = props.field;
    field.value = value;
    console.log(JSON.stringify(field));
    fetch(`/services/${props.service.name}/vars`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(field)
    })
      .then(res => res.json())
      .then(data => {
        props.setService(data.data);
      });
    props.closeModal();
  };

  return (
    <div>
      <div className={style.field}>
        <TextField
          label={props.field.label}
          select
          SelectProps={{
            native: true
          }}
          value={value}
          onChange={e => setValue(e.target.value)}
        >
          {props.field.options.map(option => (
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
