import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../dashUI/dashUI.scss";
import { ReactComponent as IconImageFile } from "../../../icons/fileIcon.svg";
import { ReactComponent as IconDelete } from "../../../icons/deleteIcon.svg";
import { getNumberOfPages } from "../../manageUser/signatureSetup/PdfUtils";

function MultipleDocumentUpload({
  selectedImage,
  fetchNumberOfPages,
  numberOfPages,
  errorMessage,
  imageDetails,
  handleImageUpload,
  handleRemoveImage,
}) {

  useEffect(() => {
      fetchNumberOfPages();
  }, [selectedImage]);

  return (
    <div className="upload">
      <div className="upload-text">
        Upload the document <span className="asterisk"> *</span>
      </div>
      <div className="upload-demo">
      
        {!selectedImage ? (
          <>
            <div
              className="image-upload-area"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div className="img-box">
                <span className="drag-img">Drag files here or</span>
                <span className="upload-img"> Upload</span>
              </div>
              <input
                id="fileInput"
                type="file"
                accept="application/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
            {/* <div
              className={
                errorMessage.length>0
                  ? "file-validation-error-msg"
                  : "file-validation-info"
              }
            >
              {errorMessage ? errorMessage : "You can upload a PDF up to 25MB"}
            </div> */}
          </>
        ) : (
          <>
            <div
              className="image-upload-area"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div className="img-box">
                <span className="drag-img">Drag files here or</span>
                <span className="upload-img"> Upload</span>
              </div>
              <input
                id="fileInput"
                type="file"
                multiple="true"
                accept="application/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
            {/* <div
              className={
                errorMessage.length>0
                  ? "file-validation-error-msg"
                  : "file-validation-info"
              }
            >
              {errorMessage ? errorMessage : "You can upload a PDF up to 25MB"}
            </div> */}
              {selectedImage && selectedImage.length > 0 && selectedImage.map((image, index) => (
              
              <div key={index} className="image-details">
                  <a
                  href={URL.createObjectURL(image)}
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
                      <span className="name" data-tooltip={imageDetails[index]?.name}>
                           {imageDetails[index]?.name} 
                      </span>
                      {numberOfPages && (
                          <p className="size">
                          {imageDetails[index]?.size} - {numberOfPages[index]} pages
                          </p>
                      )}
                      </div>
                  </div>
                  </a>
                  <span className="remove-icon" onClick={() => handleRemoveImage(index)}>
                  <IconDelete />
                  </span>
              </div>))
            }

          </>
        )}
      </div>
    </div>
  );
}

MultipleDocumentUpload.propTypes = {
  selectedImage: PropTypes.array,
  errorMessage: PropTypes.array,
  imageDetails: PropTypes.array,
  handleImageUpload: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

export default MultipleDocumentUpload;
