import React, { useState } from "react";
import "./SignatureSetup.scss";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import InitialPanelProfile from "./initialPanelProfile/InitialPanelProfile.js";
import CompanyStampProfile from "./companyStampProfile/CompanyStampProfile.js";
import SignaturePanelProfile from "../../../../../profile/signatureSet/signaturePanelProfile/SignaturePanelProfile.js";
// import SignaturePanelProfile from "./signaturePanelProfile/SignaturePanelProfile.js";
// import "../../manageUser/signatureSetup/SignatureSetup.scss"

export default function SignatureSetup({
  signatureCanvasRef,
  handleSignatureDone,
  setStoredImageURL,
  signatureCanvas,
  setSignatureCanvas,
  setSignatureImgData,
  signatureImgData,
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
                  setSignatureImgData={setSignatureImgData}
                  signatureImgData={signatureImgData}
                />
              </div>
            </Item>
            <Item title="Initials">
              <div className="ProfileData">
                <InitialPanelProfile
                  handleSignatureDone={handleSignatureDone}
                  signatureCanvas={signatureCanvas}
                  setSignatureCanvas={setSignatureCanvas}
                  setStoredImageURL={setStoredImageURL}
                />
              </div>
            </Item>
            <Item title="Company Stamp">
              <div className="ProfileData">
                <CompanyStampProfile />
              </div>
            </Item>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
