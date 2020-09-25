import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";

Input.propTypes = {
  field: PropTypes.object,
};

function Input(props) {
  const [value, setValue] = useState(props.field.value);

  return (
    <div>
      <TextField
        label={props.field.label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default Input;
