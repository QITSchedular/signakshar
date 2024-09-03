import React, { useState } from "react";
import "./AccountSetting.scss";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import accountIcon from "../svg/account-circle-line.svg";
import accountIconActive from "../svg/account-circle-line-pink.svg";
import settingsIcon from "../svg/settings-2-line.svg";
import settingsIconActive from "../svg/settings-2-line-pink.svg";
// import { values } from "pdf-lib";
import ProfileView from "../profileView/ProfileView";

export default function AccountSetting({
  selectedImageSignature,
  setSelectedImageSignature,
  errorMessage,
  setErrorMessage,
  setImageDetails,
  imageDetails,
  handleImageUpload,
  handleRemoveImage,
  initialCanvas,
  setInitialCanvas,
  initImageURL,
  handleIntialsDone,
  showModal,
  setShowModal,
  handleImageClick,
  handleCloseModal,
  signatureCanvasRef,
  setSignatureCanvas,
  signatureCanvas,
  demo,
  handleSignatureDone,
  handleChange,
  email,
  initial,
  fullName,
  myData,
  fetchData,
  setMyData,
  loading,
  setLoading,
  values,
  setValues,
  updateData,
  updatedData,
  setUpdatedData,
  handleMouseEnter,
  handleMouseLeave,
  handleFileSelect,
  hovered,
  setHovered,
  selectedImage,
  setSelectedImage,
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
  setBase64URL,
  setStoredImageURL,
  setSignatureTextDataProfile,
  signatureTextDataProfile,
  setSignatureTextTextUrlProfile,
  signatureTextUrlProfile,
  registeredUserDetails,initDrawData,setInitImageURL,setInitalsTextDataProfile,initalsTextDataProfile,setInitialsTextTextUrlProfile
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabSelection = (e) => {
    setSelectedTab(e.component.option("selectedIndex"));
  };

  return (
    <div className="settingsMain">
      <div className="accountSetting">
        <div className="accountSettingsText">Account Settings</div>
        <Button width={120} text="Save" onClick={updateData} />
      </div>
      <div className="profile-tabs-main">
        <div className="profile-tabs">
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
            <Item
              title="Profile"
              icon={selectedTab === 0 ? accountIconActive : accountIcon}
            >
              <div className="ProfileData">
                <ProfileView
                  demo={demo}
                  handleChange={handleChange}
                  initial={initial}
                  fullName={fullName}
                  email={email}
                  setMyData={setMyData}
                  myData={myData}
                  fetchData={fetchData}
                  loading={loading}
                  setLoading={setLoading}
                  values={values}
                  setValues={setValues}
                  updateData={updateData}
                  updatedData={updatedData}
                  setUpdatedData={setUpdatedData}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  handleFileSelect={handleFileSelect}
                  hovered={hovered}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  setHovered={setHovered}
                  setBase64URL={setBase64URL}
                  signatureCanvas={signatureCanvas}
                  setSignatureCanvas={setSignatureCanvas}
                  signatureCanvasRef={signatureCanvasRef}
                  handleSignatureDone={handleSignatureDone}
                  setStoredImageURL={setStoredImageURL}
                  handleCloseModal={handleImageClick}
                  handleImageClick={handleImageClick}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  initImageURL={initImageURL}
                  handleIntialsDone={handleIntialsDone}
                  initialCanvas={initialCanvas}
                  setInitialCanvas={setInitialCanvas}
                  selectedImageSignature={selectedImageSignature}
                  setSelectedImageSignature={setSelectedImageSignature}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setImageDetails={setImageDetails}
                  imageDetails={imageDetails}
                  handleImageUpload={handleImageUpload}
                  handleRemoveImage={handleRemoveImage}
                  selectedImageInitialProfile={selectedImageInitialProfile}
                  setSelectedImageInitialProfile={setSelectedImageInitialProfile}
                  imageDetailsOnInitialsProfile={imageDetailsOnInitialsProfile}
                  setImageDetailsOnInitialsProfile={setImageDetailsOnInitialsProfile}
                  handleImageUploadForIntialProfile={handleImageUploadForIntialProfile}
                  handleRemoveImageCS={handleRemoveImageCS}
                  handleImageUpload_temp={handleImageUpload_temp}
                  setImageDetailsCS={setImageDetailsCS}
                  imageDetailsCS={imageDetailsCS}
                  selectedImageCS={selectedImageCS}
                  setSelectedImageCS={setSelectedImageCS}
                  setSignatureTextDataProfile={setSignatureTextDataProfile}
                  signatureTextDataProfile={signatureTextDataProfile}
                  setSignatureTextTextUrlProfile={setSignatureTextTextUrlProfile}
                  signatureTextUrlProfile={signatureTextUrlProfile}
                  registeredUserDetails={registeredUserDetails}
                  initDrawData={initDrawData}
                  setInitImageURL={setInitImageURL}
                  initalsTextDataProfile={initalsTextDataProfile}
                  setInitalsTextDataProfile={setInitalsTextDataProfile}
                  setInitialsTextTextUrlProfile={setInitialsTextTextUrlProfile}
                />
              </div>
            </Item>
            <Item
              title="General Settings"
              icon={selectedTab === 1 ? settingsIconActive : settingsIcon}
            >
              <div className="ProfileData"></div>
            </Item>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
