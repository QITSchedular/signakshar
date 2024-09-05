//PopupMain proper
import React, { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import Button from "devextreme-react/button";
import "./PopupMain.scss";
import { useNavigate } from "react-router-dom";
import { Calendar, DateBox, TextBox } from "devextreme-react";
import SignatureContentMain from "../manageUser/signatureSetup/SignatureContentMain";
import documentSentGif from "../../assets/success.gif";
import closeBtn from "../../icons/close-line.svg";
import { toastDisplayer } from "../toastDisplay/toastDisplayer";

function PopupMain({
  mainTitle,
  subTitle,
  mainBtnText,
  visible,
  onClose,
  onNavigate,
  source,
  popupWidth,
  setSignString,
  signString,
  mainTabItemValue,
  setSignImage,
  signImage,
  setApplySignatureData,
  applySignatureData,
  setSignatureCanvas,
  signatureCanvas,
  handleSignatureDone,
  setApplyInitialsData,
  applyInitialsData,
  handleInitialsDone,
  loggedInUserDetail,
  setInitialsCanvas,
  initialsCanvas,
  setApplyCompanyStampData,
  applyCompanyStampData,
  handleCompanyStampDone,
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
  scheduleDateState,
  selectedTime,
  setSelectedTime
}) {
  const navigate = useNavigate();
  const [navigationPath, setNavigationPath] = useState("");
  const timeLabel = { "aria-label": "Time" };
  const now = new Date();
  const dateBoxLabel = { "aria-label": "Date" };

  const [selectedDate1, setSelectedDate1] = useState("");
  // const [selectedTime, setSelectedTime] = useState(null);
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };



  const [selectedDate, setSelectedDate] = useState(scheduleDateState);


  const handleNavigate = () => {
    // onNavigate(selectedDate1, selectedTime);
    if (selectedDate === new Date().toLocaleDateString()) {
      onNavigate(selectedDate, selectedTime);
      // onClose();
    } else {
      onNavigate(selectedDate1, selectedTime);
      // onClose();
    }
  };

  const handleDateChange = (e) => {
    const date = new Date(e.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    setSelectedDate(e.value);
    setSelectedDate1(formattedDate);
    // setCurrentDate()
  };

  const handleTimeChange = (e) => {
    const date = new Date(e.value);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    setSelectedTime(formattedTime);
  };

  const handleTimeInput = (e) => {
    const time24HourRegex = /^([1-9]|1[0-2]):[0-5][0-9] [APM]{2}$/;

    if (time24HourRegex.test(e.event.target.value)) {
      setSelectedTime(e.event.target.value);  // Update state if the input is valid
    } else {
      console.log("Invalid time format");
    }
  };

  const renderMiddleSection = () => {
    if (source === "send") {
      // return <div className="middle-send">Document Sentsss</div>;
      return (
        <div className="middle-send">
          <img
            src={documentSentGif}
            height="120%"
            alt="Document Sent"
            className="document-sent-gif"
          />
        </div>
      );
    } else if (source === "schedulesend") {
      return (
        <div className="middle-schedule-send">
          <Calendar
            className="schedule-send-calender"
            onValueChanged={(e) => {
              handleDateChange(e);
            }}
            value={selectedDate}
            min={new Date()}
          />
          <div className="schedule-popup-userbox">
            <div className="date-inputs">
              <div className="user-text-calender">
                Date <span className="required-field">*</span>
              </div>
              {console.log("scheduleDateState:", scheduleDateState)}
              <DateBox
                // value={selectedDate}
                acceptCustomValue={false}
                onValueChanged={handleDateChange}
                inputAttr={dateBoxLabel}
                displayFormat="dd/MM/yyyy"
                stylingMode="outlined"
                className="input-user-data-calender"
                min={new Date()}
                placeholder="31/08/2024"
              />
              <div className="user-text-calender">
                Time <span className="required-field-schedule">*</span>
              </div>
              <DateBox
                
                onInput={handleTimeInput}
                onValueChanged={handleTimeChange}
                inputAttr={timeLabel}
                type="time"
                // min={now}
                // acceptCustomValue={false}
                stylingMode="outlined"
                className="input-user-data-calender"
                placeholder="3:05 AM"
              />
            </div>
          </div>
        </div>
      );
    } else if (source == "editpen") {
      return (
        <>
          <SignatureContentMain
            signSource="signPopup"
            setSignString={setSignString}
            signString={signString}
            onClose={onClose}
            mainTabItemValue={mainTabItemValue}
            setSignImage={setSignImage}
            signImage={signImage}
            setApplySignatureData={setApplySignatureData}
            applySignatureData={applySignatureData}
            setSignatureCanvas={setSignatureCanvas}
            signatureCanvas={signatureCanvas}
            handleSignatureDone={handleSignatureDone}
            setApplyInitialsData={setApplyInitialsData}
            applyInitialsData={applyInitialsData}
            handleInitialsDone={handleInitialsDone}
            setInitialsCanvas={setInitialsCanvas}
            initialsCanvas={initialsCanvas}
            loggedInUserDetail={loggedInUserDetail}
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
        </>
      );
    } else {
      return null;
    }
  };

  const renderPopupBody = () => {
    if (source === "editpen") {
      return null;
    }

    return (
      <div className="popup-custom-body">
        <div className="popup-button-container">
          <Button className="my-btn-cancel" text="Cancel" onClick={onClose} />
          <Button
            className="my-btn-continue"
            text={mainBtnText}
            onClick={handleNavigate}
          />
        </div>
      </div>
    );
  };

  return (
    <Popup
      visible={visible}
      showTitle={false}
      width={popupWidth}
      height="auto"
      className="abc"
      hideOnOutsideClick={false}
      onHiding={onClose}
    >
      <div className="popup-content">
        <div className="popup-custom-header">
          <div className="popup-headings">
            <div className="popup-head1">{mainTitle}</div>
            <div className="popup-head2">{subTitle}</div>
          </div>
          <Button icon={closeBtn} onClick={onClose} />
        </div>
        {renderMiddleSection()}
        {renderPopupBody()}
      </div>
    </Popup>
  );
}

export default PopupMain;
