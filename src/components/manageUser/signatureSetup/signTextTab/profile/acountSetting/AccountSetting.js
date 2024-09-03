import React, { useState } from "react";
import "./AccountSetting.scss";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import accountIcon from "../svg/account-circle-line.svg";
import accountIconActive from "../svg/account-circle-line-pink.svg";
import settingsIcon from "../svg/settings-2-line.svg";
import settingsIconActive from "../svg/settings-2-line-pink.svg";

import ProfileView from "../profileView/ProfileView";
import { values } from "pdf-lib";
// import { render } from '@testing-library/react';

export default function AccountSetting({
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
  setBase64URL,
  setStoredImageURL,
  setSignatureImgData,
  signatureImgData,
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  // const dataSource = [
  //     {
  //         icon: selectedTab === 0 ? accountIconActive : accountIcon,
  //         title: "Profile"
  //     },
  //     {
  //         icon: selectedTab === 1 ? bellIconActive : bellIcon,
  //         title: "Notification Settings"
  //     },
  //     {
  //         icon: selectedTab === 2 ? settingsIconActive : settingsIcon,
  //         title: "General Settings"
  //     }
  // ];

  const handleTabSelection = (e) => {
    setSelectedTab(e.component.option("selectedIndex"));
  };

  const inputData = (event) => {
    console.log("data:", values.textbox3);
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
                  setSignatureImgData={setSignatureImgData}
                  signatureImgData={signatureImgData}
                />
              </div>
            </Item>
            {/* <Item title='Notification Settings'   icon={ selectedTab === 1 ? bellIconActive : bellIcon}>
                            <div className='ProfileData'>
                                <h4>Notification Settings</h4>
                            </div>
                        </Item> */}
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
