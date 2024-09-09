import React, { useState, useEffect } from "react";
import { Button, DropDownButton, Popup } from "devextreme-react";

import "./SplitButtonSign.scss";
import { useNavigate } from "react-router-dom";
import PopupMain from "../../customPopup/PopupMain";
import axios from "axios";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useAuth } from "../../../contexts/auth";
import {
  generateBucketName,
  generateSignedPdfonAws,
} from "../../manageUser/signatureSetup/PdfUtils";
import { LoadPanel } from "devextreme-react";
import {
  deleteDocument,
  deleteTemplate,
  fetchUserDetails,
  saveDocPositions,
  saveTemplateDraggedData,
  updateRecStatus,
  updateTemplatePositions,
  uploadFileToS3,
  uploadTemplateFileToS3,
} from "../../../api/UserDashboardAPI";

function SplitButtonSign({
  tid,
  did,
  tempYEs,
  selectedFile,
  screenValue,
  updateRecData,
  previewScreenValue,
  signerOptions,
  creatorid,
  templateDraggedData,
  emailAction,
  Expiration,
  docapiData,
  downloadDraggedData,
  selectedRowDataTemp,
  loggedInUserDetail,
  editRecData,
  updatedEditRecipients,
  isSigned,
}) {
  const { user, userDetailAuth } = useAuth();
  const [userObj, setuserObj] = useState([]);
  const [popupVisibleSend, setPopupVisibleSend] = useState(false);
  const [popupVisibleSchedule, setPopupVisibleSchedule] = useState(false);
  const [popupVisibleTemplate, setPopupVisibleTemplate] = useState(false);
  const [popupVisibleDocument, setPopupVisibleDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDocSendOnce, setIsDocSendOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchuserData = async () => {
      try {
        // const response = await fetchUserDetails(user);
        setuserObj(userDetailAuth);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchuserData();
  }, [user]);
  const mergeDateAndTime = (dateString, timeString) => {
    var formattedDateTime;
    if (dateString === new Date().toLocaleDateString()) {
      const [month, day, year] = dateString.split("/"); // Adjust parsing for MM/DD/YYYY format
      const [hours, minutes] = timeString.split(":");
      // Create a new Date object by parsing the components
      const mergedDate = new Date(
        parseInt(year, 10), // Year
        parseInt(month, 10) - 1, // Month (0-based index)
        parseInt(day, 10), // Day
        parseInt(hours, 10), // Hours
        parseInt(minutes, 10) // Minutes
      );
      formattedDateTime = mergedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      const [day, month, year] = dateString.split("/");
      const [hours, minutes] = timeString.split(":");
      const mergedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
      formattedDateTime = mergedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return formattedDateTime;
  };

  const updateStatus = async (docId, email, newStatus) => {
    try {
      const data = await updateRecStatus(docId, email, newStatus);
      return data;
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [recEmailForStatus, setRecEmailForStatus] = useState("");
  const [triggerStatusUpdate, setTriggerStatusUpdate] = useState(false);
  const [scheduleDateState, setscheduleDateState] = useState(
    new Date().toLocaleDateString()
  );

  const handleSendButtonClick = async (scheduleTime, scheduleDate) => {
    setIsLoading(true);
    if (isDocSendOnce == true) {
      setIsLoading(false);
      toastDisplayer("error", "Document is already sent");
      return;
    } else {
      if (downloadDraggedData != null) {
        var matchedData;
        var allFieldsSigned = false,
          someFieldsSigned = false;

        const missingEmails = templateDraggedData
          .filter((tdata) => tdata.roleId === 1)
          .filter(
            (tdata) =>
              !downloadDraggedData.some((ddata) => ddata.email === tdata.email)
          );

        if (missingEmails.length > 0) {
          setIsLoading(false);
          toastDisplayer(
            "error",
            `No matching position found for ${missingEmails[0].name}`
          );
          return;
        }

        if (screenValue === "Document" && tempYEs === "no") {
          matchedData = downloadDraggedData.filter(
            (item) => item.email === loggedInUserDetail.user.email
          );
          if (matchedData && matchedData.length > 0) {
            allFieldsSigned = matchedData.every((item) => item.signatureData);
            someFieldsSigned = matchedData.some((item) => item.signatureData);
            setRecEmailForStatus(loggedInUserDetail.user.email);
          }
        } else if (screenValue === "Document" && tempYEs === "yes") {
          templateDraggedData.forEach((tdata) => {
            if (tdata.emailId === loggedInUserDetail.user.email) {
              matchedData = downloadDraggedData.filter(
                (item) => item.templateRec === tdata.id
              );
              if (matchedData && matchedData.length > 0) {
                allFieldsSigned = matchedData.every(
                  (item) => item.signatureData
                );
                someFieldsSigned = matchedData.some(
                  (item) => item.signatureData
                );
                setRecEmailForStatus(loggedInUserDetail.user.email);
              }
            }
          });
        } else {
          console.error("Incorrect screen value");
        }
        if (someFieldsSigned && !allFieldsSigned) {
          setIsLoading(false);
          toastDisplayer(
            "error",
            "Please ensure that data is applied to all fields; otherwise, leave all fields blank."
          );
        } else {
          var Schedule = false;
          if (scheduleTime && scheduleDate) {
            Schedule = true;
          }

          var scheduleDateAndTime = "";
          if (scheduleTime && scheduleDate) {
            scheduleDateAndTime = mergeDateAndTime(scheduleDate, scheduleTime);
          }
          var payloadArray = [];
          await Promise.all(
            updateRecData.map(async (oneRec, index) => {
              var docRecipients;
              if (
                screenValue &&
                screenValue === "Document" &&
                tempYEs === "yes"
              ) {
                docRecipients = templateDraggedData.find(
                  (recipient) => recipient.fullName === oneRec.name
                );
              } else {
                docRecipients = templateDraggedData.find(
                  (recipient) => recipient.name === oneRec.name
                );
              }

              if (docRecipients) {
                const apiObj = {
                  fieldName: oneRec.fieldName,
                  color: oneRec.color,
                  boxId: oneRec.id,
                  pageNum: oneRec.pageNum,
                  x: oneRec.x,
                  y: oneRec.y,
                  width: oneRec.width,
                  height: oneRec.height,
                  docId: did,
                  signer_status:
                    docRecipients.roleId == 1 ? "Unsigned" : "null",
                  reviewer_status:
                    docRecipients.roleId == 2 ? "Approved" : "null",
                  docRecipientdetails_id:
                    screenValue === "Document" && tempYEs === "yes"
                      ? oneRec.signerId
                      : docRecipients.id,
                  emailAction: emailAction,
                };
                payloadArray.push(apiObj);
              } else {
                setIsLoading(false);
                console.error("Recipients length issue");
              }
            })
          );

          const newPayload = {
            docId: did,
            s_send: false,
            recipient_data: payloadArray,
            Expiration: Expiration,
            Schedule: Schedule,
            scheduleDateAndTime: scheduleDateAndTime,
            // scheduleDateState: scheduleDateState ,
            last_modified_by_id: loggedInUserDetail.user.id,
            user_id: userObj.user.id,
            isSigned: {
              email: loggedInUserDetail.user.email,
              isSignedStatus: isSigned,
            },
          };
          try {
            setLoading(true);
            const response = await saveDocPositions(newPayload);
            if (response && !response.error && userObj && docapiData) {
              const draggedArray = [];
              const positionsByPage = {};

              downloadDraggedData.forEach((item) => {
                const { pageNum, x, y } = item;
                if (!positionsByPage[pageNum]) {
                  setLoading(false);
                  positionsByPage[pageNum] = [];
                }
                positionsByPage[pageNum].push({ x, y });
                if (item.signatureData) {
                  draggedArray.push(item.signatureData);
                }
              });
              // uncomment this:
              generateSignedPdfonAws(
                selectedFile,

                draggedArray,

                userObj,
                docapiData
              );
              setIsDocSendOnce(true);
              setPopupVisibleSend(true);
            } else {
              setLoading(false);
              return toastDisplayer("error", "Error sending the document.");
            }
          } catch (error) {
            setLoading(false);
            return toastDisplayer("error", error.message || "Network error");
          } finally {
            setIsLoading(false);
          }

          if (allFieldsSigned == true) {
            setTriggerStatusUpdate(true);
          } else {
            console.log("No status update");
          }
        }
      } else {
        setPopupVisibleDocument(true);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (triggerStatusUpdate && recEmailForStatus) {
      const updateDocStatus = async () => {
        await updateStatus(did, recEmailForStatus, "approved");
      };

      updateDocStatus();
      setTriggerStatusUpdate(false);
    }
  }, [triggerStatusUpdate, recEmailForStatus]);

  useEffect(() => {
    if (
      screenValue &&
      (screenValue === "Template" || screenValue === "editTemplate")
    ) {
      return;
    }
    const handleDocSent = async (documentId) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/email-list/${documentId}/${loggedInUserDetail?.user?.email}/`
        );

        if (response.data.length === 0) {
          setIsDocSendOnce(false);

          return;
        } else {
          setIsDocSendOnce(true);
        }

        return response.data;
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching document sending data:", error);

        throw error;
      }
    };

    handleDocSent(did);
  }, [did, screenValue]);

  const handleScheduleButtonClick = () => {
    setPopupVisibleSchedule(true);
  };

  const saveTemplateBtn = async () => {
    try {
      setIsLoading(true);
      if (updateRecData.length !== 0) {
        for (let templateRecipient of templateDraggedData) {
          const oneRec = updateRecData.find(
            (rec) => rec.name === templateRecipient.name
          );
          if (!oneRec && templateRecipient.role == 1) {
            setIsLoading(false);
            toastDisplayer(
              "error",
              `No matching position found for ${templateRecipient.name}`
            );
            return; // Exit the function if no matching recipient is found
          }
        }

        const promises = updateRecData.map((oneRec) => {
          const templateRecipient = templateDraggedData.find(
            (recipient) => recipient.name === oneRec.name
          );

          if (templateRecipient) {
            const apiObj = {
              templateRec: templateRecipient.id,
              template: tid,
              fieldName: oneRec.fieldName,
              color: oneRec.color,
              recBoxid: oneRec.id,
              pageNum: oneRec.pageNum,
              width: oneRec.width,
              height: oneRec.height,
              created_by: templateRecipient.created_by,
              role: templateRecipient.role,
              user_id: loggedInUserDetail?.user?.id,
            };

            return Object.keys(oneRec.pagePositions).flatMap((pageNum) =>
              oneRec.pagePositions[pageNum].map((position) => {
                const { x, y } = position;
                const apiCallObj = { ...apiObj, x, y };
                return saveTemplateDraggedData(apiCallObj);
              })
            );
          } else {
            console.error(`Template Recipient not found for ${oneRec.name}`);
          }
        });
        setLoading(true);
        await Promise.all(promises.flat());
        const resp = await uploadTemplateFileToS3(selectedFile, userObj, tid);
        setLoading(false);
        if (resp.success) {
          toastDisplayer("success", "Template saved successfully!!");
        } else {
          toastDisplayer("error", "Failed to create template");
        }

        updateRecData.length = 0;
        navigate("/userdashboard", { state: { tabIndex: 1 } });
      } else {
        setPopupVisibleTemplate(true);
      }
    } catch (error) {
      console.error("Error saving template data:", error);
      toastDisplayer("error", "An error occurred while saving the template.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleYesClick = async () => {
    try {
      await deleteTemplate(tid, user, userObj.user.id);
      // navigate("/userdashboard");
      navigate("/userdashboard", { state: { tabIndex: 1 } });
    } catch (error) {
      console.error("Error deleting template:", error);
      toastDisplayer("error", "An error occurred while deleting the template.");
    }
    setPopupVisibleTemplate(false);
  };

  const handleNoClick = () => {
    setPopupVisibleTemplate(false);
  };

  const handleYesClickDoc = async () => {
    try {
      await deleteDocument(did, userObj?.user?.id);
      navigate("/userdashboard");
    } catch (error) {
      console.error("Error deleting document:", error);
      toastDisplayer("error", "An error occurred while deleting the document.");
    }
    setPopupVisibleDocument(false);
  };
  const handleNoClickDoc = () => {
    setIsLoading(false);
    setPopupVisibleDocument(false);
  };

  const handleScheduleSend = (sdate, stime) => {
    if (selectedTime) {
      handleSendButtonClick(stime, sdate);
      setPopupVisibleSchedule(false);
    } else {
      toastDisplayer("error", "Time Formate is Invalid");
      console.log("Invalid time or time not set.");
      // setPopupVisibleSchedule(true);
    }
  };

  const editTemplateBtn = async () => {
    if (
      (updatedEditRecipients && updatedEditRecipients.length !== 0) ||
      (updateRecData && updateRecData.length !== 0)
    ) {
      updatedEditRecipients.map(async (updRec) => {
        try {
          const user_id = loggedInUserDetail?.user?.id;
          const updRecUid = { ...updRec, user_id };
          setLoading(true);
          const response = await updateTemplatePositions(updRecUid);
          setLoading(false);
          if (response.ok) {
            const data = await response.json();
          } else {
            console.error("Update failed", response.status);
          }
        } catch (error) {
          console.error("Error updating template dragged data:", error);
        }
      });
      const selectedRowDataTempRec = selectedRowDataTemp?.recData;
      if (updateRecData && updateRecData.length !== 0) {
        const promises = [];
        updateRecData.forEach((oneRec) => {
          const templateRecipient = selectedRowDataTempRec.find(
            (recipient) => recipient.name === oneRec.name
          );
          if (templateRecipient) {
            const apiObj = {
              templateRec: templateRecipient.id,
              template: tid,
              fieldName: oneRec.fieldName,
              color: oneRec.color,
              recBoxid: oneRec.id,
              pageNum: oneRec.pageNum,
              width: oneRec.width,
              height: oneRec.height,
              created_by: templateRecipient.created_by,
              role: templateRecipient.role,
              user_id: loggedInUserDetail?.user?.id,
            };
            Object.keys(oneRec.pagePositions).forEach((pageNum) => {
              oneRec.pagePositions[pageNum].forEach((position) => {
                const { x, y } = position;
                const apiCallObj = { ...apiObj, x, y };
                setLoading(true);
                promises.push(saveTemplateDraggedData(apiCallObj));
                setLoading(false);
              });
            });
          } else {
            console.error(`Template Recipient not found for ${oneRec.name}`);
          }
        });

        await Promise.all(promises);
        updateRecData.length = 0;
      }
      // navigate("/userdashboard");
      navigate("/userdashboard", { state: { tabIndex: 1 } });
      toastDisplayer("success", "Template updated successfully!!");
    } else {
      toastDisplayer("error", "No positions Found, Can't Update");
      // setPopupVisibleTemplate(true);
    }
  };

  return (
    <>
      {loading ? <LoadPanel visible="true" /> : ""}
      {screenValue &&
        (screenValue === "Template" || screenValue === "editTemplate") && (
          // style={{ position: "relative" }}
          <div className="splitBtnInMainPage">
            <Button
              stylingMode="contained"
              text={
                isLoading
                  ? "" // Show empty text when loading
                  : screenValue === "Template" // Determine the button text based on screenValue
                  ? "Save Template"
                  : "Edit Template"
              }
              className="templateBtn"
              onClick={
                screenValue === "Template" ? saveTemplateBtn : editTemplateBtn
              }
              // disabled={isLoading}
            >
              {isLoading && (
                <div className="loader-container">
                  {/* Using react-spinners or your custom loader */}
                  {/* <ClipLoader color="#fff" size={24} /> */}
                  <div className="simple-loader"></div>
                </div>
              )}
            </Button>
          </div>
        )}

      {screenValue && screenValue === "Document" && tempYEs === "no" && (
        <div className="splitBtnInMainPage" style={{ position: "relative" }}>
          <DropDownButton
            splitButton={true}
            stylingMode="text"
            items={[
              {
                text: isLoading ? "" : "Send",
                onClick: handleSendButtonClick,
              },
              {
                text: isLoading ? "" : "Schedule Send",
                onClick: handleScheduleButtonClick,
              },
            ]}
            text={isLoading ? "" : "Send"}
            onButtonClick={() => {
              handleSendButtonClick();
            }}
            // disabled={isLoading}
            className="loading-button-container"
          >
            {/* Move loader here to overlay correctly */}
            {isLoading && (
              <div className="loader-containerSend">
                {/* <ClipLoader color="#fff" size={24} /> */}
                <div className="simple-loader"></div>
              </div>
            )}
          </DropDownButton>

          <PopupMain
            onClose={() => setPopupVisibleSend(false)}
            visible={popupVisibleSend}
            mainTitle="Document Sent Successfully"
            subTitle="It has been sent to recipients"
            mainBtnText="Back to home page"
            onNavigate={() => navigate("/userdashboard")}
            source="send"
            popupWidth="480px"
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />

          <PopupMain
            onClose={() => setPopupVisibleSchedule(false)}
            visible={popupVisibleSchedule}
            mainTitle="Pick Date & Time"
            subTitle="Set time and date for automatic sending"
            mainBtnText="Schedule Send"
            onNavigate={handleScheduleSend}
            source="schedulesend"
            popupWidth="50%"
            scheduleDateState={scheduleDateState}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
      )}

      {screenValue && screenValue === "Document" && tempYEs === "yes" && (
        <div className="splitBtnInMainPage">
          <DropDownButton
            splitButton={true}
            stylingMode="text"
            items={[
              { text: "Send", onClick: handleSendButtonClick },
              { text: "Schedule Send", onClick: handleScheduleButtonClick },
            ]}
            text="Send"
            onButtonClick={() => {
              handleSendButtonClick();
            }}
          />

          <PopupMain
            onClose={() => setPopupVisibleSend(false)}
            visible={popupVisibleSend}
            mainTitle="Document Sent Successfully"
            subTitle="It has been sent to recipients"
            mainBtnText="Back to home page"
            onNavigate={() => navigate("/userdashboard")}
            source="send"
            popupWidth="480px"
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />

          <PopupMain
            onClose={() => setPopupVisibleSchedule(false)}
            visible={popupVisibleSchedule}
            mainTitle="Pick Date & Time"
            subTitle="Set time and date for automatic sending"
            mainBtnText="Schedule Send"
            onNavigate={handleScheduleSend}
            source="schedulesend"
            popupWidth="50%"
            scheduleDateState={scheduleDateState}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
      )}

      <Popup
        visible={popupVisibleTemplate}
        onHiding={handleNoClick}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showCloseButton={true}
        showTitle={false}
        width={420}
        height={"auto"}
      >
        <div className="popup-content">
          <div className="popup-custom-header">
            <div className="popup-headings">
              <div className="popup-head1">
                No positions are assigned to this template.
              </div>
              <div className="popup-head2">
                If you proceed, the template won't be saved. <p>Continue?</p>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <Button
              stylingMode="outlined"
              className="btnNo"
              text="No"
              onClick={handleNoClick}
            />
            <Button className="btnYes" text="Yes" onClick={handleYesClick} />
          </div>
        </div>
      </Popup>

      <Popup
        visible={popupVisibleDocument}
        onHiding={handleNoClickDoc}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showTitle={false}
        showCloseButton={true}
        width={450}
        height={"auto"}
      >
        <div className="popup-content">
          <div className="popup-custom-header">
            <div className="popup-headings">
              <div className="popup-head1">
                No positions are assigned to this Document.
              </div>
              <div className="popup-head2">
                If you proceed, the document won't be send to recipients.{" "}
                <p>Continue?</p>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <Button
              stylingMode="outlined"
              className="btnNo"
              text="No"
              onClick={handleNoClickDoc}
            />
            <Button className="btnYes" text="Yes" onClick={handleYesClickDoc} />
          </div>
        </div>
      </Popup>
    </>
  );
}

export default SplitButtonSign;
