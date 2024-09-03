import React, { useState, useRef } from "react";
import { ReactComponent as IconCheckbox } from "../../../icons/checkbox-line.svg";
import { ReactComponent as IconCheckboxblankline } from "../../../icons/checkbox-blank-line.svg";
import TextBox, { Button as TextBoxButton } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import Validator, { CustomRule } from "devextreme-react/validator";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../../api/UnAuth"; // Update the import path if necessary
import "../forgotPwd/ForgotPwd.scss";
import { Tooltip } from "devextreme-react";

function ResetPassword({ email }) {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUppercase, setCheckedUppercase] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedSpecialCharacter, setCheckedSpecialCharacter] = useState(false);
  const passwordValidatorRef = useRef(null);
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");
  const [showPwd1, setShowPwd1] = useState(false);
  const [passwordMode1, setPasswordMode1] = useState("password");

  const validatePassword = () => {
    return (
      checked &&
      checkedLowercase &&
      checkedUppercase &&
      checkedNumber &&
      checkedSpecialCharacter
    );
  };

  const handlePasswordChange = (e) => {
    const value = e.value;
    setPassword(value);

    setChecked(value.length >= 8);
    setCheckedLowercase(/[a-z]/.test(value));
    setCheckedUppercase(/[A-Z]/.test(value));
    setCheckedNumber(/[0-9]/.test(value));
    setCheckedSpecialCharacter(/[^\w\s]/.test(value));
  };

  const handleNewPasswordChange = (e) => {
    const value = e.value;
    setNewPassword(value);

    setChecked(value.length >= 8);
    setCheckedLowercase(/[a-z]/.test(value));
    setCheckedUppercase(/[A-Z]/.test(value));
    setCheckedNumber(/[0-9]/.test(value));
    setCheckedSpecialCharacter(/[^\w\s]/.test(value));
  };

  const handlePwdContinue = async () => {
    if (password !== newPassword) {
      return toastDisplayer(
        "error",
        "Password and confirm password should be the same"
      );
    }

    const isPasswordValid =
      passwordValidatorRef.current &&
      passwordValidatorRef.current.instance.validate().isValid;

    if (!isPasswordValid) {
      return toastDisplayer("error", "Password is invalid");
    }

    try {
      const newPwdResponse = await forgetPassword(email, newPassword);

      if (newPwdResponse.success && newPwdResponse.message === "New Password Generated..!!") {
        toastDisplayer("success", "New Password generated!");
        navigate("/SignInForm");
      } else {
        toastDisplayer("error", "Error while generating new password");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "User matching query does not exist."
      ) {
        toastDisplayer("error", "This user does not exist");
      } else {
        console.error("Error resetting password:", error);
        toastDisplayer("error", "Failed to reset password");
      }
    }
  };

  return (
    <>
      <div className="lower-section">
        <div>
          <p className="resetText">New Password</p>
          <p className="resetTxtInfo">Enter new password to get the account setup</p>
        </div>

        <div className="pwdField">
          {/* <div className="email-add">
            New Password <span className="required">*</span>
          </div> */}
          <div className="emailText">
            New Password <span className="required-field">*</span>
          </div>
          <TextBox
            stylingMode="outlined"
            placeholder="Enter password"
            className="custom-textbox"
            mode={passwordMode}
            onFocusIn={() => setIsPasswordFocused(true)}
            valueChangeEvent="keyup"
            onValueChanged={handlePasswordChange}
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
                icon: showPwd ? "eyeopen" : "eyeclose",
                stylingMode: "text",
                onClick: () => {
                  setShowPwd(!showPwd);
                  setPasswordMode((prevPasswordMode) =>
                    prevPasswordMode === "text" ? "password" : "text"
                  );
                },
              }}
            />
          </TextBox>
          {isPasswordFocused && (
            <div
              className="password-container"
              style={{
                backgroundColor: "#FBFBFB",
                padding: "12px",
                marginTop: "1.5rem",
              }}
            >
              <div className="password">Password must be</div>
              <div className="checkbox" id="checkbox1">
                {checked ? <IconCheckbox /> : <IconCheckboxblankline />}
                <span>Minimum of 8 characters</span>
              </div>
              <div className="checkbox" id="checkbox2">
                {checkedLowercase ? <IconCheckbox /> : <IconCheckboxblankline />}
                <span>Include at least one lowercase letter (a-z)</span>
              </div>
              <div className="checkbox" id="checkbox3">
                {checkedUppercase ? <IconCheckbox /> : <IconCheckboxblankline />}
                <span>Include at least one Uppercase letter (A-Z)</span>
              </div>
              <div className="checkbox" id="checkbox4">
                {checkedNumber ? <IconCheckbox /> : <IconCheckboxblankline />}
                <span>Include at least one number (0-9)</span>
              </div>
              <div className="checkbox" id="checkbox5">
                {checkedSpecialCharacter ? <IconCheckbox /> : <IconCheckboxblankline />}
                <span>Include at least one special character</span>
              </div>
              <Tooltip
                target="#checkbox1"
                showEvent="mouseenter"
                hideEvent="mouseleave"
                hideOnOutsideClick={false}
              >
                <span>Minimum of 8 characters</span>
              </Tooltip>
              <Tooltip
                target="#checkbox2"
                showEvent="mouseenter"
                hideEvent="mouseleave"
                hideOnOutsideClick={false}
              >
                <span>Include at least one lowercase letter (a-z)</span>
              </Tooltip>
              <Tooltip
                target="#checkbox3"
                showEvent="mouseenter"
                hideEvent="mouseleave"
                hideOnOutsideClick={false}
              >
                <span>Include at least one Uppercase letter (A-Z)</span>
              </Tooltip>
              <Tooltip
                target="#checkbox4"
                showEvent="mouseenter"
                hideEvent="mouseleave"
                hideOnOutsideClick={false}
              >
                <span>Include at least one number (0-9)</span>
              </Tooltip>
              <Tooltip
                target="#checkbox5"
                showEvent="mouseenter"
                hideEvent="mouseleave"
                hideOnOutsideClick={false}
              >
                <span>Include at least one special character</span>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="newPwdField">
          <div className="emailText">
            Confirm New Password <span className="required-field">*</span>
          </div>
          <TextBox
            stylingMode="outlined"
            placeholder="Enter password"
            className="custom-textbox"
            mode={passwordMode1}
            onFocusIn={() => setIsNewPasswordFocused(true)}
            valueChangeEvent="keyup"
            onValueChanged={handleNewPasswordChange}
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
                icon: showPwd1 ? "eyeopen" : "eyeclose",
                stylingMode: "text",
                onClick: () => {
                  setShowPwd1(!showPwd1);
                  setPasswordMode1((prevPasswordMode) =>
                    prevPasswordMode === "text" ? "password" : "text"
                  );
                },
              }}
            />
          </TextBox>
        </div>

        <Button
          onClick={handlePwdContinue}
          type="default"
          width={"100%"}
          height={48}
          stylingMode="contained"
          className="custom-button"
        >
          Continue
        </Button>

        <p className="termsText">
          I agree with your{" "}
          <a href="#" className="termslink">
            Terms of Service
          </a>
        </p>
      </div>
    </>
  );
}

export default ResetPassword;
