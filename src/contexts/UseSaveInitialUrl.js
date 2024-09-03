// // utils/SaveInitialUrlWrapper.js
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useAuth } from './auth';

// const UseSaveInitialUrl = ({ children }) => {
//   const location = useLocation();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (!user && location.pathname !== '/SignInForm' && location.pathname !== '/RegistrationForm' ) {
//       const currentUrl = location.pathname+location.search;
//       console.log("Saving URL:", currentUrl);
//       localStorage.setItem('initialUrl', currentUrl);
//     }
//   }, [user, location]);

//   return children;
// };

// export default UseSaveInitialUrl;
