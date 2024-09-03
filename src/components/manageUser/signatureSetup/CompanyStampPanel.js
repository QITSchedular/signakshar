import React, { useState, useEffect, useRef } from "react";
import { Button } from "devextreme-react/button";
import "./PdfUtils.js";
import { getCroppingRect, getNonEmptyPixels } from "./PdfUtils.js";
import { ReactComponent as IconImageFile } from "../../../icons/image-file-icon.svg";
import { ReactComponent as IconDelete } from "../../../icons/delete-icon.svg";
import { Sledding } from "@mui/icons-material";
import Tooltip from "devextreme-react/tooltip";

function CompanyStampPanel({
  setCompanyStampImageData,
  companyStampImageData,
  source,
  loggedInUserDetail,
  setApplyCompanyStampData,
  applyCompanyStampData,
}) {
  const [selectedImageCS, setSelectedImageCS] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [storedImageURL, setStoredImageURL] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (source === "signingPopup" && loggedInUserDetail?.user?.stamp_img_name) {
      const base64Data = loggedInUserDetail.user.stamp_img_name;
      try {
        const binaryString = atob(base64Data.split(",")[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const imageBlob = new Blob([bytes], { type: "image/png" });
        const imageUrl = URL.createObjectURL(imageBlob);
        const formattedSize =
          (bytes.byteLength / (1024 * 1024)).toFixed(2) + " MB";

        setSelectedImageCS(imageBlob);
        setImageDetails({ name: "CompanyStamp.png", size: formattedSize });
        setStoredImageURL(imageUrl);
      } catch (error) {}
    }
  }, [source, loggedInUserDetail]);

  const handleImageUpload_temp = (event) => {
    const file = event.target.files[0];

    if (!file) {
      // setErrorMessage("Please select a file.");
      return;
    }

    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setErrorMessage("Please upload an image file.");
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Image size must be less than 1MB.");
      return;
    }
    if (source === "registrationform") {
      setSelectedImageCS(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setCompanyStampImageData(base64Data);
      };
      reader.readAsDataURL(file);

      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setErrorMessage(null);
    } else if (source === "signingPopup") {
      setSelectedImageCS(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setApplyCompanyStampData(base64Data);
      };
      reader.readAsDataURL(file);

      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setErrorMessage(null);
    }
    event.target.value = null;
  };

  const handleRemoveImage = () => {
    setSelectedImageCS(null);
    setImageDetails(null);

    if (source != "registrationform") {
      setApplyCompanyStampData(null);
    }
  };

  useEffect(() => {
    if (loggedInUserDetail?.user.stamp_img_name) {
      setApplyCompanyStampData(loggedInUserDetail.user.stamp_img_name);
    }
  }, [loggedInUserDetail?.user.stamp_img_name]);

  return (
    <>
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
                : "You can upload an image up to 1MB"}
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
                : "You can upload an image up to 1MB"}
            </div>

            {selectedImageCS && (
              <div className="image-details">
                <Tooltip
                  target="#image-details-cs"
                  showEvent="mouseenter"
                  hideEvent="mouseleave"
                  hideOnOutsideClick={false}
                >
                  <span>{imageDetails.name}</span>
                </Tooltip>
                <a
                id="image-details-cs"
                  href={selectedImageCS && URL.createObjectURL(selectedImageCS)}
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
                      <span className="name">{imageDetails.name}</span>
                      <p className="size">{imageDetails.size}</p>
                    </div>
                  </div>
                </a>
                <span className="remove-icon" onClick={handleRemoveImage}>
                  <IconDelete />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default CompanyStampPanel;
