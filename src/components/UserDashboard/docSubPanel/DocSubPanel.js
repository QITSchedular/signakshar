// //////// code refactoring after submission 21 june
import React, { useState, useCallback, useEffect } from 'react';
import './DocSubPanel.scss';
import TabPanel from 'devextreme-react/tab-panel';
import { Item } from 'devextreme-react/tabs';
import MySplitBtn from '../mySplitBtn/MySplitBtn';
import DocTabs from './docTabs/DocTabs';
import { fetchUserDetails, fetchDocuments ,getAllDocsData} from '../../../api/UserDashboardAPI';
import { useAuth } from '../../../contexts/auth';
import { LoadPanel } from "devextreme-react";


const DocSubPanel = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState("Total");
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState({
    dataSource1: [],
    dataSource: [],
    noOfDoc: 0,
  });
  const [userDetails, setUserDetails] = useState({
    loggedInUserId: null,
    loggedInEmail: null,
  });
  // new state for doc data-rajvi
  const [newDocData, setnewDocData] = useState([]);

  const { user,userDetailAuth } = useAuth();

  const onTabSelectionChanged = useCallback((index) => {
    setSelectedTabIndex(index.addedItems[0].title);
  }, []);

  useEffect(() => {
    // const initializeData = async () => {
    //   try {
    //     setLoading(true);
    //     // const userData = await fetchUserDetails(user);
    //     setUserDetails({ loggedInUserId: userDetailAuth.user.id, loggedInEmail: userDetailAuth.user.email });
    //     const documentsData = await fetchDocuments(userDetailAuth.user.id, userDetailAuth.user.email);
    //     setDocuments({
    //       dataSource: documentsData,
    //       dataSource1: documentsData,
    //       noOfDoc: documentsData.length,
    //     });
    //   } catch (error) {
    //     console.error('Error initializing data:', error);
    //   }
    //   finally {
    //     setLoading(false); // Ensure loading is set to false in the finally block
    //   }
    // };

    //////////////newcode
    const initializeData = async () => {
      try {
        setLoading(true);
        // const userData = await fetchUserDetails(user);
        setUserDetails({ loggedInUserId: userDetailAuth.user.id, loggedInEmail: userDetailAuth.user.email });
        // const documentsData = await fetchDocuments(userDetailAuth.user.id, userDetailAuth.user.email);
        const docsAllData=await getAllDocsData(true,true,userDetailAuth.user.id);
        setnewDocData(docsAllData);
        // setDocuments({
        //   dataSource: documentsData,
        //   dataSource1: documentsData,
        //   noOfDoc: documentsData.length,
        // });
      } catch (error) {
        console.error('Error initializing data:', error);
      }
      finally {
        setLoading(false); // Ensure loading is set to false in the finally block
      }
    };
    initializeData();
  }, [user]);

  const tabItems = ['Total', 'Pending', 'Completed'];

  return (
    <>
    {loading && <LoadPanel visible={true} />}
      <div className="docHead">
        <p className="doctext">Documents</p>
        <div className="mainSplit">
          <MySplitBtn tabState="document" />
        </div>
      </div>

      <div className="docTabs">
        <TabPanel onSelectionChanged={onTabSelectionChanged}>
          {tabItems.map((item) => (
            <Item key={item} title={item}>
              {/* <DocTabs
                itemName={item}
                selectedTabIndex={selectedTabIndex}
                dataSource={documents.dataSource}
                setdataSource={(data) => setDocuments((prev) => ({ ...prev, dataSource: data }))}
                dataSource1={documents.dataSource1}
                setdataSource1={(data) => setDocuments((prev) => ({ ...prev, dataSource1: data }))}
                noOfDoc={documents.noOfDoc}
                setNoOfDoc={(count) => setDocuments((prev) => ({ ...prev, noOfDoc: count }))}
                loggedInUserId={userDetails.loggedInUserId}
                loggedInEmail={userDetails.loggedInEmail}
              /> */}

              <DocTabs
                itemName={item}
                selectedTabIndex={selectedTabIndex}
                setSelectedTabIndex={setSelectedTabIndex}
                newDocData={newDocData}
                setnewDocData={setnewDocData}
              />
            </Item>
          ))}
        </TabPanel>
      </div>
    </>
  );
};

export default DocSubPanel;
