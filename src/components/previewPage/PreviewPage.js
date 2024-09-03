// import React,{useEffect,useState} from 'react'
// import "./PreviewPage.scss";
// import MyHeader from '../handle-document/main-display/MyHeader';
// import TitlePanel from '../handle-document/main-display/TitlePanel';
// import { pdfjs } from "react-pdf";
// import testingPdf from '../../sample.pdf';
// import {generateThumbnails} from '../manageUser/signatureSetup/PdfUtils';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function PreviewPage() {

//   const [numPages, setNumPages] = useState(0);
//   const [thumbnails, setThumbnails] = useState([]);
//   const [mainContentUrls, setMainContentUrls] = useState([]);

//   useEffect(() => {
//     if (testingPdf) {
//       console.log(testingPdf);
//       generateThumbnails(testingPdf).then(({ thumbnailUrls, contentUrls }) => {
//         setNumPages(thumbnailUrls.length);
//         setThumbnails(thumbnailUrls);
//         setMainContentUrls(contentUrls);
//         // setIsLoading(false);
//       }).catch((error) => {
//         console.error("Error generating thumbnails:", error);
//       });
//     }
//   }, [testingPdf]);

//   return (
//     <>
//         <div className="myContainer">
//             <MyHeader title={"Sign-akshar"} />
//             {console.log(mainContentUrls)}

//             <div className="titlePanelClass">
//                 <TitlePanel title={"QIT Demo"}/>
//             </div>

//             <div className="mainPreview">
//                 <div className="pdfView"></div>
//                 <div className="previewDetails"></div>
//             </div>
//         </div>

//     </>
//   )
// }

// export default PreviewPage

// import React, { useEffect, useState, useRef } from "react";
// import { pdfjs } from "react-pdf";
// import "./PreviewPage.scss";
// import {
//   generateThumbnails,
//   handleScroll,
// } from "../manageUser/signatureSetup/PdfUtils";
// import MyHeader from "../handle-document/main-display/MyHeader";
// import TitlePanel from "../handle-document/main-display/TitlePanel";
// import testingPdf from "../../sample.pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function PreviewPage() {
//   const [numPages, setNumPages] = useState(0);
//   // const [thumbnails, setThumbnails] = useState([]);
//   const [mainContentUrls, setMainContentUrls] = useState([]);
//   const mainContainerRef = useRef(null);
//   const [positions, setPositions] = useState([]);
//   const [pdfImageSize, setPdfImageSize] = useState({ width: 0, height: 0 });
//   const thumbnailContainerRef = useRef(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     // Fetch the PDF file from the path
//     fetch(testingPdf)
//       .then((response) => response.blob())
//       .then((pdfBlob) => {
//         // Create a File object from the fetched blob
//         const pdfFile = new File([pdfBlob], "sample.pdf", {
//           type: "application/pdf",
//         });

//         console.log(pdfFile);
//         // Generate thumbnails and content URLs
//         generateThumbnails(pdfFile)
//           .then(({ thumbnailUrls, contentUrls }) => {
//             setNumPages(thumbnailUrls.length);
//             // setThumbnails(thumbnailUrls);
//             setMainContentUrls(contentUrls);
//           })
//           .catch((error) => {
//             console.error("Error generating thumbnails:", error);
//           });
//       })
//       .catch((error) => {
//         console.error("Error fetching PDF:", error);
//       });
//   }, []);

//   const handleContainerScroll = (event) => {
//     handleScroll(
//       event,
//       numPages,
//       positions,
//       pdfImageSize,
//       thumbnailContainerRef,
//       setCurrentPage,
//       setPositions
//     );
//   };

//   return (
//     <>
//       <div className="myContainer">
//         <MyHeader title={"Sign-akshar"} />

//         <div className="titlePanelClass">
//           <TitlePanel title={"QIT Demo"} />
//         </div>

//         <div className="mainPreview">
//           <div className="pdfView">
//             <div className="inner-container-main-body-content">
//               <div className="pdf-viewer">
//                 <div className="mypdfCenter">
//                   <div
//                     className="scrollable-container "
//                     ref={mainContainerRef}
//                     onScroll={handleContainerScroll}
//                   >
//                     {Array.from({ length: numPages }, (_, index) => (
//                       <div className="page " key={index}>
//                         <div className="pdf-page-container ">
//                           <img
//                             src={mainContentUrls[index]}
//                             alt={`Page ${index + 1}`}
//                             className="tmpid"
//                             draggable="false"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="previewDetails"></div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default PreviewPage;

import React, { useEffect, useState, useRef } from "react";
import { pdfjs } from "react-pdf";
import "./PreviewPage.scss";
import {
  generateThumbnails,
  handleScroll,
} from "../manageUser/signatureSetup/PdfUtils";
import { ReactComponent as IconImageFile } from "../../icons/image-file-icon.svg";
import MyHeader from "../handle-document/main-display/MyHeader";
import TitlePanel from "../handle-document/main-display/TitlePanel";
import { DropDownButton } from "devextreme-react";
import recipientLightPurple from "../../../src/icons/recipient-colors/recipient-light-purple.svg";
import { useLocation } from "react-router-dom";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PreviewPage() {
  const [numPages, setNumPages] = useState(0);
  // const [thumbnails, setThumbnails] = useState([]);
  const [mainContentUrls, setMainContentUrls] = useState([]);
  const mainContainerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [pdfImageSize, setPdfImageSize] = useState({ width: 0, height: 0 });
  const thumbnailContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setpdf] = useState("");
  const location = useLocation();
  const selectedFile = location.state?.selectedFile;
  const Expiration = location.state?.Expiration;
  const scheduledDate = location.state?.scheduledDate;
  const reminderDays = location.state?.reminderDays;
  // const templateapiData = location.state?.templateapiData;
  const signerOptions = location.state?.signerOptions;
  const signOpt = location.state?.signOpt;
  const docapiData = location.state?.docapiData;
  const emailTitle = location.state?.emailTitle;
  const draggedDataTemp = location.state?.draggedDataTemp;
  const recipientTempData = location.state?.recipientTempData;
  const emailMessage = location.state?.emailMessage;
  const templateDraggedData = location.state?.templateDraggedData;
  const [tempYesState, settempYesState] = useState();
  const [previewScreenValue, setPreviewScreenValue] = useState("");
  const [tempID, settempID] = useState("");
  const [docId, setdocId] = useState("");

  const [pdfImageRect, setpdfImageRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (mainContentUrls.length > 0) {
      const mypdfImage = new Image();
      mypdfImage.src = mainContentUrls[0];
      const pdfImage = document.querySelector(".tmpid");
      const pdfImageRect = pdfImage.getBoundingClientRect();

      mypdfImage.onload = () => {
        setPdfImageSize({
          width: mypdfImage.width,
          height: mypdfImage.height,
        });

        setpdfImageRect({
          width: pdfImageRect.width,
          height: pdfImageRect.height,
        });
      };
    }
  }, [mainContentUrls]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const templateValue = queryParams.get("template");
    const tempYEs = queryParams.get("tempYEs");
    const tid = queryParams.get("tid");
    const did = queryParams.get("did");
    if (templateValue) {
      setPreviewScreenValue(templateValue);
    }
    if (tempYEs) {
      settempYesState(tempYEs);
    }
    if (tid) {
      settempID(tid);
    }
    if (did) {
      setdocId(did);
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedFile) {
      generateThumbnails(selectedFile)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          //           // setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
    }
  }, [selectedFile]);

  const handleContainerScroll = (event) => {
    handleScroll(
      event,
      numPages,
      positions,
      pdfImageSize,
      thumbnailContainerRef,
      setCurrentPage,
      setPositions
    );
  };

  const [recitems, setRecitems] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  useEffect(() => {
    if (signerOptions) {
      const items = signerOptions.map((signer) => ({
        name: signer.name,
        text: signer.name,
        email: signer.email,
        role: signer.role,
        color: signer.color,
      }));
      setRecitems(items);
      if (items.length > 0) {
        setSelectedRecipient(items[0]);
      }
    } else if (signOpt) {
      const items = signOpt.map((signer) => ({
        name: signer.name,
        text: signer.name,
        email: signer.email,
        role: signer.role,
        color: signer.color,
      }));
      setRecitems(items);
      if (items.length > 0) {
        setSelectedRecipient(items[0]);
      }
    }
  }, [signerOptions, signOpt]);

  const handleRecipientSelection = (e) => {
    setSelectedRecipient(e.itemData);
  };

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  /////template dragged data::
  const [tempDragRec, settempDragRec] = useState([]);
  const [tempDragged, setTempDragged] = useState([]);
  const fetchTemplateDragRec = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt");
      const header = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const templateresponse = await axios.get(
        `http://localhost:8000/api/TemplateRecipientByTemplateId/${tempID}`,
        {
          headers: header,
        }
      );
      settempDragRec(templateresponse.data);

      if (templateresponse.data.length > 0) {
        templateresponse.data.map(async (res) => {
          if (res.id && res.role === 1) {
            const dragResponse = await axios.get(
              `http://localhost:8000/api/getDraggedDataByTempRec/${res.id}`
            );
            setTempDragged(dragResponse.data);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (previewScreenValue === "Template") {
      fetchTemplateDragRec();
    }
  }, []);

  const findRecipientFullName = (templateRecId, createdBy, templateId) => {
    const recipient = recipientTempData.find(
      (rec) =>
        rec.id === templateRecId &&
        rec.role === 1 &&
        rec.created_by === createdBy &&
        rec.template_id === templateId
    );
    return recipient ? recipient.fullName : "Unknown Recipient";
  };

  const findSignerByTemplateRec = (templateRec) => {
    return signerOptions.find((signer) => signer.templateRec === templateRec);
  };

  return (
    <>
      <div className="myContainer">
        <MyHeader
          title={"Sign-akshar"}
          templateDraggedData={templateDraggedData}
          selectedFile={selectedFile}
          signerOptions={signerOptions}
          signOpt={signOpt}
          // templateapiData={templateapiData}
          previewScreenValue={previewScreenValue}
          tempYesState={tempYesState}
          docId={docId}
          tempID={tempID}
        />
        <div className="titlePanelClass">
          <TitlePanel
            previewScreenValue={previewScreenValue}
            title={docapiData.name}
          />
        </div>

        <div className="mainPreview">
          {previewScreenValue === "Document" && tempYesState === "yes" && (
            <div className="pdfView">
              <div className="inner-container-main-body-content">
                <div className="pdf-viewer">
                  <div className="mypdfCenter">
                    <div
                      className="scrollable-container"
                      ref={mainContainerRef}
                      onScroll={handleContainerScroll}
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div className="mainpage" key={index}>
                          <div className="main-pdf-page-container">
                            <img
                              src={mainContentUrls[index]}
                              alt={`Page ${index + 1}`}
                              className="tmpid"
                              draggable="false"
                            />
                            {draggedDataTemp.map((recipient, i) => {
                              // const pagePositions = recipient.pageNum;
                              // if (
                              //   recipient.id &&
                              //   pageNum &&
                              //   pageNum.length > 0
                              // ) {
                              if (parseInt(recipient.pageNum) === index) {
                                const adjustedLeft =
                                  (recipient.x / pdfImageSize.width) *
                                  pdfImageRect.width;
                                const adjustedTop =
                                  (recipient.y / pdfImageSize.height) *
                                  pdfImageRect.height;
                                const adjustedWidth =
                                  (parseFloat(recipient.width) /
                                    pdfImageSize.width) *
                                  pdfImageRect.width;
                                const adjustedHeight =
                                  (parseFloat(recipient.height) /
                                    pdfImageSize.height) *
                                  pdfImageRect.height;

                                const signer = findSignerByTemplateRec(
                                  recipient.templateRec
                                );

                                const fullName = findRecipientFullName(
                                  recipient.templateRec,
                                  recipient.created_by,
                                  recipient.template
                                );

                                return (
                                  // pagePositions.map((position, j) =>
                                  <div
                                    className="drag-box"
                                    key={i}
                                    style={{
                                      position: "absolute",
                                      left: adjustedLeft,
                                      top: adjustedTop,
                                      width: adjustedWidth,
                                      height: adjustedHeight,
                                      backgroundColor: recipient.color,
                                    }}
                                  >
                                    <div className="recipient-box">
                                      <div className="recipient-box-data">
                                        <p className="dropped-box-field-name">
                                          {recipient.fieldName}
                                        </p>
                                        <p className="dropped-box-recipient-name">
                                          {fullName}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      ))}

                      {/* {Array.from({ length: numPages }, (_, index) => (
                      <div className="page " key={index}>
                        <div className="pdf-page-container ">
                          <img
                            src={mainContentUrls[index]}
                            alt={`Page ${index + 1}`}
                            className="tmpid"
                            draggable="false"
                          />
                        </div>
                      </div>
                    ))} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewScreenValue === "Document" && tempYesState === "no" && (
            <div className="pdfView">
              <div className="inner-container-main-body-content">
                <div className="pdf-viewer">
                  <div className="mypdfCenter">
                    <div
                      className="scrollable-container"
                      ref={mainContainerRef}
                      onScroll={handleContainerScroll}
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div className="page " key={index}>
                          <div className="pdf-page-container ">
                            <img
                              src={mainContentUrls[index]}
                              alt={`Page ${index + 1}`}
                              className="tmpid"
                              draggable="false"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="previewDetails">
            <div className="mainHead">
              <div className="allDet">All Details</div>
              <div className="editDet">Edit Details</div>
            </div>

            <div className="uploadDoc">
              {previewScreenValue &&
                previewScreenValue === "Document" &&
                previewScreenValue === "Bulk Signing" && (
                  <div className="uplTxt">Uploaded Document</div>
                )}
              <div className="uplmain">
                <div className="image-details">
                  <a
                    // href={selectedImage && URL.createObjectURL(selectedImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="details-section img-link"
                  >
                    <div className="file-icon">
                      <span className="image-icon">
                        <IconImageFile />
                      </span>
                    </div>
                    <div className="file-info">
                      <div className="image-info">
                        <span className="name">{selectedFile.name}</span>
                        <p className="size">
                          {parseInt(parseFloat(selectedFile.size) / 1024)} MB
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="recipientInfo">
              <div className="headRecTxt">Recipient Details</div>
              <div className="recDropDown">
                <div className="signer-selection">
                  <div className="heading-signers">
                    All Recipient<span className="required-field">*</span>
                  </div>
                  <div className="signerDropDownBox">
                    <DropDownButton
                      splitButton={true}
                      icon={recipientLightPurple}
                      stylingMode="text"
                      items={recitems}
                      text={
                        selectedRecipient
                          ? selectedRecipient.name
                          : signerOptions.length > 0
                          ? signerOptions[0].name
                          : signOpt[0].name
                      }
                      onItemClick={handleRecipientSelection}
                    />
                  </div>
                </div>
              </div>

              {selectedRecipient && (
                <div className="selectedRecInfo">
                  <div className="rTxt">
                    {getOrdinal(
                      recitems.findIndex(
                        (item) => item.name === selectedRecipient.name
                      ) + 1
                    )}{" "}
                    Recipient
                  </div>
                  <div className="recflex">
                    <div className="recTags">
                      <div className="tagTxt">Recipient Name</div>
                      <div className="tagTxt">Recipient Email </div>
                      <div className="tagTxt">Total Fields</div>
                      <div className="tagTxt">Role</div>
                    </div>
                    <div className="recmaininfo">
                      <div className="recTxt">{selectedRecipient.name}</div>
                      <div className="recTxt">{selectedRecipient.email}</div>
                      <div className="recTxt">{recitems.length}</div>{" "}
                      <div className="recTxt">
                        {selectedRecipient.role === 1
                          ? "Signer"
                          : selectedRecipient.role === 2
                          ? "Viewer"
                          : "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="signOrderClass">
              <div className="recText">Signing Order</div>
              <div className="orderText">Send after the first user action</div>
            </div> 

            <div className="divider"></div>*/}
            {previewScreenValue && previewScreenValue === "Document" && (
              <>
                <div className="divider"></div>
                <div className="emMsgClass">
                  <div className="recText">Email Message</div>
                  <div className="emSubClass">
                    <div className="orderText">Title</div>
                    <div className="emSubText">{emailTitle}</div>
                  </div>
                  <div className="emSubClass">
                    <div className="orderText">Description</div>
                    <div className="emSubText">{emailMessage}</div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="emMsgClass">
                  <div className="recText">Other Details</div>
                  <div className="emSubClass">
                    <div className="orderText">Expiration Date</div>
                    <div className="emSubText">{scheduledDate}</div>
                  </div>
                  <div className="emSubClass">
                    <div className="orderText">Reminder</div>
                    <div className="emSubText">Every {reminderDays} days</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PreviewPage;
