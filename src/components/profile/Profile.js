import React, { useState, useEffect } from "react";
import ProfileHeader from "./profileHeader/ProfileHeader";
import "./Profile.scss";
import AccountSetting from "./acountSetting/AccountSetting";
import profileImg from "./svg/user-img.jpg";
import LoadPanel from 'devextreme-react/load-panel';
import { toastDisplayer } from "../../components/toastDisplay/toastDisplayer";
import { fetchUserDetails, updateUserData } from "../../api/UserDashboardAPI";
import { Link, useNavigate } from "react-router-dom";
 
export default function Profile() {
  const navigate = useNavigate();
  const [myData, setMyData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [base64URL, setBase64URL] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [values, setValues] = useState({
    textbox1: "",
    textbox2: "",
    textbox3: "",
  });
  const [storedImageURL, setStoredImageURL] = useState(null);
  const [initImageURL, setInitImageURL] = useState(null);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [initialCanvas, setInitialCanvas] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [initDrawData, setInitDrawData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageSignature, setSelectedImageSignature] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [selectedImageInitialProfile, setSelectedImageInitialProfile] =
    useState(null);
  const [imageDetailsOnInitialsProfile, setImageDetailsOnInitialsProfile] =
    useState(null);
  const [selectedImageCS, setSelectedImageCS] = useState(null);
  const [imageDetailsCS, setImageDetailsCS] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
 
  const [registeredUserDetails, setRegisteredUserDetails] = useState(null);
  const [signatureTextDataProfile, setSignatureTextDataProfile] = useState({
    signature_text_color: "black",
    signature_text_font: "",
    signature_text_value: "Signature",
  });
  const [signatureTextUrlProfile, setSignatureTextTextUrlProfile] = useState(null);
 
  const [initalsTextDataProfile, setInitalsTextDataProfile] = useState({
    initials_text_color: registeredUserDetails?.initials_details?.initial_text_color || "black",
    initials_text_font: registeredUserDetails?.initials_details?.initial_text_font || "",
    initials_text_value: registeredUserDetails?.initials_details?.initial_text_value,
  });
  const [initialsTextUrlProfile, setInitialsTextTextUrlProfile] = useState(null);
 
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
 
 
  const handleImageUpload_temp = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setErrorMessage("Please upload an image file.");
      return;
    }
    const maxSizeInBytes = 1 * 1024 * 1024; // 25MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Image size must be less than 25MB.");
      return;
    }
    try {
      const base64Data = await convertToBase64(file);
      setSelectedImageCS(base64Data);
      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetailsCS({ name, size: formattedSize });
      setErrorMessage(null);
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setErrorMessage("Failed to upload image. Please try again.");
    }
  };
 
  const handleRemoveImageCS = () => {
    setSelectedImageCS(null);
    setImageDetailsCS(null);
  };
 
  const handleImageClick = (e) => {
    if (e.target.className === "profileCardImg") {
      setShowModal(true);
    }
  };
 
  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };
 
  // useEffect(() => {
  //   const profileImgFromLocalStorage = localStorage.getItem("profileImage");
  //   if (profileImgFromLocalStorage) {
  //     setSelectedImage(profileImg);
  //   }
  // }, []);
 
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setErrorMessage("Please upload an image file.");
      return;
    }
    const maxSizeInBytes = 1 * 1024 * 1024; // 25MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Image size must be less than 25MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setSelectedImageSignature(base64Data);
    };
    reader.readAsDataURL(file);
    const { name, size } = file;
    const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
    setImageDetails({ name, size: formattedSize });
    setErrorMessage(null);
  };
 
  const handleImageUploadForIntialProfile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setErrorMessage("Please upload an image file.");
      return;
    }
    const maxSizeInBytes = 1 * 1024 * 1024; // 25MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Image size must be less than 25MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setSelectedImageInitialProfile(base64Data);
    };
    reader.readAsDataURL(file);
    const { name, size } = file;
    const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
    setImageDetailsOnInitialsProfile({ name, size: formattedSize });
    setErrorMessage(null);
  };
 
  const handleRemoveImage = () => {
    setSelectedImageSignature(null);
    setImageDetails(null);
  };
 
  const handleSignatureDone = () => {
    if (signatureCanvas) {
      const dataURL = signatureCanvas.toDataURL();
      const signatureImage = new Image();
      signatureImage.onload = () => {
        // const nonEmptyPixels = getNonEmptyPixels(signatureImage);
        // const croppingRect = getCroppingRect(nonEmptyPixels);
        const canvas = document.createElement("canvas");
        // canvas.width = croppingRect.width;
        // canvas.height = croppingRect.height;
        canvas.width = signatureImage.width;
        canvas.height = signatureImage.height;
 
        const context = canvas.getContext("2d");
        context.drawImage(
          signatureImage,
          // croppingRect.x,
          // croppingRect.y,
          // croppingRect.width,
          // croppingRect.height,
          0,
          0,
          // croppingRect.width,
          // croppingRect.height
        );
 
        // const croppedDataURL = canvas.toDataURL();
        const uncroppedDataURL = canvas.toDataURL();
        // setSignatureData(croppedDataURL);
        setSignatureData(uncroppedDataURL);
 
        // setStoredImageURL(croppedDataURL);
        setStoredImageURL(uncroppedDataURL);
 
        // const img = new Image();
        // img.onload = () => {
        //   const newCanvas = document.createElement("canvas");
        //   newCanvas.width = img.width;
        //   newCanvas.height = img.height;
        //   const newContext = newCanvas.getContext("2d");
        //   newContext.drawImage(img, 0, 0);
        //   const drawnImageDataURL = newCanvas.toDataURL();
        //   // localStorage.setItem("drawnSignatureImage", drawnImageDataURL);
        //   setStoredImageURL(drawnImageDataURL);
        // };
        // img.src = croppedDataURL;
      };
      signatureImage.src = dataURL;
    }
  };
 
  const handleIntialsDone = () => {
    if (initialCanvas) {
      const dataURL = initialCanvas.toDataURL();
      const signatureImage = new Image();
      signatureImage.onload = () => {
        // const nonEmptyPixels = getNonEmptyPixels(signatureImage);
        // const croppingRect = getCroppingRect(nonEmptyPixels);
        const canvas = document.createElement("canvas");
        // canvas.width = croppingRect.width;
        // canvas.height = croppingRect.height;
        canvas.width = signatureImage.width;
        canvas.height = signatureImage.height;
        const context = canvas.getContext("2d");
        context.drawImage(
          signatureImage,
          // croppingRect.x,
          // croppingRect.y,
          // croppingRect.width,
          // croppingRect.height,
          0,
          0,
          // croppingRect.width,
          // croppingRect.height
        );
        const uncroppedDataURLForInit = canvas.toDataURL();
        // localStorage.setItem("InitialImage", croppedDataURLForInit);
        setInitDrawData(uncroppedDataURLForInit);
        // const latestImg = localStorage.getItem("signatureImageInitial");
        // const img = new Image();
        // img.onload = () => {
        //   const newCanvas = document.createElement("canvas");
        //   newCanvas.width = img.width;
        //   newCanvas.height = img.height;
        //   const newContext = newCanvas.getContext("2d");
        //   newContext.drawImage(img, 0, 0);
        //   const drawnImageDataURL = newCanvas.toDataURL();
        //   // localStorage.setItem("drawnSignatureImage", drawnImageDataURL);
        // };
        // img.src = croppedDataURLForInit;
      };
      signatureImage.src = dataURL;
    } else {
      console.error("initialCanvas is not an HTMLCanvasElement.");
    }
  };
 
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetchUserDetails(token);
      setRegisteredUserDetails(response);
      setMyData(response.user);
      setValues({
        textbox1: response.user.full_name || "",
        textbox2: response.user.email || "",
        textbox3: response.user.initial || "",
      });
      // setSelectedImage(response.user.profile_pic || profileImg);
      setSelectedImage(response.user.profile_pic);
 
      if (response.signature_details.img_name) {
        const binaryString = atob(
          response.signature_details.img_name.split(",")[1]
        );
        // setSignatureCanvas(response.signature_details.draw_img_name || '');
        // setInitialCanvas(response.initials_details.draw_img_name || '');
        // setStoredImageURL(response.data.signature_details.draw_img_name || "");
        setStoredImageURL(response.signature_details.draw_img_name || "");
        setInitImageURL(response.initials_details.draw_img_name || '');
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
 
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
 
        const imageBlob = new Blob([bytes], { type: "image/png" });
        const imageUrl = URL.createObjectURL(imageBlob);
        const formattedSize =
          (bytes.byteLength / (1024 * 1024)).toFixed(2) + " MB";
        setSelectedImageSignature(imageBlob);
        setImageDetails({
          name: "SignatureImage.jpeg",
          size: formattedSize,
        });
      } else {
        // setSelectedImageSignature({
        //   name: "",
        //   size: "",
        // });
        setImageDetails(null);
      }
      setSignatureTextDataProfile((prevState) => ({
        signature_text_value: response.signature_details.sign_text_value,
        signature_text_font: response.signature_details.sign_text_font,
        signature_text_color: response.signature_details.sign_text_color,
      }));
      setSignatureTextTextUrlProfile(response.signature_details.sign_text);
 
      // //Initials
      // setInitDrawData(response.initials_details.draw_img_name || "");
      if (response.initials_details.draw_img_name) {
        const image = new Image();
        image.src = response.initials_details.draw_img_name;
        // console.log("img src", image.src);
        image.onload = async () => {
          if (initialCanvas) {
            const canvas = initialCanvas.getCanvas();
            if (canvas) {
              const ctx = await canvas.getContext("2d");
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
 
            setInitDrawData(image.src);
          }
        };
      }
      setInitalsTextDataProfile((prevState) => ({
        initials_text_value: response?.initials_details?.initial_text_value,
        initials_text_color: response?.initials_details?.initial_text_color,
        initials_text_font: response?.initials_details?.initial_text_font
      }));
      // setStoredImageURL(response.initials_details.img_name || "");
      if (response.signature_details.img_name) {
        const binaryString = atob(
          response.initials_details.img_name.split(",")[1]
        );
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
 
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
 
        const imageBlob = new Blob([bytes], { type: "image/png" });
        const imageUrl = URL.createObjectURL(imageBlob);
        const formattedSize =
          (bytes.byteLength / (1024 * 1024)).toFixed(2) + " MB";
        setSelectedImageInitialProfile(imageBlob);
        setImageDetailsOnInitialsProfile({
          name: "InitialsImage.jpeg",
          size: formattedSize,
        });
      } else {
        setImageDetailsOnInitialsProfile(null);
      }
      // // setStoredImageURL(response.data.signature_details.draw_img_name || '') // text url
 
      // Company Stamp
      // setSelectedImageCS(response.data.user.stamp_img_name || '')
      if (response.user.stamp_img_name) {
        const binaryString = atob(response.user.stamp_img_name.split(",")[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
 
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
 
        const imageBlob = new Blob([bytes], { type: "image/png" });
        const imageUrl = URL.createObjectURL(imageBlob);
        const formattedSize =
          (bytes.byteLength / (1024 * 1024)).toFixed(2) + " MB";
        setSelectedImageCS(imageBlob);
        setImageDetailsCS({
          name: "CompanyStamp.jpeg",
          size: formattedSize,
        });
      } else {
        setImageDetailsCS(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
 
 
 
  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
 
    fetchDataAsync();
  }, []);
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
 
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
 
  const updateData = async () => {
    setLoading(true);
   
    try {
      const token = localStorage.getItem("jwt");
      const formData = new FormData();
      const stampImgNameBase64 = selectedImageCS instanceof Blob
        ? await convertFileToBase64(selectedImageCS)
        : null;
      const signatureImgNameBase64 = selectedImageSignature instanceof Blob
        ? await convertFileToBase64(selectedImageSignature)
        : selectedImageSignature;
      const initialsImgNameBase64 = selectedImageInitialProfile instanceof Blob
        ? await convertFileToBase64(selectedImageInitialProfile)
        : selectedImageInitialProfile;
      formData.append("user[full_name]", values.textbox1 || registeredUserDetails?.user?.full_name);
      formData.append("user[initial]", values.textbox3 || registeredUserDetails?.user?.initial);
      formData.append("user[profile_pic]", selectedImage || registeredUserDetails?.user?.profile_pic);
      formData.append("user[stamp_img_name]", stampImgNameBase64 || registeredUserDetails?.user?.stamp_img_name);
      formData.append("signature[draw_img_name]", storedImageURL || registeredUserDetails?.signature_details?.draw_img_name);
      /// cropped changes
      // formData.append("signature[draw_img_name]", signatureCanvas.toDataURL() || registeredUserDetails?.signature_details?.draw_img_name);
      formData.append("signature[img_name]", signatureImgNameBase64 || registeredUserDetails?.signature_details?.img_name);
      formData.append("signature[sign_text_value]", signatureTextDataProfile.signature_text_value || registeredUserDetails?.signature_details?.sign_text_value);
      formData.append(
        "signature[sign_text_color]",
        signatureTextDataProfile.signature_text_color || registeredUserDetails?.signature_details?.sign_text_color
      );
      formData.append(
        "signature[sign_text_font]",
        signatureTextDataProfile.signature_text_font || registeredUserDetails?.signature_details?.sign_text_font
      );
       
      formData.append("initials[initial_text_value]", initalsTextDataProfile.initials_text_value || registeredUserDetails?.initials_details?.initial_text_value);
      formData.append(
        "initials[initial_text_color]", initalsTextDataProfile.initials_text_color || registeredUserDetails?.initials_details?.initial_text_color
      );
      formData.append(
        "initials[initial_text_font]", initalsTextDataProfile.initials_text_font || registeredUserDetails?.initials_details?.initial_text_font
      );
      formData.append(
        "initials[initial_text]", initialsTextUrlProfile || registeredUserDetails?.initials_details?.initial_text
      );
      formData.append("signature[signature_text]", signatureTextUrlProfile || registeredUserDetails?.signature_details?.sign_text);
      formData.append("initials[draw_img_name]", initDrawData || registeredUserDetails?.initials_details?.draw_img_name);
      // formData.append("initials[draw_img_name]", initImageURL);
      formData.append("initials[img_name]", initialsImgNameBase64 || registeredUserDetails?.initials_details?.img_name);
      formData.append("user_id", myData?.id);
     
      const response = await updateUserData(token, formData);
      setUpdatedData(response);
      await fetchData();
 
      toastDisplayer("success", "Profile Updated");
      setLoading(false);
      navigate('/userdashboard');
    } catch (error) {
      return toastDisplayer("error", "Try again");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <React.Fragment>
      {loading && <LoadPanel visible={true} />}
      <div className="my-container">
        <div className="header-main">
          <ProfileHeader />
        </div>
        <div className="profileAccountSettings">
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
            handleIntialsDone={handleIntialsDone}
            setStoredImageURL={setStoredImageURL}
            initImageURL={initImageURL}
            signatureCanvas={signatureCanvas}
            setSignatureCanvas={setSignatureCanvas}
            handleImageClick={handleImageClick}
            handleCloseModal={handleCloseModal}
            setShowModal={setShowModal}
            showModal={showModal}
            initialCanvas={initialCanvas}
            setInitialCanvas={setInitialCanvas}
            selectedImageSignature={selectedImageSignature}
            setSelectedImageSignature={setSelectedImageSignature}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            setImageDetails={setImageDetails}
            imageDetails={imageDetails}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            selectedImageInitialProfile={selectedImageInitialProfile}
            setSelectedImageInitialProfile={setSelectedImageInitialProfile}
            imageDetailsOnInitialsProfile={imageDetailsOnInitialsProfile}
            setImageDetailsOnInitialsProfile={setImageDetailsOnInitialsProfile}
            handleImageUploadForIntialProfile={handleImageUploadForIntialProfile}
            handleRemoveImageCS={handleRemoveImageCS}
            handleImageUpload_temp={handleImageUpload_temp}
            setImageDetailsCS={setImageDetailsCS}
            imageDetailsCS={imageDetailsCS}
            selectedImageCS={selectedImageCS}
            setSelectedImageCS={setSelectedImageCS}
            setSignatureTextDataProfile={setSignatureTextDataProfile}
            signatureTextDataProfile={signatureTextDataProfile}
            setSignatureTextTextUrlProfile={setSignatureTextTextUrlProfile}
            signatureTextUrlProfile={signatureTextUrlProfile}
            registeredUserDetails={registeredUserDetails}
            initDrawData={initDrawData}
            setInitImageURL={setInitImageURL}
            initalsTextDataProfile={initalsTextDataProfile}
            setInitalsTextDataProfile={setInitalsTextDataProfile}
            setInitialsTextTextUrlProfile={setInitialsTextTextUrlProfile}
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
 