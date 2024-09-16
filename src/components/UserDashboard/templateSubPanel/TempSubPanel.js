//// refactored codee - 21 june
import { List } from "devextreme-react/list";
import ContextMenu from "devextreme-react/context-menu";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { TextBox } from "devextreme-react/text-box";
import { Button } from "devextreme-react";
import moreIcon from "../../../SVG/more-2-fill (1).svg";
import React, { useState, useEffect } from "react";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useNavigate } from "react-router-dom";
import MySplitBtn from "../mySplitBtn/MySplitBtn";
import {
  fetchTemplates,
  fetchRecipientsByTemplateId,
  deleteTemplate,
  fetchUserDetails,
  deleteTemplateFromS3,
  fetchTemplateBucketForImages,
} from "../../../api/UserDashboardAPI"; // Update the path accordingly
import "./TempSubPanel.scss";
import { useAuth } from "../../../contexts/auth";
import { LoadPanel } from "devextreme-react";

function TempSubPanel() {
  const { user, userDetailAuth } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [templateData, setTemplateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchValue(e.value);
  };

  const fetchTemplateData = async () => {
    try {
      setLoading(true);
      const jwtToken = localStorage.getItem("jwt");
      // const userResponse = await fetchUserDetails(user);

      // Fetch templates
      const templates = await fetchTemplates(jwtToken, userDetailAuth.user.id);
      if (templates.length > 0) {
        const imgResponse = await fetchTemplateBucketForImages(userDetailAuth);

        // Create a map of template_id to image
        const imgMap = imgResponse.documents.reduce((map, doc) => {
          map[doc.template_id] = doc.image;
          return map;
        }, {});

        // Fetch recipients and merge with images
        const templateDataWithRecipients = await Promise.all(
          templates.map(async (template) => {
            const recipientResponse = await fetchRecipientsByTemplateId(
              template.template_id,
              jwtToken
            );
            template.recData = recipientResponse;

            // Add image data if available
            template.image = imgMap[template.template_id] || null;
            return template;
          })
        );
        setTemplateData(templateDataWithRecipients);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching template data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  var selectedRowData = "";
  const onCloneClick = (rowData) => {
    selectedRowData = rowData;
  };

  const templateDelete = async (rowData) => {
    try {
      setLoading(true);
      // const userResponse = await fetchUserDetails(user);
      const delTempResponse = await deleteTemplateFromS3(
        userDetailAuth,
        rowData.template_id,
        rowData.createTempfile
      );
      if (delTempResponse.success === true) {
        const responseDel = await deleteTemplate(
          rowData.template_id,
          user,
          userDetailAuth.user.id
        );
        if (
          responseDel.message === "Template deleted successfully" &&
          responseDel.status === 200
        ) {
          if (templateData.length === 1) {
            setTemplateData([]);
          }
          fetchTemplateData();
          toastDisplayer("success", "Template deleted successfully");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting template:", error);
      setLoading(false);
    }
  };

  const navigateToDocument = (selectedRowData) => {
    navigate("/DashUI?template=Document", { state: { selectedRowData } });
  };

  const editTemplateNavigate = (selectedRowData) => {
    navigate(
      `/createorsigndocument?template=editTemplate&tid=${selectedRowData.template_id}`,
      { state: { selectedRowData: selectedRowData } }
    );
  };

  const moreMenuItems = [
    {
      text: "Edit",
      onClick: () => editTemplateNavigate(selectedRowData),
    },
    {
      text: "Apply",
      onClick: () => navigateToDocument(selectedRowData),
    },
    {
      text: "Delete",
      onClick: () => templateDelete(selectedRowData),
    },
  ];

  const ItemTemplate = (data) => (
    <div className="listBox">
      <div className="pdfImg">
        {data.image ? (
          <img
            src={`data:image/png;base64,${data.image}`}
            alt="Template Preview"
            width="100%"
            height="100%"
          />
        ) : (
          <div>No Image Available</div>
        )}
      </div>
      <div className="listContent">
        <div className="listInfo">
          <div className="listDocName" title={data.templateName}>
            {data.templateName}
          </div>
          <div className="listRec">
            {data.recData.length} Recipients / {data.templateNumPages} Pages
          </div>
        </div>
        <div className="listAction">
          <Button
            icon={moreIcon}
            height={44}
            className="listBtn"
            onClick={() => onCloneClick(data)}
            width={44}
            stylingMode="outlined"
          />
          <ContextMenu
            items={moreMenuItems}
            target=".listBtn"
            showEvent="dxclick"
            cssClass="moreMenu"
          ></ContextMenu>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {loading && <LoadPanel visible={true} />}
      <div className="docHead">
        <p className="doctext">Templates</p>
        <div className="mainSplit">
          <MySplitBtn tabState="template" />
        </div>
      </div>

      {templateData && (
        <div className="tempInfo">
          <div className="tempTool">
            <Toolbar>
              <Item location="before" cssClass="tempText">
                You have created {templateData.length || 0} templates
              </Item>
              <Item location="after" cssClass="header-title2">
                <TextBox
                  width={300}
                  height={44}
                  placeholder="Search Templates"
                  mode="search"
                  stylingMode="outlined"
                  valueChangeEvent="keyup"
                  onValueChanged={handleSearchChange}
                ></TextBox>
              </Item>
            </Toolbar>
          </div>
          {templateData.length > 0 ? (
            <div className="tempMainList">
              <List
                searchValue={searchValue}
                dataSource={templateData}
                searchExpr="templateName"
                itemRender={ItemTemplate}
                className={"template-list"}
              />
            </div>
          ) : (
            <div className="nodata">No Templates Created</div>
          )}
        </div>
      )}
    </div>
  );
}

export default TempSubPanel;
