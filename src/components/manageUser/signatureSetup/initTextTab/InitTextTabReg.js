import React, { useEffect, useState } from "react";
import "./InitTextTabReg.scss";
import RadioGroup from "devextreme-react/radio-group";
import BtnGroup from "../../../profile/signatureSet/btnGroup/BtnGroup";

function InitTextTabReg({
  setApplyInitialsData,
  applyInitialsData,
  source,
  setApplyInitialsTextData,
  applyInitialsTextData,
  setInitalsTextDataReg,
  initalsTextDataReg,
  setInitialsText,
  initialsText,
  loggedInUserDetail,
  initials
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
        inputValue: loggedInUserDetail?.initials_details?.initial_text_value || "",
        selectedFont: loggedInUserDetail?.initials_details?.initial_text_font || "Dancing Script, cursive",
        selectedColor: loggedInUserDetail?.initials_details?.initial_text_color || "rgba(20,33,41,1)",
      };
    }
  });

  // Effect to update inputValue when initials prop changes
  useEffect(() => {
    if (initials && textContent.inputValue === "") {
      setTextContent(prevState => ({
        ...prevState,
        inputValue: initials
      }));
      updateInitialsData("initials_text_value", initials, textContent.selectedFont, textContent.selectedColor);
    }
  }, [initials]);

  const handleChange = (event) => {
    const { value } = event.target;
    setTextContent((prevState) => ({
      ...prevState,
      inputValue: value,
    }));
    updateInitialsData("initials_text_value", value, textContent.selectedFont, textContent.selectedColor);
  };

  const handleFontChange = (fontFamily) => {
    setTextContent((prevState) => ({
      ...prevState,
      selectedFont: fontFamily,
    }));
    updateInitialsData(
      "initials_text_font",
      textContent.inputValue,
      fontFamily,
      textContent.selectedColor
    );
  };

  const handleColorChange = (color) => {
    setTextContent((prevState) => ({
      ...prevState,
      selectedColor: color,
    }));
    updateInitialsData(
      "initials_text_color",
      textContent.inputValue,
      textContent.selectedFont,
      color
    );
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

  const updateInitialsData = (key, text, font, color) => {
    if (source === "registrationform") {
      setInitalsTextDataReg((prevState) => ({
        initials_text_value: text,
        initials_text_font: font,
        initials_text_color: color,
      }));
      const initTextDataUrlRegis = textToBase64Image(text, font, color);
      setInitialsText(initTextDataUrlRegis);
    } else if (source === "signingPopup") {
      if (text === "") {
        setApplyInitialsData(null);
        setApplyInitialsTextData(null);
      } else {
        const dataUrl = textToBase64Image(text, font, color);
        setApplyInitialsData(dataUrl);
        setApplyInitialsTextData(dataUrl);
      }
    }
  };

  const priorityEntities = [
    {
      id: 0,
      text: textContent.inputValue || "Initials",
      fontFamily: "Dancing Script, cursive",
    },
    {
      id: 1,
      text: textContent.inputValue || "Initials",
      fontFamily: "Shadows Into Light, cursive",
    },
    {
      id: 2,
      text: textContent.inputValue || "Initials",
      fontFamily: "Birthstone Bounce, cursive",
    },
    {
      id: 3,
      text: textContent.inputValue || "Initials",
      fontFamily: "Reenie Beanie, cursive",
    },
    {
      id: 4,
      text: textContent.inputValue || "Initials",
      fontFamily: "Zeyada, cursive",
    },
    {
      id: 5,
      text: textContent.inputValue || "Initials",
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
        {textContent.inputValue || "Initials"}
      </span>
    );
  };

  useEffect(() => {
    if (source !== "registrationform" && loggedInUserDetail?.initials_details?.initial_text) {
      setApplyInitialsTextData(loggedInUserDetail.initials_details.initial_text);
    }
  }, [source]);

  return (
    <div className="initTextTab-main-forReg">
      <form className="initTextTab-form">
        <div className="initTextBox">
          <div className="initTextLabel">
            <label className="mainLabel" htmlFor="initTextTabName">
              Initials
            </label>
            <label className="initTextNameAsh" htmlFor="initTextTabName">
              *
            </label>
          </div>
          <input
            type="text"
            id="initTextTabInput"
            name="initTextTabName"
            className="initTextNameInput"
            value={textContent.inputValue}
            onChange={handleChange}
            placeholder="Enter Initials"
          />
        </div>
        <div className="initTextTabRadioGroup">
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

export default InitTextTabReg;
