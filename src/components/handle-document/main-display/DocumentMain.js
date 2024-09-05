//// refactored code after submission -27june
import React, { useEffect, useState, useRef } from "react";
import "./DocumentMain.scss";
import SidebarMainLeft from "./leftSidebar/SidebarMainLeft";
import SidebarRight from "./rightSidebar/SidebarRight";
import { pdfjs } from "react-pdf";
import { LoadPanel } from "devextreme-react";
import {
  generateThumbnails,
  handleScroll,
  getDimensionsBasedOnScreenSize,
  handleThumbnailClick,
  processImage,
} from "../../manageUser/signatureSetup/PdfUtils";
import { useDragDropContext } from "../../../contexts/CustomDragDropContext";
import { Rnd } from "react-rnd";
import { ReactComponent as IconDelete } from "../../../icons/delete-icon.svg";
import { useAuth } from "../../../contexts/auth";
import { format } from "date-fns";
import { toDate, formatInTimeZone } from "date-fns-tz";
import PopupMain from "../../customPopup/PopupMain";
import {
  fetchTempApplyRecipientById,
  fetchUserDetails,
} from "../../../api/UserDashboardAPI";
import { height, maxHeight } from "@mui/system";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DocumentMain({
  signerOptions,
  tempYEs,
  updateRecData,
  selectedFile,
  screenValue,
  setupdateRecData,
  handleSetData,
  draggedDataTemp,
  setIsAnyFieldClicked,
  isAnyFieldClicked,
  recipientTempData,
  title,
  setDownloadDraggedData,
  downloadDraggedData,
  multipleImageDetails,
  multipleSelectedImage,
  mySelectedDocument,
  templateAwsPdf,
  selectedRowDataTemp,
  editRecData,
  setEditRecData,
  setUpdatedEditRecipients,
  updatedEditRecipients,
  setIsSigned
}) {
  const { user,userDetailAuth } = useAuth();
  const [numPages, setNumPages] = useState(0);
  const [mainContentUrls, setMainContentUrls] = useState([]);
  const mainContainerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [pdfImageSize, setPdfImageSize] = useState({ width: 0, height: 0 });
  const thumbnailContainerRef = useRef(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { draggedRecipient, handleDropRecipient } = useDragDropContext();
  const { draggedData, setDraggedData } = useDragDropContext();
  const [recipientBoxSize, setRecipientBoxSize] = useState({
    width: 180,
    height: 100,
  });
  const [recipients, setRecipients] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(selectedFile);
  const dimensions = getDimensionsBasedOnScreenSize();
  const [activeFieldId, setActiveFieldId] = useState(null);
  const [selectedSignerName, setSelectedSignerName] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [applySignatureData, setApplySignatureData] = useState(null);
  const [initialsCanvas, setInitialsCanvas] = useState(null);
  const [applyInitialsData, setApplyInitialsData] = useState(null);
  const [applyCompanyStampData, setApplyCompanyStampData] = useState(null);
  const [signatureTextData, setSignatureTextData] = useState({
    sign_text_color: "black",
    sign_text_font: "",
    sign_text_value: "Signature",
  });

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

  const [popupSignVisible, setPopupSignVisible] = useState(false);
  const [editPenSignPopupVisible, setEditPenSignPopupVisible] = useState(false);

  const [dateFormatIndex, setDateFormatIndex] = useState(0);
  const [fontStyleIndex, setFontStyleIndex] = useState(0);
  const [popupActiveTab, setPopupActiveTab] = useState(null);
  const [applyTempSelfSignEmail, setApplyTempSelfSignEmail] = useState(null);
  const [applyTempSelfSignData, setApplyTempSelfSignData] = useState(null);
  // const [isSigned,setIsSigned]=useState(false);
  useEffect(() => {
    setDraggedData([]);
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

  const fetchTempApplyRecipientDetailById = async (signerId) => {
    try {
      const data = await fetchTempApplyRecipientById(signerId);
      setApplyTempSelfSignData(data);
    } catch (error) {
      console.error("Error fetching recipient details:", error);
    }
  };

  useEffect(() => {
    if (screenValue === "Document" && tempYEs === "yes") {
      if (draggedDataTemp && draggedDataTemp.length > 0) {
        setDraggedData(draggedDataTemp);
        setDownloadDraggedData(draggedDataTemp);
      }
    }
  }, [draggedDataTemp]);

  const [activeFieldData, setActiveFieldData] = useState({
    recipientId: 1111,
    recipientName: "name",
    recipientColor: "blue",
    fieldName: "Field",
    x: 0,
    y: 0,
    width: 180,
    height: 100,
    currentPageNum: 0,
    email: "",
  });
  const handleSelectedSignerChange = (signerName) => {
    setSelectedSignerName(signerName);
  };

  const fields = [
    { id: 1, name: "Signature" },
    { id: 2, name: "Name" },
    { id: 3, name: "Initials" },
    { id: 4, name: "Date" },
    // { id: 5, name: "Text" },
    { id: 6, name: "Company Stamp" },
  ];

  const [pdfImageRect, setpdfImageRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // setLoading(true);
    if (mainContentUrls.length > 0) {
      const mypdfImage = new Image();
      mypdfImage.src = mainContentUrls[0];

      mypdfImage.onload = () => {
        const pdfImage = document.querySelector(".tmpid");
        const pdfImageRect = pdfImage.getBoundingClientRect();
        setPdfImageSize({
          width: mypdfImage.width,
          height: mypdfImage.height,
        });
        setpdfImageRect({
          width: pdfImageRect.width,
          height: pdfImageRect.height,
        });
        setLoading(false);
      };
      mypdfImage.onerror = () => {
        setLoading(false);
        console.error("Error loading image");
      };
    } else {
      console.log("loader");
      setLoading(true);
    }
  }, [mainContentUrls]);

  useEffect(() => {
    if (selectedFile) {
      generateThumbnails(selectedFile)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
    } else if (mySelectedDocument) {
      generateThumbnails(mySelectedDocument.file)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
          setLoading(true);
        });
    } else if (multipleImageDetails && multipleImageDetails[0]?.file) {
      generateThumbnails(multipleImageDetails[0]?.file)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
          setLoading(true);
        });
    } else {
      console.log("---");
    }
  }, [selectedFile, mySelectedDocument]);

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

  function generateUniqueId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  const handleRecipientDrop = (draggedRecipient, position, pageIndex) => {
    if (draggedRecipient) {
      const x =
        position.x -
        mainContainerRef.current.getBoundingClientRect().left -
        recipientBoxSize.width;
      const y =
        position.y -
        mainContainerRef.current.getBoundingClientRect().top -
        recipientBoxSize.height;

      const strippedColor = draggedRecipient[0].color.replace(
        /,\s*\d+(\.\d+)?\s*\)/,
        ")"
      );
      const newColor = strippedColor.replace(")", ", 0.30)");

      draggedRecipient.map((rdata) => {
        const updDraggedData = [...draggedData];
        const existingRecipientIndex = updDraggedData.find(
          (item) => item && item.id === rdata.id
        );
        if (existingRecipientIndex) {
          if (!existingRecipientIndex.pagePositions[pageIndex]) {
            existingRecipientIndex.pagePositions[pageIndex] = [];
          }
          existingRecipientIndex.pagePositions[pageIndex].push({ x, y });
        } else {
          const newRecipient = {
            fieldName: rdata.fieldName,
            color: newColor,
            id: generateUniqueId(),
            name: rdata.name,
            pageNum: pageIndex,
            x: x,
            y: y,
            width: recipientBoxSize.width,
            height: recipientBoxSize.height,
            fileName: selectedFile?.name || title,
            selectedFiles: selectedFile?.name || mySelectedDocument,
            pagePositions: { [pageIndex]: [{ x, y }] },
            size: {
              width: recipientBoxSize.width,
              height: recipientBoxSize.height,
            },
            email: rdata.email,
          };
          updDraggedData.push(newRecipient);
        }
        setDraggedData(updDraggedData);
        setDownloadDraggedData(updDraggedData);
      });

      handleDropRecipient();
      setIsAnyFieldClicked(true);

      setActiveFieldData((prevState) => ({
        ...prevState,
        recipientId: draggedRecipient[0].id,
        recipientName: draggedRecipient[0].name,
        recipientColor: newColor || draggedRecipient[0].color,
        fieldName: draggedRecipient[0].fieldName,
        x: draggedRecipient[0]?.x || x,
        y: draggedRecipient[0]?.y || y,
        width: draggedRecipient[0]?.width || recipientBoxSize.width,
        height: draggedRecipient[0]?.height || recipientBoxSize.height,
        currentPageNum: draggedRecipient[0]?.pageNum || pageIndex,
        email: draggedRecipient[0].email,
      }));
    }
  };

  const handleRecipientDrag = (recipientId, newPosition, pageIndex) => {
    if (recipientId) {
      const updatedRecipients = [...draggedData];
      const recipientIndex = updatedRecipients.findIndex(
        (item) => item.id === recipientId
      );
      updatedRecipients[recipientIndex].pagePositions[pageIndex].forEach(
        (position) => {
          position.x = newPosition.x;
          position.y = newPosition.y;
        }
      );

      updatedRecipients[recipientIndex].x = newPosition.x;
      updatedRecipients[recipientIndex].y = newPosition.y;
      setDraggedData(updatedRecipients);
    } else {
      console.log("handleRecipientDrag else");
    }
  };

  const handleRecipientResize = (
    recipientId,
    newWidth,
    newHeight,
    position,
    pageIndex,
    recipient
  ) => {
    if (recipientId) {
      const updatedRecipients = [...draggedData];
      const recipientIndex = updatedRecipients.findIndex(
        (item) => item.id === recipientId
      );
      if (recipientIndex !== -1) {
        updatedRecipients[recipientIndex].size.width = parseInt(newWidth);
        updatedRecipients[recipientIndex].size.height = parseInt(newHeight);
        updatedRecipients[recipientIndex].pagePositions[pageIndex].forEach(
          (pos) => {
            pos.x = position.x;
            pos.y = position.y;
          }
        );
        updatedRecipients[recipientIndex].x = parseInt(position.x);
        updatedRecipients[recipientIndex].y = parseInt(position.y);
        updatedRecipients[recipientIndex].width = parseInt(newWidth);
        updatedRecipients[recipientIndex].height = parseInt(newHeight);
        setDraggedData(updatedRecipients);
      }
    }
  };

  const handleDeleteRecipient = async (recipientIdToDelete, e) => {
    setIsAnyFieldClicked(false);
    if (typeof recipientIdToDelete === "string") {
      setDraggedData((prevDraggedData) =>
        prevDraggedData.filter(
          (recipient) => recipient.id !== recipientIdToDelete
        )
      );

      setDownloadDraggedData((prevDragData) =>
        prevDragData.filter((recipient) => recipient.id !== recipientIdToDelete)
      );
    } else if (typeof recipientIdToDelete === "number") {
      const delresponse = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/templateDraggedDataApi/${recipientIdToDelete}/`,
        {
          data: {
            user_id: loggedInUserDetail?.user?.id,
          },
        }
      );
      if (delresponse.status === 200) {
        setUpdatedEditRecipients((prevUpdEdit) =>
          prevUpdEdit.filter(
            (rec) => rec !== null && rec.id !== recipientIdToDelete
          )
        );

        setEditRecData((prevEdit) => {
          const flattenedArray = prevEdit.flat();
          const filteredArray = flattenedArray.filter(
            (erec) => erec.id !== recipientIdToDelete
          );
          let index = 0;
          return prevEdit.map((subArray) => {
            const length = subArray.length;
            const newSubArray = filteredArray.slice(index, index + length);
            index += length;
            return newSubArray;
          });
        });
      }
      // setUpdatedEditRecipients((prevUpdEdit)=>
      //   prevUpdEdit.filter((rec) => rec.id !==recipientIdToDelete)
      // )

      // // setEditRecData((prevEdit)=>
      // //     prevEdit.filter((erec)=> erec.id !==recipientIdToDelete)
      // // )
    }
  };

  useEffect(() => {
    if (screenValue && screenValue === "Document" && tempYEs === "yes") {
      handleSetData(draggedDataTemp);
    } else if (screenValue != "viewDocument") {
      handleSetData(draggedData);
    }
  }, [handleDeleteRecipient]);

  const handleDragDropBoxClicked = (e, recfullName) => {
    setIsAnyFieldClicked(true);
    setActiveFieldData((prevState) => ({
      ...prevState,
      recipientId: e.id,
      recipientName: e.name || recfullName.name,
      recipientColor: e.color,
      fieldName: e.fieldName,
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height,
      currentPageNum: e.pageNum,
      email: e.email,
    }));
  };

  const copyCurrentBoxToAllPages = (currentBox) => {
    if (activeFieldData) {
      const { x, y, width, height, fieldName } = activeFieldData;
      const updatedDraggedData = [...draggedData];
      for (let i = 0; i < numPages; i++) {
        const existingFieldOnPage = updatedDraggedData.find(
          (field) =>
            field.pageNum === i &&
            field.fieldName === fieldName &&
            field.x === x &&
            field.y === y &&
            field.width === width &&
            field.height === height
        );
        if (!existingFieldOnPage) {
          updatedDraggedData.push({
            id: generateUniqueId(),
            pageNum: i,
            name: activeFieldData.recipientName,
            fileName: selectedFile?.name || mySelectedDocument?.name,
            selectedFiles: selectedFile,
            x: activeFieldData.x,
            y: activeFieldData.y,
            width: activeFieldData.width,
            height: activeFieldData.height,
            size: {
              width: activeFieldData.width,
              height: activeFieldData.height,
            },
            fieldName: activeFieldData.fieldName,
            color: activeFieldData.recipientColor,
            pagePositions: { [i]: [{ x, y }] },
            email: activeFieldData.email,
          });
        }
      }
      setDraggedData(updatedDraggedData);
    }
  };

  const copyCurrentBoxToBelowPages = (currentBox) => {
    if (activeFieldData) {
      const { x, y, width, height, fieldName, currentPageNum } =
        activeFieldData;
      const updatedDraggedData = [...draggedData];

      for (let i = 0; i < numPages; i++) {
        if (i > currentPageNum) {
          const existingFieldOnPage = updatedDraggedData.find(
            (field) =>
              field.pageNum === i &&
              field.fieldName === fieldName &&
              field.x === x &&
              field.y === y &&
              field.width === width &&
              field.height === height
          );
          if (!existingFieldOnPage) {
            updatedDraggedData.push({
              id: generateUniqueId(),
              pageNum: i,
              name: activeFieldData.recipientName,
              fileName: selectedFile,
              selectedFiles: selectedFile,
              x: activeFieldData.x,
              y: activeFieldData.y,
              width: activeFieldData.width,
              height: activeFieldData.height,
              size: {
                width: activeFieldData.width,
                height: activeFieldData.height,
              },
              fieldName: activeFieldData.fieldName,
              color: activeFieldData.recipientColor,
              pagePositions: { [i]: [{ x, y }] },
              email: activeFieldData.email,
            });
          }
        }
      }
      setDraggedData(updatedDraggedData);
    }
  };

  const handleBgCLicked = () => {
    if (screenValue != "viewDocument") {
      setIsAnyFieldClicked(false);
    }
  };

  const findSignerByTemplateRec = (templateRec) => {
    return signerOptions.find((signer) => signer.templateRec === templateRec);
  };

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

  const findRecipientEmailId = (templateRecId, createdBy, templateId) => {
    const recipient = recipientTempData.find(
      (rec) =>
        rec.id === templateRecId &&
        rec.role === 1 &&
        rec.created_by === createdBy &&
        rec.template_id === templateId
    );
    return recipient ? recipient.emailId : "Unknown Recipient";
  };

  const updateDownloadSignData = (updatedData) => {
    setDownloadDraggedData(updatedData);
  };

  const removeSignatureDataFromDraggedData = (currentField) => {
    const updatedDraggedData = draggedData.map((field) => {
      if (
        field.fieldName === currentField &&
        field.email === loggedInUserDetail.user.email &&
        field.signatureData
      ) {
        const { signatureData, ...remainingField } = field;
        return remainingField;
      }
      return field;
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    setDownloadDraggedData(updatedDraggedData);
    updateDownloadSignData(updatedDraggedData);
  };

  // applySignatureData, selectedSignatureSubTabIndex, applySignatureTextData, removeSignatureDataFromDraggedData, setPopupSignVisible, applySignatureDrawingData, applySignatureImageData,
  // finalizeSignature in pdfutils
  const handleSignatureDone = () => {
    let signatureData = applySignatureData;
    setIsSigned(true);
    if (selectedSignatureSubTabIndex === 0) {
      if (applySignatureTextData == null) {
        removeSignatureDataFromDraggedData("Signature");
        setPopupSignVisible(false);
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
      if (applySignatureDrawingData == null) {
        removeSignatureDataFromDraggedData("Signature");
        setPopupSignVisible(false);
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
        removeSignatureDataFromDraggedData("Signature");
        setPopupSignVisible(false);
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

  // draggedData, signatureData, screenValue, tempYEs, fetchTempApplyRecipientById, loggedInUserDetail.user.email ,
  const finalizeSignature = async (signatureData) => {
    const updatedDraggedData = [...draggedData];
    if (screenValue === "Document" && tempYEs === "yes") {
      const fetchPromises = [];
      for (const field of updatedDraggedData) {
        if (field.fieldName === "Signature") {
          const abc = await fetchTempApplyRecipientById(field.signerId);
          fetchPromises.push(abc);
        }
      }
      const fetchedRecipientDetails = await Promise.all(fetchPromises);
      const matchingRecipients = fetchedRecipientDetails.filter(
        (recipient) => recipient.email === loggedInUserDetail.user.email
      );
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Signature" &&
          matchingRecipients.some(
            (recipient) => recipient.id === field.signerId
          )
        ) {
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
    } else {
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Signature" &&
          (field.email === loggedInUserDetail.user.email ||
            field.name === "You")
        ) {
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
    }
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    setDownloadDraggedData(updatedDraggedData);
    updateDownloadSignData(updatedDraggedData);
  };

  const handleInitialsDone = () => {
    let initialData = applyInitialsData;
    if (selectedInitialsSubTabIndex === 0) {
      if (applyInitialsTextData == null) {
        removeSignatureDataFromDraggedData("Initials");
        setPopupSignVisible(false);
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
        removeSignatureDataFromDraggedData("Initials");
        setPopupSignVisible(false);
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
        removeSignatureDataFromDraggedData("Initials");
        setPopupSignVisible(false);
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

  const finalizeInitials = async (initialData) => {
    const updatedDraggedData = [...draggedData];
    if (screenValue === "Document" && tempYEs === "yes") {
      const fetchPromises = [];
      for (const field of updatedDraggedData) {
        if (field.fieldName === "Initials") {
          const initialData = await fetchTempApplyRecipientById(field.signerId);
          fetchPromises.push(initialData);
        }
      }
      const fetchedRecipientDetails = await Promise.all(fetchPromises);
      const matchingRecipients = fetchedRecipientDetails.filter(
        (recipient) => recipient.email === loggedInUserDetail.user.email
      );

      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Initials" &&
          matchingRecipients.some(
            (recipient) => recipient.id === field.signerId
          )
        ) {
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
    } else {
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Initials" &&
          (field.email === loggedInUserDetail.user.email ||
            field.name === "You")
        ) {
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
    }
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    setDownloadDraggedData(updatedDraggedData);
    updateDownloadSignData(updatedDraggedData);
  };

  const handleCompanyStampDone = () => {
    let companyStampData = applyCompanyStampData;
    if (applyCompanyStampData == null) {
      removeSignatureDataFromDraggedData("Company Stamp");
      setPopupSignVisible(false);
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

  const finalizeCompanyStamp = async (companyStampData) => {
    const updatedDraggedData = [...draggedData];
    if (screenValue === "Document" && tempYEs === "yes") {
      const fetchPromises = [];
      for (const field of updatedDraggedData) {
        if (field.fieldName === "Company Stamp") {
          const stampdata = await fetchTempApplyRecipientById(field.signerId);
          fetchPromises.push(stampdata);
        }
      }
      const fetchedRecipientDetails = await Promise.all(fetchPromises);
      const matchingRecipients = fetchedRecipientDetails.filter(
        (recipient) => recipient.email === loggedInUserDetail.user.email
      );
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Company Stamp" &&
          matchingRecipients.some(
            (recipient) => recipient.id === field.signerId
          )
        ) {
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
    } else {
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Company Stamp" &&
          (field.email === loggedInUserDetail.user.email ||
            field.name === "You")
        ) {
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
    }
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    setDownloadDraggedData(updatedDraggedData);
    updateDownloadSignData(updatedDraggedData);
  };

  const handleDateDone = async () => {
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
    const updatedDraggedData = [...draggedData];
    if (screenValue === "Document" && tempYEs === "yes") {
      const fetchPromises = [];
      for (const field of updatedDraggedData) {
        if (field.fieldName === "Date") {
          const datedata = await fetchTempApplyRecipientById(field.signerId);
          fetchPromises.push(datedata);
        }
      }
      const fetchedRecipientDetails = await Promise.all(fetchPromises);
      const matchingRecipients = fetchedRecipientDetails.filter(
        (recipient) => recipient.email === loggedInUserDetail.user.email
      );
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Date" &&
          matchingRecipients.some(
            (recipient) => recipient.id === field.signerId
          )
        ) {
          const { x, y, width, height, pageNum } = field;

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          context.fillStyle = "transparent";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.font = "12px Inter";
          context.fillStyle = "black";
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
    } else {
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Date" &&
          (field.email === loggedInUserDetail.user.email ||
            field.name === "You")
        ) {
          const { x, y, width, height, pageNum } = field;

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;

          context.fillStyle = "transparent";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.font = "12px Inter";
          context.fillStyle = "black";
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
    }

    setDraggedData(updatedDraggedData);
    setDownloadDraggedData(updatedDraggedData);
    updateDownloadSignData(updatedDraggedData);
  };

  const handleNameDone = async () => {
    const fontStyles = [
      "20px Brush Script MT",
      "20px Times New Roman",
      "20px Lucida Handwriting",
      "20px Pacifico",
    ];

    const currentFontStyle = fontStyles[fontStyleIndex];
    setFontStyleIndex((prevIndex) => (prevIndex + 1) % fontStyles.length);
    const currentName = loggedInUserDetail.user.full_name;
    const updatedDraggedData = [...draggedData];
    if (screenValue === "Document" && tempYEs === "yes") {
      const fetchPromises = [];
      for (const field of updatedDraggedData) {
        if (field.fieldName === "Name") {
          const namedata = await fetchTempApplyRecipientById(field.signerId);
          fetchPromises.push(namedata);
        }
      }
      const fetchedRecipientDetails = await Promise.all(fetchPromises);
      const matchingRecipients = fetchedRecipientDetails.filter(
        (recipient) => recipient.email === loggedInUserDetail.user.email
      );

      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Name" &&
          matchingRecipients.some(
            (recipient) => recipient.id === field.signerId
          )
        ) {
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
    } else {
      updatedDraggedData.forEach((field) => {
        if (
          field.fieldName === "Name" &&
          (field.email === loggedInUserDetail.user.email ||
            field.name === "You")
        ) {
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
    }
    setDraggedData(updatedDraggedData);
    setDownloadDraggedData(updatedDraggedData);
    updateDownloadSignData(updatedDraggedData);
  };

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

  useEffect(() => {
    if (screenValue == "Document" && tempYEs == "yes") {
      setDownloadDraggedData(draggedDataTemp);
    }
  }, [draggedDataTemp]);

  const handleEditDragStop = (recipientIndex, newX, newY, recipient) => {
    setUpdatedEditRecipients((prevRecipients) => {
      const newRecipients = [...prevRecipients];
      newRecipients[recipientIndex] = {
        ...newRecipients[recipientIndex],
        x: newX,
        y: newY,
        id: recipient.id,
        createdBy: recipient.created_by,
        role: recipient.role,
        recUniqueId: recipient.recBoxid,
      };

      return newRecipients;
    });
  };

  const handleEditResizeStop = (recipientIndex, newWidth, newHeight, recID) => {
    setUpdatedEditRecipients((prevRecipients) => {
      const newRecipients = [...prevRecipients];
      newRecipients[recipientIndex] = {
        ...newRecipients[recipientIndex],
        width: newWidth,
        height: newHeight,
        id: recID,
      };
      return newRecipients;
    });
  };

  return (
    <>
      {loading ? <LoadPanel visible="true" /> : ""}
      <div
        className="main-container"
        onClick={() => {
          handleBgCLicked();
        }}
      >
        {screenValue && screenValue === "Template" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              onSelectedSignerChange={handleSelectedSignerChange}
              loggedInUserDetail={loggedInUserDetail}
              setApplySignatureData={setApplySignatureData}
              applySignatureData={applySignatureData}
              setSignatureCanvas={setSignatureCanvas}
              signatureCanvas={signatureCanvas}
            />
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {draggedData &&
                                draggedData.map((recipient, i) => {
                                  const pagePositions =
                                    recipient.pagePositions[index];
                                  if (
                                    recipient.id &&
                                    pagePositions &&
                                    pagePositions.length > 0
                                  ) {
                                    const isDateField =
                                      recipient.fieldName === "Date" ||
                                      recipient.fieldName === "Name";
                                    const minWidth = isDateField ? 100 : 80;
                                    const minHeight = isDateField ? 50 : 40;

                                    return pagePositions.map((position, j) => (
                                      <Rnd
                                        key={`${i}_${j}`}
                                        bounds="parent"
                                        size={recipient.size}
                                        position={{
                                          x: position.x,
                                          y: position.y,
                                        }}
                                        className="drag-box"
                                        style={{
                                          backgroundColor: recipient.color,
                                        }}
                                        // minWidth={dimensions.minWidth}
                                        // minHeight={dimensions.minHeight}
                                        minWidth={minWidth}
                                        minHeight={minHeight}
                                        maxWidth={dimensions.maxWidth}
                                        maxHeight={dimensions.maxHeight}
                                        enableResizing={{
                                          topRight: true,
                                          bottomRight: true,
                                          bottomLeft: true,
                                          topLeft: true,
                                        }}
                                        onDragStop={(e, d) => {
                                          handleRecipientDrag(
                                            recipient.id,
                                            d,
                                            index
                                          );
                                        }}
                                        onResizeStop={(
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          handleRecipientResize(
                                            recipient.id,
                                            ref.style.width,
                                            ref.style.height,
                                            position,
                                            index,
                                            recipient
                                          );
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDragDropBoxClicked(recipient);
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
                                        <IconDelete
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRecipient(
                                              recipient.id,
                                              e
                                            );
                                          }}
                                          className="recipient-box-delete"
                                        />
                                      </Rnd>
                                    ));
                                  }
                                  return null;
                                })}

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
            </div>
          </>
        )}

        {screenValue && screenValue === "Document" && tempYEs === "yes" && (
          <>
            <div className="main-pdf-container-viewDetails">
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

                              {draggedDataTemp &&
                                draggedDataTemp.map((recipient, i) => {
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

                                    const recEmail = findRecipientEmailId(
                                      recipient.templateRec,
                                      recipient.created_by,
                                      recipient.template
                                    );

                                    const signatureData =
                                      recipient.signatureData;

                                    // Render draggable box if signature data is not available
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
                                            if (
                                              loggedInUserDetail.user.email ===
                                              recEmail
                                            ) {
                                              setApplyTempSelfSignEmail(
                                                recEmail
                                              );
                                              handleApplySignatureModal(
                                                recipient
                                              );
                                            }

                                            if (recipient.fieldName == "Name") {
                                              handleNameDone();
                                            } else if (
                                              recipient.fieldName == "Date"
                                            ) {
                                              handleDateDone();
                                            }
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          </>
        )}

        {screenValue && screenValue === "Document" && tempYEs === "no" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              onSelectedSignerChange={handleSelectedSignerChange}
              loggedInUserDetail={loggedInUserDetail}
              setApplySignatureData={setApplySignatureData}
              applySignatureData={applySignatureData}
              setSignatureCanvas={setSignatureCanvas}
              signatureCanvas={signatureCanvas}
              handleSignatureDone={handleSignatureDone}
              editPenSignPopupVisible={editPenSignPopupVisible}
              setPopupSignVisible={setPopupSignVisible}
              popupSignVisible={popupSignVisible}
              setInitialsCanvas={setInitialsCanvas}
              initialsCanvas={initialsCanvas}
              setApplyInitialsData={setApplyInitialsData}
              applyInitialsData={applyInitialsData}
              handleInitialsDone={handleInitialsDone}
              setApplyCompanyStampData={setApplyCompanyStampData}
              applyCompanyStampData={applyCompanyStampData}
              handleCompanyStampDone={handleCompanyStampDone}
              setSignatureTextData={setSignatureTextData}
              signatureTextData={signatureTextData}
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {draggedData &&
                                draggedData.map((recipient, i) => {
                                  const pagePositions =
                                    recipient.pagePositions[index];
                                  if (
                                    recipient.id &&
                                    pagePositions &&
                                    pagePositions.length > 0
                                  ) {
                                    const signatureData =
                                      recipient.signatureData;

                                    const isDateField =
                                      recipient.fieldName === "Date" ||
                                      recipient.fieldName === "Name";

                                    const minWidth = isDateField ? 100 : 80;
                                    const minHeight = isDateField ? 50 : 40;

                                    if (!signatureData) {
                                      return pagePositions.map(
                                        (position, j) => (
                                          <Rnd
                                            key={`${i}_${j}`}
                                            bounds="parent"
                                            size={recipient.size}
                                            position={{
                                              x: position.x,
                                              y: position.y,
                                            }}
                                            className="drag-box"
                                            style={{
                                              backgroundColor: recipient.color,
                                              height: "auto",
                                            }}
                                            // minWidth={dimensions.minWidth}
                                            // minHeight={dimensions.minHeight}
                                            minWidth={minWidth}
                                            minHeight={minHeight}
                                            maxWidth={dimensions.maxWidth}
                                            maxHeight={dimensions.maxHeight}
                                            enableResizing={{
                                              topRight: true,
                                              bottomRight: true,
                                              bottomLeft: true,
                                              topLeft: true,
                                            }}
                                            onDragStop={(e, d) => {
                                              handleRecipientDrag(
                                                recipient.id,
                                                d,
                                                index
                                              );
                                            }}
                                            onResizeStop={(
                                              e,
                                              direction,
                                              ref,
                                              delta,
                                              position
                                            ) => {
                                              handleRecipientResize(
                                                recipient.id,
                                                ref.style.width,
                                                ref.style.height,
                                                position,
                                                index
                                              );
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDragDropBoxClicked(
                                                recipient
                                              );
                                              if (
                                                recipient.fieldName == "Name"
                                              ) {
                                                handleNameDone();
                                              } else if (
                                                recipient.fieldName == "Date"
                                              ) {
                                                handleDateDone();
                                              }
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
                                            <IconDelete
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRecipient(
                                                  recipient.id,
                                                  e
                                                );
                                              }}
                                              className="recipient-box-delete"
                                            />
                                          </Rnd>
                                        )
                                      );
                                    } else {
                                      const isDateField =
                                        recipient.fieldName === "Date" ||
                                        recipient.fieldName === "Name";
                                      const minWidth = isDateField ? 100 : 80;
                                      const minHeight = isDateField ? 50 : 40;

                                      return pagePositions.map(
                                        (position, j) => (
                                          <div
                                            className="drag-box"
                                            key={i}
                                            style={{
                                              position: "absolute",
                                              left: signatureData.x,
                                              top: signatureData.y,
                                              width: signatureData.width,
                                              height: signatureData.height,
                                              // height: "auto",
                                              minWidth: minWidth,
                                              minHeight: minHeight,
                                              backgroundColor: recipient.color,
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDragDropBoxClicked(
                                                recipient
                                              );
                                              if (
                                                recipient.fieldName == "Name"
                                              ) {
                                                handleNameDone();
                                              } else if (
                                                recipient.fieldName == "Date"
                                              ) {
                                                handleDateDone();
                                              }
                                            }}
                                          >
                                            <img
                                              src={signatureData.imageData}
                                              alt={`Value for ${recipient.fieldName} field`}
                                            />
                                          </div>
                                        )
                                      );
                                    }
                                  }
                                  return null;
                                })}

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
            </div>
          </>
        )}

        {screenValue && screenValue === "viewDocument" && (
          <>
            <div className="main-pdf-container-viewDetails">
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {screenValue && screenValue === "BulkSigning" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              loggedInUserDetail={loggedInUserDetail}
              // onFieldActivation={handleFieldActivation}
              setPopupSignVisible={setPopupSignVisible}
              onSelectedSignerChange={handleSelectedSignerChange}
              setApplySignatureData={setApplySignatureData}
              applySignatureData={applySignatureData}
              setSignatureCanvas={setSignatureCanvas}
              signatureCanvas={signatureCanvas}
              handleSignatureDone={handleSignatureDone}
              editPenSignPopupVisible={editPenSignPopupVisible}
              popupSignVisible={popupSignVisible}
              setInitialsCanvas={setInitialsCanvas}
              initialsCanvas={initialsCanvas}
              setApplyInitialsData={setApplyInitialsData}
              applyInitialsData={applyInitialsData}
              handleInitialsDone={handleInitialsDone}
              setApplyCompanyStampData={setApplyCompanyStampData}
              applyCompanyStampData={applyCompanyStampData}
              handleCompanyStampDone={handleCompanyStampDone}
              setSignatureTextData={setSignatureTextData}
              signatureTextData={signatureTextData}
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {draggedData &&
                                draggedData.map((recipient, i) => {
                                  const pagePositions =
                                    recipient.pagePositions[index];
                                  if (
                                    recipient.id &&
                                    pagePositions &&
                                    pagePositions.length > 0
                                  ) {
                                    const signatureData =
                                      recipient.signatureData;

                                    const isDateField =
                                      recipient.fieldName === "Date" ||
                                      recipient.fieldName === "Name";

                                    const minWidth = isDateField ? 100 : 80;
                                    const minHeight = isDateField ? 50 : 40;

                                    if (!signatureData) {
                                      return pagePositions.map(
                                        (position, j) => (
                                          <Rnd
                                            key={`${i}_${j}`}
                                            bounds="parent"
                                            size={recipient.size}
                                            position={{
                                              x: position.x,
                                              y: position.y,
                                            }}
                                            className="drag-box"
                                            style={{
                                              backgroundColor: recipient.color,
                                              height: "auto",
                                            }}
                                            // minWidth={dimensions.minWidth}
                                            // minHeight={dimensions.minHeight}
                                            minWidth={minWidth}
                                            minHeight={minHeight}
                                            maxWidth={dimensions.maxWidth}
                                            maxHeight={dimensions.maxHeight}
                                            enableResizing={{
                                              topRight: true,
                                              bottomRight: true,
                                              bottomLeft: true,
                                              topLeft: true,
                                            }}
                                            onDragStop={(e, d) => {
                                              handleRecipientDrag(
                                                recipient.id,
                                                d,
                                                index
                                              );
                                            }}
                                            onResizeStop={(
                                              e,
                                              direction,
                                              ref,
                                              delta,
                                              position
                                            ) => {
                                              handleRecipientResize(
                                                recipient.id,
                                                ref.style.width,
                                                ref.style.height,
                                                position,
                                                index
                                              );
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDragDropBoxClicked(
                                                recipient
                                              );
                                              if (
                                                recipient.fieldName == "Name"
                                              ) {
                                                handleNameDone();
                                              } else if (
                                                recipient.fieldName == "Date"
                                              ) {
                                                handleDateDone();
                                              }
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
                                            <IconDelete
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteRecipient(
                                                  recipient.id,
                                                  e
                                                );
                                              }}
                                              className="recipient-box-delete"
                                            />
                                          </Rnd>
                                        )
                                      );
                                    } else {
                                      const isDateField =
                                        recipient.fieldName === "Date" ||
                                        recipient.fieldName === "Name";
                                      const minWidth = isDateField ? 100 : 80;
                                      const minHeight = isDateField ? 50 : 40;

                                      return pagePositions.map(
                                        (position, j) => (
                                          <div
                                            className="drag-box"
                                            key={i}
                                            style={{
                                              position: "absolute",
                                              left: signatureData.x,
                                              top: signatureData.y,
                                              width: signatureData.width,
                                              height: signatureData.height,
                                              // height: "auto",
                                              minWidth: minWidth,
                                              minHeight: minHeight,
                                              backgroundColor: recipient.color,
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDragDropBoxClicked(
                                                recipient
                                              );
                                              if (
                                                recipient.fieldName === "Name"
                                              ) {
                                                handleNameDone();
                                              } else if (
                                                recipient.fieldName === "Date"
                                              ) {
                                                handleDateDone();
                                              }
                                            }}
                                          >
                                            <img
                                              src={signatureData.imageData}
                                              alt={`Value for ${recipient.fieldName} field`}
                                            />
                                          </div>
                                        )
                                      );
                                    }
                                  }
                                  return null;
                                })}

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
            </div>
          </>
        )}

        {screenValue && screenValue === "editTemplate" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={selectedRowDataTemp?.recData}
              onSelectedSignerChange={handleSelectedSignerChange}
            />
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {draggedData &&
                                draggedData.map((recipient, i) => {
                                  const pagePositions =
                                    recipient.pagePositions[index];
                                  if (
                                    recipient.id &&
                                    pagePositions &&
                                    pagePositions.length > 0
                                  ) {
                                    const isDateField =
                                      recipient.fieldName === "Date" ||
                                      recipient.fieldName === "Name";
                                    const minWidth = isDateField ? 100 : 80;
                                    const minHeight = isDateField ? 50 : 40;

                                    return pagePositions.map((position, j) => (
                                      <Rnd
                                        key={`${i}_${j}`}
                                        bounds="parent"
                                        size={recipient.size}
                                        position={{
                                          x: position.x,
                                          y: position.y,
                                        }}
                                        className="drag-box"
                                        style={{
                                          backgroundColor: recipient.color,
                                        }}
                                        // minWidth={dimensions.minWidth}
                                        // minHeight={dimensions.minHeight}
                                        minWidth={minWidth}
                                        minHeight={minHeight}
                                        maxWidth={dimensions.maxWidth}
                                        maxHeight={dimensions.maxHeight}
                                        enableResizing={{
                                          topRight: true,
                                          bottomRight: true,
                                          bottomLeft: true,
                                          topLeft: true,
                                        }}
                                        onDragStop={(e, d) => {
                                          handleRecipientDrag(
                                            recipient.id,
                                            d,
                                            index
                                          );
                                        }}
                                        onResizeStop={(
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          handleRecipientResize(
                                            recipient.id,
                                            ref.style.width,
                                            ref.style.height,
                                            position,
                                            index,
                                            recipient
                                          );
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDragDropBoxClicked(recipient);
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
                                        <IconDelete
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRecipient(
                                              recipient.id,
                                              e
                                            );
                                          }}
                                          className="recipient-box-delete"
                                        />
                                      </Rnd>
                                    ));
                                  }
                                  return null;
                                })}

                     
                              {editRecData &&
                                editRecData.flat().map((recipient, i) => {
                                  const recfullName =
                                    selectedRowDataTemp?.recData.find(
                                      (rec) => rec.id === recipient.templateRec
                                    );

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
                                    const isDateField =
                                      recipient.fieldName === "Date" ||
                                      recipient.fieldName === "Name";
                                    const minWidth = isDateField ? 100 : 80;
                                    const minHeight = isDateField ? 50 : 40;

                                    return (
                                      <Rnd
                                        key={i}
                                        bounds="parent"
                                        default={{
                                          x: recipient.x,
                                          y: recipient.y,
                                          width: recipient.width,
                                          height: recipient.height,
                                        }}
                                        minWidth={minWidth}
                                        minHeight={minHeight}
                                        maxWidth={dimensions.maxWidth}
                                        maxHeight={dimensions.maxHeight}
                                        className="drag-box"
                                        style={{
                                          backgroundColor: recipient.color,
                                          position: "absolute",
                                        }}
                                        onDragStop={(e, d) => {
                                          console.log(
                                            "recipient.id",
                                            recipient
                                          );
                                          handleEditDragStop(
                                            i,
                                            d.x,
                                            d.y,
                                            recipient
                                          );
                                        }}
                                        onResizeStop={(
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          handleEditResizeStop(
                                            i,
                                            parseFloat(ref.style.width),
                                            parseFloat(ref.style.height),
                                            recipient.id
                                          );
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDragDropBoxClicked(
                                            recipient,
                                            recfullName
                                          );
                                        }}
                                      >
                                        <div className="recipient-box">
                                          <div className="recipient-box-data">
                                            <p className="dropped-box-field-name">
                                              {recipient.fieldName}
                                            </p>
                                            <p className="dropped-box-recipient-name">
                                              {recfullName?.name}
                                            </p>
                                          </div>
                                        </div>
                                      </Rnd>
                                    );
                                  }
                                  return null;
                                })}

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
            </div>
          </>
        )}

        <SidebarRight
          screenValue={screenValue}
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
          // onFieldActivation={handleFieldActivation}
          pdfFile={selectedFile}
          activeFieldId={activeFieldId}
          pdfFileName={pdfFileName}
          isAnyFieldClicked={isAnyFieldClicked}
          // activeFieldName={activeFieldName}
          // activeRecipientName={activeRecipientName}
          activeFieldData={activeFieldData}
          title={title}
          handleDeleteRecipient={handleDeleteRecipient}
          copyCurrentBoxToAllPages={copyCurrentBoxToAllPages}
          copyCurrentBoxToBelowPages={copyCurrentBoxToBelowPages}
        />
      </div>
    </>
  );
}

export default DocumentMain;
