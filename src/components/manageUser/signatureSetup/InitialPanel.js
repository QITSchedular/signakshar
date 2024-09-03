import React, { useState, useEffect, useRef } from "react";
import { Button } from "devextreme-react/button";
import TabPanel from "devextreme-react/tab-panel";
import { Item } from "devextreme-react/tabs";
import SignatureCanvas from "react-signature-canvas";
import { ReactComponent as IconImageFile } from "../../../icons/image-file-icon.svg";
import { ReactComponent as IconDelete } from "../../../icons/delete-icon.svg";
import drawingPenRed from "../../../icons/drawing-pen-red.svg";
import drawingPenBlack from "../../../icons/drawing-pen-black.svg";
import drawingPenGreen from "../../../icons/drawing-pen-green.svg";
import btnDeleteSign from "../../../icons/delete-bin-icon.svg";
import InitialTextTabReg from "../../manageUser/signatureSetup/initTextTab/InitTextTabReg.js";
import Tooltip from "devextreme-react/tooltip";

import "./PdfUtils.js";
import {
  getCroppingRect,
  getNonEmptyPixels,
  processImage,
} from "./PdfUtils.js";
import InitTextTabReg from "../../manageUser/signatureSetup/initTextTab/InitTextTabReg.js";

function InitialPanel({
  signString,
  setSignString,
  setInitialDrawingData,
  initialDrawingData,
  setInitialImageData,
  initialImageData,
  source,
  setApplyInitialsData,
  applyInitialsData,
  setInitialsCanvas,
  initialsCanvas,
  loggedInUserDetail,
  setSignatureCanvas,
  signatureCanvas,
  setSelectedInitialsSubTabIndex,
  selectedInitialsSubTabIndex,
  setApplyInitialsTextData,
  applyInitialsTextData,
  setApplyInitialsDrawingData,
  applyInitialsDrawingData,
  setApplyInitialsImageData,
  applyInitialsImageData,
  setInitalsTextDataReg,
  initalsTextDataReg,
  setInitialsText,
  initialsText,
  initials,
}) {
  const [selectedImageInitial, setSelectedImageInitial] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [storedImageURL, setStoredImageURL] = useState(null);

  const modalRef = useRef(null);
  const [selectedPenColor, setSelectedPenColor] = useState("black");
  const [signatureData, setSignatureData] = useState(null);
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
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (loggedInUserDetail && loggedInUserDetail.initials_details) {
      const image = new Image();
      image.src = loggedInUserDetail.initials_details.draw_img_name;
      image.onload = () => {
        if (initialsCanvas) {
          const canvas = initialsCanvas.getCanvas();
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          setApplyInitialsDrawingData(image.src);
        }
      };
    }
  }, [initialsCanvas]);

  useEffect(() => {
    if (
      source != "registrationform" &&
      loggedInUserDetail &&
      loggedInUserDetail.initials_details?.img_name
    ) {
      setApplyInitialsImageData(loggedInUserDetail.initials_details.img_name);
    }
  }, [source]);

  useEffect(() => {
    if (source === "signingPopup" && loggedInUserDetail) {
      
      const base64Data = loggedInUserDetail.initials_details.img_name;
      
      if (base64Data) {
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

          setSelectedImageInitial(imageBlob);
          setImageDetails({ name: "InitialsImage.jpeg", size: formattedSize });
          setStoredImageURL(imageUrl);
        } catch (error) {}
      }

      // setCompanyStampImageData(base64Data);
    }
  }, [source, loggedInUserDetail]);

  const handleImageUpload = (event) => {
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
      setSelectedImageInitial(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        // setBase64SignatureImage(base64Data);
        setInitialImageData(base64Data);
      };
      reader.readAsDataURL(file);

      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setErrorMessage(null);
    } else if (source === "signingPopup") {
      setSelectedImageInitial(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setApplyInitialsImageData(base64Data);
      };
      reader.readAsDataURL(file);

      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setErrorMessage(null);
    }
    event.target.value = null;
  };

  const handleDrawingDone = () => {
    if (source === "registrationform" && initialsCanvas) {
      const dataURL = initialsCanvas.toDataURL();
      const signatureImage = new Image();
      signatureImage.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = signatureImage.width;
        canvas.height = signatureImage.height;
        const context = canvas.getContext("2d");
        context.drawImage(signatureImage, 0, 0);
        const uncroppedDataURL = canvas.toDataURL();

        localStorage.setItem("uncroppedInitialseData", uncroppedDataURL);
        setSignatureData(uncroppedDataURL);
        setStoredImageURL(uncroppedDataURL);
        // setApplyInitialsData(uncroppedDataURL);
        setInitialDrawingData(uncroppedDataURL);
      };

      signatureImage.src = dataURL;
    } else if (source === "signingPopup" && initialsCanvas) {
      const dataURL = initialsCanvas.toDataURL();

      processImage(dataURL, (croppedDataURL) => {
        if (croppedDataURL) {
          localStorage.setItem("croppedInitialData", croppedDataURL);
          setSignatureData(croppedDataURL);
          setStoredImageURL(croppedDataURL);
          setApplyInitialsDrawingData(croppedDataURL);
        } else {
          console.error("Failed to process image for signingPopup");
        }
      });
    } else {
      console.error("Other source", source);
    }
  };
  const handleRemoveImage = () => {
    setSelectedImageInitial(null);
    setImageDetails(null);

    if (source != "registrationform") {
      setApplyInitialsImageData(null);
    }
  };
  const handleDeleteCanvas = () => {
    if (initialsCanvas) {
      initialsCanvas.clear();
    }
    if (source != "registrationform") {
      setApplyInitialsDrawingData(null);
    }
    // handleClearCanvas();
    // setSelectedImageInitial(null);
    // setImageDetails(null);
    // setCroppedImage(null);
  };

  const handlePenColorChange = (color) => {
    const updatedPenColors = penColors.map((penColor) => ({
      ...penColor,
      selected: false,
    }));
    const updatedPenColorsWithSelected = updatedPenColors.map((penColor) =>
      penColor.color === color ? { ...penColor, selected: true } : penColor
    );
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

  // useEffect(() => {
  //   const signatureImageInitial = localStorage.getItem("signatureImageInitial");
  //   setStoredImageURL(signatureImageInitial);
  // });

  const handleTabSelectionChange = (e) => {
    setSelectedInitialsSubTabIndex(e.component.option("selectedIndex"));
  };

  return (
    <>
      <TabPanel onSelectionChanged={handleTabSelectionChange}>
        <Item title="Text">
          <div className="signatureTextTab-signForReg">
            {source === "registrationform" ? (
              <InitTextTabReg
                setInitalsTextDataReg={setInitalsTextDataReg}
                initalsTextDataReg={initalsTextDataReg}
                source={source}
                setInitialsText={setInitialsText}
                initialsText={initialsText}
                initials={initials}
              />
            ) : source === "signingPopup" ? (
              <InitTextTabReg
                setApplyInitialsData={setApplyInitialsData}
                applyInitialsData={applyInitialsData}
                source={source}
                setApplyInitialsTextData={setApplyInitialsTextData}
                applyInitialsTextData={applyInitialsTextData}
                loggedInUserDetail={loggedInUserDetail}
              />
            ) : null}
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
                ref={(ref) => setInitialsCanvas(ref)}
                penColor={selectedPenColor}
                canvasProps={{ className: "signature-canvas" }}
                onEnd={handleDrawingDone}
              />
            </div>
          </div>
        </Item>

        <Item title="Image">
          <div className="demo">
            {selectedImageInitial && errorMessage ? 
            (
              <>
                <div
                  className="image-upload-area"
                  onClick={() =>
                    document.getElementById("fileInputInitial").click()
                  }
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
                    : "You can upload an image up to 1MB"}
                </div>
              </>
            ) : (
              <>
                <div
                  className="image-upload-area"
                  onClick={() =>
                    document.getElementById("fileInputInitial").click()
                  }
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
                    : "You can upload an image up to 1MB"}
                </div>
                {selectedImageInitial && (
                  
                  <div className="image-details">
                    <Tooltip
                      target="#image-details-initial"
                      showEvent="mouseenter"
                      hideEvent="mouseleave"
                      hideOnOutsideClick={false}
                    >
                      <span>{imageDetails.name}</span>
                    </Tooltip>
                    <a
                      href={
                        selectedImageInitial &&
                        URL.createObjectURL(selectedImageInitial)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="details-section img-link"
                      id="image-details-initial"
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
    </>
  );
}

export default InitialPanel;
