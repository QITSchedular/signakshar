import { Routes, Route, Navigate } from "react-router-dom";
import { SingleCard } from "./layouts";
import {
  LoginForm,
  ResetPasswordForm,
  ChangePasswordForm,
  RegistrationForm,
  SignInForm,
  DashUI,
  Header,
  SignatureSetup,
  CreateOrSignDocument,

} from "./components";
import MyHeader from "./components/handle-document/main-display/MyHeader";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import MainUser from "./components/manageUser/MainUser";
import OtpVerification from "./components/manageUser/otpVerification/OtpVerification";
import ForgotPwd from "./components/manageUser/forgotPwd/ForgotPwd";
import ViewDetailsPage from "./components/UserDashboard/viewDetailsPage/ViewDetailsPage";
import PreviewPage from "./components/previewPage/PreviewPage";
import RegOtp from "./components/manageUser/registrationForm/RegOtp";
// import dashUI from './components/dashBoard/dashUI/dashUI';

export default function UnauthenticatedContent() {
  return (
    <Routes>
      <Route
        path="/SignInForm"
        element={
          // <SingleCard title="Sign In">
            //  <LoginForm /> 
          // </SingleCard>
          <SignInForm/>
        }
      />
      <Route
        path="/RegistrationForm"
        element={
          // <SingleCard title="Sign Up">
          <RegistrationForm />
          // </SingleCard>
        }
      />
      {/* <Route
        path="/userdashboard"
        element={
          // <SingleCard title="Sign Up">
          <UserDashboard />
          // </SingleCard>
        }
      /> */}
      {/* <Route path="/SignInForm" element={<SignInForm />} /> */}
      <Route path="/SignatureSetup" element={<SignatureSetup />} />
      <Route path="/RegOtp" element={<RegOtp />} />
      {/* <Route path="/CreateOrSignDocument" element={<CreateOrSignDocument />} /> */}
      {/* <Route path="/dashUI" element={<DashUI />} /> */}
      {/* <Route path="/MyHeader" element={<MyHeader />} /> */}
      {/* <Route path="/Header" element={<Header />} /> */}
      <Route
        path="/reset-password"
        element={
          <SingleCard
            title="Reset Password"
            description="Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
          >
            <ResetPasswordForm />
          </SingleCard>
        }
      />
      <Route
        path="/change-password/:recoveryCode"
        element={
          <SingleCard title="Change Password">
            <ChangePasswordForm />
          </SingleCard>
        }
      />
      {/* <Route path="*" element={<Navigate to={"/login"} />}></Route> */}
      <Route
        path="/change-password/:recoveryCode"
        element={
          <SingleCard title="Change Password">
            <ChangePasswordForm />
          </SingleCard>
        }
      />
      
      {/* <Route path='/forgotpwd' element={<ForgotPwd></ForgotPwd>}></Route>
      <Route path='/otpverification' element={<OtpVerification></OtpVerification>}></Route>
      <Route path='/mainuser' element={<MainUser></MainUser>}></Route> */}
      <Route path='/forgotpwd' element={<ForgotPwd></ForgotPwd>}></Route>
      <Route path='/otpverification' element={<OtpVerification></OtpVerification>}></Route>
      <Route path='/mainuser' element={<MainUser></MainUser>}></Route>
      {/* <Route path='/ViewDetailsPage' element={<ViewDetailsPage></ViewDetailsPage>}></Route> */}
      {/* <Route path='/previewpage' element={<PreviewPage></PreviewPage>}></Route> */}
      <Route path="*" element={<Navigate to={"/SignInForm"} />}></Route>

    </Routes>
  );
}
