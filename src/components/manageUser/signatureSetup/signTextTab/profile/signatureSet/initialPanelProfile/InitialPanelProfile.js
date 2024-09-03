import React, { useState, useEffect, useRef } from "react";
import { Button } from "devextreme-react/button";
import TabPanel from "devextreme-react/tab-panel";
import { Item } from "devextreme-react/tabs";
import SignatureCanvas from "react-signature-canvas";
import { ReactComponent as IconImageFile } from "../../../../icons/image-file-icon.svg";
import { ReactComponent as IconDelete } from "../../../../icons/delete-icon.svg";
import drawingPenRed from "../../../../icons/drawing-pen-red.svg";
import drawingPenBlack from "../../../../icons/drawing-pen-black.svg";
import drawingPenGreen from "../../../../icons/drawing-pen-green.svg";
import btnDeleteSign from "../../../../icons/delete-bin-icon.svg";
import "../../../manageUser/signatureSetup/PdfUtils.js";
import { getCroppingRect, getNonEmptyPixels } from "../../../manageUser/signatureSetup/PdfUtils.js";
import "./InitialPanelProfile.scss";
import InitialTextTab from "./intialTextTab/InitialTextTab.js";

function InitialPanelProfile({handleSignatureDone,setStoredImageURL,signatureCanvas,setSignatureCanvas}) {
  const [selectedImageInitial, setSelectedImageInitial] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  
  const modalRef = useRef(null);
  const [selectedPenColor, setSelectedPenColor] = useState("black");
  const [penColors, setPenColors] = useState([
    {
      color: "#910000",
      selected: false,
      icon: drawingPenRed,
      text: "Red",
      width: 94,
    },
    {
      color: "#142129",
      selected: true,
      icon: drawingPenBlack,
      text: "Black",
      width: 105,
    },
    {
      color: "#0C6230",
      selected: false,
      icon: drawingPenGreen,
      text: "Green",
      width: 110,
    },
  ]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log("file2:",file)

    if (!file) {
      // setErrorMessage("Please select a file.");
      return;
    }

    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setErrorMessage("Please upload an image file.");
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 25MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Image size must be less than 25MB.");
      return;
    }

    setSelectedImageInitial(file);

    const { name, size } = file;
    const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
    setImageDetails({ name, size: formattedSize });
    setErrorMessage(null);
  };

 

  const handleRemoveImage = () => {
    setSelectedImageInitial(null);
    setImageDetails(null);
  };

  const handleClearCanvas = () => {
    if (signatureCanvas) {
      signatureCanvas.clear();
    }
  };

  const handleDeleteCanvas = () => {
    handleClearCanvas();
    setSelectedImageInitial(null);
    setImageDetails(null);
    setCroppedImage(null);
  };

  const handlePenColorChange = (color) => {
    // Remove selected state from all buttons
    const updatedPenColors = penColors.map((penColor) => ({
      ...penColor,
      selected: false,
    }));

    // Find the selected button and update its state
    const updatedPenColorsWithSelected = updatedPenColors.map((penColor) =>
      penColor.color === color ? { ...penColor, selected: true } : penColor
    );

    // Update state with the new selected button and its border color
    setPenColors(updatedPenColorsWithSelected);
    setSelectedPenColor(color);
  };

  useEffect(() => {
    const buttons = document.querySelectorAll(".btn-pen-color");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        buttons.forEach((btn) => {
          btn.classList.remove("selected");
        });
        this.classList.add("selected");
      });
    });
  }, [modalRef]);

  useEffect(() => {
    const signatureImageInitial = localStorage.getItem("signatureImageInitial");
    setStoredImageURL(signatureImageInitial);
  });

  return (
    <div className="initialPanel-profile">
      <TabPanel>
        <Item title="Text">
        <div className="initTextTabmain ">
            <InitialTextTab/>
          </div>
        </Item>

        <Item title="Draw">
          <div className="demo-draw-tab">
            <div className="pen-color-selection">
              {penColors.map((penColor, index) => (
                <Button
                  key={index}
                  className={`btn-pen-color ${
                    penColor.selected ? "selected" : ""
                  } pen-${penColor.text.toLowerCase()}`}
                  icon={penColor.icon}
                  text={penColor.text}
                  onClick={() => handlePenColorChange(penColor.color)}
                />
              ))}
            </div>
            <div className="drawing-pad-area">
              <Button
                className="icon-button"
                icon={btnDeleteSign}
                onClick={handleDeleteCanvas}
              />
              <SignatureCanvas
                ref={(ref) => setSignatureCanvas(ref)}
                penColor={selectedPenColor}
                canvasProps={{ className: "signature-canvas" }}
                onEnd={handleSignatureDone}
              />
            </div>
          </div>
        </Item>

        <Item title="Image">
        <div className="demo">
          {selectedImageInitial && errorMessage ? (
            <>
              <div
                className="image-upload-area"
                onClick={() => document.getElementById("fileInputInitial").click()}
              >
                <div className="img-box">
                  <span className="drag-img">Drag an image here or</span>
                  <span className="upload-img"> Upload</span>
                </div>
                <input
                  id="fileInputInitial"
                  type="file"
                  accept="image/*"
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
                {errorMessage
                  ? errorMessage
                  : "You can upload an image up to 25MB"}
              </div>
            </>
          ) : (
            <>
              <div
                className="image-upload-area"
                onClick={() => document.getElementById("fileInputInitial").click()}
              >
                <div className="img-box">
                  <span className="drag-img">Drag an image here or</span>
                  <span className="upload-img"> Upload</span>
                </div>
                <input
                  id="fileInputInitial"
                  type="file"
                  accept="image/*"
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
                {errorMessage
                  ? errorMessage
                  : "You can upload an image up to 25MB"}
              </div>
              
              {selectedImageInitial && (
                <div className="image-details">
                  <a
                    href={selectedImageInitial && URL.createObjectURL(selectedImageInitial)}
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
        </Item>

        
      </TabPanel>
    </div>
  );
}

export default InitialPanelProfile;
