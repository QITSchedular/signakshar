import React, { useState, useEffect, useMemo } from "react";
import "./SidebarMainLeft.scss";
import { Button, DropDownButton } from "devextreme-react";
import { ReactComponent as DragDropIcon } from "../../../../icons/draggable-icon.svg";
import editPenIcon from "../../../../icons/edit-pen-icon.svg";
import radioIcon from "../../../../icons/radio-button-line.svg";
import { useDragDropContext } from "../../../../contexts/CustomDragDropContext";
import PopupMain from "../../../customPopup/PopupMain";
import { fetchUserDetails } from "../../../../api/UserDashboardAPI";
import { useAuth } from "../../../../contexts/auth";
import { Tooltip } from "devextreme-react";
import ReactDOMServer from "react-dom/server";

function SidebarMainLeft({
  fields,
  allrecipients,
  onFieldActivation,
  onSelectedSignerChange,
  sidebarLeftSorce,
  loggedInUserDetail,
  setApplySignatureData,
  applySignatureData,
  setSignatureCanvas,
  signatureCanvas,
  handleSignatureDone,
  editPenSignPopupVisible,
  setPopupSignVisible,
  popupSignVisible,
  setInitialsCanvas,
  initialsCanvas,
  setApplyInitialsData,
  applyInitialsData,
  handleInitialsDone,
  setApplyCompanyStampData,
  applyCompanyStampData,
  handleCompanyStampDone,
  recipientPanelColor,
  setSelectedSignatureSubTabIndex,
  selectedSignatureSubTabIndex,
  setApplySignatureTextData,
  applySignatureTextData,
  setApplySignatureDrawingData,
  applySignatureDrawingData,
  setApplySignatureImageData,
  applySignatureImageData,
  setSelectedInitialsSubTabIndex,
  selectedInitialsSubTabIndex,
  setApplyInitialsTextData,
  applyInitialsTextData,
  setApplyInitialsDrawingData,
  applyInitialsDrawingData,
  setApplyInitialsImageData,
  applyInitialsImageData,
  loggedinRecipientDetail,
}) {
  const { user,userDetailAuth } = useAuth();
  const [signerOptions, setSignerOptions] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState("");
  const [selectedSignerColor, setSelectedSignerColor] = useState();
  const [mydata, setMydata] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const { handleDragRecipient, handleDropRecipient } = useDragDropContext();
  const [popupTab, setPopupTab] = useState(0);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [selectedSignerForDragDrop, setSelectedSignerForDragDrop] =
    useState(null);
  const [signerColors, setSignerColors] = useState({});
  const [colors, setColors] = useState([
    "rgba(184, 122, 254, 0.05)",
    "rgba(10, 143, 237, 0.05)",
    "rgba(10, 237, 188, 0.05)",
    "rgba(56, 117, 148, 0.05)",
    "rgba(237, 10, 165, 0.05)",
    "rgba(127, 86, 208, 0.05)",
    "rgba(12, 98, 48, 0.05)",
    "rgba(194, 65, 12, 0.05)",
    "rgba(72, 89, 137, 0.05)",
    "rgba(5, 1, 12,0.05)",
  ]);

  const MyradioIcon=()=>{
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17Z"></path></svg>
  }

  useEffect(() => {
    if (allrecipients && allrecipients.length > 0) {
      const filteredSigners = allrecipients.filter(
        (recipient) => recipient.role === 1
      );
      setSignerOptions(filteredSigners);

      const updatedSignerColors = {};
      filteredSigners.forEach((signer, index) => {
        updatedSignerColors[signer.name] = colors[index % colors.length];
      });
      setSignerColors(updatedSignerColors);

      if (!filteredSigners.find((signer) => signer.name === selectedSigner)) {
        setSelectedSigner("");
      }
      if (filteredSigners.length > 0 && !selectedSigner) {
        const firstSigner = filteredSigners[0];
        setSelectedSigner(firstSigner.name);
        setSelectedRecipient({
          name: firstSigner.name,
          color: updatedSignerColors[firstSigner.name],
          role: firstSigner.role,
          email: firstSigner.email,
        });
        onSelectedSignerChange(firstSigner.name);
      }
    }
  }, [allrecipients, selectedSigner]);

  const items = signerOptions.map((recipient) => ({
    name: recipient.name,
    text: recipient.name,
    color: signerColors[recipient.name],
    role: recipient.role,
    email: recipient.email,
  }));

  const handleItemClick = (e) => {
    setSelectedSigner(e.itemData.name);
    setSelectedSignerColor(e.itemData.color);
    setSelectedRecipient({
      name: e.itemData.name,
      color: e.itemData.color,
      role: e.itemData.role,
      email: e.itemData.email,
    });
    onSelectedSignerChange(e.itemData.name);
    setSelectedSignerForDragDrop(e.itemData.email);
  };

  const handleEditPenClick = (fieldName) => {
    let tabValue;
    switch (fieldName) {
      case "Signature":
        tabValue = 1;
        break;
      case "Initials":
        tabValue = 2;
        break;
      case "Company Stamp":
        tabValue = 3;
        break;
      default:
        tabValue = null;
    }
    setPopupTab(tabValue);
    setPopupSignVisible(true);
  };

  const handleDragStart = (e, field) => {
    const recipient = selectedRecipient
      ? {
          fieldName: field.name,
          color: selectedRecipient.color,
          name: selectedRecipient.name,
          email: selectedRecipient.email,
        }
      : null;

    const newData = {
      fieldName: field.name,
      selectedSigner: recipient,
    };
    e.dataTransfer.setData("text/plain", JSON.stringify(mydata));
    setMydata([...mydata, newData]);
    handleDragRecipient(recipient);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const response = await fetchUserDetails(user);
        setLoggedInUserData(userDetailAuth);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {};
  }, []);

  return (
    <div className="inner-container-left-sidebar">
      {sidebarLeftSorce != "reciever-panel" ? (
        <div className="heading-indication">
          <div className="heading1">Select a signer</div>
          <div className="heading2">
            Number of signers -{" "}
            {allrecipients.filter((ar, i) => ar.role === 1).length}
          </div>
        </div>
      ) : (
        <div className="heading-indication">
          <div className="heading1">Sign the document</div>
          <div className="heading2">Click on field to add the signature</div>
        </div>
      )}

      <div className="signer-selection">
        <div className="heading-signers">
          Signers<span className="required-field">*</span>
        </div>

        {sidebarLeftSorce == "reciever-panel" ? (
          <div className="singleSigner">
            <i
              className="ri-radio-button-line"
              style={{
                color: recipientPanelColor.replace(0.3, 1),
                marginRight: 5,
                fontSize: "20px",
              }}
            ></i>
            <div className="single-signer-name">
              {loggedinRecipientDetail.name}
            </div>
          </div>
        ) : (
          <>
            {allrecipients.length <= 1 ? (
              <div className="singleSigner">
                <i
                  className="ri-radio-button-line"
                  style={{
                    color: "rgb(184, 122, 254)",
                    marginRight: 5,
                    fontSize: "20px",
                  }}
                ></i>
                <div className="single-signer-name">{selectedSigner}</div>
              </div>
            ) : (
              <div className="signerDropDownBox">
                <div id="dropdownWrapper">
                  <DropDownButton
                    splitButton={true}
                    stylingMode="text"
                    items={items}
                    itemRender={(x) => {
                      return (
                        <>
                          <div className="custom-item" title={x.name}
                            style={{
                              display:"flex",
                              alignItems:"center"
                            }}
                          >
                            <i
                              className="ri-radio-button-line"
                              style={{
                                color: x.color.replace(0.05, 1),
                                marginRight: 8,
                                fontSize: "20px"
                              }}
                            ></i>
                            <span
                              className="dropName"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                // whiteSpace: "nowrap",
                                display: "inline-block",
                              }}
                            >
                              {x.name}
                            </span>
                          </div>
                        </>
                      );
                      
                    }}
                    text={
                      selectedSigner ||
                      (items.length > 0 ? <>{items[0].name}</> : "")
                    }
                    onItemClick={handleItemClick}
                  />
               

                  <Tooltip
                    target="#dropdownWrapper"
                    showEvent="mouseenter"
                    hideEvent="mouseleave"
                    hideOnOutsideClick={false}
                  >
                    <span>
                      {selectedSigner ||
                        (items.length > 0 ? items[0].name : "")}
                    </span>
                  </Tooltip>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="drag-drop-title">
        Drag & Drop the sign for{" "}
        {sidebarLeftSorce == "reciever-panel" ? (
          <>{loggedinRecipientDetail.name || ""}</>
        ) : (
          <>{selectedSigner || (items.length > 0 ? items[0].name : "")}</>
        )}
      </div>

      <div className="draggable-fields-inner-container">
        <div display="flex" flexWrap="wrap" marginTop="10px">
          {fields.map((field, index) => (
            <div
              key={index}
              draggable={
                sidebarLeftSorce === "reciever-panel" ? "false" : "true"
              }
              onDragStart={(e) => {
                handleDragStart(e, field);
              }}
              onDragEnd={handleDropRecipient}
              className="draggable-fields"
              id={field.id}
              style={{
                // backgroundColor: selectedSignerColor,
                backgroundColor:
                  sidebarLeftSorce === "reciever-panel"
                    ? recipientPanelColor.replace(0.3, 0.05)
                    : selectedSignerColor,
              }}
            >
              {sidebarLeftSorce != "reciever-panel" ? (
                <div className="draggable-icon">
                  <DragDropIcon />
                </div>
              ) : (
                <></>
              )}

              <div className="field-text">{field.name}</div>
              {sidebarLeftSorce != "reciever-panel" ? (
                <>
                  {selectedRecipient &&
                    (selectedRecipient.email === loggedInUserData?.user.email ||
                      selectedRecipient.name === "You") &&
                    (field.id === 1 || field.id === 3 || field.id === 6) && (
                      <Button
                        icon={editPenIcon}
                        className="edit-pen"
                        onClick={(e) => {
                          handleEditPenClick(field.name);
                        }}
                      />
                    )}
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>

      <PopupMain
        // onClose={() => setPopupSignVisible(false)}
        onClose={() => setPopupSignVisible(!popupSignVisible)}
        visible={popupSignVisible}
        mainTitle="Edit your signature"
        subTitle="Customise it for specific document"
        mainBtnText="Apply Signature"
        source="editpen"
        popupWidth="700px"
        mainTabItemValue={popupTab}
        loggedInUserDetail={loggedInUserDetail}
        setApplySignatureData={setApplySignatureData}
        applySignatureData={applySignatureData}
        setSignatureCanvas={setSignatureCanvas}
        signatureCanvas={signatureCanvas}
        handleSignatureDone={handleSignatureDone}
        setInitialsCanvas={setInitialsCanvas}
        initialsCanvas={initialsCanvas}
        setApplyInitialsData={setApplyInitialsData}
        applyInitialsData={applyInitialsData}
        handleInitialsDone={handleInitialsDone}
        setApplyCompanyStampData={setApplyCompanyStampData}
        applyCompanyStampData={applyCompanyStampData}
        handleCompanyStampDone={handleCompanyStampDone}
        setSelectedSignatureSubTabIndex={setSelectedSignatureSubTabIndex}
        selectedSignatureSubTabIndex={selectedSignatureSubTabIndex}
        setApplySignatureTextData={setApplySignatureTextData}
        applySignatureTextData={applySignatureTextData}
        setApplySignatureDrawingData={setApplySignatureDrawingData}
        applySignatureDrawingData={applySignatureDrawingData}
        setApplySignatureImageData={setApplySignatureImageData}
        applySignatureImageData={applySignatureImageData}
        setSelectedInitialsSubTabIndex={setSelectedInitialsSubTabIndex}
        selectedInitialsSubTabIndex={selectedInitialsSubTabIndex}
        setApplyInitialsTextData={setApplyInitialsTextData}
        applyInitialsTextData={applyInitialsTextData}
        setApplyInitialsDrawingData={setApplyInitialsDrawingData}
        applyInitialsDrawingData={applyInitialsDrawingData}
        setApplyInitialsImageData={setApplyInitialsImageData}
        applyInitialsImageData={applyInitialsImageData}
      />
    </div>
  );
}

export default SidebarMainLeft;
