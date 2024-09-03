import React from 'react';
import './EditProfile.scss';

export default function EditProfile({ handleChange, values, updateData }) {
  return (
    <div className='editProfileForm'>
      <form className='editProfileForm' onSubmit={(e) => { e.preventDefault(); updateData(); }}>
        <div className='editProfileTextBox'>
          <div className='editProfileLabel'>
            <label className='mainLabel' htmlFor="textbox1">Full Name</label>
            <label className='editProfileAsh' htmlFor="textbox1">*</label>
          </div>
          <input
            type="text"
            id="textbox1"
            name="textbox1"
            className='editProfileInput'
            value={values.textbox1}
            onChange={handleChange}
          />
        </div>
        <div className='editProfileTextBox'>
          <div className='editProfileLabel'>
            <label className='mainLabel' htmlFor="textbox3">Initials</label>
            <label className='editProfileAsh' htmlFor="textbox3">*</label>
          </div>
          <input
            type="text"
            id="textbox3"
            name="textbox3"
            className='editProfileInput'
            value={values.textbox3}
            onChange={handleChange}
          />
        </div>
        <div className='editProfileTextBox'>
          <div className='editProfileLabel'>
            <label className='mainLabel' htmlFor="textbox2">Email Address</label>
            <label className='editProfileAsh' htmlFor="textbox2">*</label>
          </div>
          <input
            type="text"
            id="textbox2"
            name="textbox2"
            className='editProfileInput'
            value={values.textbox2}
            // onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
}
