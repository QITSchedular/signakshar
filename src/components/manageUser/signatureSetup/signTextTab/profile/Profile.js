import React, { useState, useEffect } from 'react';
import ProfileHeader from './profileHeader/ProfileHeader';
import './Profile.scss';
import AccountSetting from './acountSetting/AccountSetting';
import axios from 'axios';
import profileImg from "./svg/user-img.jpg"
import { getCroppingRect, getNonEmptyPixels } from "../manageUser/signatureSetup/PdfUtils";
import { toastDisplayer } from "../../components/toastDisplay/toastDisplayer";

export default function Profile() {
  const [myData, setMyData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [base64URL, setBase64URL] = useState('');
  const [selectedImage, setSelectedImage] = useState(profileImg)
  const [values, setValues] = useState({
    textbox1: '',
    textbox2: '',
    textbox3: '',
  });
  const [signature, setSignature] = useState(null);
  const [storedImageURL, setStoredImageURL] = useState(null);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [signatureImgData, setSignatureImgData] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [savedSignature, setSavedSignature] = useState('');
  
  const handleImageClick = (e) => {
    if (e.target.className === "profileCardImg") {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  useEffect(() => {
    const profileImgFromLocalStorage = localStorage.getItem("profileImage");
    if (profileImgFromLocalStorage) {
      setSelectedImage(profileImg);
    }
  }, []);

  const handleSignatureDone = () => {
    if (signatureCanvas) {
      // Get signature data URL
      const dataURL = signatureCanvas.toDataURL();

      // Convert signature URL to image
      const signatureImage = new Image();
      signatureImage.onload = () => {
        // Get non-empty pixels and cropping rectangle
        const nonEmptyPixels = getNonEmptyPixels(signatureImage);
        const croppingRect = getCroppingRect(nonEmptyPixels);

        // Create canvas to crop the image
        const canvas = document.createElement("canvas");
        console.log("dataURL : ",canvas)
        console.log("canvas : ",canvas)

        canvas.width = croppingRect.width;
        canvas.height = croppingRect.height;
        const context = canvas.getContext("2d");
        context.drawImage(
          signatureImage,
          croppingRect.x,
          croppingRect.y,
          croppingRect.width,
          croppingRect.height,
          0,
          0,
          croppingRect.width,
          croppingRect.height
        );

        // Get the cropped image data URL
        const croppedDataURL = canvas.toDataURL();

        // const croppedSignatureImage = new Image();
        // const croppedDataImage = canvas.toDataURL();
        // Store the cropped image data URL in local storage
        // localStorage.setItem("signatureImage", croppedDataImage);
        // localStorage.setItem("signatureImageInitial", croppedDataURL);
        setSignatureData(croppedDataURL);
        setStoredImageURL(croppedDataURL);

        // console.log("signatureImage",signatureImage);
        // console.log("croppedDataURL", croppedDataURL);
        // const latestImg = localStorage.getItem("signatureImageInitial");
        // console.log("storedImageURL", latestImg);

        // Create an image element
        const img = new Image();
        img.onload = () => {
          // Create a new canvas to draw the image
          const newCanvas = document.createElement("canvas");
          newCanvas.width = img.width;
          newCanvas.height = img.height;
          const newContext = newCanvas.getContext("2d");
          newContext.drawImage(img, 0, 0);

          // Get the data URL of the drawn image
          const drawnImageDataURL = newCanvas.toDataURL();

          // Store the drawn image data URL in local storage
          // localStorage.setItem("drawnSignatureImage", drawnImageDataURL);
          setStoredImageURL(drawnImageDataURL);

          // console.log("drawnImageDataURL", drawnImageDataURL);
        };
        img.src = croppedDataURL;
      };
      signatureImage.src = dataURL;
    }
  };
  // useEffect(() => {
  //   if (signatureCanvas && savedSignature) {
  //     signatureCanvas.fromDataURL(savedSignature);
  //   }
  // }, [signatureCanvas, savedSignature]);
console.log("heyyyehyehey");
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyData(response.data.user);
      setValues({
        textbox1: response.data.user.full_name || '',
        textbox2: response.data.user.email || '',
        textbox3: response.data.user.initial || '',
      });
      console.log(response.data.user)
      setSelectedImage( response.data.user.profile_pic || profileImg)

      setSignatureCanvas(response.data.signature_details.draw_img_name || '')
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const updateData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const formData = new FormData();
      // Append user fields
      formData.append('user[full_name]', values.textbox1);
      formData.append('user[initial]', values.textbox3);
      console.log("base:" ,base64URL)
      if (selectedImage) {
        formData.append('user[profile_pic]', selectedImage);
      }
   
      // Append signature fields
      formData.append('signature[draw_img_name]', signatureData);
      // formData.append('signature[draw_enc_key]', values.signatureDrawEncKey);
      formData.append('signature[img_name]', values.signatureImgName);
      // formData.append('signature[img_enc_key]', values.signatureImgEncKey);
   
      // // Append initials fields
      formData.append('initials[draw_img_name]', signatureData);
      // formData.append('initials[draw_enc_key]', values.initialsDrawEncKey);
      formData.append('initials[img_name]', values.initialsImgName);
      // formData.append('initials[img_enc_key]', values.initialsImgEncKey);
   
      const response = await axios.put(
        'http://localhost:8000/api/user/update/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
   
      setUpdatedData(response.data.user);
      console.log('Updated data:', response.data.user);
   
      await fetchData();
      return toastDisplayer("success", "Profile Updated");
    } catch (error) {
      console.error('Error:', error);
      return toastDisplayer("error", "Try again");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <React.Fragment>
      <div className='my-container'>
        <div className='header-main'>
          <ProfileHeader />
        </div>
        <div className='profileAccountSettings'>
          <AccountSetting
            handleChange={handleChange}
            email={values.textbox2}
            initial={values.textbox3}
            fullName={values.textbox1}
            myData={myData}
            setMyData={setMyData}
            loading={loading}
            setLoading={setLoading}
            values={values}
            setValues={setValues}
            updateData={updateData}
            updatedData={updatedData}
            setUpdatedData={setUpdatedData}
            setBase64URL={setBase64URL} 
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleSignatureDone={handleSignatureDone}
            setStoredImageURL={setStoredImageURL}
            signatureCanvas={signatureCanvas}
            setSignatureCanvas={setSignatureCanvas}
            handleImageClick={handleImageClick}
            handleCloseModal={handleCloseModal}
            setShowModal={setShowModal}
            showModal={showModal}
            setSignatureImgData={setSignatureImgData}
            signatureImgData={signatureImgData}
          />
        </div>
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal">
            <img
              src={selectedImage || profileImg}
              alt="Enlarged Profile"
              className="enlarged-profile-img"
            />
          </div>
        </div>
      )}
      </div>
    </React.Fragment>
  );
}
