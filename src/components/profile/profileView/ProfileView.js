import React, { useState, useEffect } from "react";
import userIconImg from "../svg/user-add-line.svg";
import "./ProfileView.scss";
import Accordion, { Item } from "devextreme-react/accordion";
import EditProfile from "./EditProfile/EditProfile";
import SignatureSetup from "../signatureSet/SignatureSetup";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";

export default function ProfileView({
  signatureCanvasRef,
  signatureCanvas,
  setSignatureCanvas,
  handleChange,
  initial,
  email,
  fullName,
  myData,
  base64URL,
  setBase64URL,
  loading,
  setLoading,
  values,
  setValues,
  updateData,
  selectedImage,
  setSelectedImage,
  updatedData,
  setUpdatedData,
  handleSignatureDone,
  setStoredImageURL,
  handleCloseModal,
  handleImageClick,
  setShowModal,
  handleIntialsDone,
  initImageURL,
  initialCanvas,
  setInitialCanvas,
  selectedImageSignature,
  setSelectedImageSignature,
  errorMessage, setErrorMessage,
  setImageDetails, imageDetails,
  handleImageUpload,
  handleRemoveImage,
  selectedImageInitialProfile, setSelectedImageInitialProfile,
  imageDetailsOnInitialsProfile, setImageDetailsOnInitialsProfile,
  handleImageUploadForIntialProfile,
  handleRemoveImageCS,
  handleImageUpload_temp,
  setImageDetailsCS,
  imageDetailsCS,
  selectedImageCS,
  setSelectedImageCS,
  setSignatureTextDataProfile,
  signatureTextDataProfile,
  setSignatureTextTextUrlProfile,
  signatureTextUrlProfile,
  registeredUserDetails, setInitialsTextTextUrlProfile,
  initDrawData, setInitImageURL, initalsTextDataProfile, setInitalsTextDataProfile
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const profileImgFromLocalStorage = localStorage.getItem("profileImage");
    if (profileImgFromLocalStorage) {
      setSelectedImage(profileImgFromLocalStorage);
    }
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    // Validate if file is an image
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setSelectedImage(base64Data);
        setBase64URL(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Please select a valid image file (JPEG/PNG/GIF).");
      toastDisplayer("error", "invalid image type");
    }
  };

  return (
    <div className="profileCardMain">
      <div className="profileaCard">
        <div
          className={`profile-card-img ${hovered ? "hovered" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
          {
            (selectedImage && selectedImage != "null") ?
              <img
                src={selectedImage}
                alt="Default"
                className="profileCardImg"
              />
              :
              <div className="profileCardImg customeImg">{fullName ? fullName[0].toUpperCase() : (email ? email[0].toUpperCase : '')}</div>
          }
          {hovered && (
            <div className="userIcon" onClick={(e) => e.stopPropagation()}>
              <label htmlFor="file-upload">
                <img
                  src={userIconImg}
                  alt="user-Icon"
                  className="userIconImg"
                />
              </label>
            </div>
          )}
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
        <div className="card-content">
          <h3 className="card-title">{fullName}</h3>
          <p className="card-description">{initial}</p>
          <p className="card-email">Email: {email}</p>
        </div>
      </div>
      <div className="edit-profile-main">
        <div className="accordionItems">
          <Accordion
            id="accordion-container"
            multiple="true"
            collapsible={true}
          >
            <Item
              title="Edit Profile"
              className="edit-profile-item"
            >
              <EditProfile
                myData={myData}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
                updateData={updateData}
                updatedData={updatedData}
                setUpdatedData={setUpdatedData}
              />
            </Item>
            <Item
              title="Signature Setup"
              className="signature-setup-item"
            >
              <SignatureSetup
                handleSignatureDone={handleSignatureDone}
                setSignatureCanvas={setSignatureCanvas}
                signatureCanvas={signatureCanvas}
                signatureCanvasRef={signatureCanvasRef}
                setStoredImageURL={setStoredImageURL}
                initImageURL={initImageURL}
                handleIntialsDone={handleIntialsDone}
                initialCanvas={initialCanvas}
                setInitialCanvas={setInitialCanvas}
                selectedImageSignature={selectedImageSignature}
                setSelectedImageSignature={setSelectedImageSignature}
                errorMessage={errorMessage} setErrorMessage={setErrorMessage}
                setImageDetails={setImageDetails} imageDetails={imageDetails}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
                selectedImageInitialProfile={selectedImageInitialProfile} setSelectedImageInitialProfile={setSelectedImageInitialProfile}
                imageDetailsOnInitialsProfile={imageDetailsOnInitialsProfile} setImageDetailsOnInitialsProfile={setImageDetailsOnInitialsProfile}
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
            </Item>
          </Accordion>
        </div>
      </div>

    </div>
  );
}
