import axios from "axios";

/// RegistrationForm.js , RegOtp.js , OtpVerification.js
export const sendOtp = async (email,filter) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/sendOtp/`,
      {
        email: email,
        filter: filter,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/// RegistrationForm.js
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/verifyOtp/`,
      {
        email: email,
        otp: otp,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/// SignatureSetup.js
// export const registerUser = async ({
//     email,
//     password,
//     full_name,
//     initials,
//     companyStampImageData,
//     signatureDrawingData,
//     signatureImageData,
//     signatureText,
//     signatureTextData,
//     initialDrawingData,
//     initialImageData,
//     initialsText,
//     initalsTextDataReg,
//   }) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/register/`,
//         {
//           email,
//           password,
//           full_name,
//           initial: initials,
//           stamp_img_name: companyStampImageData,
//           draw_img_name_signature: signatureDrawingData,
//           img_name_signature: signatureImageData,
//           signature_text: signatureText,
//           sign_text_color: signatureTextData?.sign_text_color || null,
//           sign_text_font: signatureTextData?.sign_text_font || null,
//           sign_text_value: signatureTextData?.sign_text_value || null,
//           draw_img_name_initials: initialDrawingData,
//           img_name_initials: initialImageData,
//           initial_text: initialsText,
//           initial_text_color: initalsTextDataReg?.initials_text_color || null,
//           initial_text_font: initalsTextDataReg?.initials_text_font || null,
//           initial_text_value: initalsTextDataReg?.initials_text_value || null,
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error during registration:", error);
//       throw error;
//     }
//   };

export const registerUser = async ({
  email,
  password,
  full_name,
  initials,
  companyStampImageData,
  signatureDrawingData,
  signatureImageData,
  signatureText,
  signatureTextData,
  initialDrawingData,
  initialImageData,
  initialsText,
  initalsTextDataReg,
}) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/register/`,
      {
        email,
        password,
        full_name,
        initial: initials,
        stamp_img_name: companyStampImageData,
        draw_img_name_signature: signatureDrawingData,
        img_name_signature: signatureImageData,
        signature_text: signatureText,
        sign_text_color: signatureTextData?.sign_text_color || null,
        sign_text_font: signatureTextData?.sign_text_font || null,
        sign_text_value: signatureTextData?.sign_text_value || null,
        draw_img_name_initials: initialDrawingData,
        img_name_initials: initialImageData,
        initial_text: initialsText,
        initial_text_color: initalsTextDataReg?.initials_text_color || null,
        initial_text_font: initalsTextDataReg?.initials_text_font || null,
        initial_text_value: initalsTextDataReg?.initials_text_value || null,
      }
    );

    // Extract the JWT token from the response and store it in localStorage
    const token = response.data.jwt;
    localStorage.setItem("jwt", token);

    // Print the token to the console
    console.log("Registration successful! Token:", token);

    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};


//// ResetPassword.js
export const forgetPassword = async (email, newPassword) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgetPassword/`, {
        email: email,
        newPassword: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };
  