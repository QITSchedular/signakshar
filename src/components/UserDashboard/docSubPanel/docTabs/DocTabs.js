////// code after refactoring
import React, { useState, useEffect, useRef } from "react";
import "./DocTabs.scss";
import { Button } from "devextreme-react";
import SelectBox from "devextreme-react/select-box";
import SelectBoxInstance from "devextreme/ui/select_box";
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";
import { toastDisplayer } from "../../../toastDisplay/toastDisplayer";

import {
  Toolbar,
  Item,
  DataGrid,
  Column,
  Selection,
  Paging,
  SearchPanel,
  Pager,
} from "devextreme-react/data-grid";
import moreIcon from "../../../../SVG/more-2-fill.svg";
import ContextMenu from "devextreme-react/context-menu";
import { useAuth } from "../../../../contexts/auth";
import { generateBucketName } from "../../../manageUser/signatureSetup/PdfUtils";
import { fetchDocuments,fetchRecipientCount,
  fetchPendingRecipientCount,
  deleteDocument,
  deleteFileFromS3,
  generatePresignedUrl, } from '../../../../api/UserDashboardAPI';

var selectedRowData = "";
let selectBoxVal = 1;

function DocTabs({
  itemName,
  selectedTabIndex,
  dataSource,
  setdataSource,
  dataSource1,
  setdataSource1,
  noOfDoc,
  setNoOfDoc,
  loggedInUserId,
  loggedInEmail,
}) {
  const { user } = useAuth();
  const gridContainerRef = useRef();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  
  const fetchDocumentFunc = async (reqObj) => {
    try {
      const data = await fetchDocuments(reqObj.userid, reqObj.email);
      setdataSource1(data);
  
      const countData = await fetchDocuments({
        createdByYou: true,
        createdByOthers: true,
        userid: loggedInUserId,
        email: loggedInEmail,
      });
      setNoOfDoc(countData.length);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (selectedTabIndex === "Total") {
        setdataSource1(dataSource);
      } else {
        const newData = dataSource.filter((data) => data.status == selectedTabIndex);
        setdataSource1(newData);
      }
    };
  
    fetchData();
  }, [selectedTabIndex]);

  const handleDelete = (id) => {
    const updatedDocuments = documents.filter((item) => item.id !== id);
    setDocuments(updatedDocuments);
    handleAddedFilterChange(getSelectBoxValueById("filterDocs"));
  };

  const getSelectBoxValueById = (id) => {
    const selectBox = SelectBoxInstance.getInstance(
      document.getElementById(id)
    );
    if (selectBox) {
      return selectBox.option("value");
    }
    return null;
  };

  const createddataSource1 = [
    {
      value: 1,
      text: "All Documents",
    },
    {
      value: 2,
      text: "Created By You",
    },
    {
      value: 3,
      text: "Created By Others",
    },
  ];

  const docCellTemplate = async (container, options) => {
    const { data } = options;
    const { name, id, creator_id } = data;
    let createdBy = creator_id.id === loggedInUserId ? "You" : creator_id.full_name;
    const splitName = name.split('_');
    const displayName = splitName.slice(0, -1).join('_'); 
    try {
        const recipientData = await fetchRecipientCount(id);
        container.innerHTML = `
            <div class="document-details">
                <div class="document-name" title="${displayName}">${displayName}</div> 
                <span class="document-status">Created by ${createdBy}</span>,
                <span class="document-status">Total ${recipientData.recipient_count} Recipients</span>
            </div>
        `;
    } catch (error) {
        console.error("Error fetching recipient count:", error);
    }
};

  const statusCellTemplate = async (container, options) => {
    const { data } = options;
    const { status, id } = data;

    try {
      const pendingData = await fetchPendingRecipientCount(id);
      container.innerHTML = `
        <div class="statusDetails">
          <div class="statusBtn" statustype="${status}">
            <div class="statusCircle" statustype="${status}"></div>
            <div class="statusText" statustype="${status}">${status}</div>
          </div>
          <div class="subtext" id="pending${id}">${pendingData.pending_count} people haven't completed</div>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching pending recipient count:", error);
    }
  };

  const expdateCellTemplate = (container, options) => {
    const { data } = options;
    const { expirationDateTime } = data;
    const utcDate = new Date(expirationDateTime);
    const istDate = new Date(utcDate.getTime() + (5 * 60 + 30) * 60 * 1000); 
    const currentDate = new Date(); 
    const timeDiff = istDate.getTime() - currentDate.getTime();
    const remDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let hours = istDate.getHours();
    hours = hours % 12;
    hours = hours ? hours : 12;
    container.innerHTML = `
      <div class="document-details">
        <div class="document-name">${istDate.getDate()}-${istDate.getMonth() + 1}-${istDate.getFullYear()} </div>
        <div class="document-status">${remDays} days remaining</div>
      </div>
    `;
  };

  const modDateCellTemplate = (container, options) => {
    const { data } = options;
    const { last_modified_date_time, last_modified_by } = data;
    const dt = new Date(last_modified_date_time);
    const istDate = new Date(dt.getTime() + (5 * 60 + 30) * 60 * 1000); 
    let hours = dt.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    let viewer = last_modified_by.full_name;
    container.innerHTML = `
      <div class="document-details">
        <div class="document-name">${istDate.getDate()}-${istDate.getMonth()+1}-${istDate.getFullYear()} ${hours}:${dt.getMinutes()}:${dt.getSeconds()} ${ampm}</div>
        <div class="document-status">${viewer} has reviewed the document </div>
      </div>
    `;
  };

  const handleAddedFilterChange = (val) => {
    selectBoxVal = val;
    if (val == 1) {
      setdataSource1(dataSource);
    } else if (val == 2) {
      const newData = dataSource.filter(
        (data) => data.creator_id.id == loggedInUserId
      );
      setdataSource1(newData);
    } else {
      const newData = dataSource.filter(
        (data) => data.creator_id.id != loggedInUserId
      );
      setdataSource1(newData);
    }
  };

  const onCloneIconClick = (e) => {
    selectedRowData = e.data;
  };
  const [showDel, setshowDel] = useState(false)
  const actionTemplate = (rowData) => {
    const actionMenuItems = [
      {
        text: "View Details",
        onClick: () => {
          navigate("/ViewDetailsPage", { state: { details: selectedRowData } });
        },
      },
      {
        text: "View Document",
        onClick: () => {
          navigate(`/ViewDocumentPage?docStatus=${selectedRowData.status}`, { state: { docData: selectedRowData } });
        },
      },
      {
        text: "Delete",
        onClick: async () => {
          try {
            const bucketName = generateBucketName(selectedRowData.creator_id.id, selectedRowData.creator_id.email);
            const fileName = selectedRowData.name + ".pdf";
  
            await deleteFileFromS3(bucketName, fileName,loggedInUserId);
            const deleteResponse = await deleteDocument(selectedRowData.id,loggedInUserId);
  
            if (deleteResponse.status === 200) {
              toastDisplayer("success", "Document deleted successfully");
  
              let reqObj;
              switch (selectBoxVal) {
                case 1:
                  reqObj = {
                    createdByYou: true,
                    createdByOthers: true,
                    userid: loggedInUserId,
                    email: loggedInEmail,
                  };
                  break;
                case 2:
                  reqObj = {
                    createdByYou: true,
                    createdByOthers: false,
                    userid: loggedInUserId,
                    email: loggedInEmail,
                  };
                  break;
                case 3:
                  reqObj = {
                    createdByYou: false,
                    createdByOthers: true,
                    userid: loggedInUserId,
                    email: loggedInEmail,
                  };
                  break;
              }
  
              fetchDocumentFunc(reqObj);
            } else {
              toastDisplayer("error", "Document can't be deleted");
            }
          } catch (error) {
            console.error("Error deleting document:", error);
          }
        },
        // disabled: !showDel,
        // visible: showDel
      },
      {
        text: "Download",
        onClick: async () => {
          try {
            const bucketName = generateBucketName(selectedRowData.creator_id.id, selectedRowData.creator_id.email);
            const fileName = selectedRowData.name + ".pdf";
            const presignedUrl = await generatePresignedUrl(bucketName, fileName);
  
            if (presignedUrl.success) {
              const link = document.createElement("a");
              link.href = presignedUrl.url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.error("Error generating pre-signed URL:", presignedUrl.error);
            }
          } catch (error) {
            console.error("Error fetching pre-signed URL:", error);
          }
        },
      },
    ];

    const actionMenuItemsShowDel = [
      {
        text: "View Details",
        onClick: () => {
          navigate("/ViewDetailsPage", { state: { details: selectedRowData } });
        },
      },
      {
        text: "View Document",
        onClick: () => {
          navigate(`/ViewDocumentPage?docStatus=${selectedRowData.status}`, { state: { docData: selectedRowData } });
        },
      },
      {
        text: "Download",
        onClick: async () => {
          try {
            const bucketName = generateBucketName(selectedRowData.creator_id.id, selectedRowData.creator_id.email);
            const fileName = selectedRowData.name + ".pdf";
            const presignedUrl = await generatePresignedUrl(bucketName, fileName);
  
            if (presignedUrl.success) {
              const link = document.createElement("a");
              link.href = presignedUrl.url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.error("Error generating pre-signed URL:", presignedUrl.error);
              toastDisplayer("error","Unable to download this document");
            }
          } catch (error) {
            console.error("Error fetching pre-signed URL:", error);
          }
        },
      },
    ];
  
    const actionMenuMode = "context1";
    return (
      <>
        <div className="actionDetails">
          <Button
            icon={moreIcon}
            className={"actionbtn"}
            onClick={() => onCloneIconClick(rowData)}
          />
        </div>
        {actionMenuMode === "context1" && (
          <ContextMenu
            items={showDel ? actionMenuItems : actionMenuItemsShowDel}
            target={".actionbtn"}
            showEvent={"dxclick"}
            cssClass={"actionMenu"}
          />
        )}
      </>
    );
  };

  const handleRowClick = (e) => {
    const dataGrid = e.component;
    const keys = dataGrid.getSelectedRowKeys();
    const isSelected = keys.includes(e.key);
    if (isSelected) {
      dataGrid.deselectRows([e.key]);
    } else {
      dataGrid.selectRows([e.key], true);
    }

    if(e.data.creator_id.id === loggedInUserId){
      setshowDel(true);
    }else{
      setshowDel(false);
    }
  };

  const handleRowDoubleClick=(e)=>{
    navigate(`/ViewDocumentPage?docStatus=${e.data.status}`, { state: { docData: e.data } });
  }
  return (
    <>
      <div className="dashboardData">
        <DataGrid
          ref={gridContainerRef}
          id="gridContainer"
          dataSource={dataSource1}
          ////rajvi changes
          onRowClick={handleRowClick}
          onRowDblClick={handleRowDoubleClick}
          width={"100%"}
          keyExpr={"id"}
        >
          <Selection mode="multiple" showCheckBoxesMode="always" />
          <Paging defaultPageSize={5} />
          <Pager displayMode={"compact"} />

          <Toolbar>
            <Item location="before">
              <div className="infoText">
                In {itemName}, you have {noOfDoc} documents
              </div>
            </Item>
            <Item name="searchPanel" />
            <Item location="after">
              <SelectBox
                id="filterDocs"
                width={"100%"}
                height="44px"
                className="selectbox-right"
                valueExpr="value"
                displayExpr="text"
                stylingMode="outlined"
                value={selectBoxVal}
                items={createddataSource1}
                onValueChanged={(e) => handleAddedFilterChange(e.value)}
              />
            </Item>
          </Toolbar>

          <SearchPanel
            visible={true}
            width={300}
            stylingMode="outlined"
            placeholder="Search Documents"
          />
          <Column
            dataField="pdfName"
            cellTemplate={docCellTemplate}
            caption="DOCUMENT NAME"
            allowSorting={false}
            width={"30%"}
            allowSearch={true}
          />
          <Column
            dataField="Status"
            cellTemplate={statusCellTemplate}
            caption="STATUS"
            allowSorting={false}
            width={"15%"}
            allowSearch={false}
          />
          <Column
            dataField="ExpirationDate"
            cellTemplate={expdateCellTemplate}
            caption="EXPIRATION DATE"
            allowSorting={false}
            width={"15%"}
            allowSearch={false}
          />
          <Column
            dataField="last_modified_date_time"
            cellTemplate={modDateCellTemplate}
            caption="LAST MODIFIED"
            width={"25%"}
            allowSearch={false}
            defaultSortOrder="desc"
            defaultSortIndex={0}
          />
          <Column
            dataField="ACTIONS"
            cellRender={actionTemplate}
            caption="ACTIONS"
            allowSorting={false}
            width={"10%"}
            allowSearch={false}
          />
        </DataGrid>
      </div>
    </>
  );
}

export default DocTabs;
