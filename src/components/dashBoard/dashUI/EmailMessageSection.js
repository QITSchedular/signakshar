// EmailMessageSection.js
import React,{useEffect} from "react";
import PropTypes from "prop-types";
import TextBox from "devextreme-react/text-box";
import TextArea, { TextAreaTypes } from "devextreme-react/text-area";

function EmailMessageSection({
  emailTitle,
  emailMessage,
  gemailTitle,
  gemailMessage,
}) {
  return (
    <div className="section4">
      <div className="Add-EmailMess">Email Message</div>
      <div className="title_Emailmess">
        <span>Title</span>
        <span className="star2">*</span>
        <TextBox
          placeholder="Enter the Subject for mail"
          stylingMode="outlined"
          className="custom-textbox2"
          valueChangeEvent="keyup"
          onValueChanged={emailTitle}
          value={gemailTitle}
          // onChange={emailtitle}
        />
      </div>
      <div className="title_Emailmess">
        <span>Message</span>
        {/* <TextBox
          placeholder="Enter the Message for mail"
          stylingMode="outlined"
          className="custom-textbox3"
          valueChangeEvent="keyup"
          onValueChanged={emailMessage}
        /> */}
        <TextArea
          height={130}
          maxLength={255}
          stylingMode={"outlined"}
          placeholder={"Enter the Message for mail"}
          className="custom-textbox3"
          valueChangeEvent="keyup"
          onValueChanged={emailMessage}
          value={gemailMessage}
          // defaultValue={value}
          // inputAttr={notesLabel}
          // autoResizeEnabled={autoResizeEnabled}
        />
      </div>
    </div>
  );
}

export default EmailMessageSection;
