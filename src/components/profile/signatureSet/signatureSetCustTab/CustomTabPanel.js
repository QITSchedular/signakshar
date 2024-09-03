import React, { useState } from 'react'
import "./CustomTabPanel.scss";
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import BtnGroup from '../btnGroup/BtnGroup'



export default function CustomTabPanel() {
    const [selectedTab, setSelectedTab] = useState(1);
  

    const handleTabSelection = (e) => {
        setSelectedTab(e.component.option('selectedIndex'));
    };
    return (
        <div className='customTabPanel-main'>
            <div className='customTabPanel'>
                <TabPanel
                    className="dx-theme-background-color-custom"
                    width="100%"
                    height={418}
                    animationEnabled={false}
                    swipeEnabled={true}
                    tabsPosition={"top"}
                    iconPosition={"start"}
                    selectedIndex={selectedTab}
                    onOptionChanged={handleTabSelection}
                >
                    <Item title='Text'>
                        <div className='ProfileData'>

                        </div>
                    </Item>
                    <Item title="Draw">
                        <BtnGroup/>
                    </Item>
                    <Item title='Image'>
                        <div className='ProfileData'>

                        </div>
                    </Item>
                </TabPanel>
            </div>
        </div>
    )
}

