import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import Validator from "devextreme-react/validator";
import { ReactComponent as IconCheckbox } from "../../../icons/checkbox-line.svg";
import { ReactComponent as IconCheckboxblankline } from "../../../icons/checkbox-blank-line.svg";
import GoogleIcon from "./google.jpeg";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useAuth } from "../../../contexts/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import { LoadPanel, Tooltip } from "devextreme-react";
import { CustomRule, EmailRule } from "devextreme-react/form";
import { sendOtp } from "../../../api/UnAuth"; // Import the sendOtp API function
import axios from "axios";
import './RegistrationForm.scss';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUppercase, setCheckedUppercase] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedSpecialCharacter, setCheckedSpecialCharacter] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const emailValidatorRef = useRef(null);
  const passwordValidatorRef = useRef(null);
  const { signInWithGoogle } = useAuth();
  const [showpwd, setshowpwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");

  // Track the current step
  const [currentStep, setCurrentStep] = useState(1);

  const handlePasswordChange = (e) => {
    setPassword(e.value); // Make sure this line is correctly updating the state
    if (e.value.length >= 8) {
      setChecked(true);
    } else {
      setChecked(false);
    }
    setCheckedLowercase(/[a-z]/.test(e.value));
    setCheckedUppercase(/[A-Z]/.test(e.value));
    setCheckedNumber(/[0-9]/.test(e.value));
    setCheckedSpecialCharacter(/[^\w\s]/.test(e.value));
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
    const isEmailValid = emailValidatorRef.current && emailValidatorRef.current.instance.validate().isValid;
    const isPasswordValid = passwordValidatorRef.current && passwordValidatorRef.current.instance.validate().isValid;

    if (!isEmailValid) {
      return toastDisplayer("error", "Enter correct Email");
    }
    if (!isPasswordValid) {
      return toastDisplayer("error", "Enter correct password");
    }

    if (isEmailValid && isPasswordValid) {
      try {
        setLoading(true);
        const checkEmailResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/checkEmail/`,
          { email }
        );
        if (checkEmailResponse.data.exists) {
          setLoading(false);
          return toastDisplayer("error", "This email is already registered");
        }
        const response = await sendOtp(email, null);
        if (response.Status === 200 && response.StatusMsg === "OTP sent successfully..!!") {
          setLoading(false);
          toastDisplayer("success", "OTP sent successfully..!!");
          // Move to the next step
          setCurrentStep(2);
          navigate("/RegOtp", {
            state: { regEmail: email, regPwd: password },
          });
        } else {
          setLoading(false);
          toastDisplayer("error", "Unable to send OTP");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error sending OTP:", error);
        toastDisplayer("error", "An error occurred while sending OTP");
      }
    }
  };


  
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => signInWithGoogle(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const onbackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
      // Navigate back to the previous step if needed
      // Add logic to handle step navigation
    } else {
      navigate("/SignInForm");
    }
  };

  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div className="container-main-signup">
        <div className="box box-1"></div>
        <div className="box box-2">
          <div className="card">
            <div className="upper-section">
              <img src="/logo-grey.svg" style={{ marginLeft: "-.5rem" }} height={50} alt="logo" />
            </div>
            {/* Display the "Go Back" button only for steps 2 and 3 */}
            {(currentStep === 2 || currentStep === 3) && (
              <Button
                icon="back"
                className="backBtn"
                text="Go Back"
                onClick={onbackClick}
                width={"auto"}
              />
            )}
            <div className="lower-section">
              <div className="step">Step {currentStep} of 3</div>
              <div className="create-acc">
                Create an account
              </div>
              <div className="already">
                Already have an account?{" "}
                <Link to="/SignInForm" className="login">
                  Log in
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
              >
                <Validator ref={emailValidatorRef}>
                  <EmailRule message="Please enter a valid email address." />
                </Validator>
              </TextBox>
              <div className="email-add">
                Password <span className="required">*</span>
              </div>
              <TextBox
                stylingMode="outlined"
                placeholder="Enter password"
                className="custom-textbox"
                mode={passwordMode}
                onFocusIn={() => {
                  setIsPasswordFocused(true);
                }}
                // onFocusOut={() => {
                //   setIsPasswordFocused(false);
                // }}
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
                    icon: `${showpwd ? "eyeopen" : "eyeclose"}`,
                    stylingMode: "text",
                    onClick: () => {
                      setshowpwd(!showpwd);
                      setPasswordMode(prevPasswordMode =>
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
                    marginTop: "4px",
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
              <div className="forgot-pass"></div>
              <Button
                className="submit-button"
                text="Continue"
                type="default"
                textTransform="none"
                onClick={handleContinue}
                disabled={loading}
              />
              <div className="or">or</div>
              <Button
                className="google-button"
                type="default"
                textTransform="none"
                onClick={login} // Call handleGoogleLogin when the button is clicked
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
