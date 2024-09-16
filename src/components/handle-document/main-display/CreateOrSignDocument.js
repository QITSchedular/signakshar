/////code after submission 26june
import React, { useEffect, useState } from "react";
import MyHeader from "./MyHeader";
import "./CreateOrSignDocument.scss";
import TitlePanel from "./TitlePanel";
import DetailPanel from "./DetailPanel";
import DocumentMain from "./DocumentMain";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../src/contexts/auth";
import {
  fetchDocumentData,
  fetchDraggedDataByTemplateRecId,
  fetchRecipientsByTemplateId,
  fetchTemplatePdfFile,
  fetchUseDocRec,
  fetchUserDetails,
} from "../../../api/UserDashboardAPI";
import axios from "axios";
import LoadPanel from 'devextreme-react/load-panel';

function CreateOrSignDocument() {
  const { user,userDetailAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const mystatus = location.state?.status;
  const scheduledDate = location.state?.scheduledDate;
  const selectedFile = location.state?.selectedFile;
  const emailAction = location.state?.emailAction;
  const emailTitle = location.state?.emailTitle;
  const emailMessage = location.state?.emailMessage;
  const Expiration = location.state?.Expiration;
  const reminderDays = location.state?.reminderDays;
  const creatorid = location.state?.creatorid;
  const signOpt = location.state?.signOpt;
  const recipientTempData = location.state?.recipientTempData;
  const multipleDocName = location.state?.multipleDocName;
  const multipleSelectedImage = location.state?.multipleSelectedImage;
  const multipleImageDetails = location.state?.multipleImageDetails;
  const selectedRowDataTemp = location.state?.selectedRowData;
  const showSections=location.state?.showSections;
  // const setShowSections=location.state?.setShowSections;
  const [screenValue, setScreenValue] = useState("");
  const [tid, settid] = useState();
  const [did, setdid] = useState();
  const [selfBulkSign, setSelfBulkSign] = useState();
  const [tempYEs, setTempYes] = useState();
  const [isAnyFieldClicked, setIsAnyFieldClicked] = useState(false);
  const [downloadDraggedData, setDownloadDraggedData] = useState(null);
  const [loggedInUserDetail, setLoggedInUserdetail] = useState();
  const [templateAwsPdf, setTemplateAwsPdf] = useState();
  const [isSigned,setIsSigned]=useState(false);

  const fetchUser = async () => {
    setLoading(true);
    // const resp = await fetchUserDetails(user);
    setLoading(false);
    setLoggedInUserdetail(userDetailAuth);
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
    const queryParams = new URLSearchParams(location.search);
    const templateValue = queryParams.get("template");
    if (templateValue) {
      setScreenValue(templateValue);
    }
    const templateid = queryParams.get("tid");
    settid(templateid);
    const docid = queryParams.get("did");
    setdid(docid);
    const tempYes = queryParams.get("tempYes");
    setTempYes(tempYes);
    const selfBSign = queryParams.get("selfBulkSign");
    setSelfBulkSign(selfBSign);
  }, [user, location.search]);

  const [templateDraggedData, setTemplateDraggedData] = useState([]);
  const [templateapiData, setTemplateapiData] = useState([]);
  const [docapiData, setdocapiData] = useState([]);
  const [signerOptions, setsignerOptions] = useState([]);
  const [updateRecData, setupdateRecData] = useState([]);
  const [draggedDataTemp, setDraggedDataTemp] = useState([]);
  const [mySelectedDocument, setMySelectedDocument] = useState();
  const [editRecData, setEditRecData] = useState([]);
  const [updatedEditRecipients, setUpdatedEditRecipients] =
    useState(editRecData);

  useEffect(() => {
    setTemplateDraggedData([]);
    // setTemplateapiData([]);
    setdocapiData([]);
    setsignerOptions([]);
    setupdateRecData([]);
    setDraggedDataTemp([]);
  }, [screenValue, tid, did]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempYesValue = queryParams.get("tempYes");
    const did = queryParams.get("did");

    const fetchTemplateDraggedData = async () => {
      try {
        setLoading(true);
        const response = await fetchRecipientsByTemplateId(tid, user);
        setLoading(false);
        setTemplateDraggedData(response);
      } catch (error) {
        console.error("Error fetching template dragged data:", error);
      }
    };

    const fetchTemplateData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/TemplateByTemplateId/${tid}`
        );
        setLoading(false);
        setTemplateapiData(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching template data:", error);
        return null;
      }
    };

    const fetchDoc = async () => {
      try {
        setLoading(true);
        const response = await fetchDocumentData(did);
        setLoading(false);
        setdocapiData(response);
      } catch (error) {}
    };

    const fetchTempFromAws = async () => {

      setLoading(true);
      const awsTemplateResponse = await fetchTemplatePdfFile(loggedInUserDetail, selectedRowDataTemp);
      setLoading(false);
      setTemplateAwsPdf(awsTemplateResponse)
      if (awsTemplateResponse.size) {
        setLoading(true)
        const tempres = await Promise.all(
          selectedRowDataTemp.recData.map(async (myrec) => {
            return fetchDraggedDataByTemplateRecId(myrec.id);
          })
        );
        setLoading(false);
        setEditRecData(tempres);
      }

      
    }

    if (screenValue === "Template") {
      if (tid) {
        fetchTemplateData();
        fetchTemplateDraggedData();
      }
    } else if (screenValue === "Document" && tempYesValue === "yes") {
      fetchDoc();
    } else if (screenValue === "BulkSigning" && tempYesValue == "no") {
      fetchDoc();
    } else if (
      screenValue === "editTemplate" &&
      loggedInUserDetail &&
      loggedInUserDetail?.user
    ) {
      fetchTempFromAws();
    }

    const fetchDocRecipientData = async () => {
      try {
        setLoading(true)
        const response = await fetchUseDocRec(did, user);
        setLoading(false);
        setTemplateDraggedData(response);
      } catch (error) {
        console.error("Error fetching template dragged data:", error);
      }
    };
    if (screenValue === "Document" && tempYesValue === "no") {
      fetchDoc();
      fetchDocRecipientData();
    }
  }, [screenValue, tid, loggedInUserDetail]);

  useEffect(() => {
    if (screenValue === "Template") {
      if (templateDraggedData.length > 0) {
        const processedData = templateDraggedData.map((data) => ({
          id: data.id,
          name: data.name,
          role: data.role,
          color: "",
          email: "",
        }));
        setsignerOptions(processedData);
      }
    } else if (screenValue === "BulkSigning" && selfBulkSign === "yes") {
      const bulkSignerData = [
        {
          id: 1,
          name: "You",
          role: 1,
          color: "",
          email: "",
        },
      ];
      setsignerOptions(bulkSignerData);
    }
  }, [screenValue, templateDraggedData]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempYesValue = queryParams.get("tempYes");

    const fetchData = async () => {
      try {
        if (did) {
          setLoading(true);
          const response = await fetchUseDocRec(did, user);
          setLoading(false);
          if (response.length > 0) {
            const processedData = response.map((data) => ({
              id: data.id,
              name: data.name,
              role: data.roleId,
              color: "",
              email: data.email,
            }));
            setsignerOptions(processedData);

            if (screenValue === "Document" && tempYesValue === "yes") {
              const matchAndUpdateDraggedData = async () => {
                try {
                  setLoading(true);
                  const templateresponse = await fetchRecipientsByTemplateId(
                    tid,
                    user
                  );
                  setLoading(false);
                  setTemplateDraggedData(templateresponse);
                  if (templateresponse.length > 0) {
                    for (const res of templateresponse) {
                      if (res.id && res.role === 1) {
                        setLoading(true);
                        const dragResponse =await fetchDraggedDataByTemplateRecId(res.id);
                        setLoading(false);
                        const prodata = dragResponse.map((item) => {
                          let transformedItem = item;
                          processedData.forEach((signer) => {
                            recipientTempData.forEach((index) => {
                              if (
                                signer.email === index.emailId &&
                                item.templateRec === index.id
                              ) {
                                transformedItem = {
                                  ...item,
                                  name: signer.name,
                                  signerId: signer.id,
                                };
                              }
                            });
                          });
                          return transformedItem;
                        });
                        setDraggedDataTemp((prevData) => [
                          ...prevData,
                          ...prodata,
                        ]);
                      }
                    }
                    setTemplateDraggedData(recipientTempData);
                  }
                } catch (error) {
                  console.error(
                    "Error fetching and matching dragged data:",
                    error
                  );
                }
              };
              matchAndUpdateDraggedData();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching document recipient data:", error);
      }
    };

    fetchData();
  }, [screenValue, did, tid, recipientTempData, location.search]);

  const handleSetData = (data) => {
    setupdateRecData(data);
  };


  return (
    <>
    {loading && <LoadPanel visible={true} />}
      <div className="my-container">
        <MyHeader
          title={"Sign-akshar"}
          screenValue={screenValue}
          docId={did}
          signerOptions={signerOptions}
          selectedFile={selectedFile}
          showSections={showSections}
          // setShowSections={setShowSections}
        />
        <div className="my-main-container">
          {screenValue && screenValue === "Template" && (
            <TitlePanel
              title={templateapiData.templateName}
              tid={tid}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              signStatus={mystatus}
              screenValue={screenValue}
              signerOptions={signerOptions}
              selectedFile={selectedFile}
            />
          )}
          {screenValue && screenValue === "editTemplate" && (
            <TitlePanel
              title={selectedRowDataTemp.templateName}
              tid={selectedRowDataTemp.template_id}
              updatedEditRecipients={updatedEditRecipients}
              editRecData={editRecData}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              selectedRowDataTemp={selectedRowDataTemp}
              // signStatus={mystatus}
              screenValue={screenValue}
              // signerOptions={signerOptions}
            />
          )}
          {screenValue && screenValue === "Document" && (
            <TitlePanel
              title={docapiData.name}
              creatorid={creatorid}
              did={did}
              signerOptions={signerOptions}
              selectedFile={selectedFile}
              tid={tid}
              tempYEs={tempYEs}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              signStatus={mystatus}
              screenValue={screenValue}
              emailAction={emailAction}
              Expiration={Expiration}
              docapiData={docapiData}
              setDownloadDraggedData={setDownloadDraggedData}
              downloadDraggedData={downloadDraggedData}
              isSigned={isSigned}
            />
          )}
          {screenValue &&
            screenValue === "BulkSigning" &&
            selfBulkSign != "yes" && (
              <TitlePanel
                title={docapiData.name}
                creatorid={creatorid}
                did={did}
                signerOptions={signerOptions}
                selectedFile={selectedFile}
                tid={tid}
                tempYEs={tempYEs}
                templateDraggedData={templateDraggedData}
                updateRecData={updateRecData}
                signStatus={mystatus}
                screenValue={screenValue}
                emailAction={emailAction}
                Expiration={Expiration}
                docapiData={docapiData}
              />
            )}
          {screenValue &&
            screenValue === "BulkSigning" &&
            selfBulkSign === "yes" && (
              <TitlePanel
                title={multipleDocName}
                screenValue={screenValue}
                multipleImageDetails={multipleImageDetails}
                setDownloadDraggedData={setDownloadDraggedData}
                downloadDraggedData={downloadDraggedData}
                multipleSelectedImage={multipleSelectedImage}
              />
            )}

          {screenValue &&
          screenValue === "BulkSigning" &&
          selfBulkSign === "yes" ? (
            <DetailPanel
              multipleImageDetails={multipleImageDetails}
              multipleSelectedImage={multipleSelectedImage}
              screenValue={screenValue}
              signerOptions={signerOptions}
              mySelectedDocument={mySelectedDocument}
              setIsAnyFieldClicked={setIsAnyFieldClicked}
              isAnyFieldClicked={isAnyFieldClicked}
              setMySelectedDocument={setMySelectedDocument}
            />
          ) : screenValue === "editTemplate" && selectedRowDataTemp ? (
            <DetailPanel
              selectedRowDataTemp={selectedRowDataTemp}
              selectedFile={templateAwsPdf}
              screenValue={screenValue}
            />
          ) : (
            <DetailPanel
              tempYEs={tempYEs}
              did={did}
              tid={tid}
              signOpt={signOpt}
              scheduledDate={scheduledDate}
              Expiration={Expiration}
              emailTitle={emailTitle}
              emailMessage={emailMessage}
              docapiData={docapiData}
              reminderDays={reminderDays}
              templateapiData={templateapiData}
              templateDraggedData={templateDraggedData}
              signerOptions={signerOptions}
              setIsAnyFieldClicked={setIsAnyFieldClicked}
              isAnyFieldClicked={isAnyFieldClicked}
              screenValue={screenValue}
              selectedFile={selectedFile}
              recipientTempData={recipientTempData}
              draggedDataTemp={draggedDataTemp}
            />
          )}
        </div>

        <DocumentMain
          setIsSigned={setIsSigned}
          setEditRecData={setEditRecData}
          editRecData={editRecData}
          setUpdatedEditRecipients={setUpdatedEditRecipients}
          updatedEditRecipients={updatedEditRecipients}
          selectedRowDataTemp={selectedRowDataTemp}
          multipleImageDetails={multipleImageDetails}
          multipleSelectedImage={multipleSelectedImage}
          selectedFile={selectedFile || templateAwsPdf}
          screenValue={screenValue}
          tempYEs={tempYEs}
          signerOptions={signerOptions}
          updateRecData={updateRecData}
          setupdateRecData={setupdateRecData}
          handleSetData={handleSetData}
          draggedDataTemp={draggedDataTemp}
          recipientTempData={recipientTempData}
          setIsAnyFieldClicked={setIsAnyFieldClicked}
          isAnyFieldClicked={isAnyFieldClicked}
          title={
            docapiData?.name ||
            multipleDocName ||
            templateapiData.templateName ||
            selectedRowDataTemp?.templateName
          }
          setDownloadDraggedData={setDownloadDraggedData}
          downloadDraggedData={downloadDraggedData}
          mySelectedDocument={mySelectedDocument}
        />
      </div>
    </>
  );
}

export default CreateOrSignDocument;
