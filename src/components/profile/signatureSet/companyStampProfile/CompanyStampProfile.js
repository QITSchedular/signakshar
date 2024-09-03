import React, { useState, useEffect, useRef } from "react";
import { Button } from "devextreme-react/button";
// import TabPanel from "devextreme-react/tab-panel";
// import { Item } from "devextreme-react/tabs";
import "../../../manageUser/signatureSetup/PdfUtils.js";
import { ReactComponent as IconImageFile } from "../../../../icons/image-file-icon.svg";
import { ReactComponent as IconDelete } from "../../../../icons/delete-icon.svg";
import "./CompanyStampProfile.scss";
import { Tooltip } from "devextreme-react";

function CompanyStampProfile({
  handleRemoveImageCS,
  handleImageUpload_temp,
  setImageDetailsCS,
  imageDetailsCS,
  selectedImageCS,
  setSelectedImageCS,
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  console.log("from cs Comp:", selectedImageCS);

  return (
    <div className="companyStamp-profileMain">
      <div className="demo">
        {selectedImageCS && errorMessage ? (
          <>
            <div
              className="image-upload-area"
              onClick={() => document.getElementById("fileInputCS").click()}
            >
              <div className="img-box">
                <span className="drag-img">Drag an image here or</span>
                <span className="upload-img"> Upload</span>
              </div>
              <input
                id="fileInputCS"
                type="file"
                accept="image/*"
                onChange={handleImageUpload_temp}
                style={{ display: "none" }}
              />
            </div>
            <div
              className={
                errorMessage
                  ? "file-validation-error-msg"
                  : "file-validation-info"
              }
            >
              {errorMessage
                ? errorMessage
                : "You can upload an image up to 25MB"}
            </div>
          </>
        ) : (
          <>
            <div
              className="image-upload-area"
              onClick={() => document.getElementById("fileInputCS").click()}
            >
              <div className="img-box">
                <span className="drag-img">Drag an image here or</span>
                <span className="upload-img"> Upload</span>
              </div>
              <input
                id="fileInputCS"
                type="file"
                accept="image/*"
                onChange={handleImageUpload_temp}
                style={{ display: "none" }}
              />
            </div>
            <div
              className={
                errorMessage
                  ? "file-validation-error-msg"
                  : "file-validation-info"
              }
            >
              {errorMessage
                ? errorMessage
                : "You can upload an image up to 25MB"}
            </div>

            {selectedImageCS && (
              <div className="image-details">
                <Tooltip
                  target="#image-details-csp"
                  showEvent="mouseenter"
                  hideEvent="mouseleave"
                  hideOnOutsideClick={false}
                >
                  <span>{imageDetailsCS.name}</span>
                </Tooltip>
                <a
                  // href={selectedImageCS && URL.createObjectURL(selectedImageCS)}
                  id="image-details-csp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="details-section img-link"
                >
                  <div className="file-icon">
                    <span className="image-icon">
                      <IconImageFile />
                    </span>
                  </div>
                  <div className="file-info">
                    <div className="image-info">
                      <span className="name">{imageDetailsCS.name}</span>
                      <p className="size">{imageDetailsCS.size}</p>
                    </div>
                  </div>
                </a>
                <span className="remove-icon" onClick={handleRemoveImageCS}>
                  <IconDelete />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CompanyStampProfile;
