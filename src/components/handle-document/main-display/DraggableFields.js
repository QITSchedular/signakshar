import React, { useState } from "react";
import { Draggable } from "devextreme-react";
import { Box } from "devextreme-react/box";
import Button from "devextreme-react/cjs/button";
import { ReactComponent as DragDropIcon } from "../../../icons/draggable-icon.svg";
import { ReactComponent as EditPenIcon } from "../../../icons/edit-pen-icon.svg";
import editPenIcon from "../../../icons/edit-pen-icon.svg";
import dragDropIcon from "../../../icons/draggable-icon.svg";
import "./DraggableFields.scss";

function DraggableFields(selectedSigner, selectedSignerColor) {
  const fields = [
    { name: "Signature" },
    { name: "Name" },
    { name: "Initials" },
    { name: "Date" },
    { name: "Text" },
    { name: "Company Stamp" },
  ];

  // const handleDragStart = (e, field) => {
  //   const recipient = selectedRecipient
  //     ? {
  //         fieldName: field.name,
  //         color: selectedRecipient.color,
  //         name: selectedRecipient.name,
  //         email: selectedRecipientEmail, // Include the email property
  //       }
  //     : null;

  //   const newData = {
  //     fieldName: field.name,
  //     selectedRecipient: recipient,
  //   };

  //   e.dataTransfer.setData("text/plain", JSON.stringify(mydata));
  //   setMydata([...mydata, newData]);
  //   // console.log("selectedFiles in Sidebar 2",selectedFiles);
  // };

  return (
    <>
      <div className="draggable-fields-inner-container">
        {fields.map((field, index) => (
          <Draggable key={index}>
            <div
              className="draggable-fields"
              style={{ backgroundColor: selectedSignerColor.userColor }}
            >
              <div className="draggable-icon">
                <DragDropIcon />
              </div>
              <div className="field-text">{field.name}</div>
              <Button icon={editPenIcon} className="edit-pen" />
            </div>
          </Draggable>
        ))}

        {/* <div display="flex" flexWrap="wrap" marginTop="10px">
          {fields.map((field, index) => (
            <div
              key={index}
              // draggable={isRecipientSelected ? "true" : "false"}
              // onDragStart={(e) => handleDragStart(e, field)}
              // onDragEnd={handleDropRecipient}
              className="draggable-fields"
              style={{
                margin: "5px",
                flex: "0 0 100%",
                boxSizing: "border-box",
                // border: "4px solid",
                borderColor: selectedSignerColor && selectedSignerColor.userColor,
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedSignerColor.userColor,
              }}
            >
               <DragDropIcon />
              <span style={{ marginLeft: "5px" }}>{field.name}</span>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
}

export default DraggableFields;
