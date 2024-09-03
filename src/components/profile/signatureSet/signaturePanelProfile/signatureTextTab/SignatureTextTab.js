import React, { useState ,useEffect} from "react";
import "./SignatureTextTab.scss";
import RadioGroup from "devextreme-react/radio-group";
import BtnGroup from "../../btnGroup/BtnGroup";

function SignatureTextTab({
  registeredUserDetails,
  setSignatureTextDataProfile,
  signatureTextDataProfile,
  setSignatureTextTextUrlProfile,
  signatureTextUrlProfile,
}) {
  
  const [textContent, setTextContent] = useState({
    inputValue: registeredUserDetails?.signature_details?.sign_text_value ||"",
    selectedFont: registeredUserDetails?.signature_details?.sign_text_font || "Dancing Script, cursive", // Set initial font
    selectedColor: registeredUserDetails?.signature_details?.sign_text_color || "rgba(20,33,41,1)",
  });

  const textToBase64Image = (text, font, color) => {
    const canvas = document.createElement("canvas");
  
    if (!canvas) {
      console.error("Failed to create canvas element.");
      return;
    }
  
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get 2D context for the canvas.");
      return;
    }
  
    const fontSize = 70;
    context.font = `${fontSize}px ${font}`;
  
    const textWidth = context.measureText(text).width;
    const textHeight = fontSize;
  
    const padding = 20;
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;
  
    context.font = `${fontSize}px ${font}`;
    context.fillStyle = color;
    context.textBaseline = "top";
  
    context.fillText(text, padding, padding);
  
    return canvas.toDataURL("image/png");
  };
  

  useEffect(() => {
    setSignatureTextDataProfile({
      signature_text_color: textContent.selectedColor,
      signature_text_font: textContent.selectedFont,
      signature_text_value: textContent.inputValue || "Signature",
    });
    const textToImg=textToBase64Image(textContent.inputValue,textContent.selectedFont,textContent.selectedColor);
    setSignatureTextTextUrlProfile(textToImg);
  }, [textContent, setSignatureTextDataProfile,setSignatureTextTextUrlProfile]);

  const handleChange = (event) => {
    setTextContent((prevState) => ({
      ...prevState,
      inputValue: event.target.value,
    }));
  };

  const handleFontChange = (fontFamily) => {
    setTextContent((prevState) => ({
      ...prevState,

      selectedFont: fontFamily,
    }));
  };

  const handleColorChange = (color) => {
    setTextContent((prevState) => ({
      ...prevState,

      selectedColor: color,
    }));
  };

  const priorityEntities = [
    {
      id: 0,
      text: textContent.inputValue || registeredUserDetails?.signature_details?.sign_text_value || registeredUserDetails?.user?.full_name || "Signature",
      fontFamily: "Dancing Script, cursive",
    },

    {
      id: 1,
      text: textContent.inputValue|| registeredUserDetails?.signature_details?.sign_text_value || registeredUserDetails?.user?.full_name || "Signature",
      fontFamily: "Shadows Into Light, cursive",
    },

    {
      id: 2,
      text: textContent.inputValue || registeredUserDetails?.signature_details?.sign_text_value || registeredUserDetails?.user?.full_name || "Signature",
      fontFamily: "Birthstone Bounce, cursive",
    },

    {
      id: 3,
      text: textContent.inputValue || registeredUserDetails?.signature_details?.sign_text_value|| registeredUserDetails?.user?.full_name || "Signature",
      fontFamily: "Reenie Beanie, cursive",
    },
    {
      id: 4,
      text: textContent.inputValue || registeredUserDetails?.signature_details?.sign_text_value|| registeredUserDetails?.user?.full_name || "Signature",
      fontFamily: "Zeyada, cursive",
    },
    {
      id: 5,
      text: textContent.inputValue || registeredUserDetails?.signature_details?.sign_text_value|| registeredUserDetails?.user?.full_name || "Signature",
      fontFamily: "Homemade Apple, cursive",
    }
  ];

  const renderRadioItem = (item) => {
    return (
      <span
        style={{
          fontFamily: item.fontFamily,

          color: textContent.selectedColor,
        }}
      >
        {textContent.inputValue || "Signature"}
      </span>
    );
  };
  return (
    <div className="signTextTab-main">
      <form className="signTextTab-form">
        <div className="signTextBox">
          <div className="signTextLabel">
            <label className="mainLabel" htmlFor="signTextTabName">
              Full Name
            </label>

            <label className="signTextNameAsh" htmlFor="signTextTabName">
              *
            </label>
          </div>

          <input
            type="text"
            id="signTextTabInput"
            name="signTextTabName"
            className="signTextNameInput"
            value={textContent.inputValue}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="signTextTabRadioGroup">
          <RadioGroup
            id="radio-group-with-selection"
            items={priorityEntities}
            value={priorityEntities.findIndex(
              (item) => item.fontFamily === textContent.selectedFont
            )}
            valueExpr="id"
            displayExpr="text"
            itemRender={renderRadioItem}
            onValueChanged={(e) =>
              handleFontChange(priorityEntities[e.value].fontFamily)
            }
          />
        </div>

        <div className="colorSelectionTextTab">
          <div className="colorButtonIcons">
            <BtnGroup onColorChange={handleColorChange} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignatureTextTab;
