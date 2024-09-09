///////////////// code after submission 26june
import Header from "../Header2/Header";
import React, { useState, useRef, useEffect } from "react";
import "./dashUI.scss";
import { LoadPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import DocumentUpload from "./DocumentUpload";
import EmailMessageSection from "./EmailMessageSection";
import ExpirationDateSection from "./ExpirationDateSection";
import DocumentNameSection from "./DocumentNameSection";
import TemplateSelectionSection from "./TemplateSelectionSection";
import List, { ItemDragging } from "devextreme-react/list";
import RecipientItem from "./RecipientItem";
import ApplyTemplateRecipientItem from "./ApplyTemplateRecipientItem";
import { useLocation } from "react-router-dom";
import { getNumberOfPages } from "../../manageUser/signatureSetup/PdfUtils";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CheckboxLine } from "../../../icons/checkbox-line page-2.svg";
import { ReactComponent as Checkboxblankline } from "../../../icons/checkbox-blank-line_page-2.svg";
import MultipleDocumentUpload from "./MultipleDocumentUpload";
import Tooltip from "devextreme-react/tooltip";
import {
  addTemplateRecipient,
  createTemplate,
  fetchCurrentUser,
  fetchRecipientsByTemplateId,
  fetchTemplates,
  fetchUserDetails,
  saveDocument,
  saveMultipleDocument,
} from "../../../api/UserDashboardAPI";
import { useAuth } from "../../../contexts/auth";

function DashUI() {
  const { user, userDetailAuth } = useAuth();
  const [multipleErrorMessage, setMultipleErrorMessage] = useState([]);
  const [multipleImageDetails, setMultipleImageDetails] = useState([]);
  const [multipleSelectedImage, setMultipleSelectedImage] = useState([]);
  const [multipleNumberOfPages, setMultipleNumberOfPages] = useState([]);
  const [multipleDocName, setMultipleDocName] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTemplateOptionsSelected, setIsTemplateOptionsSelected] =
    useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [screenValue, setScreenValue] = useState("");
  const [firstCheckboxChecked, setFirstCheckboxChecked] = useState(false);
  const [secondCheckboxChecked, setSecondCheckboxChecked] = useState(false);
  const location = useLocation();
  const [documentData, setDocumentData] = useState(null);
  const [documentBase64File, setDocumentBase64File] = useState("");
  const docId = location.state?.docId;
  // const [showTooltip, setShowTooltip] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipTarget, setTooltipTarget] = useState(null);
  const [addYourselfUsed, setAddYourselfUsed] = useState({});
  const [defaultDocumentTitle, setDefaultDocumentTitle] = useState("");

  const [OnceClicked, setOnceClicked] = useState(true);
  const [showSections, setShowSections] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [expirationDays, setExpirationDays] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("");
  const [reminderDays, setReminderDays] = useState(0); // Default reminder days
  const [isTemplateDataInitalized, setIsTemplateDataInitalized] =
    useState(false);

  const [docName, setDocName] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedRowData = location.state?.selectedRowData;

  const handleFirstCheckboxChange = () => {
    if (firstCheckboxChecked) {
      setEmailAction(""); // Clear action or set to a default value
      setFirstCheckboxChecked(false); // Uncheck the first checkbox
    } else {
      setEmailAction("C");
      setFirstCheckboxChecked(true); // Set the first checkbox to checked
      setSecondCheckboxChecked(false); // Uncheck the second checkbox
      // setShowTooltip(true);
    }
  };

  const handleSecondCheckboxChange = () => {
    if (secondCheckboxChecked) {
      setEmailAction(""); // Clear action or set to a default value
      setFirstCheckboxChecked(false); // Uncheck the first checkbox
      setSecondCheckboxChecked(false); // Uncheck the second checkbox
    } else {
      setEmailAction("S");
      setFirstCheckboxChecked(false); // Uncheck the first checkbox
      setSecondCheckboxChecked(true); // Set the second checkbox to checked
    }
  };

  const handleMouseEnter = (content, target) => {
    setTooltipContent(content);
    setTooltipTarget(target);
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageDetails(null);
    setDefaultDocumentTitle("");
    // setEmailTitle("");
    return toastDisplayer("success", "Pdf File Removed");
  };

  const [fileName, setFileName] = useState("No file selected");

  function removePdfExtension(filename) {
    // Check if the filename ends with .pdf
    if (filename.endsWith(".pdf")) {
      // Remove the .pdf extension
      return filename.slice(0, -4);
    }
    // Return the original filename if it doesn't end with .pdf
    return filename;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      // setErrorMessage("Please select a file.");
      return;
    }
    if (file.type !== "application/pdf") {
      setErrorMessage("Invalid File Type, only pdf are allowed!");
      return;
    }

    const maxSizeInBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Pdf size must be less than 25MB.");
      return;
    }

    setSelectedImage(file);
    sessionStorage.setItem("filesDataBackup", file);

    toastDisplayer("success", "Pdf File Uploaded");

    const { name, size } = file;
    const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
    setImageDetails({ name, size: formattedSize });
    setErrorMessage(null);

    const defaultDocEmailTitle = name.replace(/\.pdf$/i, "");
    setDefaultDocumentTitle(defaultDocEmailTitle);
    setEmailTitle("Request for signing / reviewing document");

    // Set the file name for the tooltip
    setFileName(name);

    const filteredName = removePdfExtension(name);
    setDocName(filteredName);

    event.target.value = null;
  };

  const goBackData = sessionStorage.getItem("goBackData");

  const documentOptions = ["Signer", "Viewer"];
  const [templateOption, setTemplateOption] = useState([]);
  const [recipientData, setRecipientData] = useState([
    {
      id: 1,
      fullName: "",
      emailId: "",
      role: "",
      testID: 1,
    },
  ]);
  /// GO BACK DATA Function

  const { backUpdocId, backUpSelectedFile } = location.state || {};
  function getStringBeforeLastUnderscore(input) {
    // Check if the input is a valid string
    if (typeof input !== "string") {
      console.error("Invalid input: Expected a string.");
      return "";
    }

    // Find the last index of the underscore
    const lastUnderscoreIndex = input.lastIndexOf("_");

    // Return the substring before the last underscore
    if (lastUnderscoreIndex !== -1) {
      return input.substring(0, lastUnderscoreIndex);
    }

    // If no underscore is found, return the original string
    return input;
  }

  useEffect(() => {
    const goBackData = sessionStorage.getItem("goBackData");
    const fileData = sessionStorage.getItem("fileData");

    if (goBackData) {
      const parsedTemplate = JSON.parse(
        sessionStorage.getItem("goBackTemplate")
      );

      if (parsedTemplate) {
        setSelectedTemplate(parsedTemplate);
        setIsTemplateOptionsSelected(parsedTemplate);
      }

      const parsedData = JSON.parse(goBackData);
      const { name, size } = backUpSelectedFile;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setSelectedImage(backUpSelectedFile);

      const backupName = getStringBeforeLastUnderscore(parsedData.name);
      setDocName(backupName);
      if (parsedData.emailAction === "C") {
        setFirstCheckboxChecked(true); // Set the first checkbox to checked
        setSecondCheckboxChecked(false);
      } else if (parsedData.emailAction === "S") {
        setFirstCheckboxChecked(false); // Uncheck the first checkbox
        setSecondCheckboxChecked(true);
      }
      setReminderDays(parseInt(parsedData.reminderDays));
      setEmailMessage(parsedData.email_message);
      setEmailAction(parsedData.emailAction);
      setEmailTitle(parsedData.email_title);
      setExpirationDays(parsedData.expirationDays);
      setScheduledDate(parsedData.scheduledDate);
      const recipientDataBackUp = Array.isArray(parsedData.receipientData)
        ? parsedData.receipientData
        : [];
      const updatedRecipientData = recipientDataBackUp.map((item, index) => ({
        id: index + 1,
        fullName: item.RecipientName,
        emailId: item.RecipientEmail,
        role: item.role,
        testID: index + 1,
      }));
      setRecipientData(updatedRecipientData);
    }
  }, []);
  // for document
  const [emailTitle, setEmailTitle] = useState(
    "Request for signing / reviewing document"
  );
  const [emailMessage, setEmailMessage] = useState("");

  const handleemailTitle = (e) => {
    setEmailTitle(e.value);
  };

  const handleEmailMessage = (e) => {
    setEmailMessage(e.value);
  };

  useEffect(() => {
    // const fetchTemplateOptions = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetchTemplates(user, creatorid);
    //     setLoading(false);
    //     setLoading(true);
    //     const templatesWithData = await Promise.all(
    //       response.map(async (template) => {

    //         const recipientResponse = await fetchRecipientsByTemplateId(
    //           template.template_id,
    //           user
    //         );
    //         template.recipientData = recipientResponse;
    //         return template;
    //       })
    //     );
    //     setLoading(false);
    //     console.log("templatesWithData:",templatesWithData)
    //     setTemplateOption(templatesWithData);
    //     if (selectedTemplate) {
    //       setRecipientData([]);
    //       const queryParams = new URLSearchParams(location.search);
    //       const docid = queryParams.get("docId");
    //       let tempData = selectedTemplate.recData;

    //       if (docid !== null && isTemplateDataInitalized === false) {
    //         setIsTemplateDataInitalized(true);
    //         tempData.map((e, index) => {
    //           const recipient = recipientData[index] || {};
    //           const data = {
    //             created_by: e.created_by,
    //             name: e.name,
    //             role: e.role,
    //             template_id: e.template,
    //             id: e.id,
    //             fullName: recipient.fullName ? recipient.fullName : "",
    //             emailId: recipient.emailId ? recipient.emailId : "",
    //             testID: index + 1,
    //           };

    //           return setRecipientData((prevData) => [...prevData, data]);
    //         });
    //       } else {
    //         tempData.map((e, index) => {
    //           var data = {
    //             created_by: e.created_by,
    //             name: e.name,
    //             role: e.role,
    //             template_id: e.template,
    //             id: e.id,
    //             fullName: "",
    //             emailId: "",
    //             testID: index + 1,
    //           };
    //           setRecipientData((prevData) => [...prevData, data]);
    //         });
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error fetching template options:", error);
    //   }
    // };

    const fetchTemplateOptions = async () => {
      try {
        setLoading(true);
        const response = await fetchTemplates(user, creatorid);
        setTemplateOption(response);
        setLoading(false);
        if (selectedTemplate) {
          setLoading(true);
          const recipientResponse = await fetchRecipientsByTemplateId(
            selectedTemplate?.tempid || selectedTemplate?.template_id,
            user
          );
          selectedTemplate.recData = recipientResponse;
    
          setLoading(false);
          setTemplateOption((prevOptions) =>
            prevOptions.map((template) =>
              template.template_id === selectedTemplate.tempid
                ? { ...template, recipientData: recipientResponse }
                : template
            )
          );
          setRecipientData([]);
          const queryParams = new URLSearchParams(location.search);
          const docid = queryParams.get("docId");
          let tempData = selectedTemplate.recData || [];
          if (docid !== null && isTemplateDataInitalized === false) {
            setIsTemplateDataInitalized(true);
            tempData.forEach((e, index) => {
              const recipient = recipientResponse[index] || {};
              const data = {
                created_by: e.created_by,
                name: e.name,
                role: e.role,
                template_id: e.template,
                id: e.id,
                fullName: recipient.fullName ? recipient.fullName : "",
                emailId: recipient.emailId ? recipient.emailId : "",
                testID: index + 1,
              };
    
              setRecipientData((prevData) => [...prevData, data]);
            });
          } else {
            tempData.forEach((e, index) => {
              var data = {
                created_by: e.created_by,
                name: e.name,
                role: e.role,
                template_id: e.template,
                id: e.id,
                fullName: "",
                emailId: "",
                testID: index + 1,
              };
              setRecipientData((prevData) => [...prevData, data]);
            });
          }
        }
      } catch (error) {
        console.error("Error fetching template options:", error);
      }
    };
    
    

    fetchTemplateOptions();
  }, [selectedTemplate]);

  const handleAddRecipient = () => {
    const newId = recipientData.length + 1;
    var newRecipient = {
      id: newId,
      fullName: "",
      emailId: "",
      role: "",
      testID: newId,
    };
    setRecipientData((prevData) => [...prevData, newRecipient]);
  };

  const handleDeleteRecipient = (id) => {
    if (recipientData.length === 1) {
      return;
    }
    setRecipientData((prevData) => {
      const newData = prevData.filter((recipient) => recipient.id !== id);
      newData.forEach((recipient, index) => {
        recipient.testID = index + 1;
        recipient.id = index + 1;
      });

      return newData;
    });
    // if (addYourselfUsed[id]) {
    //   setOnceClicked(true);
    //   setAddYourselfUsed((prevState) => {
    //     const newState = { ...prevState };
    //     delete newState[id];
    //     return newState;
    //   });
    // }
    if (addYourselfUsed[id]) {
      setOnceClicked(true);
      setAddYourselfUsed((prevState) => {
        const newState = { ...prevState };
        delete newState[id];
        return newState;
      });
    }
  };

  useEffect(() => {
    if (recipientData.length === 1 && addYourselfUsed[recipientData[0].id]) {
      setShowSections(false);
    } else {
      setShowSections(true);
    }
  }, [recipientData, addYourselfUsed]);

  // const handleRecipientChange = (id, field, value) => {
  //   setRecipientData((prevData) =>
  //     prevData.map((item) => {
  //       if (item.id === id) {
  //         return { ...item, [field]: value };
  //       }
  //       return item;
  //     })
  //   );
  // };

  useEffect(() => {
    console.log("Updated addYourselfUsed:", addYourselfUsed);
    console.log("OnceClicked State:", OnceClicked);
  }, [addYourselfUsed, OnceClicked]);

  // const handleRecipientChange = (id, field, value) => {
  //   setRecipientData((prevData) =>
  //     prevData.map((item) => {
  //       if (item.id === id) {
  //         // Check if the field being updated is part of the addYourselfUsed check
  //         if (field === 'fullName' || field === 'emailId') {
  //           if (addYourselfUsed[id] && addYourselfUsed[id] !== value) {
  //             const newAddYourselfUsed = { ...addYourselfUsed };
  //             delete newAddYourselfUsed[id]; // Remove the entry if it no longer matches
  //             setAddYourselfUsed(newAddYourselfUsed);
  //           }
  //         }
  //         return { ...item, [field]: value };
  //       }
  //       return item;
  //     })
  //   );
  // };
  const handleRecipientChange = (id, field, value) => {
    setRecipientData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          // Update recipient data with the new value
          const updatedItem = { ...item, [field]: value };

          // Check if the field being updated is 'fullName' and if it should affect `addYourselfUsed`
          if (field === "fullName") {
            if (addYourselfUsed[id] && addYourselfUsed[id] !== value) {
              // Remove entry from `addYourselfUsed` if the name no longer matches
              setAddYourselfUsed((prevState) => {
                const newState = { ...prevState };
                delete newState[id];
                return newState;
              });
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleChangeItemDragging = (e) => {
    rearrange(e.fromIndex, e.toIndex);
  };

  function rearrange(fromIndex, toIndex) {
    if (
      fromIndex < 0 ||
      fromIndex >= recipientData.length ||
      toIndex < 0 ||
      toIndex >= recipientData.length
    ) {
      setRecipientData(recipientData);
      return;
    }

    setRecipientData((prevData) => {
      const newData = [...prevData];
      const elementToMove = newData[fromIndex];
      newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, elementToMove);
      newData.forEach((recipient, index) => {
        recipient.testID = index + 1;
      });

      return newData;
    });
  }

  var templateValue;
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const templateValue = queryParams.get("template");
    if (templateValue) {
      setScreenValue(templateValue);
    }
  }, [location.search]);

  const [templateName, settemplateName] = useState();
  const navigate = useNavigate();
  const [creatorid, setCreatorid] = useState();

  useEffect(() => {
    const fetchuserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        // const response = await fetchUserDetails(jwtToken);
        setCreatorid(userDetailAuth.user.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchuserData();
  }, []);

  const handleProceed = async () => {
    setIsLoading(true);
    if (screenValue === "Template") {
      if (selectedImage === null) {
        setIsLoading(false);
        return toastDisplayer("error", "Upload pdf");
      }

      if (templateName === "") {
        setIsLoading(false);
        return toastDisplayer("error", "Enter Template Name!");
      }

      if (recipientData.length <= 0) {
        setIsLoading(false);
        return toastDisplayer("error", "Add default Recipient...!!");
      }

      const allRecipientsFilled = recipientData.every(
        (recipient) => recipient.fullName.trim() !== "" && recipient.role !== ""
      );

      if (!allRecipientsFilled) {
        setIsLoading(false);
        return toastDisplayer(
          "error",
          "Please fill out all recipient details."
        );
      }

      const hasSigner = recipientData.some(
        (recipient) => recipient.role === "Signer"
      );
      if (!hasSigner) {
        setIsLoading(false);
        return toastDisplayer(
          "error",
          "At least one recipient must have the role of 'Signer'."
        );
      }

      const recipientNames = recipientData.map((recipient) =>
        recipient.fullName.trim().toLowerCase()
      );
      const hasDuplicateNames = recipientNames.some(
        (name, index) => recipientNames.indexOf(name) !== index
      );

      if (hasDuplicateNames) {
        setIsLoading(false);
        return toastDisplayer("error", "Recipient names must be unique.");
      }

      if (
        templateName &&
        selectedImage &&
        creatorid &&
        recipientData &&
        allRecipientsFilled &&
        hasSigner &&
        !hasDuplicateNames
      ) {
        try {
          const tempNumPages = await getNumberOfPages(selectedImage);
          const jwtToken = localStorage.getItem("jwt");

          const templateData = {
            templateName: templateName,
            createTempfile: selectedImage.name,
            templateNumPages: tempNumPages,
            created_by: creatorid,
            user_id: creatorid,
          };

          const tempResponse = await createTemplate(templateData, jwtToken);
          if (
            tempResponse.error ===
            "Template with the same name already exists for this user."
          ) {
            setIsLoading(false);
            toastDisplayer("error", "This template name already exists!");
            return;
          }

          for (const rec of recipientData) {
            let roleid;
            if (rec.role === "Signer") {
              roleid = 1;
            } else if (rec.role === "Viewer") {
              roleid = 2;
            }

            const recipientPayload = {
              name: rec.fullName,
              created_by: creatorid,
              role: roleid,
              template: tempResponse.template_id,
              user_id: creatorid,
            };

            await addTemplateRecipient(recipientPayload);
          }

          navigate(
            `/createorsigndocument?template=Template&tid=${tempResponse.template_id}`,
            { state: { selectedFile: selectedImage } }
          );
        } catch (error) {
          setIsLoading(false);
          console.error(
            "Error fetching user data or posting template data:",
            error
          );
          if (
            error.response.data.error ===
            "Template with the same name already exists for this user."
          ) {
            toastDisplayer(
              "error",
              "Template with the same name already exists for this user."
            );
          } else {
            toastDisplayer("error", "An error occurred. Please try again.");
          }
        }
      } else {
        setIsLoading(false);
        return toastDisplayer("error", "Fill all the fields");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const docid = queryParams.get("docId");
    if (!docid) {
      sessionStorage.removeItem("fileData");
      sessionStorage.removeItem("filesDataBackup");
      sessionStorage.removeItem("goBackData");
      sessionStorage.removeItem("goBackTemplate");
    }
  }, []);
  const [numberOfPages, setNumberOfPages] = useState(null);
  const fetchNumberOfPages = async () => {
    if (selectedImage) {
      try {
        const pages = await getNumberOfPages(selectedImage);
        setNumberOfPages(pages);
      } catch (error) {
        console.error("Error calculating number of pages:", error);
        setNumberOfPages(null);
      }
    } else {
      setNumberOfPages(null);
    }
  };
  useEffect(() => {
    if (selectedTemplate) {
    }
  }, []);

  // N = NONE
  // S = Sequence
  // C = Conccurent + Sequencial
  const [getEmailAction, setEmailAction] = useState("N");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProceedDocument = async () => {
    setIsLoading(true);
    const currentDate = new Date();
    const diffTime = new Date(scheduledDate) - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (selectedImage == null) {
      setIsLoading(false);
      return toastDisplayer("error", "Please upload the pdf!!!");
    }
    if (selectedTemplate) {
      if (
        !(
          selectedTemplate.pages === numberOfPages ||
          selectedTemplate.templateNumPages === numberOfPages
        )
      ) {
        setIsLoading(false);
        return toastDisplayer(
          "error",
          "Selected Template pages should be equal to the number of pages in the selected PDF!"
        );
      }
    }

    // if (docName === null) {
    //   return toastDisplayer("error", "Please set document name...!!");
    // }
    if (!docName || docName.trim() === "") {
      setIsLoading(false);
      return toastDisplayer("error", "Please set document name...!!");
    }

    const allRecipientsFilled = recipientData.every(
      (recipient) =>
        recipient.fullName.trim() !== "" &&
        recipient.emailId.trim() !== "" &&
        recipient.role !== ""
    );

    if (!allRecipientsFilled) {
      setIsLoading(false);
      return toastDisplayer("error", "Please fill out all recipient details.");
    }

    if (screenValue === "Document" && showSections) {
      const emailTitleExists = !!emailTitle;
      if (!emailTitleExists) {
        setIsLoading(false);
        return toastDisplayer("error", "Please fill the email title");
      }

      if (recipientData.length <= 0) {
        setIsLoading(false);
        return toastDisplayer("error", "Add Recipient...!!");
      }
      if (expirationDays === 0) {
        setIsLoading(false);
        return toastDisplayer("error", "Set Expiration date...!!");
      }
    }

    const emailCounts = recipientData.reduce((acc, recipient) => {
      acc[recipient.emailId] = (acc[recipient.emailId] || 0) + 1;
      return acc;
    }, {});

    const duplicateEmails = Object.keys(emailCounts).filter(
      (email) => emailCounts[email] > 1
    );
    if (duplicateEmails.length > 0) {
      setIsLoading(false);
      return toastDisplayer(
        "error",
        "Duplicate recipient emails found: " + duplicateEmails.join(", ")
      );
    }

    const invalidEmails = recipientData.filter(
      (recipient) => !isValidEmail(recipient.emailId)
    );
    if (invalidEmails.length > 0) {
      setIsLoading(false);
      return toastDisplayer(
        "error",
        "Invalid email address(es) found: " +
          invalidEmails.map((recipient) => recipient.emailId).join(" , ")
      );
    }

    try {
      const recDataToSend = recipientData.map((recipient) => ({
        RecipientName: recipient.fullName,
        RecipientEmail: recipient.emailId,
        role:
          recipient.role === 1 || recipient.role === "Signer"
            ? "Signer"
            : "Viewer",
      }));

      const timestamp = Date.now();
      const uniqueDocName = `${docName}_${timestamp}`;
      const queryParams = new URLSearchParams(location.search);

      const docid = queryParams.get("docId");
      const payload = {
        doc_id: docid,
        name: uniqueDocName,
        pdfName: selectedImage.name,
        size: selectedImage.size,
        s3Key: selectedImage.name,
        creator_id: creatorid,
        status: "Pending",
        receipientData: recDataToSend,
        email_title: emailTitle,
        email_message: emailMessage,
        emailAction: getEmailAction,
        scheduledDate: scheduledDate,
        expirationDays: expirationDays,
        reminderDays: reminderDays,
        user_id: creatorid,
      };
      // Convert the payload object to a JSON string
      const payloadString = JSON.stringify(payload);

      // Store the JSON string in sessionStorage
      sessionStorage.setItem("goBackData", payloadString);
      sessionStorage.setItem("fileData", selectedImage);

      const response = await saveDocument(payload);
      if (response.error) {
        setIsLoading(false);
        toastDisplayer("error", "Error in recipient data" + response.error);
        return;
      } else {
        if (isTemplateOptionsSelected != null) {
          navigate(
            `/createorsigndocument?template=Document&tempYes=yes&did=${response?.doc_id}&tid=${recipientData[0].template_id}`,
            {
              state: {
                selectedFile: selectedImage,
                creatorid: creatorid,
                emailTitle: emailTitle,
                emailMessage: emailMessage,
                scheduledDate: scheduledDate,
                reminderDays: reminderDays,
                recipientTempData: recipientData,
                Expiration: {
                  expirationDays: expirationDays,
                  scheduledDate: scheduledDate,
                  reminderDays: reminderDays,
                },
              },
            }
          );
        } else {
          const hasSigner = recipientData.some(
            (recipient) => recipient.role === "Signer"
          );
          if (!hasSigner) {
            setIsLoading(false);
            return toastDisplayer(
              "error",
              "At least one recipient must have the role of 'Signer'."
            );
          }
          navigate(
            `/createorsigndocument?template=Document&tempYes=no&did=${response?.doc_id}`,
            {
              state: {
                selectedFile: selectedImage,
                creatorid: creatorid,
                emailAction: getEmailAction,
                Expiration: {
                  expirationDays: expirationDays,
                  scheduledDate: scheduledDate,
                  reminderDays: reminderDays,
                },
              },
            }
          );
        }
      }
    } catch (error) {
      setIsLoading(false);

      if (
        error.response &&
        error.response.data.error ===
          "Document with the same name already exists for this user."
      ) {
        return toastDisplayer(
          "error",
          "Document with the same name already exists for this user."
        );
      } else if (
        error.response &&
        error.response.data.RecipientEmail &&
        error.response.data.RecipientEmail[0] === "Enter a valid email address."
      ) {
        toastDisplayer("error", "Enter a valid email address.");
        return;
      } else {
        return toastDisplayer("error", "Fill Proper Details!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const maxAndMinLabel = { "aria-label": "Min And Max" };

  useEffect(() => {
    const currentDate = new Date();
    const scheduledDate = new Date(
      currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000
    );
    setScheduledDate(scheduledDate.toISOString().slice(0, 10)); // Format the date as per date input
  }, [expirationDays]);

  const [reminderOptions, setReminderOptions] = useState(["Select days"]);

  useEffect(() => {
    const currentDate = new Date();
    const diffTime = new Date(scheduledDate) - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // setReminderDays(0);
    if (diffDays < 2) {
      setReminderOptions([{ text: "Select days", value: 0 }]);
    } else if (diffDays < 4) {
      setReminderOptions([{ text: "2 days ago", value: 2 }]);
    } else if (diffDays >= 4 && diffDays <= 5) {
      setReminderOptions([
        { text: "2 days ago", value: 2 },
        { text: "4 days ago", value: 4 },
      ]);
    } else if (diffDays >= 6 && diffDays <= 7) {
      setReminderOptions([
        { text: "2 days ago", value: 2 },
        { text: "4 days ago", value: 4 },
        { text: "6 days ago", value: 6 },
      ]);
    } else if (diffDays >= 8) {
      setReminderOptions([
        { text: "2 days ago", value: 2 },
        { text: "4 days ago", value: 4 },
        { text: "6 days ago", value: 6 },
        { text: "8 days ago", value: 8 },
      ]);
    }
  }, [scheduledDate]);

  const handleExpirationChange = (e) => {
    setExpirationDays(e.value);
  };

  const handleScheduledDateChange = (value) => {
    const currentDate = new Date();
    const scheduledDate = new Date(value);
    const diffTime = scheduledDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setExpirationDays(diffDays);
    setScheduledDate(value);
  };

  const handleReminderChange = (e) => {
    setReminderDays(parseInt(e));
  };

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    var currentUserData;
    const getCurrentUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);
        currentUserData = userData;
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const recipient = recipientData.find((item) => {
      return item.emailId === currentUser.email;
    });
    if (recipient) {
      if (recipient.emailId === currentUser.email) {
        setOnceClicked(false);
      }
    }
  }, [currentUser]);

  const onTemplateSelect = (selectedTemplate) => {
    setIsTemplateOptionsSelected(selectedTemplate);
  };
  /// rajvi changes
  const handleMultipleRemoveImage = (index) => {
    setMultipleSelectedImage((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
    setMultipleImageDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
    toastDisplayer("success", "Pdf file Removed");
  };

  const handleMultipleImageUpload = async (event) => {
    const files = event.target.files; // This will be a FileList object

    if (!files) {
      return; // If no files are selected, exit early
    }

    // Convert FileList to Array and filter only PDF files
    const fileArray = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    // Check if there were any non-PDF files
    if (fileArray.length < files.length) {
      setMultipleErrorMessage((prevErrors) => [
        ...prevErrors,
        "Some files were not PDF and were not uploaded.",
      ]);
      toastDisplayer("error", "Some files were not PDF and were not uploaded!");
    }

    if (fileArray.length === 0) {
      return; // If no valid PDF files are selected, exit early
    }
    let newImageDetails = []; // Array to hold new file details
    setMultipleSelectedImage((prevData) => [...prevData, ...fileArray]);
    for (let file of fileArray) {
      try {
        const pages = await getNumberOfPages(file);
        const { name, size } = file;
        const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";

        newImageDetails.push({ file, name, size: formattedSize, pages });
        setMultipleErrorMessage((prevErrors) => [...prevErrors, null]);
      } catch (error) {
        console.error("Error fetching pages:", error);
        setMultipleErrorMessage((prevErrors) => [
          ...prevErrors,
          "Error fetching number of pages.",
        ]);
      }
    }

    setMultipleImageDetails((prevImageDetails) => [
      ...prevImageDetails,
      ...newImageDetails,
    ]);
    toastDisplayer("success", "PDF Files Uploaded");
  };

  const fetchMultipleNumberOfPages = async () => {
    if (multipleSelectedImage && multipleSelectedImage.length > 0) {
      try {
        const pagesPromises = multipleSelectedImage.flatMap((image) =>
          // image.map((img) => getNumberOfPages(img))
          getNumberOfPages(image)
        );
        const pages = await Promise.all(pagesPromises);
        setMultipleNumberOfPages(pages);
        return pages;
      } catch (error) {
        console.error("Error calculating number of pages:", error);
        toastDisplayer("error", "Can't upload Pdf!");
        // setMultipleNumberOfPages((prevPages) => [...prevPages, 0]);
      }
    } else {
      setMultipleNumberOfPages((prevPages) => [...prevPages, 0]);
      // toastDisplayer("error","Can't upload Pdf!")
    }
  };

  const handleProceedMultipleDocument = () => {
    setIsLoading(true);
    if (
      multipleSelectedImage.length > 0 &&
      multipleDocName &&
      multipleImageDetails
    ) {
      navigate(`/createorsigndocument?template=BulkSigning&selfBulkSign=yes`, {
        state: {
          multipleSelectedImage: multipleSelectedImage,
          multipleImageDetails: multipleImageDetails,
          multipleDocName: multipleDocName,
        },
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const handleTabClose = (event) => {
      // Trigger your custom function here
      localStorage.removeItem("testing");
      sessionStorage.removeItem("goBackData");

      // Optional: Show a confirmation dialog (not always reliable in modern browsers)
      event.preventDefault();
      event.returnValue = ""; // Required for the dialog to be displayed in some browsers
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div className="my-container">
        <Header title={"Sign-akshar"} />
        <div className="first-container">
          <div className="inner-container">
            <div className="section1">
              {screenValue && screenValue === "Template" && (
                <>
                  <div className="prepare">
                    Prepare the template for signature position
                  </div>
                  <Button
                    text={isLoading ? "" : "Proceed"}
                    onClick={handleProceed}
                    className="process-btn"
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
                </>
              )}

              {screenValue && screenValue === "Document" && (
                <>
                  <div className="prepare">
                    Prepare the Document for signature
                  </div>
                  <Button
                    text={isLoading ? "" : "Proceed"}
                    onClick={handleProceedDocument}
                    className="process-btn"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <div className="loader-container">
                        <div className="simple-loader"></div>
                      </div>
                    )}
                  </Button>
                </>
              )}

              {screenValue && screenValue === "BulkSigning" && (
                <>
                  <div className="prepare">
                    Prepare the Bulk Document for signature
                  </div>
                  <Button
                    text={isLoading ? "" : "Proceed"}
                    onClick={handleProceedMultipleDocument}
                    className="process-btn"
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
                </>
              )}
            </div>

            <div className="space"></div>
            {screenValue && screenValue === "Template" && (
              <>
                <DocumentUpload
                  selectedImage={selectedImage}
                  errorMessage={errorMessage}
                  imageDetails={imageDetails}
                  fetchNumberOfPages={fetchNumberOfPages}
                  handleImageUpload={handleImageUpload}
                  numberOfPages={numberOfPages}
                  handleRemoveImage={handleRemoveImage}
                />
                <div className="space"></div>

                <DocumentNameSection
                  screenValue={screenValue}
                  templateName={templateName}
                  settemplateName={settemplateName}
                  docName={docName}
                  setDocName={setDocName}
                  defaultDocumentTitle={defaultDocumentTitle}
                />
              </>
            )}

            {screenValue && screenValue === "Document" && (
              <>
                <DocumentUpload
                  selectedImage={selectedImage}
                  errorMessage={errorMessage}
                  imageDetails={imageDetails}
                  fetchNumberOfPages={fetchNumberOfPages}
                  handleImageUpload={handleImageUpload}
                  numberOfPages={numberOfPages}
                  handleRemoveImage={handleRemoveImage}
                  fileName={fileName}
                />
                <div className="space"></div>
                <DocumentNameSection
                  screenValue={screenValue}
                  templateName={templateName}
                  settemplateName={settemplateName}
                  docName={docName}
                  setDocName={setDocName}
                  defaultDocumentTitle={defaultDocumentTitle}
                />
              </>
            )}
            {screenValue && screenValue === "BulkSigning" && (
              <>
                <MultipleDocumentUpload
                  selectedImage={multipleSelectedImage}
                  errorMessage={multipleErrorMessage}
                  imageDetails={multipleImageDetails}
                  fetchNumberOfPages={fetchMultipleNumberOfPages}
                  handleImageUpload={handleMultipleImageUpload}
                  numberOfPages={multipleNumberOfPages}
                  handleRemoveImage={handleMultipleRemoveImage}
                  defaultDocumentTitle={defaultDocumentTitle}
                />
                <div className="space"></div>
                <DocumentNameSection
                  screenValue={screenValue}
                  templateName={templateName}
                  settemplateName={settemplateName}
                  docName={multipleDocName}
                  setDocName={setMultipleDocName}
                />
              </>
            )}

            <div className="space"></div>
            {screenValue && screenValue === "Document" && (
              <>
                {/* <TemplateSelectionSection TemplateOptions={TemplateOptions} /> */}
                <TemplateSelectionSection
                  onTemplateSelect={onTemplateSelect}
                  handleTemplateClear={() => {
                    setSelectedTemplate(null);
                    onTemplateSelect(null);
                  }}
                  selectedRowData={selectedRowData}
                  // TemplateOptions={TemplateOptions}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  templateOption={templateOption}
                  setTemplateOption={setTemplateOption}
                />
                <div className="space"></div>
              </>
            )}

            {screenValue && screenValue !== "BulkSigning" && (
              <div className="section3">
                {screenValue && screenValue === "Document" && (
                  <>
                    {selectedTemplate ? (
                      <>
                        <div className="Add-Recipients">Recipients</div>
                      </>
                    ) : (
                      <>
                        <div className="Add-Recipients">
                          Add Recipients
                          <button
                            className="Add-Recipients-pink"
                            onClick={handleAddRecipient}
                          >
                            Add Recipients
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
                {screenValue && screenValue === "Template" && (
                  <div className="Add-Recipients">
                    Add Default Recipients
                    <button
                      className="Add-Recipients-pink"
                      onClick={handleAddRecipient}
                    >
                      Add Default Recipients
                    </button>
                  </div>
                )}

                {screenValue && screenValue !== "BulkSigning" && (
                  <div className="recipients-section">
                    {recipientData && (
                      <>
                        <List
                          dataSource={recipientData}
                          onItemReordered={handleChangeItemDragging}
                          itemRender={(id, index) => (
                            <>
                              {isTemplateOptionsSelected != null ? (
                                <>
                                  <ApplyTemplateRecipientItem
                                    recipient={recipientData[index]}
                                    handleDeleteRecipient={
                                      handleDeleteRecipient
                                    }
                                    handleRecipientChange={
                                      handleRecipientChange
                                    }
                                    currentUser={currentUser}
                                    setOnceClicked={setOnceClicked}
                                    setAddYourselfUsed={setAddYourselfUsed}
                                    addYourselfUsed={addYourselfUsed}
                                    OnceClicked={OnceClicked}
                                  />
                                </>
                              ) : (
                                <>
                                  <RecipientItem
                                    recipient={recipientData[index]}
                                    handleRecipientChange={
                                      handleRecipientChange
                                    }
                                    handleDeleteRecipient={
                                      handleDeleteRecipient
                                    }
                                    screenValue={screenValue}
                                    currentUser={currentUser}
                                    setOnceClicked={setOnceClicked}
                                    OnceClicked={OnceClicked}
                                    setAddYourselfUsed={setAddYourselfUsed}
                                    addYourselfUsed={addYourselfUsed}
                                  />
                                </>
                              )}
                            </>
                          )}
                          // height={354}
                        >
                          <ItemDragging
                            allowReordering={true}
                            group="tasks"
                            data="plannedTasks"
                            showDragIcons={true}
                          />
                        </List>
                      </>
                    )}
                  </div>
                )}

                {screenValue && screenValue === "Document" && showSections && (
                  <>
                    <div className="checkbox-mycontainer">
                      <div
                        className="checkbox-item"
                        onClick={handleFirstCheckboxChange}
                        onMouseEnter={() =>
                          handleMouseEnter(
                            "Once the first user completes the process,\n the document will be accessible to all other users.",
                            ".checkbox-item"
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {firstCheckboxChecked ? (
                          <CheckboxLine />
                        ) : (
                          <Checkboxblankline />
                        )}
                        <span className="checkbox-text">
                          Send after the first user action
                        </span>
                      </div>

                      <div
                        className="checkbox-item2"
                        onClick={handleSecondCheckboxChange}
                        onMouseEnter={() =>
                          handleMouseEnter(
                            "The document will be accessed sequentially by each user.",
                            ".checkbox-item2"
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {secondCheckboxChecked ? (
                          <CheckboxLine />
                        ) : (
                          <Checkboxblankline />
                        )}
                        <span className="checkbox-text">Set signing order</span>
                      </div>
                    </div>

                    <Tooltip
                      target={tooltipTarget}
                      visible={tooltipVisible}
                      contentRender={(e) => (
                        <div style={{ whiteSpace: "pre-line" }}>
                          {tooltipContent}
                        </div>
                      )}
                    >
                      <div>{tooltipContent}</div>
                    </Tooltip>
                  </>
                )}
              </div>
            )}

            <div className="space"></div>

            {screenValue === "Document" && showSections && (
              <>
                <EmailMessageSection
                  emailTitle={handleemailTitle}
                  emailMessage={handleEmailMessage}
                  gemailTitle={emailTitle}
                  gemailMessage={emailMessage}
                />
                <div className="space"></div>
                <ExpirationDateSection
                  scheduledDate={scheduledDate}
                  handleScheduledDateChange={handleScheduledDateChange}
                  maxAndMinLabel={maxAndMinLabel}
                  expirationDays={expirationDays}
                  handleReminderChange={handleReminderChange}
                  reminderDays={reminderDays}
                  reminderOptions={reminderOptions}
                  handleExpirationChange={handleExpirationChange}
                  greminderDays={reminderDays}
                  gexpirationDays={expirationDays}
                />
              </>
            )}
            <div className="space"></div>

            <div className="lastspace"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashUI;
