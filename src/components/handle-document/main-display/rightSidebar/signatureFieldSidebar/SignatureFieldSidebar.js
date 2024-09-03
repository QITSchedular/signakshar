import React from "react";
import "./SignatureFieldSidebar.scss";
import DraggableFields from "../../DraggableFields";
import { Button } from "devextreme-react";
import { ReactComponent as DragDropIcon } from "../../../../../icons/draggable-icon.svg";

function SignatureFieldSidebar({
  fields,
  selectedSignerName,
  activeFieldData,
  handleDeleteRecipient,
  copyCurrentBoxToAllPages,
  copyCurrentBoxToBelowPages,
}) {
  const getColorWithOpacity = (color) => {
    // Assuming color is in the format #RRGGBB or rgb(r, g, b)
    let r, g, b;

    if (color.startsWith("#")) {
      // Convert hex to rgb
      const bigint = parseInt(color.slice(1), 16);
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else if (color.startsWith("rgb")) {
      const rgbValues = color.match(/\d+/g);
      r = rgbValues[0];
      g = rgbValues[1];
      b = rgbValues[2];
    }

    return `rgba(${r}, ${g}, ${b}, 0.05)`;
  };

  return (
    <div className="inner-container-field-sidebar">
      <div className="heading-right">
        <div className="heading-properties">Properties</div>
        {/* <div className="heading-signer">Signer - {selectedSignerName} </div> */}
        <div className="heading-signer">
          Signer - {activeFieldData.recipientName}{" "}
        </div>
      </div>

      <div>
        <div className="draggable-fields-right-container">
          <div display="flex" flexWrap="wrap" marginTop="10px">
            {/* {fields.map((field, index) => ( */}
            <div
              key={1}
              // draggable={selectedSigner ? "true" : "false"}
              // onDragStart={(e) => handleDragStart(e, field)}
              // onDragEnd={handleDropRecipient}
              className="draggable-fields"
              onClick={(e) => {
                // setActiveField(e.target.id);
              }}
              id={1}
              style={{
                margin: "5px",
                flex: "0 0 100%",
                boxSizing: "border-box",
                // border: "4px solid rgba(184, 122, 254, 0.05)",
                border: "4px solid transperant",
                // borderColor: selectedSignerColor && selectedSignerColor,
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                // justifyContent: "center",
                backgroundColor: getColorWithOpacity(
                  activeFieldData.recipientColor
                ),
                // backgroundColor:activeFieldData.color,
              }}
            >
              <DragDropIcon id={1} />
              <span id={1} style={{ marginLeft: "5px" }}>
                {activeFieldData.fieldName}
              </span>
              {/* <span><Button icon={editPenIcon} className="edit-pen" /></span> */}
            </div>
            {/* ))} */}
          </div>
        </div>
      </div>
      <div className="copy-del-operations">
        {/* <Button className="operation-text">Copy Field to all pages</Button> */}
        <Button
          className="operation-text"
          text="Copy Field to all pages"
          onClick={(e) => copyCurrentBoxToAllPages(activeFieldData)}
        />
        <div className="horizontal-spacing" />
        <Button
          className="operation-text"
          text="Copy Field to below pages"
          onClick={(e) => copyCurrentBoxToBelowPages(activeFieldData)}
        />
        <div className="horizontal-spacing" />
        <Button
          className="operation-text"
          text="Delete"
          // onClick={handleDeleteRecipient(activeFieldData.recipientId)}
          onClick={(e) => handleDeleteRecipient(activeFieldData.recipientId, e)}
        />
        {/* <div className="operation-text">Delete</div> */}
      </div>
    </div>
  );
}

export default SignatureFieldSidebar;
