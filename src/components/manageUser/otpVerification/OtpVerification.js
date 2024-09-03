/// code before submission
// import React, { useState, useRef, useEffect } from "react";
// import "./OtpVerification.scss";
// import { ReactComponent as TickIcon } from "../../../SVG/checkbox-circle-fill.svg";
// import ResetPassword from "../resetPwd/ResetPassword";
// import axios from "axios";
// import { toastDisplayer } from "../../toastDisplay/toastDisplayer";

// export default function OtpVerification({
//   email,
//   handleContinue,
//   // emailValidatorRef,
//   // showOtpVerification,
//   setShowOtpVerification,
// }) {
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const inputRefs = useRef([]);
//   const length = 6;
//   const [timer, setTimer] = useState(60);
//   const minutes = Math.floor(timer / 60);
//   const seconds = timer % 60;
//   const [verified, setVerified] = useState(false);

//   useEffect(() => {
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   const handleChange = (index, e) => {
//     const value = e.target.value;
//     if (isNaN(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value.substring(value.length - 1);
//     setOtp(newOtp);

//     const combinedOtp = newOtp.join("");
//     if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

//     if (value && index < length - 1 && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const onOtpSubmit = async (combinedOtp) => {
//     try {
//       const verifyResponse = await axios.post(
//         `http://localhost:8000/api/verifyOtp/`,
//         {
//           email: email,
//           otp: combinedOtp,
//         }
//       );
//       if(verifyResponse.data.Status === 200 && verifyResponse.data.StatusMsg ==="OTP has expired..!!"){
//         return toastDisplayer("error","OTP has expired..!!");
//       }

//       if(verifyResponse.data.Status===400 && verifyResponse.data.StatusMsg==="Invalid Email or OTP ..!!"){
//         return toastDisplayer("error","Invalid Email or OTP ..!!" );
//       }

//       if (
//         verifyResponse.data.Status === 200 &&
//         verifyResponse.data.StatusMsg === "OTP veryfied..!!"
//       ) {
//         setVerified(true);
//       }
//     } catch (error) {
//       if (error.response.data.Status === 400) {
//         return toastDisplayer("error", "OTP verification failed");
//       }
//     }
//   };

//   const handleRetryClick =async () => {
//     setTimer(60);
//     const response = await axios.post(`http://localhost:8000/api/sendOtp/`,
//       {       email : email})

//       if(response.data.success===false && response.data.message==="User already verified but still you can request after 5 min..!!"){
//         return toastDisplayer("error","User already verified but still you can request after 5 min..!!")
//       }

//       if(response.data.Status===400 && response.data.StatusMsg==="This email already register..!!"){
//         return toastDisplayer("error","This email already register..!!")
//       }
    
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (timer > 0) {
//         setTimer((prevTimer) => prevTimer - 1);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   const handleNotYouClick = () => {
//     setVerified(false);
//     setShowOtpVerification(false);
//   };

//   if (verified) {
//     return <ResetPassword email={email} />;
//   }
//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   return (
//     <>
//     <div className="lower-section">
//       <div>
//         <p className="resetText">OTP Verification</p>
//         <p className="resetTxtInfo">
//           Sent to {email}{" "}
//           <button className="notyouTxt" onClick={handleNotYouClick}>
//             Not you?
//           </button>
//         </p>
//       </div>

//       <div className="main-container1">
//         <div className="otp-main">
//           {otp.map((value, index) => (
//             <input
//               key={index}
//               type="text"
//               ref={(input) => (inputRefs.current[index] = input)}
//               value={value}
//               onChange={(e) => handleChange(index, e)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               className="otpInput"
//             />
//           ))}
//         </div>
//       </div>

//       <div className="footer-main">
//       {verified ? (
//           <div className="verified-parent">
//             <span className="verified-symbol"><TickIcon/></span>
//             <span className="verified-text">Verified Successfully</span>
//           </div>
//         ) : (
//         <span className="Pre-text">
//           {timer > 0 ? (
//             <>
//               Didn't get an OTP ?{"  "}
//               <span className="boldText">
//                 Retry in {minutes.toString().padStart(2, "0")} :{" "}
//                 {seconds.toString().padStart(2, "0")}
//               </span>
//             </>
//           ) : (
//             "Didn’t get an OTP ? "
//           )}
//           {timer === 0 && (
//             <span className="notyouTxt" onClick={handleRetryClick}>
//               <span className="resendTxt">Click here to resend</span>
//             </span>
//           )}
//         </span>)}
//       </div>
//       </div>
//     </>
//   );
// }


/// refactored code after submission - 24june
import React, { useState, useRef, useEffect } from "react";
import "./OtpVerification.scss";
import { ReactComponent as TickIcon } from "../../../SVG/checkbox-circle-fill.svg";
import ResetPassword from "../resetPwd/ResetPassword";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { sendOtp, verifyOtp } from "../../../api/UnAuth"; // Import API functions

export default function OtpVerification({
  email,
  handleContinue,
  setShowOtpVerification,
}) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const length = 6;
  const [timer, setTimer] = useState(60);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const onOtpSubmit = async (combinedOtp) => {
    try {
      const verifyResponse = await verifyOtp(email, combinedOtp);

      if (verifyResponse.Status === 200 && verifyResponse.StatusMsg === "OTP has expired..!!") {
        return toastDisplayer("error", "OTP has expired..!!");
      }

      if (verifyResponse.Status === 400 && verifyResponse.StatusMsg === "Invalid Email or OTP ..!!") {
        return toastDisplayer("error", "Invalid Email or OTP ..!!");
      }

      if (verifyResponse.Status === 200 && verifyResponse.StatusMsg === "OTP veryfied..!!") {
        setVerified(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toastDisplayer("error", "OTP verification failed");
    }
  };

  const handleRetryClick = async () => {
    try {
      setTimer(60);
      const response = await sendOtp(email,null);
      if (response.success === false && response.message === "User already verified but still you can request after 5 min..!!") {
        return toastDisplayer("error", "User already verified but still you can request after 5 min..!!");
      }

      if (response.Status === 400 && response.StatusMsg === "This email already register..!!") {
        return toastDisplayer("error", "This email already register..!!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toastDisplayer("error", "Failed to resend OTP");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleNotYouClick = () => {
    setVerified(false);
    setShowOtpVerification(false);
  };

  if (verified) {
    return <ResetPassword email={email} />;
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="lower-section">
      <div>
        <p className="resetText">OTP Verification</p>
        <p className="resetTxtInfo">
          Sent to {email}{" "}
          <button className="notyouTxt" onClick={handleNotYouClick}>
            Not you?
          </button>
        </p>
      </div>

      <div className="main-container1">
        <div className="otp-main">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              ref={(input) => (inputRefs.current[index] = input)}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otpInput"
            />
          ))}
        </div>
      </div>

      <div className="footer-main">
        <span className="Pre-text">
          {timer > 0 ? (
            <>
              Didn't get an OTP ?{" "}
              <span className="boldText">
                Retry in {minutes.toString().padStart(2, "0")} :{" "}
                {seconds.toString().padStart(2, "0")}
              </span>
            </>
          ) : (
            "Didn’t get an OTP ? "
          )}
          {timer === 0 && (
            <span className="notyouTxt" onClick={handleRetryClick}>
              <span className="resendTxt">Click here to resend</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
