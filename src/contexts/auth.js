import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  getUser,
  signIn as sendSignInRequest,
  Logout,
  signInWithGoogleAPI,
} from "../api/auth";
import { toastDisplayer } from "../components/toastDisplay/toastDisplayer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadPanel } from "devextreme-react";

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [userDetailAuth, setUserDetailAuth] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  // useEffect(() => {
  //   (async function () {
  //     const result = await getUser();
  //     if (result.isOk) {
  //       setUser(result.data);
  //       setUserDetailAuth(result.userData);
  //     }
  //     setLoading(false);
  //   })();
  // }, []);

  const fetchAuthUserData = async () => {
    const result = await getUser();
    if (result.isOk) {
      setUser(result.data);
      setUserDetailAuth(result.userData);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchAuthUserData();
  }, []);
  

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      const newresult = await getUser();
      if (newresult.isOk) {
        setUser(result.data);
        setUserDetailAuth(newresult.userData);
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = useCallback(async (data) => {
    setLoading(true);
    const result = await signInWithGoogleAPI(data.access_token);
    if (result.isOk) {
      const newresult = await getUser();
      if (newresult.isOk) {
        setUser(result.data);
        setUserDetailAuth(newresult.userData);
      }
    }
    setLoading(false);
  }, []);

  const signOut = useCallback(() => {
    setLoading(true);
    const result = Logout();
    if (!result.isOk) {
      setUser(undefined);
      setUserDetailAuth(undefined);
    }
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadPanel visible={true} />}
      <AuthContext.Provider
        value={{ user,userDetailAuth,fetchAuthUserData, signIn, signOut, loading, signInWithGoogle }}
        {...props}
      />
    </>
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
