import React, { useState,useEffect } from "react";
import { Button as TextBoxButton, TextBox } from "devextreme-react/text-box";
import { ReactComponent as DeleteIcon } from "../../../icons/delete-bin-line.svg";

const ApplyTemplateRecipientItem = ({
  recipient,
  handleDeleteRecipient,
  currentUser,
  handleRecipientChange,
  selectedTemplate,
  setOnceClicked,
  OnceClicked,
  setAddYourselfUsed = { setAddYourselfUsed },
  addYourselfUsed = { addYourselfUsed },
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onDeleteClick = () => {
    handleDeleteRecipient(recipient.id); // Pass the index to the delete function
  };

  const handleAddYourselfClick = () => {
    setOnceClicked(false);
    setAddYourselfUsed((prevState) => ({ ...prevState, [recipient.id]: true }));
    handleRecipientChange(recipient.id, "emailId", currentUser.email);
    handleRecipientChange(recipient.id, "fullName", currentUser.full_name);
  };

  const addYourself = {
    text: "Add Yourself",
    name: "Add",
    onClick: () => {
      handleAddYourselfClick();
    },
  };

  return (
    <>
      <div className="master-recipient1">
        <div className="recipient1">
          <button className="dragable-icon">
            <span className="number">{recipient.testID}</span>
          </button>
          <div className="fullname">
            <span>{recipient.name}</span>
            <span className="star">*</span>
            <TextBox
              placeholder="Enter the actual name"
              stylingMode="outlined"
              value={recipient.fullName}
              onValueChange={(e) =>
                handleRecipientChange(recipient.id, "fullName", e)
              }
              onFocusIn={handleFocus}
              onFocusOut={handleBlur}
              className="custom-textbox2"
            >
              {isFocused && (
                <TextBoxButton
                name="Add Yourself"
                cssClass="add-yourself hide"
                options={{
                  text: "Add yourself",
                  name: "Add",
                  visible:OnceClicked,
                  onClick: () => {
                    handleAddYourselfClick();
                  },
                }}
              />
              )}
            </TextBox>
          </div>
          <div className="fullname">
            <span>Email ID</span>
            <span className="star">*</span>
            <TextBox
              placeholder="Enter the email id"
              stylingMode="outlined"
              className="custom-textbox2"
              value={recipient.emailId}
              onValueChanged={(e) =>
                handleRecipientChange(recipient.id, "emailId", e.value.toLowerCase())
              }
            />
          </div>

          <div className="dropdown-custom">
            <span>Role</span>
            <TextBox
              readOnly={true}
              text={
                recipient.role === 1
                  ? "Signer"
                  : recipient.role === 2
                  ? "Viewer"
                  : ""
              }
              stylingMode="outlined"
              className="custom-textbox2"
            />
            {/*<span className="star">*</span>
            <SelectBox
              displayExpr="this"
              stylingMode="outlined"
              placeholder="Role"
              dataSource={documentOptions}
              // dropDownButtonComponent={CustomDropDownButton}
              value={recipient.role}
              onValueChanged={(e) =>
                handleRecipientChange(recipient.id, "role", e.value)
              }
            /> */}
          </div>
          {/* <button className="button-custom" onClick={onDeleteClick}>
            <DeleteIcon />
          </button> */}
        </div>
      </div>
    </>
  );
};

export default ApplyTemplateRecipientItem;
