import JSZip from 'jszip';
import { PDFDocument } from "pdf-lib";
import { pdfjs } from "react-pdf";
import { uploadFileToS3 } from "../../../api/UserDashboardAPI";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export function getNumberOfPages(anypdfFile) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      try {
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const numPages = pdf.numPages;
        resolve(numPages);
      } catch (error) {
        reject(error);
      }
    };

    fileReader.readAsArrayBuffer(anypdfFile);
  });
}

export function getNonEmptyPixels(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const nonEmptyPixels = [];

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const alpha = imageData.data[index + 3];

      if (alpha > 0) {
        nonEmptyPixels.push({ x, y });
      }
    }
  }

  return nonEmptyPixels;
}

export function getCroppingRect(nonEmptyPixels) {
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;

  nonEmptyPixels.forEach((pixel) => {
    minX = Math.min(minX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxX = Math.max(maxX, pixel.x);
    maxY = Math.max(maxY, pixel.y);
  });

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return {
    x: minX,
    y: minY,
    width,
    height,
  };
}

export async function generateThumbnails(file) {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      try {
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const numPages = pdf.numPages;
        const thumbnailUrls = [];
        const contentUrls = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const scale = 1.0;
          canvas.width = viewport.width * scale;
          canvas.height = viewport.height * scale;
          const renderContext = {
            canvasContext: context,
            viewport: page.getViewport({ scale: scale }),
          };
          await page.render(renderContext).promise;
          const thumbnailUrl = canvas.toDataURL();
          thumbnailUrls.push(thumbnailUrl);

          const contentUrl = canvas.toDataURL("image/jpeg");
          contentUrls.push(contentUrl);
        }

        resolve({ thumbnailUrls, contentUrls });
      } catch (error) {
        reject(error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
}

export function handleScroll(
  event,
  numPages,
  positions,
  pdfImageSize,
  thumbnailContainerRef,
  setCurrentPage,
  setpositions
) {
  const container = event.target;
  if (container) {
    const { scrollTop, scrollHeight } = container;
    const pageHeight = scrollHeight / numPages;
    const currentPage = Math.floor(scrollTop / pageHeight) + 1;
    setCurrentPage(currentPage);
    const adjustedTop =
      positions[currentPage - 1]?.y +
      (scrollTop * pdfImageSize.height) / scrollHeight;
    const updatedpositions = [...positions];
    updatedpositions[currentPage - 1] = {
      ...updatedpositions[currentPage - 1],
      y: adjustedTop,
    };
    // console.log("updatedpositions : ",updatedpositions);
    setpositions(updatedpositions);
    if (thumbnailContainerRef.current) {
      const thumbnailScrollTop = (currentPage - 1) * 100;
      thumbnailContainerRef.current.scrollTo(0, thumbnailScrollTop);
    }
  }
}

export function getDimensionsBasedOnScreenSize() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 768) {
    // For smaller screens (e.g., mobile)
    return {
      minWidth: 70,
      minHeight: 27,
      maxWidth: 240,
      maxHeight: 100,
    };
  } else if (screenWidth <= 1024) {
    // For medium-sized screens (e.g., tablets)
    return {
      minWidth: 50,
      minHeight: 30,
      maxWidth: 300,
      maxHeight: 130,
    };
  } else {
    // For larger screens (e.g., desktops)
    return {
      minWidth: 90,
      minHeight: 30,
      maxWidth: 350,
      maxHeight: 150,
    };
  }
}

export function handleThumbnailClick(
  pageNumber,
  mainContainerRef,
  setCurrentPage,
  numPages
) {
  if (mainContainerRef.current) {
    const scrollableContainer = mainContainerRef.current;
    const containerHeight = scrollableContainer.scrollHeight;
    const pageHeight = containerHeight / numPages;
    const scrollToY = (pageNumber - 1) * pageHeight + 3;
    scrollableContainer.scrollTo({ top: scrollToY, behavior: "smooth" });
  }
  setCurrentPage(pageNumber);
}

async function generateSignedPdf(pdfFile, draggedData , splitDocName) {
  try {
    if (!Array.isArray(draggedData)) {
      throw new Error("Invalid draggedData: not an array");
    }
    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const positionsByPage = {};
    draggedData.forEach((item) => {
      const { signatureData } = item;
      if (!signatureData) {
        console.error(`Error: signatureData is undefined for item`, item);
        return;
      }

      const { pageNumber, x, y, width, height, imageData } = signatureData;
      if (!positionsByPage[pageNumber]) {
        positionsByPage[pageNumber] = [];
      }
      positionsByPage[pageNumber].push({ x, y, width, height, imageData });
    });

    for (const [pageNum, positions] of Object.entries(positionsByPage)) {
      const page = pages[pageNum];
      for (let i = 0; i < positions.length; i++) {
        const { x, y, width, height, imageData } = positions[i];

        if (!imageData) {
          console.error(
            `Error: imageData is undefined for item at page ${pageNum}`
          );
          continue;
        }
        const base64Data = imageData.split("base64,")[1];

        if (!base64Data) {
          console.error(
            `Error: Invalid base64 data for item at page ${pageNum}`
          );
          continue;
        }

        try {
          const drawingImageBytes = new Uint8Array(
            atob(base64Data)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          const drawingImage = await pdfDoc.embedPng(drawingImageBytes);

          const xPos = x;
          const yPos = page.getHeight() - y - height;

          page.drawImage(drawingImage, {
            x: xPos,
            y: yPos,
            width: width,
            height: height,
          });
        } catch (decodeError) {
          console.error(
            `Error decoding base64 data for item at page ${pageNum}:`,
            decodeError
          );
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = splitDocName+"_signed_pdf.pdf";
    downloadLink.click();
  } catch (error) {
    console.error("Error generating signed PDF:", error);
  }
}

async function generateBulkSignedPdf(pdfFiles, draggedData,docname) {
  try {
    if (!Array.isArray(draggedData)) {
      throw new Error("Invalid draggedData: not an array");
    }
    const zip = new JSZip();

    await Promise.all(pdfFiles.map(async (pdfFile, index) => {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const positionsByPage = {};

      draggedData.forEach((item) => {
        const { signatureData } = item;
        if (!signatureData) {
          console.error(`Error: signatureData is undefined for item`, item);
          return;
        }

        const { pageNumber, x, y, width, height, imageData } = signatureData;
        if (!positionsByPage[pageNumber]) {
          positionsByPage[pageNumber] = [];
        }
        positionsByPage[pageNumber].push({ x, y, width, height, imageData });
      });

      for (const [pageNum, positions] of Object.entries(positionsByPage)) {
        const page = pages[pageNum];
        for (let i = 0; i < positions.length; i++) {
          const { x, y, width, height, imageData } = positions[i];

          if (!imageData) {
            console.error(
              `Error: imageData is undefined for item at page ${pageNum}`
            );
            continue;
          }
          const base64Data = imageData.split("base64,")[1];

          if (!base64Data) {
            console.error(
              `Error: Invalid base64 data for item at page ${pageNum}`
            );
            continue;
          }

          try {
            const drawingImageBytes = new Uint8Array(
              atob(base64Data)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const drawingImage = await pdfDoc.embedPng(drawingImageBytes);

            const xPos = x;
            const yPos = page.getHeight() - y - height;

            page.drawImage(drawingImage, {
              x: xPos,
              y: yPos,
              width: width,
              height: height,
            });
          } catch (decodeError) {
            console.error(
              `Error decoding base64 data for item at page ${pageNum}:`,
              decodeError
            );
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      zip.file(`${pdfFile.name}_${index + 1}.pdf`, pdfBytes);
    }));

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create a download link for the zip file
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(zipBlob);
    downloadLink.download = `${docname}_pdfs.zip`;
    downloadLink.click();

  } catch (error) {
    console.error("Error generating signed PDFs:", error);
  }
}



async function generateSignedPdfonAws(
  pdfFile,
  draggedData,
  senderData,
  documentData
) {
  try {
    if (!Array.isArray(draggedData)) {
      throw new Error("Invalid draggedData: not an array");
    }

    const existingPdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const element = document.querySelector(".tmpid");
    const styles = window.getComputedStyle(element);
    const widthWithPaddingAndMargin = parseFloat(styles.width);
    const heightWithPaddingAndMargin = parseFloat(styles.height);

    const positionsByPage = {};
    let numPages = 0;

    draggedData.forEach((item) => {
      const { pageNumber, x, y, width, height, imageData } = item;
      if (!positionsByPage[pageNumber]) {
        positionsByPage[pageNumber] = [];
      }
      positionsByPage[pageNumber].push({ x, y, width, height, imageData });
      numPages = Math.max(numPages, pageNumber + 1);
    });

    for (let i = 0; i < numPages; i++) {
      const page = pages[i];
      const positions = positionsByPage[i];

      if (positions) {
        for (let j = 0; j < positions.length; j++) {
          const { x, y, width, height, imageData } = positions[j];
          const base64Data = imageData.split("base64,")[1];

          if (!base64Data) {
            console.error(`Error: Invalid base64 data at page index ${i}`);
            continue;
          }

          try {
            const drawingImageBytes = new Uint8Array(
              atob(base64Data)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            const drawingImage = await pdfDoc.embedPng(drawingImageBytes);
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();
            const xRatio = pageWidth / widthWithPaddingAndMargin;
            const yRatio = pageHeight / heightWithPaddingAndMargin;
            const xPos = x * xRatio;
            const yPos =
              (heightWithPaddingAndMargin - y - parseFloat(height)) * yRatio;

            page.drawImage(drawingImage, {
              x: xPos,
              y: yPos,
              width: parseFloat(width) * xRatio,
              height: parseFloat(height) * yRatio,
            });
          } catch (decodeError) {
            console.error(
              `Error decoding base64 data at page index ${i}:`,
              decodeError
            );
          }
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const dynamic_bucketName = generateBucketName(
      senderData.user.id,
      senderData.user.email
    );
    const formData = new FormData();
    formData.append("file", pdfBlob, documentData.name + ".pdf");
    formData.append("bucket_name", dynamic_bucketName);
    formData.append("user_id",senderData.user.id );

    const response = await uploadFileToS3(formData);
    if (!response.success) {
      throw new Error("Failed to upload file to AWS S3");
    } else {
      console.log("File uploaded successfully:", response);
      // toastDisplayer("success", "Document proceeded successfully");
      return true;
    }
  } catch (error) {
    console.error("Error generating signed PDF:", error);
    return false; // Indicate failure
  }
}

// async function generateSignedPdf(pdfFile, draggedData) {
//   try {
//     console.log("draggedData : ", draggedData);
//     if (!Array.isArray(draggedData)) {
//       throw new Error("Invalid draggedData: not an array");
//     }
//     console.log("inside download");

//     const existingPdfBytes = await pdfFile.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const pages = pdfDoc.getPages();

//     const positionsByPage = {};

//     draggedData.forEach((item) => {
//       const { signatureData } = item;
//       if (!signatureData) {
//         console.error(`Error: signatureData is undefined for item`, item);
//         return;
//       }

//       const { pageNumber, x, y, width, height, imageData } = signatureData;
//       if (!positionsByPage[pageNumber]) {
//         positionsByPage[pageNumber] = [];
//       }
//       positionsByPage[pageNumber].push({ x, y, width, height, imageData });
//     });

//     for (const [pageNum, positions] of Object.entries(positionsByPage)) {
//       const page = pages[pageNum];
//       for (let i = 0; i < positions.length; i++) {
//         const { x, y, width, height, imageData } = positions[i];

//         if (!imageData) {
//           console.error(`Error: imageData is undefined for item at page ${pageNum}`);
//           continue;
//         }

//         const base64Data = imageData.split("base64,")[1];

//         if (!base64Data) {
//           console.error(`Error: Invalid base64 data for item at page ${pageNum}`);
//           continue;
//         }

//         try {
//           const drawingImageBytes = new Uint8Array(
//             atob(base64Data).split("").map((char) => char.charCodeAt(0))
//           );
//           const drawingImage = await pdfDoc.embedPng(drawingImageBytes);

//           const xPos = x;
//           const yPos = page.getHeight() - y - height;

//           page.drawImage(drawingImage, {
//             x: xPos,
//             y: yPos,
//             width: width,
//             height: height,
//           });
//         } catch (decodeError) {
//           console.error(`Error decoding base64 data for item at page ${pageNum}:`, decodeError);
//         }
//       }
//     }

//     const pdfBytes = await pdfDoc.save();
//     const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
//     const downloadLink = document.createElement("a");
//     downloadLink.href = URL.createObjectURL(pdfBlob);
//     downloadLink.download = "signed_pdf.pdf";
//     downloadLink.click();
//   } catch (error) {
//     console.error("Error generating signed PDF:", error);
//   }
// }

function generateBucketName(userId, userEmail) {
  const trimmedEmail = userEmail.split("@")[0].toLowerCase();
  const cleanedEmail = trimmedEmail.replace(/[^a-z0-9-]/g, "-");
  let bucketName = `sign-${userId}-${cleanedEmail}`;
  if (bucketName.length > 63) {
    bucketName = bucketName.substring(0, 63);
  }
  return bucketName;
}

export {
  generateSignedPdfonAws,
  generateBucketName,
  generateSignedPdf,
  generateBulkSignedPdf,
};

const processImage = (imageSrc, callback) => {
  const signatureImage = new Image();
  signatureImage.onload = () => {
    // Create canvas to process the image
    const canvas = document.createElement("canvas");
    canvas.width = signatureImage.width;
    canvas.height = signatureImage.height;
    const context = canvas.getContext("2d");

    // Get non-empty pixels and cropping rectangle
    const nonEmptyPixels = getNonEmptyPixels(signatureImage);
    const croppingRect = getCroppingRect(nonEmptyPixels);

    if (croppingRect.width > 0 && croppingRect.height > 0) {
      // Draw the cropped image onto the canvas
      canvas.width = croppingRect.width;
      canvas.height = croppingRect.height;
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

      const croppedDataURL = canvas.toDataURL();
      callback(croppedDataURL);
    } else {
      console.error("Cropping rectangle has zero width or height");
      callback(null);
    }
  };

  signatureImage.src = imageSrc;
};

export { processImage };
