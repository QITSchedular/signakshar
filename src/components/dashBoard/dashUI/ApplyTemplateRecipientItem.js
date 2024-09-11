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
  setShowSections={setShowSections}
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

  const handleEmailChange = (e) => {
    const inputEmail = e.event.target.value.toLowerCase();
    const addYourselfEmail = currentUser.email.toLowerCase();
    
    console.log("Input Email:", inputEmail);
    console.log("Add Yourself Email:", addYourselfEmail);
  
    // Update recipient data
    handleRecipientChange(recipient.id, "emailId", inputEmail);
  
    // Determine if the email matches the "Add Yourself" email
    const isEmailMatching = inputEmail === addYourselfEmail;
    console.log("Email Matching Status:", isEmailMatching);
  
    if (addYourselfUsed[recipient.id]) {
      if (isEmailMatching) {
        // Email matches "Add Yourself" email
        setOnceClicked(false);
        console.log("==========Email matches Add Yourself email.");
      } else {
        // Email does not match "Add Yourself" email
        setOnceClicked(true);
        console.log("==========Email does not match Add Yourself email.");
      }
    } else {
      // "Add Yourself" was not used for this recipient
      setOnceClicked(false);
      console.log("==========Add Yourself not used for this recipient.");
    }
  
    // Check if there is only one recipient and "Add Yourself" is used
    const recipientsCount = Object.keys(addYourselfUsed).length;
    console.log("==========Number of recipients:", recipientsCount);
    if (recipientsCount === 1 && addYourselfUsed[recipient.id]) {
      setShowSections(false); // Hide sections if only one recipient is present and "Add Yourself" is used
      console.log("==========Only one recipient and Add Yourself used. Hiding sections.");
    } else {
      // Ensure sections are visible if conditions are not met
      setShowSections(true);
    }
  
    // Clear the "Add Yourself" functionality if email changes
    if (addYourselfUsed[recipient.id] && !isEmailMatching) {
      setOnceClicked(true); // Show "Add Yourself" button for other recipients
      setAddYourselfUsed((prevState) => {
        const newState = { ...prevState };
        delete newState[recipient.id];
        return newState;
      });
      console.log("==========Clearing Add Yourself functionality as email does not match.");
    }
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
            onChange={handleEmailChange}
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
