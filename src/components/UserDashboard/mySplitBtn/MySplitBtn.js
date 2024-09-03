import React, { useState } from "react";
import { DropDownButton } from "devextreme-react";
import addIcon from "../../../SVG/add-line.svg";
import fileIcon from "../../../SVG/file-3-line.svg";
import "./MySplitBtn.scss";
import { useNavigate } from "react-router-dom";

function MySplitBtn({ tabState }) {
  const [templateType, setTemplateType] = useState("");
  const navigate = useNavigate();
  const items = [
    { text: 'Document' ,icon: fileIcon},
    { text: 'Template',icon: fileIcon },
    { text: 'Bulk Sign',icon: fileIcon },
  ];

  const handleTemplateClick = (e) => {
    var TemplateTypeINFun;
    if(e.itemData.text==="Bulk Sign"){
      TemplateTypeINFun="BulkSigning";
    }else{
      TemplateTypeINFun=e.itemData.text;
    }
    navigate(`/dashUI?template=${TemplateTypeINFun}`);
    setTemplateType();
  };

  const handleCreateNew = (e) => {
    if (tabState === "document") {
      navigate(`/dashUI?template=Document`);
    } else if (tabState === "template") {
      navigate(`/dashUI?template=Template`);
    }else{
      navigate(`/dashUI?template=BulkSigning`);
    }
  };

  return (
    <>
      <div className="dropDownMain">
        <DropDownButton
          splitButton={true}
          icon={addIcon}
          items={items}
          useSelectMode={false}
          width={"auto"}
          text="Create New"
          onItemClick={handleTemplateClick}
          onButtonClick={handleCreateNew}
        />
      </div>
    </>
  );
}

export default MySplitBtn;
