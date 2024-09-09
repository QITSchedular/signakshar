import React, { useEffect, useState } from "react";
import SelectBox from "devextreme-react/select-box";
import { Button as TextBoxButton, TextBox } from "devextreme-react/text-box";
import { ReactComponent as DeleteIcon } from "../../../icons/delete-bin-line.svg";
import Tooltip from "devextreme-react/tooltip";

const RecipientItem = ({
  recipient,
  handleDeleteRecipient,
  screenValue,
  handleRecipientChange,
  currentUser,
  OnceClicked,
  setOnceClicked,
  setAddYourselfUsed = { setAddYourselfUsed },
  addYourselfUsed = { addYourselfUsed },
}) => {
  const documentOptions = ["Signer", "Viewer"];
  const [isFocused, setIsFocused] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    if (screenValue === "Template") {
      if (recipient.fullName === "") {
        handleRecipientChange(
          recipient.id,
          "fullName",
          `Recipient ${recipient.id}`
        );
      }
    }
  }, [screenValue, recipient]);

  const handleMouseEnter = () => {
    if (screenValue === "Template") {
      setTooltipContent("Enter the default name");
      setTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const CustomDropDownButton = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
    </svg>
  );

  const onDeleteClick = () => {
    handleDeleteRecipient(recipient.id);
  };

  const handleAddYourselfClick = () => {
    setOnceClicked(false);
    setAddYourselfUsed((prevState) => ({ ...prevState, [recipient.id]: true }));
    handleRecipientChange(recipient.id, "emailId", currentUser.email);
    handleRecipientChange(recipient.id, "fullName", currentUser.full_name);
  };

  // const handleEmailChange = (e) => {
  //   const inputEmail = e.event.target.value;

  //   // Update recipient data
  //   handleRecipientChange(recipient.id, "emailId", inputEmail.toLowerCase());

  //   // Check if the input value matches the "Add Yourself" email
  //   if (addYourselfUsed[recipient.id] && inputEmail !== currentUser.email) {
  //     setOnceClicked(true); // Show "Add Yourself" button for other recipients
  //     setAddYourselfUsed((prevState) => {
  //       const newState = { ...prevState };
  //       delete newState[recipient.id];
  //       return newState;
  //     });
  //   } else {
  //     setOnceClicked(false); // Hide "Add Yourself" button if the email matches
  //   }
  // };

  const handleEmailChange = (e) => {
    const inputEmail = e.event.target.value.toLowerCase();
  
    // Update recipient data
    handleRecipientChange(recipient.id, "emailId", inputEmail);
  
    // Clear the "Add Yourself" functionality if email changes
    if (addYourselfUsed[recipient.id] && inputEmail !== currentUser.email) {
      setOnceClicked(true); // Show "Add Yourself" button for other recipients
      setAddYourselfUsed((prevState) => {
        const newState = { ...prevState };
        delete newState[recipient.id];
        return newState;
      });
    } else {
      setOnceClicked(false); // Hide "Add Yourself" button if the email matches
    }
  };

  const handleInputChange = (e) => {
    const inputFullName = e.event.target.value;

    // Update recipient data
    handleRecipientChange(recipient.id, "fullName", inputFullName);

    // Check if the input value matches the "Add Yourself" name
    if (addYourselfUsed[recipient.id] && inputFullName !== addYourselfUsed[recipient.id]) {
      setOnceClicked(true); // Show "Add Yourself" button for other recipients
    } else {
      setOnceClicked(false); // Hide "Add Yourself" button if the name matches
    }
  };

  return (
    <>
      <div className="master-recipient1">
        <div className="recipient1">
          <button className="dragable-icon">
            <span className="number">{recipient.testID}</span>
          </button>

          {screenValue === "Template" && (
            <div className="fullname">
              <span>Recipient</span>
              <span className="star">*</span>
              <TextBox
                placeholder="Enter the default name"
                stylingMode="outlined"
                value={recipient.fullName}
                className="custom-textbox4"
                onValueChange={(e) =>
                  handleRecipientChange(recipient.id, "fullName", e)
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocusIn={handleFocus}
                onFocusOut={handleBlur}
              />
              <Tooltip visible={tooltipVisible} target=".custom-textbox4">
                {tooltipContent}
              </Tooltip>
            </div>
          )}

          {(screenValue === "Document" || screenValue === "BulkSigning") && (
            <>
              <div className="fullname">
                <span>Full Name</span>
                <span className="star">*</span>
                <TextBox
                  // onChange={handleInputChange}
                  placeholder="Enter the full name"
                  stylingMode="outlined"
                  className={
                    isFocused
                      ? "custom-textbox4 buttonshow"
                      : "custom-textbox4 buttonhide"
                  }
                  value={recipient.fullName}
                  onValueChange={(e) =>
                    handleRecipientChange(recipient.id, "fullName", e)
                  }
                  onFocusIn={handleFocus}
                  onFocusOut={handleBlur}
                >
                  <TextBoxButton
                    name="Add Yourself"
                    cssClass="add-yourself hide"
                    options={{
                      text: "Add yourself",
                      name: "Add",
                      visible: OnceClicked,
                      onClick: () => {
                        handleAddYourselfClick();
                      },
                    }}
                  />
                </TextBox>
              </div>
              <div className="fullname">
                <span>Email ID</span>
                <span className="star">*</span>
                <TextBox
                  onChange={handleEmailChange}
                  placeholder="Enter the email id"
                  stylingMode="outlined"
                  className="custom-textbox4"
                  value={recipient.emailId}
                  onValueChange={(e) =>
                    handleRecipientChange(recipient.id, "emailId", e)
                  }
                />
              </div>
            </>
          )}

          <div className="dropdown-custom">
            <SelectBox
              displayExpr="this"
              stylingMode="outlined"
              placeholder="Role"
              className="custom-textbox4"
              dataSource={documentOptions}
              dropDownButtonComponent={CustomDropDownButton}
              value={recipient.role}
              onValueChanged={(e) =>
                handleRecipientChange(recipient.id, "role", e.value)
              }
            />
          </div>
          <button className="button-custom" onClick={onDeleteClick}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default RecipientItem;
