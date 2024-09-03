import "devextreme/dist/css/dx.common.css";
import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";
import "./assets/remixicon/remixicon.css";
import React from "react";
import { useEffect } from "react";
import { useLocation, HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import UnauthenticatedContent from "./UnauthenticatedContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { CustomDragDropProvider } from "./components/handle-document/main-display/CustomDragDropContext";
import { CustomDragDropProvider } from "./contexts/CustomDragDropContext";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname == "/recieverPanel") {
      const currentUrl = location.pathname + location.search;
      console.log("Saving URL:", currentUrl);
      if (!localStorage.getItem("initialUrl")) {
        localStorage.setItem("initialUrl", currentUrl);
      }
    }
  }, [user, location]);

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();



  return (
    <CustomDragDropProvider>
      <Router>
        <ToastContainer />
        <AuthProvider>
          <NavigationProvider>
            {/* <UseSaveInitialUrl> */}
            <div className={`app ${screenSizeClass}`}>
              <App />
            </div>
            {/* </UseSaveInitialUrl> */}
          </NavigationProvider>
        </AuthProvider>
      </Router>
    </CustomDragDropProvider>
  );
}
