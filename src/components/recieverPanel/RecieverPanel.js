///// refactored code after submission
import React, { useState, useRef, useEffect } from "react";
import MyHeader from "../handle-document/main-display/MyHeader";
import axios from "axios";
import btnReset from "../../icons/restart-line.svg";
import { Button, DropDownButton } from "devextreme-react";
import { useLocation } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { toastDisplayer } from "../toastDisplay/toastDisplayer";
import SelectBox from "devextreme-react/select-box";
import {
  generateThumbnails,
  handleScroll,
  generateSignedPdfonAws,
  handleThumbnailClick,
  processImage,
} from "../manageUser/signatureSetup/PdfUtils";
import { useNavigate } from "react-router-dom";
import "../handle-document/main-display/CreateOrSignDocument.scss";
import "../handle-document/main-display/DocumentMain.scss";
import "../handle-document/main-display/TitlePanel.scss";
import "../handle-document/main-display/DetailPanel.scss";
import PopupMain from "../customPopup/PopupMain";
import SidebarMainLeft from "../handle-document/main-display/leftSidebar/SidebarMainLeft";
import SidebarRight from "../handle-document/main-display/rightSidebar/SidebarRight";
import { useAuth } from "../../contexts/auth";
import { format } from "date-fns";
import { toDate, formatInTimeZone } from "date-fns-tz";
import { LoadPanel } from "devextreme-react";
import "../recieverPanel/RecieverPanel.scss";

import {
  approveDocument,
  fetchDocumentData,
  fetchDocumentDraggedData,
  fetchPdfFile,
  fetchRecipientSignStatusData,
  fetchSenderData,
  fetchUseDocRec,
  fetchUserDetails,
} from "../../api/UserDashboardAPI";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function RecieverPanel() {
  const [loading, setLoading] = useState(false);
  const { user,userDetailAuth } = useAuth();
  const navigate = useNavigate();
  const [correctRecData, setCorrectRecData] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [mainContentUrls, setMainContentUrls] = useState([]);
  const mainContainerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [pdfImageSize, setPdfImageSize] = useState({ width: 0, height: 0 });
  const thumbnailContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recieverfile, setRecieverFile] = useState(null);
  const [pdfImageRect, setpdfImageRect] = useState({ width: 0, height: 0 });
  const [draggedData, setDraggedData] = useState([]);
  const [defaultColor, setDefaultColor] = useState("transperant");
  const [documentData, setDocumentData] = useState([]);
  const [useTempRec, setuseTempRec] = useState([]);
  const [popupActiveTab, setPopupActiveTab] = useState(null);
  const [signImage, setSignImage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const docid = queryParams.get("did");
  const rid = queryParams.get("rid");
  const typeReciever = queryParams.get("type");
  const sender = queryParams.get("sender");
  const tid = queryParams.get("tid");
  const docType = queryParams.get("docType");

  const [signerOptions, setsignerOptions] = useState([]);
  const [selectedSignerName, setSelectedSignerName] = useState("");
  const [popupSignVisible, setPopupSignVisible] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [applySignatureData, setApplySignatureData] = useState(null);
  const [initialsCanvas, setInitialsCanvas] = useState(null);
  const [applyInitialsData, setApplyInitialsData] = useState(null);
  const [applyCompanyStampData, setApplyCompanyStampData] = useState(null);
  const [dateFormatIndex, setDateFormatIndex] = useState(0);
  const [fontStyleIndex, setFontStyleIndex] = useState(0);
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);
  const [isSignApplied, setIsSignApplied] = useState(false);
  const [selectedSignatureSubTabIndex, setSelectedSignatureSubTabIndex] =
    useState(0);
  const [applySignatureTextData, setApplySignatureTextData] = useState(null);
  const [applySignatureDrawingData, setApplySignatureDrawingData] =
    useState(null);
  const [applySignatureImageData, setApplySignatureImageData] = useState(null);

  const [selectedInitialsSubTabIndex, setSelectedInitialsSubTabIndex] =
    useState(0);
  const [applyInitialsTextData, setApplyInitialsTextData] = useState(null);
  const [applyInitialsDrawingData, setApplyInitialsDrawingData] =
    useState(null);
  const [applyInitialsImageData, setApplyInitialsImageData] = useState(null);

  const [filteredRecipient, setFilteredRecipient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    if (jwtToken) {
      const getLoggedInUser = async () => {
        try {
          // const userDetails = await fetchUserDetails(jwtToken);
          setLoggedInUserdetail(userDetailAuth);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      getLoggedInUser();
    } else {
      return;
    }
  }, []);

  useEffect(() => {
    if (recieverfile) {
      generateThumbnails(recieverfile)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
    }
  }, [recieverfile]);

  const fields = [
    { id: 1, name: "Signature" },
    { id: 2, name: "Name" },
    { id: 3, name: "Initials" },
    { id: 4, name: "Date" },
    // { id: 5, name: "Text" },
    { id: 6, name: "Company Stamp" },
  ];

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

  const [senderData, setSenderData] = useState();
  const [splitDocName, setsplitDocName] = useState();
  const fetchDocData = async () => {
    try {
      const response = await fetchDocumentData(docid);
      setDocumentData(response);

      if (response) {
        const senderResp = await fetchSenderData(response.creator_id);
        setSenderData(senderResp);
        fetchDocPdfFile(senderResp, response);
        const splitName = response.name.split("_");
        const displayName = splitName.slice(0, -1).join("_");
        setsplitDocName(displayName);
      }
    } catch (error) {
      return toastDisplayer("error", "Failed to fetch document data");
    }
  };

  const fetchUseDocumentRec = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt");
      const response = await fetchUseDocRec(docid, jwtToken);
      if (response.length > 0) {
        const processedData = response.map((data) => ({
          id: data.id,
          name: data.name,
          role: data.roleId,
          color: "#ffb6c1",
          email: data.email,
        }));
        setsignerOptions(processedData);
      }
    } catch (error) {
      return toastDisplayer("error", "Can't fetch the reciever");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (
          loggedInUserDetail &&
          loggedInUserDetail.user &&
          loggedInUserDetail.user.email &&
          signerOptions.length > 0
        ) {
          let isToastDisplayed = false;
          signerOptions.forEach((s) => {
            if (s.id == rid) {
              if (s.email === loggedInUserDetail?.user?.email) {
                setCorrectRecData(loggedInUserDetail);
              } else {
                if (!isToastDisplayed) {
                  toastDisplayer(
                    "error",
                    "You are not allowed to access signing page!"
                  );
                  isToastDisplayed = true;
                }
                navigate("/userDashboard");
              }
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [signerOptions]);

  const fetchDocPdfFile = async (senderData1, documentData1) => {
    setLoading(true);
    try {
      const response = await fetchPdfFile(senderData1, documentData1);
      setRecieverFile(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PDF file:", error);
      toastDisplayer("error", "Failed to fetch PDF file");
    }
  };

  const fetchDocDraggedData = async () => {
    try {
      const response = await fetchDocumentDraggedData(docid, rid);
      setDraggedData(response);
    } catch (error) {
      console.error("Error fetching dragged data:", error);
      toastDisplayer("error", "Failed to fetch dragged data");
    }
  };

  const handleDocSignedOrViewd = async () => {
    try {
      const statusResponse = await fetchRecipientSignStatusData(
        docid,
        loggedInUserDetail.user.email
      );
      const ckhStatus = statusResponse[0].status;
      if (ckhStatus !== "approved") {
        setIsSignApplied(false);
      } else {
        setIsSignApplied(true);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const ApproveDocument = async () => {
    setIsLoading(true);
    try {
      setLoading(true);

      const allSigned = draggedData.every(
        (item) => item.signatureData && item.signatureData.imageData
      );

      if (typeReciever === "signer") {
        if (!allSigned && isSignApplied === false) {
          toastDisplayer(
            "error",
            "Make sure you've signed all required fields before marking them as done."
          );
          return; // Exit function if not all signed
        }
      }
      const response = await approveDocument(
        docid,
        rid,
        loggedInUserDetail.user.id
      );

      if (response.status === 200) {
        if (
          response.data.success === "Document completed successfully" ||
          response.data.success === "Document approved successfully"
        ) {
          if (response.data.last_approved) {
            const draggedArray = [];
            const positionsByPage = {};
            draggedData.forEach((item) => {
              const { pageNum, x, y } = item;
              if (!positionsByPage[pageNum]) {
                positionsByPage[pageNum] = [];
              }
              positionsByPage[pageNum].push({ x, y });
              if (item.signatureData) {
                draggedArray.push(item.signatureData);
              }
            });

            const isUploaded = await generateSignedPdfonAws(
              recieverfile,
              draggedArray,
              senderData,
              documentData
            );
            if (isUploaded) {
              toastDisplayer("success", "Document approved successfully.");
              navigate("/userDashboard");
            } else {
              toastDisplayer("error", "Failed to upload signed PDF");
            }
          } else {
            toastDisplayer("success", "Document completed successfully.");
            navigate("/userDashboard");
          }
        } else {
          if (senderData) {
            const draggedArray = [];
            const positionsByPage = {};
            draggedData.forEach((item) => {
              const { pageNum, x, y } = item;
              if (!positionsByPage[pageNum]) {
                positionsByPage[pageNum] = [];
              }
              positionsByPage[pageNum].push({ x, y });
              if (item.signatureData) {
                draggedArray.push(item.signatureData);
              }
            });

            const isUploaded = await generateSignedPdfonAws(
              recieverfile,
              draggedArray,
              senderData,
              documentData
            );
            if (isUploaded) {
              toastDisplayer("success", "Document approved successfully.");
              navigate("/userDashboard");
            } else {
              toastDisplayer("error", "Failed to upload signed PDF");
            }
          } else {
            toastDisplayer(
              "success",
              "Document approved and email sent to next recipient."
            );
            navigate("/userDashboard");
          }
        }
      } else {
        console.log("Unexpected response status:", response.status);
        toastDisplayer("error", "Failed to approve document");
      }
    } catch (error) {
      console.error("Error approving document:", error);
      toastDisplayer("error", "Failed to approve document");
    } finally {
      setLoading(false);
      setIsLoading(false);

    }
  };

  useEffect(() => {
    if (docid) {
      fetchDocData();
      if (docType == "temp") {
      } else if (docType == "doc") {
        fetchUseDocumentRec();
        fetchDocDraggedData();
        handleDocSignedOrViewd();
      }
    }
  }, [docid, tid, sender, loggedInUserDetail]);

  useEffect(() => {
    if (recieverfile) {
      generateThumbnails(recieverfile)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setMainContentUrls(contentUrls);
          if (typeReciever === "signer") {
            fetchDocDraggedData();
          }
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
    }
  }, [recieverfile]);

  useEffect(() => {
    if (correctRecData && mainContentUrls.length > 0) {
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

  const findSignerByTemplateRec = (templateRec) => {
    return useTempRec.find((signer) => signer.templateRec === templateRec);
  };

  useEffect(() => {
    if (signerOptions.length > 0) {
      if (
        loggedInUserDetail &&
        loggedInUserDetail.user &&
        loggedInUserDetail.user.email
      ) {
        const userEmail = loggedInUserDetail.user.email;
        const matchingSigner = signerOptions.filter(
          (signer) => signer.email === userEmail
        );
        setFilteredRecipient(
          matchingSigner.length > 0 ? matchingSigner[0] : null
        );
      }
    }
  }, [signerOptions, loggedInUserDetail]);

  const handleApplySignatureModal = (recipient) => {
    let tabValue = null;
    switch (recipient.fieldName) {
      case "Signature":
        tabValue = 1;
        setPopupActiveTab(tabValue);
        setPopupSignVisible(true);
        break;
      case "Initials":
        tabValue = 2;
        setPopupActiveTab(tabValue);
        setPopupSignVisible(true);
        break;
      case "Company Stamp":
        tabValue = 3;
        setPopupActiveTab(tabValue);
        setPopupSignVisible(true);
        break;
      case "Name":
        handleNameDone();
        break;
      case "Date":
        handleDateDone();
        break;
      default:
        tabValue = null;
    }
  };

  const handleSignatureDone = () => {
    let signatureData = applySignatureData;
    if (selectedSignatureSubTabIndex === 0) {
      if (applySignatureTextData == null) {
        if (loggedInUserDetail.signature_details.sign_text) {
          processImage(
            loggedInUserDetail.signature_details.sign_text,
            (croppedDataURL) => {
              if (croppedDataURL) {
                signatureData = croppedDataURL;
                finalizeSignature(signatureData);
              } else {
                console.error(
                  "Failed to process loggedInUserDetail signature image"
                );
              }
            }
          );
        } else {
          setPopupSignVisible(false);
        }
      } else {
        processImage(applySignatureTextData, (croppedDataURL) => {
          if (croppedDataURL) {
            signatureData = croppedDataURL;
            finalizeSignature(signatureData);
          } else {
            console.error("Failed to process applySignatureData image");
            setPopupSignVisible(false);
          }
        });
      }
    } else if (selectedSignatureSubTabIndex === 1) {
      // Tab 1: Draw Tab
      if (applySignatureDrawingData == null) {
        if (loggedInUserDetail.signature_details.draw_img_name) {
          processImage(
            loggedInUserDetail.signature_details.draw_img_name,
            (croppedDataURL) => {
              if (croppedDataURL) {
                signatureData = croppedDataURL;
                finalizeSignature(signatureData);
              } else {
                console.error(
                  "Failed to process loggedInUserDetail signature image"
                );
              }
            }
          );
        } else {
          setPopupSignVisible(false);
        }
      } else {
        processImage(applySignatureDrawingData, (croppedDataURL) => {
          if (croppedDataURL) {
            signatureData = croppedDataURL;
            finalizeSignature(signatureData);
          } else {
            console.error("Failed to process applySignatureData image");
            setPopupSignVisible(false);
          }
        });
      }
    } else if (selectedSignatureSubTabIndex === 2) {
      // Tab 2: Image Tab
      if (applySignatureImageData == null) {
        if (loggedInUserDetail.signature_details.img_name) {
          processImage(
            loggedInUserDetail.signature_details.img_name,
            (croppedDataURL) => {
              if (croppedDataURL) {
                signatureData = croppedDataURL;
                finalizeSignature(signatureData);
              } else {
                console.error(
                  "Failed to process loggedInUserDetail signature image"
                );
              }
            }
          );
        } else {
          setPopupSignVisible(false);
        }
      } else {
        processImage(applySignatureImageData, (croppedDataURL) => {
          if (croppedDataURL) {
            signatureData = croppedDataURL;
            finalizeSignature(signatureData);
          } else {
            console.error("Failed to process applySignatureData image");
            setPopupSignVisible(false);
          }
        });
      }
    } else {
      setPopupSignVisible(false);
    }
  };

  const finalizeSignature = (signatureData) => {
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Signature") {
        const { x, y, width, height, pageNum } = field;
        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: signatureData,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
  };

  const handleInitialsDone = () => {
    let initialData = applyInitialsData;

    if (selectedInitialsSubTabIndex === 0) {
      // Tab 0: Text Tab
      if (applyInitialsTextData == null) {
        if (loggedInUserDetail.initials_details.draw_img_name) {
          processImage(
            loggedInUserDetail.initials_details.draw_img_name,
            (croppedDataURL) => {
              if (croppedDataURL) {
                initialData = croppedDataURL;
                finalizeInitials(initialData);
              } else {
                console.error("Failed to process loggedInUserDetail text data");
                setPopupSignVisible(false);
              }
            }
          );
        } else {
          setPopupSignVisible(false);
        }
      } else {
        processImage(applyInitialsTextData, (croppedDataURL) => {
          if (croppedDataURL) {
            initialData = croppedDataURL;
            finalizeInitials(initialData);
          } else {
            console.error("Failed to process applyInitialsTextData");
            setPopupSignVisible(false);
          }
        });
      }
    } else if (selectedInitialsSubTabIndex === 1) {
      // Tab 1: Draw Tab
      if (applyInitialsDrawingData == null) {
        if (loggedInUserDetail.initials_details.draw_img_name) {
          processImage(
            loggedInUserDetail.initials_details.draw_img_name,
            (croppedDataURL) => {
              if (croppedDataURL) {
                initialData = croppedDataURL;
                finalizeInitials(initialData);
              } else {
                console.error(
                  "Failed to process loggedInUserDetail drawing initials"
                );
                setPopupSignVisible(false);
              }
            }
          );
        } else {
          setPopupSignVisible(false);
        }
      } else {
        processImage(applyInitialsDrawingData, (croppedDataURL) => {
          if (croppedDataURL) {
            initialData = croppedDataURL;
            finalizeInitials(initialData);
          } else {
            console.error("Failed to process applyInitialsDrawingData");
            setPopupSignVisible(false);
          }
        });
      }
    } else if (selectedInitialsSubTabIndex === 2) {
      // Tab 2: Image Tab
      if (applyInitialsImageData == null) {
        if (loggedInUserDetail.initials_details.img_name) {
          processImage(
            loggedInUserDetail.initials_details.img_name,
            (croppedDataURL) => {
              if (croppedDataURL) {
                initialData = croppedDataURL;
                finalizeInitials(initialData);
              } else {
                console.error(
                  "Failed to process loggedInUserDetail initials image"
                );
                setPopupSignVisible(false);
              }
            }
          );
        } else {
          setPopupSignVisible(false);
        }
      } else {
        processImage(applyInitialsImageData, (croppedDataURL) => {
          if (croppedDataURL) {
            initialData = croppedDataURL;
            finalizeInitials(initialData);
          } else {
            console.error("Failed to process applyInitialsImageData");
            setPopupSignVisible(false);
          }
        });
      }
    } else {
      setPopupSignVisible(false);
    }
  };

  const finalizeInitials = (initialData) => {
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Initials") {
        const { x, y, width, height, pageNum } = field;
        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;
        field.signatureData = {
          imageData: initialData,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
  };

  const handleCompanyStampDone = () => {
    let companyStampData = applyCompanyStampData;
    if (applyCompanyStampData == null) {
      console.log(
        "blank canvas on RP, using loggedInUserDetail company stamp image"
      );

      if (loggedInUserDetail.user.stamp_img_name) {
        processImage(
          loggedInUserDetail.user.stamp_img_name,
          (croppedDataURL) => {
            if (croppedDataURL) {
              companyStampData = croppedDataURL;
              finalizeCompanyStamp(companyStampData);
            } else {
              console.error(
                "Failed to process loggedInUserDetail company stamp image"
              );
              setPopupSignVisible(false);
            }
          }
        );
      } else {
        setPopupSignVisible(false);
      }
    } else {
      processImage(applyCompanyStampData, (croppedDataURL) => {
        if (croppedDataURL) {
          companyStampData = croppedDataURL;
          finalizeCompanyStamp(companyStampData);
        } else {
          console.error("Failed to process applyCompanyStampData image");
          setPopupSignVisible(false);
        }
      });
    }
  };

  const finalizeCompanyStamp = (companyStampData) => {
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Company Stamp") {
        const { x, y, width, height, pageNum } = field;
        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;
        field.signatureData = {
          imageData: companyStampData,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
  };

  const handleDateDone = () => {
    const dateFormats = [
      "MM/dd/yyyy", //"06/01/2024"
      "dd/MM/yyyy", // "01/06/2024"
      "dd-MM-yyyy", // "01-06-2024"
      "MMMM dd, yyyy", //"June 1, 2024"
      "eeee, MMMM do yyyy", //"Saturday, June 1st 2024"
    ];
    const currentDateFormat = dateFormats[dateFormatIndex];
    setDateFormatIndex((prevIndex) => (prevIndex + 1) % dateFormats.length);
    const now = new Date();
    const timeZone = "Asia/Kolkata";
    const istDate = toDate(now, { timeZone });
    const currentDate = format(istDate, currentDateFormat);
    const currentTime = formatInTimeZone(istDate, "IST", "'T'HH:mm:ss.SSS'Z'");
    const dateTime = `${currentDate} ${currentTime}`; // Combine date and time
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Date") {
        const { x, y, width, height, pageNum } = field;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.fillStyle = "transparent";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "14px Inter";
        context.fillStyle = "#000000";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(currentDate, canvas.width / 2, canvas.height / 3);
        context.fillText(
          currentTime,
          canvas.width / 2,
          (canvas.height * 2) / 3
        );
        const imageDataURL = canvas.toDataURL();
        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;
        field.signatureData = {
          imageData: imageDataURL,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });

    setDraggedData(updatedDraggedData);
  };

  const handleNameDone = () => {
    const fontStyles = [
      "20px Inter",
      "20px Arial",
      "20px Times New Roman",
      "20px Brush Script MT",
      "20px Lucida Handwriting",
      "20px Pacifico",
    ];

    const currentFontStyle = fontStyles[fontStyleIndex];
    setFontStyleIndex((prevIndex) => (prevIndex + 1) % fontStyles.length);
    const currentName = loggedInUserDetail.user.full_name;
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Name") {
        const { x, y, width, height, pageNum } = field;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.fillStyle = "transparent";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = currentFontStyle;
        context.fillStyle = "#344450";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(currentName, canvas.width / 2, canvas.height / 2);
        const imageDataURL = canvas.toDataURL();
        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: imageDataURL,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
  };

  const handleSelectedSignerChange = (signerName) => {
    setSelectedSignerName(signerName);
  };

  const handleResetButtonClick = () => {
    const updatedDraggedData = draggedData.map((field) => {
      return {
        ...field,
        signatureData: null,
      };
    });

    setDraggedData(updatedDraggedData);
  };

  return (
    <>
      {loading ? <LoadPanel visible="true" /> : ""}
      <div className="my-container">
        <MyHeader
          title={"Sign-akshar"}
          typeReciever={typeReciever}
          screenValue={"recipient-panel"}
        />
        <div className="my-main-container">
          <div className="main-title-panel">
            <div className="panel-title">{splitDocName && splitDocName}</div>
            <div className="splitBtnInMainPage">
              {typeReciever && typeReciever === "signer" && (
                <Button
                  stylingMode="contained"
                  text={isLoading ? "" : "Done"}
                  className="templateBtn"
                  onClick={ApproveDocument}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <div className="loader-container">
                      {/* Using react-spinners */}
                      {/* <ClipLoader color="#fff" size={24} /> */}
                      <div className="simple-loader"></div>
                    </div>
                  )}
                </Button>
              )}
              {typeReciever && typeReciever === "viewer" && (
                <Button
                  stylingMode="contained"
                  text={isLoading ? "" : "Viewed"}
                  className="templateBtn"
                  onClick={ApproveDocument}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <div className="loader-container">
                      {/* Using react-spinners */}
                      {/* <ClipLoader color="#fff" size={24} /> */}
                      <div className="simple-loader"></div>
                    </div>
                  )}
                  </Button>
              )}
            </div>
          </div>

          <div className="main-detail-panel">
            <div className="outer-section">
              <div className="first-inner-section">
                {/* <Button
                  icon={btnReset}
                  className="btn-reset"
                  onClick={handleResetButtonClick}
                /> */}
                <div className="single-document-sign">1 Documnet</div>
                {signerOptions.length != 1 ? (
                  <div className="splitbtnRecipients">
                    <DropDownButton
                      splitButton={true}
                      stylingMode="text"
                      className="recipient-selection"
                      dataSource={signerOptions}
                      itemTemplate={(item) => {
                        const role = item.role === 1 ? "Signer" : "Viewer";
                        return `<div class="custom-item" title="${item.name}">
                                <div class="recipient-name" style="font-size: 14px; font-weight: 500; 'Inter';">
                                  ${item.name}
                                </div>
                                <div class="recipient-role" style="color: #687787; font-size: 12px; font-weight: 500; 'Inter';">
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
              </div>
            </div>
          </div>
        </div>

        <div className="main-container">
          {typeReciever && typeReciever === "signer" && (
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              onSelectedSignerChange={handleSelectedSignerChange}
              sidebarLeftSorce="reciever-panel"
              recipientPanelColor={draggedData[0]?.color || defaultColor}
              loggedinRecipientDetail={filteredRecipient ?? "detault user"}
            />
          )}
          <div className="main-pdf-container">
            <div className="main-pdf-view">
              <div className="pdf-inner-container-main-body-content">
                <div className="pdf-viewer">
                  <div className="pdf-display">
                    <div
                      className="pdf-scrollable-container "
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

                            {isSignApplied == true ? (
                              <></>
                            ) : (
                              <>
                                {draggedData &&
                                  draggedData.map((recipient, i) => {
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
                                      const signatureData =
                                        recipient.signatureData;

                                      if (!signatureData) {
                                        return (
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
                                            onClick={(e) => {
                                              handleApplySignatureModal(
                                                recipient
                                              );
                                            }}
                                          >
                                            <div className="recipient-box">
                                              <div className="recipient-box-data">
                                                <p className="dropped-box-field-name">
                                                  {recipient.fieldName}
                                                </p>
                                                <p className="dropped-box-recipient-name">
                                                  {recipient.name}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div
                                            className="drag-box"
                                            key={i}
                                            style={{
                                              position: "absolute",
                                              left: signatureData.x,
                                              top: signatureData.y,
                                              width: signatureData.width,
                                              height: signatureData.height,
                                              backgroundColor: recipient.color,
                                            }}
                                            onClick={(e) => {
                                              handleApplySignatureModal(
                                                recipient
                                              );
                                            }}
                                          >
                                            <img
                                              src={signatureData.imageData}
                                              alt={`Value for ${recipient.fieldName} field`}
                                            />
                                          </div>
                                        );
                                      }
                                    }
                                    return null;
                                  })}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SidebarRight
            thumbnails={thumbnails}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            numPages={numPages}
            mainContainerRef={mainContainerRef}
            selectedSignerName={selectedSignerName}
            handleThumbnailClick={(pageNumber) =>
              handleThumbnailClick(
                pageNumber,
                mainContainerRef,
                setCurrentPage,
                numPages
              )
            }
            fields={fields}
            title={documentData.name}
            pdfFile={recieverfile}
          />
        </div>

        <PopupMain
          onClose={() => setPopupSignVisible(false)}
          visible={popupSignVisible}
          mainTitle="Edit your signature"
          subTitle="Customise it for specific document"
          mainBtnText="Continue"
          source="editpen"
          popupWidth="848px"
          mainTabItemValue={popupActiveTab}
          signImage={signImage}
          loggedInUserDetail={loggedInUserDetail}
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
    </>
  );
}

export default RecieverPanel;
