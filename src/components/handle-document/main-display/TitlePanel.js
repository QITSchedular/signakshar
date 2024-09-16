import React, { useState, useEffect } from "react";
import "./TitlePanel.scss";
import SplitButtonSign from "./SplitButtonSign";
import { Button } from "devextreme-react";
import { useAuth } from "../../../contexts/auth";
import axios from "axios";
import {
  generateSignedPdf,
  generateBucketName,
  generateBulkSignedPdf,
} from "../../manageUser/signatureSetup/PdfUtils";
import {
  fetchUserDetails,
  generatePresignedUrl,
} from "../../../api/UserDashboardAPI";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";

function TitlePanel({
  tid,
  did,
  title,
  selectedFile,
  creatorid,
  signerOptions,
  updateRecData,
  previewScreenValue,
  tempYEs,
  signStatus,
  screenValue,
  templateDraggedData,
  emailAction,
  Expiration,
  statusSoure,
  docapiData,
  downloadDraggedData,
  senderData,
  multipleImageDetails,
  multipleSelectedImage,editRecData,
  updatedEditRecipients,setUpdatedEditRecipients,selectedRowDataTemp,isSigned
}) {
  const { user,userDetailAuth } = useAuth();
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);

  const [splitDocName, setsplitDocName] = useState();
  useEffect(() => {
    if (screenValue !== "Template" && title) {
      const splitName = title.split("_");
      const displayName = splitName.slice(0, -1).join("_");
      setsplitDocName(displayName);
    }
  }, [title]);

  useEffect(() => {
    if (user) {
      const getLoggedInUser = async () => {
        try {
          // const userDetails = await fetchUserDetails(user);
          setLoggedInUserdetail(userDetailAuth);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      getLoggedInUser();
    }
  }, []);

  const downloadFromAws = async () => {
    try {
      const bucketName = generateBucketName(
        senderData.user.id,
        senderData.user.email
      );
      const fileName = title + ".pdf";
      const data = await generatePresignedUrl(bucketName, fileName);
      if (data.success) {
        const link = document.createElement("a");
        link.href = data.url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error generating pre-signed URL:", data.error);
      }
    } catch (error) {
      console.error("Error fetching pre-signed URL:", error);
    }
  };

  const renderButtons = () => {
    switch (statusSoure) {
      case "Completed":
        return (
          <Button
            width={150}
            className="btn-statusCompleted"
            text="Download"
            onClick={downloadFromAws}
          />
        );
      case "Lapsed":
        return (
          <Button width={150} className="btn-statusLapsed" text="Delete" />
        );
      case "Pending":
        return (
          // <Button width={150} className="btn-statusCompleted" text="Save" />
          <></>
        );
      case "Draft":
        return (
          <Button width={150} className="btn-statusCompleted" text="Send" />
        );
      default:
        if (signerOptions && signerOptions.length == 1) {
          if (
            loggedInUserDetail &&
            loggedInUserDetail.user &&
            loggedInUserDetail.user.email
          ) {
            if (signerOptions[0].email == loggedInUserDetail.user.email) {
              return (
                <>
                  <Button
                    width={150}
                    className="btn-statusCompleted"
                    text="Download"
                    onClick={() => {
                      if(downloadDraggedData){
                        
                        generateSignedPdf(selectedFile, downloadDraggedData,splitDocName);
                      }else{
                        toastDisplayer("error","Make sure you've applied the signature!");
                      }
                        
                    }}
                  />
                </>
              );
            } else {
              return (
                <SplitButtonSign
                  tempYEs={tempYEs}
                  creatorid={creatorid}
                  did={did}
                  previewScreenValue={previewScreenValue}
                  signerOptions={signerOptions}
                  selectedFile={selectedFile}
                  className="split-btn"
                  tid={tid}
                  screenValue={screenValue}
                  templateDraggedData={templateDraggedData}
                  updateRecData={updateRecData}
                  emailAction={emailAction}
                  Expiration={Expiration}
                  docapiData={docapiData}
                  downloadDraggedData={downloadDraggedData}
                  loggedInUserDetail={loggedInUserDetail}
                  isSigned={isSigned}
                />
              );
            }
          }
        } else {
          if (screenValue === "BulkSigning") {
            return (
              <>
                <Button
                  width={150}
                  className="btn-statusCompleted"
                  text="Download"
                  onClick={() => {
                    generateBulkSignedPdf(
                      multipleSelectedImage,
                      downloadDraggedData,
                      title
                    );
                  }}
                />
              </>
            );
          } else {
            return (
              <SplitButtonSign
                tempYEs={tempYEs}
                creatorid={creatorid}
                did={did}
                previewScreenValue={previewScreenValue}
                signerOptions={signerOptions}
                selectedFile={selectedFile}
                className="split-btn"
                tid={tid}
                screenValue={screenValue}
                templateDraggedData={templateDraggedData}
                updateRecData={updateRecData}
                emailAction={emailAction}
                Expiration={Expiration}
                docapiData={docapiData}
                downloadDraggedData={downloadDraggedData}
                loggedInUserDetail={loggedInUserDetail}
                updatedEditRecipients={updatedEditRecipients}
                editRecData={editRecData}
                selectedRowDataTemp={selectedRowDataTemp}
                isSigned={isSigned}
              />
            );
          }
        }
    }
  };

  return (
    <>
      {screenValue === "BulkSigning" ? (
        <>
          <div className="main-title-panel">
            <div className="panel-title" title={title}><div className="titleName">{title}</div></div>
            {renderButtons()}
          </div>
        </>
      ) : (
        <div className="main-title-panel">
          {statusSoure != null ? (
            <div class="statusDetails">
              <div class="statusBtn" statustype={statusSoure}>
                <div class="statusCircle" statustype={statusSoure}></div>
                <div class="statusText" statustype={statusSoure}>
                  {statusSoure}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {screenValue === "Template" || screenValue==="editTemplate" ? (
            <div className="panel-title" title={title}><div className="titleName">{title}</div></div>
          ) : (
            <div className="panel-title" title={splitDocName}><div className="titleName">{splitDocName}</div></div>
          )}
          {renderButtons()}
        </div>
      )}
    </>
  );
}

export default TitlePanel;
