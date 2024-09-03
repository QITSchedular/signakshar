import React, { useState,useEffect } from 'react';
import "./InitialTextTab.scss";
import RadioGroup from 'devextreme-react/radio-group';
import BtnGroup from '../../btnGroup/BtnGroup';
 
function InitialTextTab({registeredUserDetails,initalsTextDataProfile,setInitalsTextDataProfile,setInitialsTextTextUrlProfile,signatureTextDataProfile}) {
  
  const [textContent, setTextContent] = useState({
    inputValue: registeredUserDetails?.initials_details?.initial_text_value  ||'',
    selectedFont: registeredUserDetails?.initials_details?.initial_text_font || 'Dancing Script, cursive',
    selectedColor: registeredUserDetails?.initials_details?.initial_text_color || 'rgba(20,33,41,1)'
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
    setInitalsTextDataProfile({
      initials_text_color: textContent.selectedColor,
      initials_text_font: textContent.selectedFont,
      // initials_text_value: textContent?.inputValue || registeredUserDetails?.initials_details?.initial_text_value || "Initials",
      initials_text_value: textContent?.inputValue || "Initials",
    });

    const textToImg=textToBase64Image(textContent.inputValue,textContent.selectedFont,textContent.selectedColor);
    setInitialsTextTextUrlProfile(textToImg);

  }, [textContent, registeredUserDetails,setInitalsTextDataProfile,setInitialsTextTextUrlProfile,signatureTextDataProfile]);
 
  const handleChange = (event) => {
    setTextContent(prevState => ({
      ...prevState,
      inputValue: event.target.value
    }));
  };
 
  const handleFontChange = (fontFamily) => {
    setTextContent(prevState => ({
      ...prevState,
      selectedFont: fontFamily
    }));
  };
 
  const handleColorChange = (color) => {
    setTextContent(prevState => ({
      ...prevState,
      selectedColor: color
    }));
  };
 
  const priorityEntities = [
    { id: 0, text: textContent.inputValue || registeredUserDetails?.initials_details?.initial_text_value || registeredUserDetails?.user?.initial || 'Initials', fontFamily: "Dancing Script, cursive" },
    { id: 1, text: textContent.inputValue || registeredUserDetails?.initials_details?.initial_text_value || registeredUserDetails?.user?.initial || 'Initials', fontFamily: 'Shadows Into Light, cursive' },
    { id: 2, text: textContent.inputValue || registeredUserDetails?.initials_details?.initial_text_value || registeredUserDetails?.user?.initial || 'Initials', fontFamily: 'Birthstone Bounce, cursive' },
    { id: 3, text: textContent.inputValue|| registeredUserDetails?.initials_details?.initial_text_value || registeredUserDetails?.user?.initial || 'Initials', fontFamily: "Reenie Beanie, cursive" },
    {
      id: 4,
      text: textContent.inputValue || registeredUserDetails?.initials_details?.initial_text_value || registeredUserDetails?.user?.initial || "Initials",
      fontFamily: "Zeyada, cursive",
    },
    {
      id: 5,
      text: textContent.inputValue || registeredUserDetails?.initials_details?.initial_text_value || registeredUserDetails?.user?.initial || "Initials",
      fontFamily: "Homemade Apple, cursive",
    },
  ];
 
  const renderRadioItem = (item) => {
    return (
      <span
        style={{
          fontFamily: item.fontFamily,
          color: textContent.selectedColor
        }}
      >
        {textContent.inputValue || 'Initials'}
      </span>
    );
  };
  return (
    <div className='initTextTab-main'>
      <form className='initTextTab-form'>
        <div className='initTextBox'>
          <div className='initTextLabel'>
            <label className='mainLabel' htmlFor="initTextTabName">Initials</label>
            <label className='initTextNameAsh' htmlFor="initTextTabName">*</label>
          </div>
          <input
            type="text"
            id="initTextTabInput"
            name="initTextTabName"
            className='initTextNameInput'
            value={textContent.inputValue}
            onChange={handleChange}
            placeholder='Enter Initials'
          />
        </div>
        <div className='initTextTabRadioGroup'>
          <RadioGroup
            id="radio-group-with-selection"
            items={priorityEntities}
            value={priorityEntities.findIndex(item => item.fontFamily === textContent.selectedFont)}
            valueExpr="id"
            displayExpr="text"
            itemRender={renderRadioItem}
            onValueChanged={(e) => handleFontChange(priorityEntities[e.value].fontFamily)}
          />
        </div>
        <div className='colorSelectionTextTab'>
          <div className='colorButtonIcons'>
            <BtnGroup onColorChange={handleColorChange} />
          </div>
        </div>
      </form>
    </div>
  );
}
 
export default InitialTextTab;
