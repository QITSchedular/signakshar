import React, { useState } from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/UserPanel';
import './Header.scss';
import { Template } from 'devextreme-react/core/template';
import settings2 from '../../SVG/settings-2-line (1).svg';
import notification4 from '../../SVG/notification-4-line.svg';
import NotificationPanel from '../notificationPanel/NotificationPanel'


export default function Header({ menuToggleEnabled, title, toggleMenu }) {

  const [notificationPanel, setNotificationPanel] = useState(false);

  const handleNotification = () => {
    setNotificationPanel(!notificationPanel)
  }
  return (
    <div className="mytestdiv">
      <header className={'header-component'}>
        <Toolbar className={'header-toolbar'}>
          {/* <Item
          visible={menuToggleEnabled}
          location={'before'}
          widget={'dxButton'}
          cssClass={'menu-button'}
        >
          <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
        </Item> */}
          <Item
            location={'before'}
            cssClass={'header-title'}
            text={title}
            visible={!!title}
          />
          {/* <Item
            location={'after'}
            locateInMenu={'auto'}
            menuItemTemplate={'userPanelTemplate'}
          > */}
          {/* <Button
              // className={'user-button authorization'}
              // icon={'ri-settings-2-line'}
              width={40}
              height={40}
              icon={settings2}
              stylingMode={'text'}
              onClick={() => {
                // Handle button click event here
                console.log("hey hello")
              }}
            /> */}

          {/* <Button
              // className={'user-button authorization'}
              width={40}
              height={40}
              icon={notification4}
              stylingMode={'text'}
              onClick={handleNotification}
            />
            {notificationPanel && <NotificationPanel />} */}


          {/* <Button
            className={'user-button authorization'}
            width={210}
            height={'100%'}
            stylingMode={'text'}
          >
            <UserPanel menuMode={'context'} />
          </Button> */}
          {/* </Item> */}

          <Item
            location={'after'}
          // locateInMenu={'auto'}
          // menuItemTemplate={'userPanelTemplate'}
          >
            <Button
              className={'user-button authorization'}
              width={'auto'}
              height={'100%'}
              stylingMode={'text'}
            >
              <UserPanel menuMode={'context'} />
            </Button>


          </Item>
          {/* <Template name={'userPanelTemplate'}>
          <UserPanel menuMode={'list'} />
        </Template> */}

        </Toolbar>
      </header>
    </div>
  )
}
