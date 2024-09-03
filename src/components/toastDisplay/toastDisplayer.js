import { toast } from "react-toastify";


export const toastDisplayer = async (toastType, toastMsg) => {
  if (toastType === "error") {
    return toast.error(`${toastMsg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (toastType === "success") {
    return toast.success(`${toastMsg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else if (toastType === "info") {
    return toast.info(
      <div
        dangerouslySetInnerHTML={{ __html: toastMsg.replace(/\n/g, "<br>") }}
      />,
      {
        position: "top-right",
        autoClose: 20000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  }
};