import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

VariableForm.propTypes = {
  service: PropTypes.object,
};

function VariableForm(props) {
  const [services, setServices] = useState([]);

  return (
    <div>
      <h1>Variables</h1>
    </div>
  );
}

export default VariableForm;
