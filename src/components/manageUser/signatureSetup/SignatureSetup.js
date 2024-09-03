import React, { useState,useEffect } from "react";
import "./SignatureSetup.scss";
import { TextBox } from "devextreme-react/text-box";
import { Item } from "devextreme-react/tabs";
import TabPanel from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import SignSubPanel from "./SignSubPanel";
import InitialPanel from "./InitialPanel";
import { LoadPanel } from "devextreme-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CompanyStampPanel from "./CompanyStampPanel";
import { registerUser } from "../../../api/UnAuth";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import axios from "axios";
import { useAuth } from "../../../contexts/auth";
 
function SignatureSetup() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");
 
  const regEm = location.state?.regEmail;
  const regPw = location.state?.regPwd;
 
  useEffect(() => {
    if (!regEm && !regPw) {
      navigate("/RegistrationForm")
    }
  }, [regEm, regPw])
  // const source = location.hash.includes("RegistrationForm")
  //   ? "registrationform"
  //   : "registrationform";
 
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [signatureDrawingData, setSignatureDrawingData] = useState(null);
  const [signatureImageData, setSignatureImageData] = useState(null);
  const [signatureTextData, setSignatureTextData] = useState({
    sign_text_color: "black",
    sign_text_font: "",
    sign_text_value: "Signature",
  });
 
  const [initalsTextDataReg, setInitalsTextDataReg] = useState({
    initials_text_color: "black",
    initials_text_font: "",
    initials_text_value: "Initials",
  });
  const [initialsText, setInitialsText] = useState(null);
 
  const [selectedSignatureSubTabIndex, setSelectedSignatureSubTabIndex] =
    useState(0);
  const [selectedInitialsSubTabIndex, setSelectedInitialsSubTabIndex] =
    useState(0);
 
  const [initialsCanvas, setInitialsCanvas] = useState(null);
  const [initialDrawingData, setInitialDrawingData] = useState(null);
  const [initialImageData, setInitialImageData] = useState(null);
  const [signatureText, setSignatureText] = useState(null);
  const [companyStampImageData, setCompanyStampImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
  // const handleFullNameChange = (e) => {
  //   setFullName(e.value);
  // };
  const handleFullNameChange = (e) => {
    const name = e.value;
    setFullName(name);
    setInitials(getInitials(name));
  };
 
  const handleInitialsChange = (e) => {
    setInitials(e.value);
  };
 
  const handleBackClick = () => {
    navigate("/RegistrationForm");
  };
 
  const handleSkipBtn = async () => {
    try {
      if (fullName) {
        setLoading(true);
        const resp = await registerUser({
          email: regEm,
          password: regPw,
          full_name: fullName,
          initials: initials,
          companyStampImageData: companyStampImageData,
          signatureDrawingData: signatureDrawingData,
          signatureImageData: signatureImageData,
          signatureText: signatureText,
          signatureTextData: signatureTextData,
          initialDrawingData: initialDrawingData,
          initialImageData: initialImageData,
          initialsText: initialsText,
          initalsTextDataReg: initalsTextDataReg,
        });
        setLoading(false);
 
        if (resp) {
          // navigate("/SignInForm");
          if (regEm && regPw) {
            setLoading(true);
            const result = await signIn(regEm, regPw);
            setLoading(false);
          }
          // toastDisplayer("success", "Registration Successfully");
        }
      } else {
        toastDisplayer("error", "Enter your Full Name");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toastDisplayer("error", error?.response?.data?.email[0]);
    }
  };
  // const handleUserRegistration = async () => {
  //     try {
  //       if (fullName) {
  //         console.log({
  //           email: regEm,
  //           password: regPw,
  //           full_name: fullName,
  //           initials: initials,
  //           companyStampImageData: companyStampImageData,
  //           signatureDrawingData: signatureDrawingData,
  //           signatureImageData: signatureImageData,
  //           signatureText: signatureText,
  //           signatureTextData: signatureTextData,
  //           initialDrawingData: initialDrawingData,
  //           initialImageData: initialImageData,
  //           initialsText: initialsText,
  //           initalsTextDataReg: initalsTextDataReg,
  //         })
  //         // Step 1: Register the User
  //         const result = await registerUser({
  //           email: regEm,
  //           password: regPw,
  //           full_name: fullName,
  //           initials: initials,
  //           companyStampImageData: companyStampImageData,
  //           signatureDrawingData: signatureDrawingData,
  //           signatureImageData: signatureImageData,
  //           signatureText: signatureText,
  //           signatureTextData: signatureTextData,
  //           initialDrawingData: initialDrawingData,
  //           initialImageData: initialImageData,
  //           initialsText: initialsText,
  //           initalsTextDataReg: initalsTextDataReg,
  //         });
 
  //         if (result?.jwt) {
  //           // Step 2: Call the Login API
  //           if (regEm && regPw) {
  //             const result = await signIn(regEm, regPw);
  //           }
 
  //           // if (loginResponse.data?.jwt) {
  //           //   // Store the token in localStorage
  //           //   localStorage.setItem("jwt", loginResponse.data.jwt);
 
  //           //   // Step 3: Navigate to the user dashboard
  //           //   navigate("/userdashboard");
  //           //   toastDisplayer("success", "Registration and login successful");
  //           // } else {
  //           //   toastDisplayer("error", "Login failed");
  //           // }
  //         } else {
  //           toastDisplayer("error", "Registration failed");
  //         }
  //       } else {
  //         toastDisplayer("error", "Enter your Full Name");
  //       }
  //     } catch (error) {
  //       console.error("Error during registration:", error);
  //       toastDisplayer("error", "Error during registration");
  //     }
  //   };
 
  const handleUserRegistration = async () => {
    setIsLoading(true);
    try {
      if (fullName) {
        setLoading(true);
        const resp = await registerUser({
          email: regEm,
          password: regPw,
          full_name: fullName,
          initials: initials,
          companyStampImageData: companyStampImageData,
          signatureDrawingData: signatureDrawingData,
          signatureImageData: signatureImageData,
          signatureText: signatureText,
          signatureTextData: signatureTextData,
          initialDrawingData: initialDrawingData,
          initialImageData: initialImageData,
          initialsText: initialsText,
          initalsTextDataReg: initalsTextDataReg,
        });
        setLoading(false);
 
        if (resp) {
          // navigate("/SignInForm");
          if (regEm && regPw) {
            setLoading(true);
            const result = await signIn(regEm, regPw);
            setLoading(false);
          }
          // toastDisplayer("success", "Registration Successfully");
        }
      } else {
        toastDisplayer("error", "Enter your Full Name");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toastDisplayer("error", error?.response?.data?.email[0]);
    }
    finally {
      setIsLoading(false);
    }
  };
 
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return nameParts[0][0] + nameParts[1][0];
    }
    return name.charAt(0).toUpperCase(); // Fallback for single names
  };
 
  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div className="container-main">
        <div className="box box-1"></div>
        <div className="box box-2">
          <div className="card">
            <div className="card-content">
              <div className="upper-section">
                <img
                  src="/logo-grey.svg"
                  style={{ marginLeft: "-.5rem" }}
                  height={50}
                />
              </div>
 
              <div className="lower-section">
                <div className="step">Step 3 of 3</div>
                <div className="main-title">Set up your signature details</div>
                <div className="sub-title">
                  Signature details for seamless document signing
                </div>
                <div className="user-detail">
                  <div className="userbox1">
                    <div className="user-text">
                      Full name <span className="required-field">*</span>
                    </div>
                    <TextBox
                      placeholder=" e.g. John Doe"
                      stylingMode="outlined"
                      className="input-user-data"
                      value={fullName}
                      onValueChanged={handleFullNameChange}
                    />
                  </div>
                  <div className="userbox2">
                    <div className="user-text">Initials</div>
                    {/* <TextBox
                    placeholder="Enter initials"
                    stylingMode="outlined"
                    className="input-user-data"
                    value={initials}
                    onValueChanged={handleInitialsChange}
                  /> */}
                    <TextBox
                      placeholder={`e.g. JD`}
                      stylingMode="outlined"
                      className="input-user-data"
                      value={initials}
                      onValueChanged={handleInitialsChange}
                    />
                  </div>
                </div>
 
                <div className="custom-tab-panel-container">
                  <TabPanel className="mytabpanel">
                    <Item title="Signature">
                      <div className="sub-tab-signature">
                        <SignSubPanel
                          setSignatureDrawingData={setSignatureDrawingData}
                          signatureDrawingData={signatureDrawingData}
                          setSignatureImageData={setSignatureImageData}
                          signatureImageData={signatureImageData}
                          source={"registrationform"}
                          setSignatureCanvas={setSignatureCanvas}
                          signatureCanvas={signatureCanvas}
                          setSignatureTextData={setSignatureTextData}
                          signatureTextData={signatureTextData}
                          setSignatureText={setSignatureText}
                          signatureText={signatureText}
                          setSelectedSignatureSubTabIndex={
                            setSelectedSignatureSubTabIndex
                          }
                          selectedSignatureSubTabIndex={
                            selectedSignatureSubTabIndex
                          }
                          fullName={fullName}
                        />
                      </div>
                    </Item>
                    <Item title="Initials">
                      <div className="sub-tab-signature">
                        <InitialPanel
                          setInitialDrawingData={setInitialDrawingData}
                          initialDrawingData={initialDrawingData}
                          setInitialImageData={setInitialImageData}
                          initialImageData={initialImageData}
                          source={"registrationform"}
                          setInitialsCanvas={setInitialsCanvas}
                          initialsCanvas={initialsCanvas}
                          setSelectedInitialsSubTabIndex={
                            setSelectedInitialsSubTabIndex
                          }
                          selectedInitialsSubTabIndex={
                            selectedInitialsSubTabIndex
                          }
                          setInitalsTextDataReg={setInitalsTextDataReg}
                          initalsTextDataReg={initalsTextDataReg}
                          setInitialsText={setInitialsText}
                          initialsText={initialsText}
                          initials={initials}
                        />
                      </div>
                    </Item>
                    <Item title="Company Stamp">
                      <div className="sub-tab-signature">
                        <CompanyStampPanel
                          setCompanyStampImageData={setCompanyStampImageData}
                          companyStampImageData={companyStampImageData}
                          source={"registrationform"}
                        />
                      </div>
                    </Item>
                  </TabPanel>
                  <div class="bottom-panel">
                    <div className="skip-step">
                      <span className="skip-step-text">
                        <a onClick={handleSkipBtn}>Skip this step</a>
                      </span>
                    </div>
                    <div className="button-container">
                      <Button
                        className="my-btn-cancel"
                        text="Back"
                        onClick={handleBackClick}
                      />
                      <Button
                        className="my-btn-continue"
                        text={isLoading ? "" : "Continue"}
                        onClick={handleUserRegistration}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <div className="loader-container">
                            {/* Using react-spinners */}
                            {/* <ClipLoader color="#fff" size={24} /> */}
                            <div className="simple-loader"></div>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default SignatureSetup;