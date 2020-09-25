import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";

Select.propTypes = {
  field: PropTypes.object,
};

function Select(props) {
  const [value, setValue] = useState(props.field.value);

  return (
    <div>
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
  );
}

export default Select;
