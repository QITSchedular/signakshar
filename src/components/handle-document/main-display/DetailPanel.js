//new code with selection handling
import React, { useState, useEffect } from "react";
import "./DetailPanel.scss";
import Button from "devextreme-react/cjs/button";
import btnReset from "../../../icons/restart-line.svg";
import DropDownButton from "devextreme-react/drop-down-button";
import SelectBox from "devextreme-react/select-box";
import { useNavigate } from "react-router-dom";
import { useDragDropContext } from "../../../contexts/CustomDragDropContext";

function DetailPanel({
  signerOptions,
  emailTitle,
  signOpt,
  Expiration,
  emailMessage,
  reminderDays,
  docapiData,
  screenValue,
  did,
  tid,
  tempYEs,
  selectedFile,
  templateapiData,
  scheduledDate,
  setIsAnyFieldClicked,
  templateDraggedData,
  recipientTempData,
  draggedDataTemp,
  setMySelectedDocument,
  mySelectedDocument,
  multipleImageDetails,
  selectedRowDataTemp,
}) {
  const navigate = useNavigate();
  const { resetDraggedData } = useDragDropContext();
  const documentSource = [selectedRowDataTemp?.recData];
  const [mydata, setMyData] = useState([]);
  useEffect(() => {
    if (selectedRowDataTemp?.recData) {
      const separatedRecData = selectedRowDataTemp?.recData.map((item) => ({
        id: item.id,
        name: item.name,
        role: item.role,
      }));
      setMyData(separatedRecData);
    }
  }, [selectedRowDataTemp?.recData]);

  const handlePreviewBtn = () => {
    navigate(
      `/previewpage?template=${screenValue}&tempYEs=${tempYEs}&tid=${tid}&did=${did}&preview=yes`,
      {
        state: {
          selectedFile: selectedFile,
          Expiration: Expiration,
          draggedDataTemp: draggedDataTemp,
          docapiData: docapiData,
          scheduledDate: scheduledDate,
          reminderDays: reminderDays,
          emailMessage: emailMessage,
          emailTitle: emailTitle,
          signOpt: signOpt,
          templateapiData: templateapiData,
          signerOptions: signerOptions,
          templateDraggedData: templateDraggedData,
          recipientTempData: recipientTempData,
        },
      }
    );
  };

  const handleBgCLicked = () => {
    setIsAnyFieldClicked(false);
  };

  const handleResetButtonClick = () => {
    resetDraggedData();
    handleBgCLicked();
  };

  return (
    <>
      <div className="main-detail-panel">
        <div className="outer-section">
          <div className="first-inner-section">
            {tempYEs !== "yes" && screenValue!=="editTemplate" && (
              <Button
                icon={btnReset}
                className="btn-reset"
                onClick={handleResetButtonClick}
              />
            )}
            {screenValue && screenValue != "BulkSigning" && (
              <>
                {selectedFile ? (
                  <>
                    <div className="single-document-sign">1 Document</div>
                  </>
                ) : (
                  
                  <SelectBox
                    width="13%"
                    className="document-selection"
                    valueExpr={(documentSource) => documentSource}
                    valueRender={(item) => `${item.docName} (${item.pages})`}
                    displayRender={(item) => `${item.docName} (${item.pages})`}
                    stylingMode="outlined"
                    onItemClick={(e) => {
                      setMySelectedDocument(e.itemData);
                    }}
                    dataSource={documentSource}
                    value={mySelectedDocument} // Set initial value
                    selectedItem={mySelectedDocument}
                    itemTemplate={(item) => {
                      return `<div class="custom-item">
                      
                      <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter'; overflow:hidden ; text-overflow:ellipsis;">${item.docName}</div>
                      <div class="recipient-role"}>${item.pages} pages</div>
                      </div>`;
                    }}
                    placeholder={
                      mySelectedDocument != null
                        ? mySelectedDocument.docName
                        : documentSource.length + " Documents"
                    }
                  />
                )}
              </>
            )}

            {screenValue && screenValue === "BulkSigning" && (
              <>
                {multipleImageDetails && (
                  // <SelectBox
                  <div className="splitbtnRecipients">
                  <DropDownButton
                    // width={"15%"}
                    splitButton={true}
                    className="recipient-selection"
                    valueExpr={(multipleImageDetails) => multipleImageDetails}
                    valueRender={(item) => `${item.name} (${item.pages})`}
                    displayRender={(item) => `${item.name} (${item.pages})`}
                    stylingMode="text"  
                    onItemClick={(e) => {
                      setMySelectedDocument(e.itemData);
                    }}
                    dataSource={multipleImageDetails}
                    itemTemplate={(item) => {
                      return `<div class="custom-item">
                        <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter'; overflow:hidden ; text-overflow:ellipsis;">${item.name}</div>
                        <div class="recipient-role"}>${item.pages} pages</div>
                        </div>`;
                    }}
                    text={
                      mySelectedDocument != null
                        ? mySelectedDocument.name
                        : multipleImageDetails.length + " Documents"
                    }
                  />
                  </div>
                )}
              </>
            )}

            {screenValue && screenValue === "editTemplate" && mydata && (
              <div className="splitbtnRecipients">
                <DropDownButton
                  splitButton={true}
                  stylingMode="text"
                  className="recipient-selection"
                  dataSource={mydata}
                  itemTemplate={(myitem) => {
                    const role = myitem.role === 1 ? "Signer" : "Viewer";
                    return `<div class="custom-item" title="${myitem.name}">
                          <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter'; overflow:hidden ; text-overflow:ellipsis;">
                            ${myitem.name}
                          </div>
                          <div class="recipient-role" style="color: #687787; font-size: 12px; font-weight: 500; font-family: 'Inter';">
                            ${role}
                          </div>
                          </div>`;
                  }}
                  text={`${mydata.length} Recipients`}
                />
              </div>
            )}

            {screenValue &&
              screenValue !== "BulkSigning" &&
              screenValue !== "editTemplate" && (
                <>
                  {signerOptions.length != 1 ? (
                    <div className="splitbtnRecipients">
                      <DropDownButton
                        splitButton={true}
                        stylingMode="text"
                        className="recipient-selection"
                        dataSource={
                          signerOptions.length > 0 ? signerOptions : signOpt
                        }
                        itemTemplate={(item) => {
                          const role = item.role === 1 ? "Signer" : "Viewer";

                          return `<div class="custom-item" title="${item.name}">
                    <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter'; overflow:hidden ; text-overflow:ellipsis;">
                      ${item.name}
                    </div>
                    <div class="recipient-role" style="color: #687787; font-size: 12px; font-weight: 500; font-family: 'Inter';">
                      ${role}
                    </div>
                  </div>`;
                        }}
                        text={signerOptions.length + " Recipients"}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="single-document-sign">1 Recipient</div>
                    </>
                  )}
                </>
              )}
          </div>
          <div className="second-inner-section">
          </div>
        </div>
      </div>
      <div className="bottomSpace"></div>
    </>
  );
}

export default DetailPanel;
