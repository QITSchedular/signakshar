import React, { useState } from 'react';
import "./SignatureTextTab.scss";
import RadioGroup from 'devextreme-react/radio-group';
import BtnGroup from '../../btnGroup/BtnGroup';

function SignatureTextTab() {
  const [inputValue, setInputValue] = useState(''); // Initialize with default text
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState('black'); // Initialize with default color

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const priorityEntities = [
    { id: 0, text: inputValue || 'Signature', fontFamily: "Dancing Script, cursive" },
    { id: 1, text: inputValue || 'Signature', fontFamily: 'Shadows Into Light, cursive' },
    { id: 2, text: inputValue || 'Signature', fontFamily: 'Birthstone Bounce, cursive' },
    { id: 3, text: inputValue || 'Signature', fontFamily: "Reenie Beanie, cursive" },
  ];

  const renderRadioItem = (item) => {
    return <span style={{ fontFamily: item.fontFamily, color: selectedColor }}>{item.text}</span>;
  };

  return (
    <div className='signTextTab-main'>
      <form className='signTextTab-form'>
        <div className='signTextBox'>
          <div className='signTextLabel'>
            <label className='mainLabel' htmlFor="signTextTabName">Full Name</label>
            <label className='signTextNameAsh' htmlFor="signTextTabName">*</label>
          </div>
          <input
            type="text"
            id="signTextTabInput"
            name="signTextTabName"
            className='signTextNameInput'
            value={inputValue}
            onChange={handleChange}
          />
        </div>
        <div className='signTextTabRadioGroup'>
          <RadioGroup
            id="radio-group-with-selection"
            items={priorityEntities}
            valueExpr="id"
            displayExpr="text"
            itemRender={renderRadioItem}
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

export default SignatureTextTab;
