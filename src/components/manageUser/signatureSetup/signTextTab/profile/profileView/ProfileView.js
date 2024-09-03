// import React, { useState, useEffect } from "react";
// import profileImg from "../svg/user-img.jpg";
// import userIconImg from "../svg/user-add-line.svg";
// import "./ProfileView.scss";
// import Accordion, { Item } from "devextreme-react/accordion";
// import EditProfile from "./EditProfile/EditProfile";
// import SignatureSetup from "../signatureSet/SignatureSetup";
// import axios from "axios";

// export default function ProfileView({signatureCanvasRef,signatureCanvas,setSignatureCanvas,handleChange,initial,email,fullName,myData,base64URL,setBase64URL,loading,setLoading,
//   values,setValues,updateData,selectedImage,setSelectedImage,updatedData,setUpdatedData,handleSignatureDone,setStoredImageURL}) {
//   const [hovered, setHovered] = useState(false);

//   useEffect(() => {
//     const profileImgFromLocalStorage = localStorage.getItem("profileImage");
//     if (profileImgFromLocalStorage) {
//       setSelectedImage(profileImgFromLocalStorage);
//     }
//   }, []);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const token = localStorage.getItem('jwt');
//   //       const response = await axios.get(process.env.REACT_APP_API_URL+"/api/user/", {
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`
//   //         }
//   //       });
//   //       setMyData(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchData();
//   // }, []);

//   const data = {
//     imageUrl: base64URL || profileImg,
//     title: fullName,
//     description: initial,
//     email: email,
//     userIcon: userIconImg,
//   };

//   const handleMouseEnter = () => {
//     setHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setHovered(false);
//   };

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const base64Data = e.target.result;
//       // localStorage.setItem("profileImage", base64Data);
//       setSelectedImage(base64Data);
//       // console.log("base64Img:",base64Data)
//       setBase64URL(base64Data)
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="profileCardMain">
//       <div className="profileaCard">
//         <div
//           className="profile-card-img"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           {selectedImage && (
//             <img src={selectedImage} alt="Default" className="profileCardImg" />
//           )}

//           {hovered && (
//             <div className="userIcon" onClick={(e) => e.stopPropagation()}>
//               <label htmlFor="file-upload">
//                 <img
//                   src={data.userIcon}
//                   alt="user-Icon"
//                   className="userIconImg"
//                 />
//               </label>
//             </div>
//           )}
//           <input
//             type="file"
//             id="file-upload"
//             style={{ display: "none" }}
//             onChange={handleFileSelect}
//           />
//         </div>
//         <div className="card-content">
//           <h3 className="card-title">{data.title}</h3>
//           <p className="card-description">{data.description}</p>
//           <p className="card-email">Email: {data.email}</p>
//         </div>
//       </div>
//       <div className="edit-profile-main">
//         <div className="accordionItems">
//           <Accordion
//             id="accordion-container"
//             multiple="true"
//             selectedIndex="-1"
//           >
//             <Item
//               title="Edit Profile"
//               className="edit-profile-item"
//               collapsible={true}
//             >
//               <EditProfile myData={myData} handleChange={handleChange} values={values} setValues={setValues} updateData={updateData} updatedData={updatedData} setUpdatedData={setUpdatedData} />
//             </Item>
//             <Item
//               title="Signature Setup"
//               className="signature-setup-item"
//               collapsible={true}
//             >
//               <SignatureSetup handleSignatureDone={handleSignatureDone}
//                 setSignatureCanvas={setSignatureCanvas}
//                 signatureCanvas={signatureCanvas}
//                 signatureCanvasRef={signatureCanvasRef}
//                 setStoredImageURL={setStoredImageURL}
//               />
//             </Item>
//           </Accordion>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import profileImg from "../svg/user-img.jpg";
import userIconImg from "../svg/user-add-line.svg";
import "./ProfileView.scss";
import Accordion, { Item } from "devextreme-react/accordion";
import EditProfile from "./EditProfile/EditProfile";
import SignatureSetup from "../signatureSet/SignatureSetup";
import axios from "axios";

export default function ProfileView({
  signatureCanvasRef,
  signatureCanvas,
  setSignatureCanvas,
  handleChange,
  initial,
  email,
  fullName,
  myData,
  base64URL,
  setBase64URL,
  loading,
  setLoading,
  values,
  setValues,
  updateData,
  selectedImage,
  setSelectedImage,
  updatedData,
  setUpdatedData,
  handleSignatureDone,
  setStoredImageURL,
  handleCloseModal,
  handleImageClick,
  setShowModal,
  showModal,
  setSignatureImgData,
  signatureImgData,
}) {
  console.log("A : ", selectedImage)
  const [hovered, setHovered] = useState(false);

  // useEffect(() => {
  //   const profileImgFromLocalStorage = localStorage.getItem("profileImage");
  //   if (profileImgFromLocalStorage) {
  //     setSelectedImage(profileImgFromLocalStorage);
  //   }
  // }, []);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        setSelectedImage(base64Data);
        setBase64URL(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected!");
    }
  };

  return (
    <div className="profileCardMain">
      <div className="profileaCard">
        <div
          className={`profile-card-img ${hovered ? "hovered" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
          {console.log("selectedImage : ", profileImg)}
          {/* <img
            src={selectedImage || profileImg}
            alt="Default"
            className="profileCardImg"
          /> */}
          {hovered && (
            <div className="userIcon" onClick={(e) => e.stopPropagation()}>
              <label htmlFor="file-upload">
                <img
                  src={userIconImg}
                  alt="user-Icon"
                  className="userIconImg"
                />
              </label>
            </div>
          )}
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
        <div className="card-content">
          <h3 className="card-title">{fullName} ASFAS</h3>
          <p className="card-description">{initial}</p>
          <p className="card-email">Email: {email}</p>
        </div>
      </div>
      <div className="edit-profile-main">
        <div className="accordionItems">
          <Accordion
            id="accordion-container"
            multiple="true"
            collapsible={true}
          // selectedItemKeys={null}
          // selectedItems={-1}
          // selectedIndex={1}
          >
            <Item title="Edit Profile" className="edit-profile-item">
              <EditProfile
                myData={myData}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
                updateData={updateData}
                updatedData={updatedData}
                setUpdatedData={setUpdatedData}
              />
            </Item>
            <Item title="Signature Setup" className="signature-setup-item">
              <SignatureSetup
                handleSignatureDone={handleSignatureDone}
                setSignatureCanvas={setSignatureCanvas}
                signatureCanvas={signatureCanvas}
                signatureCanvasRef={signatureCanvasRef}
                setStoredImageURL={setStoredImageURL}
                setSignatureImgData={setSignatureImgData}
                signatureImgData={signatureImgData}
              />
            </Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
