import React, { useEffect, useState } from "react";
import "./SidebarRight.scss";
import SignatureFieldSidebar from "./signatureFieldSidebar/SignatureFieldSidebar";
import PdfDetailsSection from "./PdfDetailsSection";
// import samplePdf from "../../../../pdfs/hastaksharDoc.pdf";

function SidebarRight({
  screenValue,
  thumbnails,
  currentPage,
  setCurrentPage,
  numPages,
  mainContainerRef,
  handleThumbnailClick,
  pdfFile,
  pdfFileName,
  fields,
  activeFieldId,
  selectedSignerName,
  isAnyFieldClicked,
  activeFieldData,
  title,
  handleDeleteRecipient,
  copyCurrentBoxToAllPages,
  copyCurrentBoxToBelowPages,
}) {

  const [splitDocName, setsplitDocName] = useState();
  useEffect(() => {
    if (title) {
      const splitName = title.split("_");
      const displayName = splitName.slice(0, -1).join("_");
      setsplitDocName(displayName);
    }
  }, [title]);

  return (
    <>
      <div className="inner-container-right-sidebar">
        {isAnyFieldClicked === false || isAnyFieldClicked == null ? (
          <div className="sidebar-container">
            <div className="sidebar-pdf-detail">
              <div className="pdf-name" title={screenValue === "Template" || screenValue==="editTemplate" ? title : splitDocName}>
                {screenValue === "Template" || screenValue==="editTemplate" ? title : splitDocName}
              </div>
              <PdfDetailsSection
                numPages={numPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                mainContainerRef={mainContainerRef}
              />
            </div>

            <div className="thumbnail-wrapper">
              <div className="thumbnail-container">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    className="thumbnail"
                    key={index}
                    style={{
                      backgroundColor:
                        currentPage === index + 1 ? "#ffffff" : "transparent",
                    }}
                    onClick={() => handleThumbnailClick(index + 1)}
                  >
                    <img
                      draggable="false"
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      height="100vh"
                    />
                    <p className="pageNumInThumbnail">{`${index + 1}`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <SignatureFieldSidebar
            fields={fields}
            selectedSignerName={selectedSignerName}
            activeFieldData={activeFieldData}
            handleDeleteRecipient={handleDeleteRecipient}
            copyCurrentBoxToAllPages={copyCurrentBoxToAllPages}
            copyCurrentBoxToBelowPages={copyCurrentBoxToBelowPages}
          />
        )}
      </div>
    </>
  );
}

export default SidebarRight;
