import axios from "axios";
import { generateBucketName } from "../components/manageUser/signatureSetup/PdfUtils";
import { toastDisplayer } from "../components/toastDisplay/toastDisplayer";
import { logApiAction } from "../api/ApiLogger";


////DocSubPanel  , ViewDocument.js , profile.js , RecieverPanel.js, Dashui.js , DocumentMain.js , SplitButtonSign.js
export const fetchUserDetails = async (token) => {
  let responseData;
  let userId;

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/user/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    responseData = response.data;
    userId = response.data.user.id;
    return responseData;
  } catch (error) {
    responseData = error.response ? error.response.data : { error: error.message };
    userId = responseData.user ? responseData.user.id : 'unknown';
    console.error("Error fetching user details:", error);

    throw error;
  } finally {
    
  }
};


////DocSubPanel , DocTabs
export const fetchDocuments = async (userId, email) => {
  const reqObj = {
    createdByYou: true,
    createdByOthers: true,
    userid: userId,
    email: email,
  };
  let response;
  let data;
  let logMessage;

  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/getDocuments/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqObj),
      }
    );

    data = await response.json();
    
    if (response.ok) {
      logMessage = `Fetched documents for user ID ${userId}`;
    } else {
      logMessage = data.error || "Failed to fetch documents";
      throw new Error(logMessage);
    }

    return data;
  } catch (error) {
    logMessage = error.message;
    console.error("Error fetching documents:", error);
    throw error;
  } finally {
  }
};

/////DocTabs , ViewDetailsPage.js
export const fetchRecipientCount = async (docid) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/getRecipientCount/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docid }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipient count:", error);
    throw error;
  }
};

//Doctabs.js
export const fetchPendingRecipientCount = async (docid) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/getPendingRecipientCount/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docid }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pending recipient count:", error);
    throw error;
  }
};

//Doctabs.js , splitButtonSign.js
export const deleteDocument = async (docId,loggedInUserId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/deleteDocument/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docid: docId ,user_id:loggedInUserId}),
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

//Doctabs.js
export const deleteFileFromS3 = async (bucketName, fileName,loggedInUserId) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/delete_file_from_s3/`,
      {
        data: { bucket_name: bucketName, file_name: fileName,user_id:loggedInUserId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

//Doctabs.js , titlePanel.js
export const generatePresignedUrl = async (bucketName, fileName) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/generate_presigned_url/${bucketName}/${fileName}/`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
};

//// TempSubPanel.js , DashUI.js
const fetchTemplates = async (jwtToken,userid) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/templateapi/`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching template data:", error);
    throw error;
  }
};

//// TempSubPanel.js , DashUI.js , createOrSignDocument.js
const fetchRecipientsByTemplateId = async (templateId, jwtToken) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/TemplateRecipientByTemplateId/${templateId}/`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recipients for template:", error);
    throw error;
  }
};
//// TempSubPanel.js , splitButtonSign.js
const deleteTemplate = async (templateId,jwtToken,userid) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/deleteTemplate/`,
      {
        templateID: templateId,
        user_id:userid 
      },{
        headers: {
          Authorization: `Bearer ${jwtToken}`, 
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
  }
};

export { fetchTemplates, fetchRecipientsByTemplateId, deleteTemplate };

/// ViewDetailsPage.js
export const fetchRecipientDetails = async (docid) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/getRecipientDetails/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docid }),
      }
    );
    const data = await response.json();
    console.log("---data",data);
    return data;
  } catch (error) {
    console.error("Error fetching recipient details:", error);
    throw error;
  }
};

/// ViewDetailsPage.js-----RecieverPanel.js
export const fetchRecipientStatus = async (docid, email) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/getStatus/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docid, email }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipient status:", error);
    throw error;
  }
};

/// ViewDocument.js , RecieverPanel
export const fetchPdfFile = async (user, documentData) => {
  const bucketName = generateBucketName(user?.user?.id || user.id, user?.user?.email || user.email );
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/fetch_pdf_from_s3/${bucketName}/${documentData.name}.pdf`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching PDF file:", error);
    toastDisplayer("error", "Failed to fetch PDF file");
    throw error;
  }
};

// CreateorSignDocument.js
export const fetchTemplatePdfFile = async (user, selectedRowDataTemp) => {
  const bucketName = generateBucketName(user.user.id, user.user.email);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/fetch_templateFile_from_s3/${bucketName}/templateBucket/${selectedRowDataTemp.template_id+"-"+selectedRowDataTemp.createTempfile}/`,
      { responseType: "blob" }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching PDF file:", error);
    toastDisplayer("error", "Failed to fetch PDF file");
    throw error;
  }
};

export const fetchTemplateBucketForImages=async (user)=>{
  const bucketName=generateBucketName(user.user.id,user.user.email);
  try{
    const response=await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch_TemplatePdfs/${bucketName}/`);
    return response.data;
  }catch(err){
    console.error("Error fetching template bucket",err);
    toastDisplayer("error","Failed to load template Images");
  }
}

/// ViewDocument.js , RecieverPanel.js , createOrSignDocument.js
export const fetchDocumentData = async (documentId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/DocumentByDocId/${documentId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching document data:", error);
    throw error;
  }
};

/// ViewDocument.js , RecieverPanel.js
export const fetchSenderData = async (creatorId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/user-details/${creatorId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sender data:", error);
    throw error;
  }
};

/// ViewDocument.js
export const fetchDocumentRecipientStatus = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/get_email_list/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching document recipient status:", error);
    throw error;
  }
};

/// ViewDocument.js , RecieverPanel.js , createOrSignDocument.js
export const fetchUseDocRec = async (documentId, token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/DocAllRecipientById/${documentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching document recipients:", error);
    throw error;
  }
};

/// ViewDocument.js ,RecieverPanel.js
export const fetchDocumentDraggedData = async (documentId,rid) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/GetDraggedDataByDocRec/${documentId}/${rid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dragged data:", error);
    throw error;
  }
};

/// ViewDocument.js , RecieverPanel.js
export const fetchRecipientSignStatusData = async (documentId, userEmail) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/email-list/${documentId}/${userEmail}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recipient sign status data:", error);
    throw error;
  }
};

/// SplitButtonSign.js
// export const updateRecStatus = async (docId, email, newStatus) => {
//   try {
//     const response = await axios.put(
//       `${process.env.REACT_APP_API_URL}/api/email-list/${docId}/${email}/`,
//       { doc_id: docId, status: newStatus }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating status:", error);
//     throw new Error("Failed to update status");
//   }
// };

export const updateRecStatus = async (docId, email, newStatus) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/email-list/${docId}/${email}/`,
      { doc_id: docId, status: newStatus }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error.response?.data || error.message);
    throw new Error("Failed to update status"); 
  }
};


/// ViewDocument.js
export const fetchRecipientDetailData = async (documentId, userEmail) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/document-recipient-detail/${documentId}/${userEmail}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recipient detail data:", error);
    throw error;
  }
};

/// profile.js
export const updateUserData = async (token, formData) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/user/update/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.user;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

/// RecieverPanel.js
export const approveDocument = async (docid, rid,lastModID) => {
  const payload = {
    doc_id: docid,
    email_id: rid,
    lastModID:lastModID
  };
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/DocApprove/`, payload);
    return response;
  } catch (error) {
    console.error("Error approving document:", error);
    throw error;
  }
};

/// Dashui.js
export const createTemplate = async (templateData, token) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/templateapi/`,
      templateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
};

/// Dashui.js
export const addTemplateRecipient = async (recipientData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/TemplateRecipient/`,
      recipientData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding template recipient:", error);
    throw error;
  }
};

/// Dashui.js
export const saveDocument = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/save_doc/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving document:", error);
    if(error.response.data.error==="(1406, \"Data too long for column 'name' at row 1\")"){
      toastDisplayer("error","Document name is too long!");
    }
    
    throw error;
  }
};

/// Dashui.js
export const fetchCurrentUser = async () => {
  try {
    const jwtToken = localStorage.getItem("jwt");
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/current-user/`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

/// Dashui.js
export const saveMultipleDocument = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/save_multiple_doc/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving multiple documents:", error);
    throw error;
  }
};

//// createorsigndocument.js--- not used
export const fetchTemplateById = async (jwtToken, templateId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/TemplateByTemplateId/${templateId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching template data:", error);
    throw error;
  }
};

/// createOrSignDocument.js
export const fetchDraggedDataByTemplateRecId = async (recId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/getDraggedDataByTempRec/${recId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dragged data:", error);
    throw error;
  }
};

// DocumentMain.js
export const fetchTempApplyRecipientById = async (signerId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipient-details/${signerId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fetchTempApplyRecipientDetailById:", error);
    throw error;
  }
};

//// SplitButtonSign.js
// export const saveDocPositions = async (payload) => {
//   try {
//     console.log("payload:",payload);
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_URL}/api/save_doc_positions/`,
//       payload
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error saving document positions, Try making new document if issue persists!", error);
//     throw new Error("Failed to save document positions,Try making new document if issue persists!");
//   }
// };

//// aayushi's code
export const saveDocPositions = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/save_doc_positions/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error saving document positions:", error);
    throw new Error("Failed to save document positions");
  }
};

//// SplitButtonSign.js
export const uploadFileToS3 = async (formData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/upload_file_to_s3/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export const uploadTemplateFileToS3 = async (selectedFile,userObj,tid) => {
  const file = selectedFile;
  const bucketName = generateBucketName(userObj.user.id,userObj.user.email)
  const templateBucketName = "templateBucket"

  const formData = new FormData();
  formData.append('file', file,tid+"-"+selectedFile.name);
  formData.append('bucket_name', bucketName);
  formData.append('template_bucket_name', templateBucketName);
  formData.append('user_id', userObj.user.id);

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload_template_file_to_s3/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    toastDisplayer("error", "An error occurred while uploading the file.");
  }
};

//// SplitButtonSign.js
export const saveTemplateDraggedData = async (apiCallObj) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/templateDraggedDataApi/`,
      apiCallObj
    );
    return response.data;
  } catch (error) {
    console.error("Error saving template dragged data:", error);
    throw new Error("Failed to save template dragged data");
  }
};

//// SplitButtonSign.js
export const updateTemplatePositions=async (updateData)=>{
  try {
    const response=await fetch(`${process.env.REACT_APP_API_URL}/api/updateTemplateDraggedData/${updateData.id}/`, {
      method: 'PATCH', // Use 'PATCH' to partially update the data
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return response;
  } catch (error) {
    console.log(error)
  }
}

////TempSubPanel.js
export const deleteTemplateFromS3 = async (userdetails, tid,createtempfile) => {
  try {
    const bucketName=generateBucketName(userdetails.user.id,userdetails.user.email)
    const fileName=tid+"-"+createtempfile;
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/delete_template_from_s3/`,
      {
        data: { bucket_name: bucketName, file_name: fileName,user_id:userdetails.user.id},
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};