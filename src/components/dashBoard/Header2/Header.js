import React from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import leftarrow from "../../../SVG/arrow-left-s-line.svg";

export default function Header({ menuToggleEnabled, title, toggleMenu }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    sessionStorage.removeItem("fileData");
    sessionStorage.removeItem("filesDataBackup");
    sessionStorage.removeItem("goBackData");
    sessionStorage.removeItem("goBackTemplate");

    navigate("/userdashboard");
  };
  return (
    <div className="headertest">
      <header className={"header2-component"}>
        <Toolbar className={"header-toolbar"}>
          <Item
            location={"before"}
            cssClass={"header-title"}
            text={title}
            visible={!!title}
          />
          <Item location={"before"} locateInMenu={"auto"} cssClass="demo">
            <Button
              icon={leftarrow}
              text="Go back"
              className="button-custom"
              onClick={handleGoBack}
            />
          </Item>
        </Toolbar>
      </header>
    </div>
  );
}
