import defaultUser from "../utils/default-user";

import { toastDisplayer } from "../components/toastDisplay/toastDisplayer";
import axios from "axios";


export async function signIn(email, password) {
  try {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL+"/api/login/", {
        email,
        password,
      });
      const token = response.data.jwt;
      
      localStorage.setItem("jwt", token);
      toastDisplayer("success", "Login Successful");

      return {
        isOk: true,
        // data: defaultUser
        data: token,
      };
    } catch (error) {
      console.error("Error during login:", error?.response?.data?.detail);
      // setLoading(false);
      return toastDisplayer("error", error?.response?.data?.detail);
    }
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

// export async function registerUser(userData) {
//   try {
//     const response = await axios.post(process.env.REACT_APP_API_URL + "/api/register/", userData);
//     const token = response.data.jwt;

//     // Store the token in localStorage
//     localStorage.setItem("jwt", token);
//     toastDisplayer("success", "Registration Successful");

//     return {
//       isOk: true,
//       data: token,
//     };
//   } catch (error) {
//     console.error("Error during registration:", error?.response?.data?.detail);
//     toastDisplayer("error", error?.response?.data?.detail);
//     return {
//       isOk: false,
//       message: "Registration failed",
//     };
//   }
// }



export async function signInWithGoogleAPI(access_token) {
  try {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+"/api/googleLogIn/",
        {
          token: access_token,
        }
      );
      console.log("--:",response.data);
      const token = response.data.jwt;
      localStorage.setItem("jwt", token);
      toastDisplayer("success", "Login Successful");
      return {
        isOk: true,
        // data: defaultUser
        data: token,
        // userData:
      };
    } catch (error) {
      console.error("Error during login:", error);
      // setLoading(false);
      return toastDisplayer("error", "Invalid User");
    }
  } catch {
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function getUser() {
  try {
    const jwtToken = localStorage.getItem("jwt");
    const userResponse=await axios.get(process.env.REACT_APP_API_URL+"/api/user/", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return {
      isOk: true,
      data: jwtToken,
      userData:userResponse.data
      // data: defaultUser
    };
  } catch (error) {
    return {
      isOk: false,
    };
    // console.error("Error fetching user data:", error);
  }
  // try {
  //   // Send request
  //   const storedJwt=localStorage.getItem("jwt");
  //   if(storedJwt){
  //     return {
  //       isOk: true,
  //       data:storedJwt
  //       // data: defaultUser
  //     };
  //   }
  //   else{
  //     return{
  //       isOk:false
  //     }
  //   }

  // }
  // catch {
  //   return {
  //     isOk: false
  //   };
  // }
}

export async function createAccount(email, password) {
  try {
    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to create account",
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email) {
  try {

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}

export async function Logout() {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Successfully logged out, clear local storage
      localStorage.removeItem('jwt');
      return {
        isOk: true,
        message: 'Logged out successfully',
      };
    } else {
      // Handle the error
      const errorData = await response.json();
      return {
        isOk: false,
        message: errorData.message || 'Logout failed',
      };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return {
      isOk: false,
      message: 'Logout error',
    };
  }
}
