///// code after submission -25june
import React, { useState, useRef } from "react";
import "../manageUser/forgotPwd/ForgotPwd";
import ForgotPwd from "../manageUser/forgotPwd/ForgotPwd";
import { toastDisplayer } from "../toastDisplay/toastDisplayer";
import OtpVerification from "./otpVerification/OtpVerification";
import { LoadPanel } from "devextreme-react";
import { sendOtp } from "../../api/UnAuth"; // Update the import path if necessary
import axios from "axios";

export default function MainUser() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // State to store the entered email
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const emailValidatorRef = useRef(null);

  const handleContinue = async () => {
    if (emailValidatorRef.current.instance.validate().isValid && email !== "") {
      setLoading(true);
      try {
        const checkEmailResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/checkEmail/`,
          { email }
        );
        if (checkEmailResponse.data.exists===false) {
          setLoading(false);
          return toastDisplayer("error", "This email is not registered");
        }
          const response = await sendOtp(email, "F");
          if (response.success === false && response.message === "User already verified but still you can request after 5 min..!!") {
            setLoading(false);
            return toastDisplayer("error", "User already verified but still you can request after 5 min..!!");
          }
          setLoading(false);
          setShowOtpVerification(true);

      } catch (error) {
        setLoading(false);
        toastDisplayer("error", "Error sending OTP");
      }
    } else {
      setLoading(false);
      return toastDisplayer("error", "Invalid Email Address");
    }
  };

  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div className="container-main-mainuser">
        <div className="box box-1"></div>
        <div className="box box-2">
          <div className="card">
            <div className="upper-section">
              <img src="/logo-grey.svg" style={{ marginLeft: "-.5rem" }} height={50} alt="Logo" />
            </div>
            {showOtpVerification ? (
              <OtpVerification
                showOtpVerification={showOtpVerification}
                setShowOtpVerification={setShowOtpVerification}
                email={email}
                setEmail={setEmail}
                handleContinue={handleContinue}
                emailValidatorRef={emailValidatorRef}
              />
            ) : (
              <ForgotPwd
                emailValidatorRef={emailValidatorRef}
                email={email}
                handleContinue={handleContinue}
                setEmail={setEmail}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
