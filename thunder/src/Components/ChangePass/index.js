import React from "react";
import PropTypes from "prop-types";
import style from "./style.module.css";

import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";

// content
import BackAppBar from "../BackAppBar";
import Container from "@material-ui/core/Container";

import authHeader from "../../services/auth-header";

ChangePass.propTypes = {
  setAppState: PropTypes.func,
  showAlert: PropTypes.func,
};

function ChangePass(props) {
  const defaultValues = {
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    showPassword: false,
  };

  const [values, setValues] = React.useState(defaultValues);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    for (const k in values) {
      if (values[k] === "") {
        props.showAlert("Please fill all values!", "error");
        return;
      }
    }
    if (values.newPassword !== values.confirmNewPassword) {
      props.showAlert("Confirm password does not match!", "error");
      return;
    }
    fetch(`/settings/password`, {
      method: "post",
      headers: authHeader(),
      body: JSON.stringify({
        password: values.password,
        newPassword: values.newPassword,
      }),
    }).then((res) =>
      res.json().then((data) => {
        props.showAlert(data.message, data.severity);
        if (data.severity === "success") {
          setValues(defaultValues);
        }
      })
    );
  };

  return (
    <div>
      <BackAppBar backTo="app" setAppState={props.setAppState} />
      <Container maxWidth="md">
        <h2>Change Password</h2>

        <div className={style.login}>
          <FormControl className={style.textField}>
            <InputLabel htmlFor="standard-password">
              Current Password
            </InputLabel>
            <Input
              id="standard-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl className={style.textField}>
            <InputLabel htmlFor="standard-new-password">
              New Password
            </InputLabel>
            <Input
              id="standard-new-password"
              type={values.showPassword ? "text" : "password"}
              value={values.newPassword}
              onChange={handleChange("newPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl className={style.textField}>
            <InputLabel htmlFor="standard-confirm-password">
              Confirm New Password
            </InputLabel>
            <Input
              id="standard-confirm-password"
              type={values.showPassword ? "text" : "password"}
              value={values.confirmNewPassword}
              onChange={handleChange("confirmNewPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <br />
          <FormControl className={style.textField}>
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
          </FormControl>
        </div>
      </Container>
    </div>
  );
}

export default ChangePass;
