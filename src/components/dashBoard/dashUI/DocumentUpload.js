import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../dashUI/dashUI.scss";
import { ReactComponent as IconImageFile } from "../../../icons/fileIcon.svg";
import { ReactComponent as IconDelete } from "../../../icons/deleteIcon.svg";
import { Tooltip } from "devextreme-react";

function DocumentUpload({
  selectedImage,
  fetchNumberOfPages,
  numberOfPages,
  errorMessage,
  imageDetails,
  handleImageUpload,
  handleRemoveImage,
  fileName,
}) {
  useEffect(() => {
    fetchNumberOfPages();
  }, [selectedImage]);
  return (
    <div className="upload">
      {/* <div className="upload-text">Upload the document *</div> */}
      <div className="upload-text">
        Upload the document <span className="asterisk"> *</span>
      </div>

      <div className="upload-demo">
        {selectedImage && errorMessage ? (
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
                onChange={handleImageUpload}
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
              {errorMessage ? errorMessage : "You can upload a PDF up to 25MB"}
            </div>
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
                accept="application/*"
                onChange={handleImageUpload}
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
              {errorMessage ? errorMessage : "You can upload a PDF up to 25MB"}
            </div>

            {selectedImage && (
              <>
                <div className="image-details" id="image-details">
                  <a
                    href={selectedImage && URL.createObjectURL(selectedImage)}
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

                        <span className="name" data-tooltip={imageDetails.name}>

                          {imageDetails.name}
                        </span>
                        {numberOfPages !== null && (
                          <p className="size">
                            {imageDetails.size} - {numberOfPages} pages
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="remove-icon" onClick={handleRemoveImage}>
                      <IconDelete />
                    </span>
                  </a>

                </div>
                <Tooltip
                  target="#image-details"
                  showEvent="mouseenter"
                  hideEvent="mouseleave"
                  hideOnOutsideClick={false}
                >

                  <span>{imageDetails.name}</span>

                </Tooltip>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

DocumentUpload.propTypes = {
  selectedImage: PropTypes.object,
  errorMessage: PropTypes.string,
  imageDetails: PropTypes.object,
  handleImageUpload: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

export default DocumentUpload;
