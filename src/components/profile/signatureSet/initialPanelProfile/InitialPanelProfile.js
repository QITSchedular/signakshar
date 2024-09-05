// -------------
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
import "./InitialPanelProfile.scss";
import InitialTextTab from "./intialTextTab/InitialTextTab.js";
import { Tooltip } from "devextreme-react";

function InitialPanelProfile({
  selectedImageInitialProfile, setSelectedImageInitialProfile,signatureTextDataProfile,
  imageDetailsOnInitialsProfile,setImageDetailsOnInitialsProfile,setInitialsTextTextUrlProfile,
  handleImageUploadForIntialProfile,registeredUserDetails,initalsTextDataProfile,setInitalsTextDataProfile,
  setInitialCanvas,handleIntialsDone,initImageURL,se,initDrawData,initialCanvas,setInitImageURL}) {
  
  
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

  const handleRemoveImage = () => {
    setSelectedImageInitialProfile(null);
    setImageDetailsOnInitialsProfile(null);
  };

  const handleClearCanvas = () => {
    if(initialCanvas){
      initialCanvas.clear();
    }
  };

  const handleDeleteCanvas = () => {
    handleClearCanvas();
    // setSelectedImageInitialProfile(null);
    // setImageDetailsOnInitialsProfile(null);
    // setCroppedImage(null);
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

  // useEffect(() => {
  //   if (typeof initImageURL === 'function') {
  //     const signatureImageInitial = localStorage.getItem("signatureImageInitial");
  //     initImageURL(signatureImageInitial);
  //   } else {
  //     console.error('initImageURL is not a function');
  //   }
  // }, [initImageURL]); 

  useEffect(() => {
    if (registeredUserDetails?.initials_details?.draw_img_name) {
      const image = new Image();
      image.src = registeredUserDetails.initials_details.draw_img_name;
      image.onload = () => {
        if (initialCanvas) {
          const canvas = initialCanvas.getCanvas();
          if(canvas){
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          }
          setInitImageURL(image.src);
        }
      };
    }
  }, [registeredUserDetails, initialCanvas,setInitImageURL]);
  var imgUrl;
  useEffect(()=>{
    if(registeredUserDetails?.initials_details?.img_name){
      const base64dt=registeredUserDetails?.initials_details?.img_name;

      if(base64dt){
        try {
          const binaryString = atob(base64dt.split(",")[1]);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const imageBlob = new Blob([bytes], { type: "image/png" });
          // const imageUrl = URL.createObjectURL(imageBlob);
          imgUrl=URL.createObjectURL(imageBlob);
          const formattedSize =(bytes.byteLength / (1024 * 1024)).toFixed(2) + " MB";

          setSelectedImageInitialProfile(imageBlob);
          setImageDetailsOnInitialsProfile({ name: "InitialsImage.jpeg", size: formattedSize })

        } catch (error) {
          
        }
      }

    }
  },[registeredUserDetails])

  return (
    <div className="initialPanel-profile">
      <TabPanel>
        <Item title="Text">
        <div className="initTextTabmain ">
            <InitialTextTab 
              registeredUserDetails={registeredUserDetails}
              initalsTextDataProfile={initalsTextDataProfile}
              setInitalsTextDataProfile={setInitalsTextDataProfile}
              signatureTextDataProfile={signatureTextDataProfile}
              setInitialsTextTextUrlProfile={setInitialsTextTextUrlProfile}
            />
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
                ref={(ref) => setInitialCanvas(ref)}
                penColor={selectedPenColor}
                canvasProps={{ className: "signature-canvas" }}
                onEnd={handleIntialsDone}
              />
            </div>
          </div>
        </Item>

        <Item title="Image">
        <div className="demo">
          {selectedImageInitialProfile && errorMessage ? 
          (
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
                  onChange={handleImageUploadForIntialProfile}
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
                {console.log("mklmlkml1st")}
                <div className="img-box">
                  <span className="drag-img">Drag an image here or</span>
                  <span className="upload-img"> Upload</span>
                </div>
                <input
                  id="fileInputInitial"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadForIntialProfile}
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
            
              {selectedImageInitialProfile && (
                <div className="image-details">
                  <Tooltip
                  target="#image-details-ipp"
                  showEvent="mouseenter"
                  hideEvent="mouseleave"
                  hideOnOutsideClick={false}
                >
                  <span>{imageDetailsOnInitialsProfile.name}</span>
                </Tooltip>
                
                  <a
                  id="image-details-ipp"
                    // href={selectedImageInitialProfile && URL.createObjectURL(selectedImageInitialProfile)}
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="details-section img-link"
                  >
                    {console.log("here")}
                    
                    <div className="file-icon">
                      <span className="image-icon">
                        <IconImageFile />
                      </span>
                    </div>
                    <div className="file-info">
                      <div className="image-info">
                        <span className="name">{imageDetailsOnInitialsProfile.name}</span>
                        <p className="size">{imageDetailsOnInitialsProfile.size}</p>
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
