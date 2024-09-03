import React from "react";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import { Validator, EmailRule } from "devextreme-react/validator";
import "./ForgotPwd.scss";
import { useNavigate } from "react-router-dom";

export default function ForgotPwd({
  setEmail,
  email,
  handleContinue,
  emailValidatorRef,
}) {
  const navigate = useNavigate();
  const onbackClick = () => {
    navigate("/SignInForm");
  }
  return (
    <>
      {/* <Button
        icon="arrowleft"
        className="backBtn"
        text="Go Back"
        onClick={onbackClick}
        width={"auto"}
      /> */}
      <div className="lower-section">
        <div>
          <p className="resetText">Reset Password</p>
          <p className="resetTxtInfo">
            Enter your email address to get an OTP to reset your password.&nbsp;
            <button className="notyouTxt" onClick={() => { navigate("/SignInForm") }}>
             Go to Login ?
            </button>
          </p>
        </div>

        <div>
          <p className="emailText">
            Email Address <span className="required-field">*</span>
          </p>
          <TextBox
            placeholder="Enter email address"
            stylingMode="outlined"
            width={"100%"}
            className="custom-textbox"
            value={email}
            onValueChanged={(e) => setEmail(e.value)}
          >
            <Validator ref={emailValidatorRef}>
              <EmailRule message="Please enter a valid email address." />
            </Validator>
          </TextBox>
          <Button
            onClick={handleContinue} // Call handleContinue function on button click
            type="default"
            width={"100%"}
            height={48}
            stylingMode="contained"
            className="custom-button"
          // disabled={!email}
          >
            Continue
          </Button>

          <p className="termsText">
            I agree with your{" "}
            <a href="" className="termslink">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
