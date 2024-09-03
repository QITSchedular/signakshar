import React, { useEffect, useState } from "react";
import "./SignTextTabReg.scss";
import RadioGroup from "devextreme-react/radio-group";
import BtnGroup from "../../../profile/signatureSet/btnGroup/BtnGroup";

function SignTextTabReg({
  setSignatureTextData,
  signatureTextData,
  setSignatureText,
  signatureText,
  setApplySignatureData,
  applySignatureData,
  source,
  setApplySignatureTextData,
  applySignatureTextData,
  fullName,
  loggedInUserDetail,
}) {

  const [textContent, setTextContent] = useState(() => {
    if (source === "registrationform") {
      return {
        inputValue: "",
        selectedFont: "Dancing Script, cursive",
        selectedColor: "rgba(20,33,41,1)",
      };
    } else {
      return {
        inputValue: loggedInUserDetail?.signature_details?.sign_text_value || "",
        selectedFont: loggedInUserDetail?.signature_details?.sign_text_font || "Dancing Script, cursive",
        selectedColor: loggedInUserDetail?.signature_details?.sign_text_color || "rgba(20,33,41,1)",
      };
    }
  });

  useEffect(() => {
    if (fullName && textContent.inputValue === "") {
      setTextContent((prevState) => ({
        ...prevState,
        inputValue: fullName,
      }));
      updateSignatureData("sign_text_value", fullName, textContent.selectedFont, textContent.selectedColor);
    }
  }, [fullName]);

  const handleChange = (event) => {
    const { value } = event.target;
    setTextContent((prevState) => ({
      ...prevState,
      inputValue: value,
    }));
    updateSignatureData("sign_text_value", value, textContent.selectedFont, textContent.selectedColor);
  };

  const handleFontChange = (fontFamily) => {
    setTextContent((prevState) => ({
      ...prevState,
      selectedFont: fontFamily,
    }));
    updateSignatureData("sign_text_font", textContent.inputValue, fontFamily, textContent.selectedColor);
  };

  const handleColorChange = (color) => {
    setTextContent((prevState) => ({
      ...prevState,
      selectedColor: color,
    }));
    updateSignatureData("sign_text_color", textContent.inputValue, textContent.selectedFont, color);
  };

  const textToBase64Image = (text, font, color) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
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

  const updateSignatureData = (key, text, font, color) => {
    if (source === "registrationform") {
      setSignatureTextData({
        sign_text_value: text,
        sign_text_font: font,
        sign_text_color: color,
      });
      const textDataUrlRegis = textToBase64Image(text, font, color);
      setSignatureText(textDataUrlRegis);
    } else if (source === "signingPopup") {
      if (text === "") {
        setApplySignatureData(null);
        setApplySignatureTextData(null);
      } else {
        const dataUrl = textToBase64Image(text, font, color);
        setApplySignatureData(dataUrl);
        setApplySignatureTextData(dataUrl);
      }
    }
  };

  const priorityEntities = [
    {
      id: 0,
      text: textContent.inputValue || "Signature",
      fontFamily: "Dancing Script, cursive",
    },
    {
      id: 1,
      text: textContent.inputValue || "Signature",
      fontFamily: "Shadows Into Light, cursive",
    },
    {
      id: 2,
      text: textContent.inputValue || "Signature",
      fontFamily: "Birthstone Bounce, cursive",
    },
    {
      id: 3,
      text: textContent.inputValue || "Signature",
      fontFamily: "Reenie Beanie, cursive",
    },
    {
      id: 4,
      text: textContent.inputValue || "Signature",
      fontFamily: "Zeyada, cursive",
    },
    {
      id: 5,
      text: textContent.inputValue || "Signature",
      fontFamily: "Homemade Apple, cursive",
    },
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

  useEffect(() => {
    if (source !== "registrationform" && loggedInUserDetail?.signature_details?.sign_text) {
      if (typeof setApplySignatureTextData === "function") {
        setApplySignatureTextData(loggedInUserDetail.signature_details.sign_text);
      } else {
        console.error("setApplySignatureTextData is not a function");
      }
    }
  }, [source, loggedInUserDetail]);

  return (
    <div className="signTextTab-main-forReg">
      <form className="signTextTab-form">
        <div className="signTextBox">
          <div className="signTextLabel">
            <label className="mainLabel" htmlFor="signTextTabName">
              Signature
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
            placeholder="Enter your sign text"
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

export default SignTextTabReg;
