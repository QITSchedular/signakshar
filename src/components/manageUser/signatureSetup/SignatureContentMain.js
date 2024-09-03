import React, { useState, useEffect } from "react";
import "./SignatureContentMain.scss";
import Tabs, { Item } from "devextreme-react/tabs";
import TabPanel from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import SignSubPanel from "./SignSubPanel";
import InitialPanel from "./InitialPanel";
import CompanyStampPanel from "./CompanyStampPanel";

function SignatureContentMain({
  signSource,
  signString,
  setSignString,
  mainTabItemValue,
  onClose,
  setSignImage,
  signImage,
  setApplySignatureData,
  applySignatureData,
  setSignatureCanvas,
  signatureCanvas,
  handleSignatureDone,
  setApplyInitialsData,
  applyInitialsData,
  handleInitialsDone,
  setInitialsCanvas,
  initialsCanvas,
  loggedInUserDetail,
  setApplyCompanyStampData,
  applyCompanyStampData,
  handleCompanyStampDone,
  setSelectedSignatureSubTabIndex,
  selectedSignatureSubTabIndex,
  setApplySignatureTextData,
  applySignatureTextData,
  setApplySignatureDrawingData,
  applySignatureDrawingData,
  setApplySignatureImageData,
  applySignatureImageData,
  setSelectedInitialsSubTabIndex,
  selectedInitialsSubTabIndex,
  setApplyInitialsTextData,
  applyInitialsTextData,
  setApplyInitialsDrawingData,
  applyInitialsDrawingData,
  setApplyInitialsImageData,
  applyInitialsImageData,
}) {
  const renderTabContent = () => {
    switch (mainTabItemValue) {
      case 1:
        return (
          <Item title="Signature">
            <div className="sub-tab-signature">
              <SignSubPanel
                signString={signString}
                setSignString={setSignString}
                setSignImage={setSignImage}
                signImage={signImage}
                source={"signingPopup"}
                setApplySignatureData={setApplySignatureData}
                applySignatureData={applySignatureData}
                setSignatureCanvas={setSignatureCanvas}
                signatureCanvas={signatureCanvas}
                loggedInUserDetail={loggedInUserDetail}
                setSelectedSignatureSubTabIndex={setSelectedSignatureSubTabIndex}
                selectedSignatureSubTabIndex={selectedSignatureSubTabIndex}
                setApplySignatureTextData={setApplySignatureTextData}
                applySignatureTextData={applySignatureTextData}
                setApplySignatureDrawingData={setApplySignatureDrawingData}
                applySignatureDrawingData={applySignatureDrawingData}
                setApplySignatureImageData={setApplySignatureImageData}
                applySignatureImageData={applySignatureImageData}
              />
            </div>
          </Item>
        );
      case 2:
        return (
          <Item title="Initials">
            <div className="sub-tab-signature">
              <InitialPanel
                signString={signString}
                setSignString={setSignString}
                source={"signingPopup"}
                setApplyInitialsData={setApplyInitialsData}
                applyInitialsData={applyInitialsData}
                setInitialsCanvas={setInitialsCanvas}
                initialsCanvas={initialsCanvas}
                loggedInUserDetail={loggedInUserDetail}
                setSelectedInitialsSubTabIndex={setSelectedInitialsSubTabIndex}
                selectedInitialsSubTabIndex={selectedInitialsSubTabIndex}
                setApplyInitialsTextData={setApplyInitialsTextData}
                applyInitialsTextData={applyInitialsTextData}
                setApplyInitialsDrawingData={setApplyInitialsDrawingData}
                applyInitialsDrawingData={applyInitialsDrawingData}
                setApplyInitialsImageData={setApplyInitialsImageData}
                applyInitialsImageData={applyInitialsImageData}
              />
            </div>
          </Item>
        );
      case 3:
        return (
          <Item title="Company Stamp">
            <div className="sub-tab-signature">
              <CompanyStampPanel
                source={"signingPopup"}
                loggedInUserDetail={loggedInUserDetail}
                setApplyCompanyStampData={setApplyCompanyStampData}
                applyCompanyStampData={applyCompanyStampData}
              />
            </div>
          </Item>
        );
      default:
        return null;
    }
  };

  // useEffect(() => {
  //   // Fetch user data when the component mounts
  //   const fetchUserData = async () => {
  //     try {
  //       const jwtToken = localStorage.getItem("jwt");
  //       const response = await axios.get(process.env.REACT_APP_API_URL+"/api/user/", {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`, // Pass JWT token in the Authorization header
  //         },
  //       });
  //       // console.log("resp",response);
  //       setUserSetupData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();

  //   return () => {
  //     // Cleanup function
  //     console.log("userSetupData : ",userSetupData)
  //   };
  // }, [userSetupData]);


  const handleBtnApplySignClick = async () => {
    if (mainTabItemValue === 1) {
      handleSignatureDone();
    } else if (mainTabItemValue === 2) {
      handleInitialsDone();
    }else if (mainTabItemValue === 3) {
      handleCompanyStampDone();
    }
  };

  return (
    <>
      <div className="popup-custom-tab-panel-container">
        <TabPanel className="mytabpanel">{renderTabContent()}</TabPanel>

        {/* {signSource !== "signPopup" && ( */}
        <div className="bottom-panel-popup">
          <div className="skip-step">
            {signSource !== "signPopup" && (
              <span className="skip-step-text">
                <a onClick={handleBtnApplySignClick}>Skip this step</a>
              </span>
            )}
          </div>
          <div className="button-container">
            <Button className="my-btn-cancel" text="Cancel" onClick={onClose} />
            <Button
              className="my-btn-continue"
              text="Apply Sign"
              onClick={handleBtnApplySignClick}
            />
          </div>
        </div>
        {/* )} */}
      </div>
    </>
  );
}

export default SignatureContentMain;
