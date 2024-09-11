///// loader
import React, { useEffect, useState } from "react";
import Header from "../../dashBoard/Header2/Header";
import "./ViewDetailsPage.scss";
import { useLocation } from "react-router-dom";
import {
  fetchRecipientCount,
  fetchRecipientDetails,
  fetchRecipientStatus,
  fetchPdfFile,
} from "../../../api/UserDashboardAPI";
import * as pdfjsLib from "pdfjs-dist/webpack"; // Import pdfjs
import { LoadPanel } from "devextreme-react";

function ViewDetailsPage() {
  const location = useLocation();
  const { details } = location.state || {};
  // const [recipientCount, setRecipientCount] = useState(0);
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [recipientStatus, setRecipientStatus] = useState({});
  const [pdfImage, setPdfImage] = useState(null);
  const expiryDate = new Date(details.expirationDateTime);
  const [loading, setLoading] = useState(false);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    if (details && details.id) {
      setLoadingRecipients(true);
      // fetchRecipientCount(details.id)
      //   .then((data) => setRecipientCount(data.recipient_count))
      //   .catch((error) =>
      //     console.error("Error fetching recipient count:", error)
      //   );

      fetchRecipientDetails(details.id)
        .then((data) => {
          setRecipientDetails(data);
          return Promise.all(
            data.map((recipient) =>
              fetchRecipientStatus(recipient.docId, recipient.email)
            )
          );
        })
        .then((statusDataArray) => {
          const statusMap = {};
          statusDataArray.forEach((statusData, index) => {
            const email = statusData[0].emails;
            const statusType = getStatusType(statusData[0].status);
            statusMap[email] = statusType;
          });
          setRecipientStatus(statusMap);
        })
        .catch((error) =>
          console.error("Error fetching recipient details:", error)
        )
        .finally(() => setLoadingRecipients(false));
    }
  }, [details]);

  useEffect(() => {
    if (details && details.creator_id && details.name) {
      setLoadingPdf(true);
      fetchPdfFile(details.creator_id, details)
        .then((pdfData) => {
          extractFirstPageAsImage(pdfData);
        })
        .catch((error) => console.error("Error fetching PDF file:", error))
        .finally(() => setLoadingPdf(false));
    }
  }, [details]);

  const extractFirstPageAsImage = (pdfData) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(this.result),
      }).promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
      const imageDataUrl = canvas.toDataURL("image/png");
      setPdfImage(imageDataUrl);
    };
    fileReader.readAsArrayBuffer(pdfData);
  };

  const getStatusType = (status) => {
    if (["sent", "Pending", "pending", "Sent"].includes(status))
      return "Pending";
    if (status === "approved") return "Completed";
    if (status === "Draft") return "Draft";
    return "-";
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [splitDocName, setsplitDocName] = useState("");
  useEffect(() => {
    if (details.name) {
      const splitName = details.name.split("_");
      const displayName = splitName.slice(0, -1).join("_");
      setsplitDocName(displayName);
    }
  }, [details.name]);

  return (
    <>
      <LoadPanel visible={loading || loadingRecipients || loadingPdf} />

      <div className="viewInfoMain">
        <Header title={"Sign-akshar"} />
        <div className="viewinfo">
          <div className="docDetailInfo">
            <div className="docImg">
              {loadingPdf ? (
                <div className="imgimg1"></div>
              ) : (
                pdfImage && (
                  <img
                    className="imgimg"
                    src={pdfImage}
                    alt="PDF first page"
                  />
                )
              )}
            </div>
            <div className="docDetail">
              <div className="statusDetails">
                <div className="statusBtn" statustype={details.status}>
                  <div
                    className="statusCircle"
                    statustype={details.status}
                  ></div>
                  <div className="statusText" statustype={details.status}>
                    {details.status}
                  </div>
                </div>
              </div>
              <p className="filenameClass">{splitDocName}</p>
              <p className="expiresClass">
                Expires on {formatDate(expiryDate)}
              </p>
              <p className="recClass">{details.recipient_count} Recipients</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="recipientDet">
            <p className="recText1">Recipient Details</p>
            {loadingRecipients ? (
              <div>Loading recipient details...</div>
            ) : recipientDetails ? (
              recipientDetails.map((r, index) => (
                <div key={r.id} className="recinfo">
                  <div className="recidClass">{index + 1}</div>
                  <div className="subrecInfo">
                    <div className="headText">Full Name</div>
                    <div className="recTxt">{r.name}</div>
                  </div>
                  <div className="subrecInfo">
                    <div className="headText">Role</div>
                    <div className="recTxt">
                      {r.roleId === 1 ? "Signer" : "Viewer"}
                    </div>
                  </div>
                  <div className="subrecInfo">
                    
                    <div className="statusDetails">
                       <div className="statusBtn" statustype={recipientStatus[r.email] || ""}>
                         <div className="statusCircle" statustype={recipientStatus[r.email] || ""}></div>
                         <div className="statusText" statustype={recipientStatus[r.email] || ""}>
                           {recipientStatus[r.email] || "-"}
                         </div>
                       </div>
                     </div>
                  </div>
                  <div className="subrecInfo">
                    <div className="headText">Email</div>
                    <div className="recTxt">{r.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No recipient details available.</div>
            )}
          </div>

          <div className="divider"></div>

          <div className="emMsgClass">
            <div className="recText">Email Message</div>
            <div className="emSubClass">
              <div className="orderText">Title</div>
              <div className="emSubText">{details.email_title}</div>
            </div>
            <div className="emSubClass">
              <div className="orderText">Description</div>
              <div className="emSubText">{details.email_msg || "-"}</div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="emMsgClass">
            <div className="recText">Other Details</div>
            <div className="emSubClass">
              <div className="orderText">Expiration Date</div>
              <div className="emSubText">{formatDate(expiryDate)}</div>
            </div>
            <div className="emSubClass">
              <div className="orderText">Reminder</div>
              <div className="emSubText">2 days before expiration date</div>
            </div>
          </div>

          <div className="divider"></div>
        </div>
      </div>
    </>
  );
}

export default ViewDetailsPage;