import React, { useEffect, useState } from "react";
import MyHeader from "../../handle-document/main-display/MyHeader";
import TitlePanel from "../../handle-document/main-display/TitlePanel";
import DocumentMain from "../../handle-document/main-display/DocumentMain";
import { useLocation, useNavigate } from "react-router-dom";
import { DropDownButton } from "devextreme-react";
import { useAuth } from "../../../contexts/auth";
import {
  fetchUserDetails,
  fetchPdfFile,
  fetchDocumentData,
  fetchSenderData,
  fetchDocumentRecipientStatus,
  fetchUseDocRec,
  fetchDocumentDraggedData,
  fetchRecipientSignStatusData,
  fetchRecipientDetailData,
} from "../../../api/UserDashboardAPI";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";

function ViewDocument() {
  const location = useLocation();
  const { docData } = location.docData || {}; // Access passed state
  const [signerOptions, setsignerOptions] = useState([]);
  const [draggedData, setDraggedData] = useState([]);
  const [fullDocumentData, setFullDocumentData] = useState([]);
  const [recieverfile, setRecieverFile] = useState(null);
  const [senderData, setSenderData] = useState([]);
  const documentData = location.state.docData;
  const { user ,userDetailAuth} = useAuth();
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);
  const [mySignStatus, setMySignStatus] = useState("done");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");

    if (jwtToken) {
      // fetchUserDetails(jwtToken)
      //   .then((data) => setLoggedInUserdetail(data))
      //   .catch((error) =>
      //     console.error("Error fetching logged-in user:", error)
      //   );
      setLoggedInUserdetail(userDetailAuth);
    }
  }, []);

  useEffect(() => {
    if (documentData.id) {
      fetchDocumentData(documentData.id)
        .then((data) => {
          setFullDocumentData(data);
          return fetchSenderData(data.creator_id);
        })
        .then((senderData) => {
          setSenderData(senderData);
          return fetchPdfFile(senderData, documentData);
        })
        .then((pdfFile) => setRecieverFile(pdfFile))
        .catch((error) => {
          toastDisplayer("error", "Failed to fetch document data");
          navigate("/userdashboard");
        });

      fetchUseDocRec(documentData.id, localStorage.getItem("jwt"))
        .then((data) => {
          const processedData = data.map((item) => ({
            id: item.id,
            name: item.name,
            role: item.roleId,
            color: "#ffb6c1",
            email: item.email,
          }));
          setsignerOptions(processedData);

          fetchDocumentDraggedData(documentData.id,data[0].id)
            .then((data) => setDraggedData(data))
            .catch((error) => {
              toastDisplayer("error", "Failed to fetch dragged data");
              navigate("/userdashboard");
            });

        })
        .catch((error) => toastDisplayer("error", "Can't fetch the reciever"));

      fetchDocumentRecipientStatus()
        .then((data) => {
          setFullDocumentData(data);
        })
        .catch((error) =>
          toastDisplayer(
            "error",
            "Failed to fetch document recipient status data"
          )
        );
    }
  }, [documentData.id]);

  var mystatus;
  useEffect(() => {
    if (loggedInUserDetail) {
      fetchRecipientSignStatusData(
        documentData?.id,
        loggedInUserDetail?.user?.email
      )
        .then((data) => {
          mystatus = data[0]?.status;
          return fetchRecipientDetailData(
            documentData?.id,
            loggedInUserDetail?.user?.email
          );
        })
        .then((data) => {
          console.log("rec panel data:", data);
          if (mystatus !== "done" && mystatus === "sent") {
            const role = data[0]?.roleId;
            const url = `/recieverPanel?docType=doc&type=${
              role === 1 ? "signer" : "viewer"
            }&did=${documentData?.id}&rid=${data[0]?.id}`;
            navigate(url);
          }
        })
        .catch((error) =>
          console.error("Error fetching recipient detail data:", error)
        );
    }
  }, [loggedInUserDetail]);

  return (
    <>
      <div className="my-container">
        <MyHeader title={"Sign-akshar"} screenValue={"viewDocument"} />
        <div className="my-main-container">
          <TitlePanel
            title={documentData.name}
            statusSoure={documentData.status}
            senderData={senderData}
          />
          <div className="main-detail-panel">
            <div className="outer-section">
              <div className="first-inner-section">
                <div className="single-document-sign">1 Document</div>
                {signerOptions.length !== 1 ? (
                  <div className="splitbtnRecipients">
                    <DropDownButton
                      splitButton={true}
                      stylingMode="text"
                      className="recipient-selection"
                      dataSource={signerOptions}
                      itemTemplate={(item) => {
                        const role = item.role === 1 ? "Signer" : "Viewer";
                        return `<div class="custom-item" title="${item.name}">
                          <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter';">
                            ${item.name}
                          </div>
                          <div class="recipient-role" style="color: #687787; font-size: 12px; font-weight: 500; font-family: 'Inter';">
                            ${role}
                          </div>
                          </div>`;
                      }}
                      text={`${signerOptions.length} Recipients`}
                    />
                  </div>
                ) : (
                  <>
                    <div className="single-document-sign">1 Recipient</div>
                  </>
                )}
              </div>
              <div className="second-inner-section"></div>
            </div>
          </div>
        </div>
        <DocumentMain
          selectedFile={recieverfile}
          screenValue={"viewDocument"}
          signerOptions={signerOptions}
          title={documentData.name}
        />
      </div>
    </>
  );
}

export default ViewDocument;
