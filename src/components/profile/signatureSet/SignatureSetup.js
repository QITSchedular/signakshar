import React, { useState } from "react";
import "./SignatureSetup.scss";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import InitialPanelProfile from "./initialPanelProfile/InitialPanelProfile.js";
import CompanyStampProfile from "./companyStampProfile/CompanyStampProfile.js";
import SignaturePanelProfile from "./signaturePanelProfile/SignaturePanelProfile.js";
// import "../../manageUser/signatureSetup/SignatureSetup.scss"

export default function SignatureSetup({
  selectedImageSignature,
  setSelectedImageSignature,
  errorMessage,
  setErrorMessage,
  handleImageUpload,
  handleRemoveImage,
  setImageDetails,
  imageDetails,
  selectedImageInitialProfile,
  setSelectedImageInitialProfile,
  imageDetailsOnInitialsProfile,
  setImageDetailsOnInitialsProfile,
  handleImageUploadForIntialProfile,
  handleRemoveImageCS,
  handleImageUpload_temp,
  setImageDetailsCS,
  imageDetailsCS,
  selectedImageCS,
  setSelectedImageCS,
  initialCanvas,
  setInitialCanvas,
  initImageURL,
  handleIntialsDone,
  signatureCanvasRef,
  handleSignatureDone,
  setStoredImageURL,
  signatureCanvas,
  setSignatureCanvas,
  setSignatureTextDataProfile,
  signatureTextDataProfile,
  setSignatureTextTextUrlProfile,
  signatureTextUrlProfile,
  registeredUserDetails,setInitialsTextTextUrlProfile,
  initDrawData,setInitImageURL,initalsTextDataProfile,setInitalsTextDataProfile
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabSelection = (e) => {
    setSelectedTab(e.component.option("selectedIndex"));
  };
  return (
    <div className="signature-setup-main">
      <div className="signatureSetup">
        <div className="signatureSetup-tabPanel">
          <TabPanel
            className="dx-theme-background-color"
            width="100%"
            height={418}
            animationEnabled={false}
            swipeEnabled={false}
            tabsPosition={"top"}
            iconPosition={"start"}
            selectedIndex={selectedTab}
            onOptionChanged={handleTabSelection}
          >
            <Item title="Signature">
              <div className="ProfileData">
                <SignaturePanelProfile
                  handleSignatureDone={handleSignatureDone}
                  signatureCanvas={signatureCanvas}
                  setSignatureCanvas={setSignatureCanvas}
                  signatureCanvasRef={signatureCanvasRef}
                  setStoredImageURL={setStoredImageURL}
                  selectedImageSignature={selectedImageSignature}
                  setSelectedImageSignature={setSelectedImageSignature}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setImageDetails={setImageDetails}
                  imageDetails={imageDetails}
                  handleImageUpload={handleImageUpload}
                  handleRemoveImage={handleRemoveImage}
                  setSignatureTextDataProfile={setSignatureTextDataProfile}
                  signatureTextDataProfile={signatureTextDataProfile}
                  setSignatureTextTextUrlProfile={setSignatureTextTextUrlProfile}
                  signatureTextUrlProfile={signatureTextUrlProfile}
                  registeredUserDetails={registeredUserDetails}
                />
              </div>
            </Item>
            <Item title="Initials">
              <div className="ProfileData">
                <InitialPanelProfile
                  handleIntialsDone={handleIntialsDone}
                  initialCanvas={initialCanvas}
                  setInitialCanvas={setInitialCanvas}
                  initImageURL={initImageURL}
                  setInitImageURL={setInitImageURL}
                  initDrawData={initDrawData}
                  selectedImageInitialProfile={selectedImageInitialProfile}
                  setSelectedImageInitialProfile={setSelectedImageInitialProfile}
                  imageDetailsOnInitialsProfile={imageDetailsOnInitialsProfile}
                  setImageDetailsOnInitialsProfile={setImageDetailsOnInitialsProfile}
                  handleImageUploadForIntialProfile={handleImageUploadForIntialProfile}
                  registeredUserDetails={registeredUserDetails}
                  initalsTextDataProfile={initalsTextDataProfile}
                  signatureTextDataProfile={signatureTextDataProfile}
                  setInitalsTextDataProfile={setInitalsTextDataProfile}
                  setInitialsTextTextUrlProfile={setInitialsTextTextUrlProfile}
                />
              </div>
            </Item>
            <Item title="Company Stamp">
              <div className="ProfileData">
                <CompanyStampProfile
                  handleRemoveImageCS={handleRemoveImageCS}
                  handleImageUpload_temp={handleImageUpload_temp}
                  setImageDetailsCS={setImageDetailsCS}
                  imageDetailsCS={imageDetailsCS}
                  selectedImageCS={selectedImageCS}
                  setSelectedImageCS={setSelectedImageCS}
                />
              </div>
            </Item>
          </TabPanel>
        </div>
      </div>

      {/* <div className="custom-tab-panel-container">
                <div className='lower-section'>
                    <TabPanel className="mytabpanel">
                        <Item title="Signature">
                            <div className="sub-tab-signature">
                                <SignSubPanel />
                            </div>
                        </Item>
                        <Item title="Initials">
                            <div className="sub-tab-signature">
                                <InitialPanel />
                            </div>
                        </Item>
                        <Item title="Company Stamp">
                            <div className="sub-tab-signature">
                                <CompanyStampPanel />
                            </div>
                        </Item>
                    </TabPanel>
                </div>
            </div> */}
    </div>
  );
}
