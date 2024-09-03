//In diff popup
import React, { useState, useEffect } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import "./MyHeader.scss";
import leftarrow from "../../../icons/left-arrow.svg";
import closeBtn from "../../../icons/close-line.svg";
import { useNavigate } from "react-router-dom";
import PopupMain from "../../customPopup/PopupMain";
import { fetchUserDetails } from "../../../api/UserDashboardAPI";
import { useAuth } from "../../../contexts/auth";

export default function MyHeader({
  menuToggleEnabled,
  title,
  toggleMenu,
  screenValue,
  typeReciever,
  previewScreenValue,
  tempYesState,
  selectedFile,
  signerOptions,
  docId,
  tempID,
  templateDraggedData,
}) {
  const { user } = useAuth();
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);

  useEffect(() => {
    if (user) {
      const getLoggedInUser = async () => {
        try {
          const userDetails = await fetchUserDetails(user);
          setLoggedInUserdetail(userDetails);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      getLoggedInUser();
    }
  }, []);

  const handleCloseBtnInHeader = () => {
    if (screenValue === "viewDocument") {
      navigate("/userdashboard");
    } else if (screenValue === "Document" && signerOptions.length === 1) {
      if (
        loggedInUserDetail &&
        loggedInUserDetail.user &&
        loggedInUserDetail.user.email
      ) {
        if (signerOptions[0].email === loggedInUserDetail.user.email) {
          navigate("/userdashboard");
        } else {
          setPopupVisible(!popupVisible);
        }
      }
    } else if (screenValue === "BulkSigning") {
      navigate("/userdashboard");
    } else if (screenValue === "recipient-panel") {
      setPopupVisible(!popupVisible);
    } else {
      setPopupVisible(!popupVisible);
    }
  };

  const handleGoBackBtn = () => {
    if (screenValue === "Template") {
      navigate("/dashui?template=Template");
    } else if (screenValue === "Document") {
      navigate(`/dashui?template=Document&docId=${docId}`, {
        state: { backUpdocId: docId, backUpSelectedFile: selectedFile },
      });
    } else if (typeReciever === "reciever") {
      navigate("/userdashboard");
    } else if (
      previewScreenValue === "Document" &&
      tempYesState === "yes" &&
      docId &&
      tempID
    ) {
      navigate(
        `/createorsigndocument?template=Document&tempYes=yes&did=${docId}&tid=${tempID}`,
        {
          state: {
            signOpt: signerOptions,
            backUpSelectedFile: selectedFile,
            templateDraggedData: templateDraggedData,
          },
        }
      );
    } else if (screenValue === "viewDocument") {
      navigate("/userdashboard");
    } else if (screenValue === "recipient-panel") {
      navigate("/userdashboard");
    } else if (screenValue === "BulkSigning") {
      navigate("/userdashboard");
    } else if (screenValue === "editTemplate") {
      // navigate("/userdashboard");
      navigate("/userdashboard", { state: { tabIndex: 1 } });
    }
  };

  return (
    <div className="headertest2">
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
              onClick={handleGoBackBtn}
            />
          </Item>
          <Item location={"after"} cssClass="demo2">
            <Button
              icon={closeBtn}
              className="navigate-to-dashboard"
              onClick={handleCloseBtnInHeader}
            />
          </Item>
        </Toolbar>

        <PopupMain
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onNavigate={() => navigate("/userdashboard")}
          mainTitle="Back to home page"
          subTitle={
            screenValue === "editTemplate"
              ? "Templates are not edited until you edit them."
              : screenValue === "Template"
              ? "Templates are not saved until you save them."
              : screenValue === "recipient-panel" && typeReciever === "signer"
              ? "Documents are not approved until you sign them and mark them as done."
              : screenValue === "recipient-panel" && typeReciever === "viewer"
              ? "Documents are not approved until you mark them as viewed."
              : "Documents are not saved until you send them."
          }
          mainBtnText="Back to home page"
          source="header"
          popupWidth="490px"
        />
      </header>
    </div>
  );
}
