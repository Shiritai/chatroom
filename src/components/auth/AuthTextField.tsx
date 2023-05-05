import { TextField } from "@mui/material";
import React, { useState } from "react";
import { MyTextProp } from "../../types/PagePropTypes";
import { isValidEmail } from "../../util/function/TextChecker";

const EmailTextField = (props: MyTextProp = { focus: false }) => {
  const [error, setError] = useState(false);

  const email = React.createRef<HTMLInputElement>();

  const handleEmailChange = () => {
    if (email.current) setError(!isValidEmail(email.current.value));
  };

  return (
    <TextField
      required
      fullWidth
      id="email"
      label="Email Address"
      name="email"
      inputRef={email}
      onChange={handleEmailChange}
      onClick={handleEmailChange}
      error={error}
      autoComplete="email"
      autoFocus={props.focus}
    />
  );
};

const PasswordTextField = () => {
  return (
    <TextField
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="new-password"
    />
  );
};

export { EmailTextField, PasswordTextField };
