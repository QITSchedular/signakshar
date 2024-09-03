import React, { useState } from "react";
import { Popup } from "devextreme-react/popup";
import "./NotificationPanel.scss";

export default function NotificationPanel() {
  const [popupVisible, setPopupVisible] = useState(true);

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const HeaderTemplate = () => (
    <div className="popup-header">
      <div className="popup-title">Notifications</div>
      <div className="popup-subtitle">All the notifications at one place!</div>
      <button className="popup-close-button" onClick={togglePopup}>
        + {/* Unicode character for a close icon */}
      </button>
    </div>
  );

  return (
    <Popup
      width={372}
      height={620}
      visible={popupVisible}
      showCloseButton={false}
      dragEnabled={false}
      titleRender={HeaderTemplate}
      position={{
        my: "top",
        at: "top",
        of: window,
        offset: "500 70",
      }}
      hideOnOutsideClick={false}
      className="NotificationPanel-main"
    >
      <div className="NotificationPanel-main">
        <div className="popUp-main">
          <div className="popup-content">
            <div className="caption">
              <p className="popUp-notification">
                You have to sign QIT document in pending state
              </p>
              <p className="popUp-notification-date">07th July 2023</p>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
