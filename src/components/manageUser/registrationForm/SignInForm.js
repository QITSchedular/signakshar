/// refactored code after submission- 24 june
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import Validator from "devextreme-react/validator";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import {
  CustomRule,
  EmailRule,
} from "devextreme-react/form";
// import "./RegistrationForm.scss";
import "./SignInForm.scss";
import GoogleIcon from "./google.jpeg";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../contexts/auth";
import { LoadPanel } from "devextreme-react";

export default function SignInForm() {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUppercase, setCheckedUppercase] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedSpecialCharacter, setCheckedSpecialCharacter] = useState(false);
  const [password, setPassword] = useState("");
  const formData = useRef({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const emailValidatorRef = React.createRef();
  const passwordValidatorRef = React.createRef();
  const { signIn, signInWithGoogle } = useAuth();
  const [showpwd, setshowpwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");
  const [loading, setLoading] = useState(false);
  const passwordTextBoxRef = useRef(null);

  const handlePasswordChange = (e) => {
    setPassword(e.value);
    if (e.value.length >= 8) {
      setChecked(true);
    } else {
      setChecked(false);
    }
    const hasLowercase = /[a-z]/.test(e.value);
    setCheckedLowercase(hasLowercase);

    const hasUppercase = /[A-Z]/.test(e.value);
    setCheckedUppercase(hasUppercase);

    const hasNumber = /[0-9]/.test(e.value);
    setCheckedNumber(hasNumber);

    const hasSpecialCharacter = /[^\w\s]/.test(e.value);
    setCheckedSpecialCharacter(hasSpecialCharacter);
  };
  const validatePassword = () => {
    return (
      checked &&
      checkedLowercase &&
      checkedUppercase &&
      checkedNumber &&
      checkedSpecialCharacter
    );
  };

  const handleContinue = async () => {
    const isEmailValid = emailValidatorRef.current.instance.validate().isValid;

    const isPasswordValid =
      passwordValidatorRef.current.instance.validate().isValid;
    if (!isEmailValid) {
      return toastDisplayer("error", "Enter correct Email");
    }
    if (!isPasswordValid) {
      return toastDisplayer("error", "Enter correct password");
    }
    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      const result = await signIn(email, password);
      if (result) {
        setLoading(false);
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => signInWithGoogle(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div className="container-main-signin">
        <div className="box box-1"></div>

        <div className="box box-2">
          <div className="card">
            <div className="upper-section">
              <img src="/logo-grey.svg" style={{ marginLeft: "-.5rem" }} height={50} alt="logo" />
            </div>
            <div className="lower-section">
              {/* <div className="step">Step 1 of 3</div> */}
              <div className="create-acc">
                Login into an account
              </div>
              <div className="already">
                Don’t have an account?{" "}
                <Link to="/RegistrationForm" className="login">
                  Create an account
                </Link>
              </div>
              <div className="email-add">
                Email Address <span className="required">*</span>
              </div>
              <TextBox
                placeholder="Enter Email address"
                stylingMode="outlined"
                width={"100%"}
                className="custom-textbox"
                value={email}
                onValueChanged={(e) => setEmail(e.value.toLowerCase())}
                onEnterKey={(e) => {
                  if (e.event.key === 'Enter') {
                    passwordTextBoxRef.current.instance.focus();
                  }
                }}
              >
                <Validator ref={emailValidatorRef}>
                  <EmailRule message="Please enter a valid email address." />
                </Validator>
              </TextBox>

              <div className="email-add">
                Password <span className="required">*</span>
              </div>
              <TextBox
                mode={passwordMode}
                stylingMode="outlined"
                placeholder="Enter password"
                className="custom-textbox"
                onFocusIn={() => {
                  setIsPasswordFocused(true);
                }}
                valueChangeEvent="keyup"
                onValueChanged={handlePasswordChange}
                ref={passwordTextBoxRef}
                onEnterKey={(e) => {
                  if (e.event.key === 'Enter') {
                    handleContinue()
                  }
                }}
              >
                <Validator ref={passwordValidatorRef}>
                  <CustomRule
                    message="Password must meet the specified criteria."
                    validationCallback={validatePassword}
                  />
                </Validator>
                <TextBoxButton
                  name="password"
                  location="after"
                  options={{
                    icon: `${showpwd ? "eyeopen" : "eyeclose"}`,
                    stylingMode: "text",
                    onClick: () => {
                      setshowpwd(!showpwd);
                      setPasswordMode((prevPasswordMode) =>
                        prevPasswordMode === "text" ? "password" : "text"
                      );
                    },
                  }}
                />
              </TextBox>
              <div className="forgot-pass">
                <Link to="/MainUser" className="forgot-pass">
                  Forgot Password?
                </Link>
              </div>
              <Button
                className="submit-button"
                text="Continue"
                type="default"
                textTransform="none"
                onClick={handleContinue}
              />
              <div className="or">or</div>
              <Button
                className="google-button"
                // text="Continue with Google"
                type="default"
                textTransform="none"
                onClick={login}
              >
                <img
                  src={GoogleIcon}
                  width={25}
                  alt="Google Icon"
                  className="google-icon"
                />
                Continue with Google
              </Button>
              <div className="agree">
                I agree with your{" "}
                <Link to="/login" className="agree">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}