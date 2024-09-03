import { Routes, Route, Navigate } from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { CreateOrSignDocument, DashUI, Footer, UserDashboard, ViewDetailsPage, ViewDocumentPage } from './components';
import PreviewPage from './components/previewPage/PreviewPage';
import RecieverPanel from './components/recieverPanel/RecieverPanel';
import Profile from './components/profile/Profile'
import { LogUI } from './pages';

export default function Content() {
  
  return (
    // <SideNavBarLayout title={appInfo.title}>
    //   <Routes>
    //     {routes.map(({ path, element }) => (
    //       <Route
    //         key={path}
    //         path={path}
    //         element={element}
    //       />
    //     ))}
    //     <Route
    //       path='*'
    //       element={<Navigate to='/home' />}
    //     />
    //             <Route
    //       path='/userdashboard'
    //       element={<Navigate to='/userdashboard' />}
    //     />
    //   </Routes>
    //   <Footer>
    //     Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Inc.
    //     <br />
    //     All trademarks or registered trademarks are property of their
    //     respective owners.
    //   </Footer>
    // </SideNavBarLayout>
    
    <>
    {/* <UserDashboard/> */}
    <Routes>
      <Route
        path='/userdashboard'
        element={<UserDashboard/>}
      />
      <Route
        path='/ViewDetailsPage'
        element={<ViewDetailsPage/>}
      />
      <Route
        path='/ViewDocumentPage'
        element={<ViewDocumentPage/>}
      />
      <Route
        path='/PreviewPage'
        element={<PreviewPage/>}
      />
      <Route
        path='/createorsigndocument'
        element={<CreateOrSignDocument/>}
      />
      <Route
        path='/myProfile'
        element={<Profile/>}
      />
      <Route
        path='/RecieverPanel'
        element={<RecieverPanel/>}
      />
      <Route
        path='/dashui'
        element={<DashUI/>}
      />
      <Route
        path='/logui'
        element={<LogUI/>}
      />
       <Route
        path='*'
        element={
          <Navigate 
            to={"/userdashboard"}
          />
        }
      />
    </Routes>
  </>
  );
}

