import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "devextreme-react/button";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useAuth } from "../../contexts/auth";
import "./UserPanel.scss";
import downArrowIcon from "../../SVG/arrow-down-s-line.svg";
import profileIcon from "../../SVG/account-circle-line.svg";
import logoutIcon from "../../SVG/logout-circle-r-line.svg";
import { fetchUserDetails } from "../../api/UserDashboardAPI";
import { LoadPanel } from "devextreme-react";

export default function UserPanel({ menuMode }) {
  const { user, userDetailAuth,signOut } = useAuth();
  console.log("userDetailAuth:",userDetailAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetchUserDetails(user);
  //       setUserData(response);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   fetchUserData();
  // }, [user.data]);


  const navigateToProfile = useCallback(() => {
    navigate("/myProfile");
  }, [navigate]);

  const menuItems = useMemo(
    () => [
      {
        text: "My Profile",
        icon: profileIcon,
        onClick: navigateToProfile,
      },
      {
        text: "Logout",
        icon: logoutIcon,
        onClick: signOut,
      },
    ],
    [navigateToProfile, signOut]
  );
  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <div className={"user-panel"}>
        <div className={"user-info"}>
          {userDetailAuth && (
            <>
              <div className={"image-container"}>
                {
                  (userDetailAuth.user.profile_pic && (userDetailAuth.user.profile_pic != "null"))
                    ? <img src={userDetailAuth.user.profile_pic} alt="profile_img" height={35} width={35} />
                    : <span>{userDetailAuth ? userDetailAuth.user.email[0].toUpperCase() : ""}</span>
                }
              </div>
              <div className={"user-name"}>{userDetailAuth && userDetailAuth.user.full_name !== null ? userDetailAuth.user.full_name : userDetailAuth.user.email.split('@')[0]}</div>
            </>
          )}


          <Button
            className={"user-button authorization"}
            width={44}
            height={44}
            icon={downArrowIcon}
            stylingMode={"text"}
          />
        </div>

        {menuMode === "context" && (
          <ContextMenu
            items={menuItems}
            target={".user-button"}
            showEvent={"dxclick"}
            // width={226}
            // height={128}
            cssClass={"user-menu"}
          >
            <Position
              my={{ x: "center", y: "top" }}
              at={{ x: "center", y: "bottom" }}
            />
          </ContextMenu>
        )}
        {menuMode === "list" && (
          <List className={"dx-toolbar-menu-action"} items={menuItems} />
        )}
      </div>
    </>
  );
}
