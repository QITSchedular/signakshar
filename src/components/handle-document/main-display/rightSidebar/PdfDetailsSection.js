import React, { useState, useEffect } from "react";

function PdfDetailsSection({ numPages, currentPage, setCurrentPage, mainContainerRef }) {
  const [value, setValue] = useState(currentPage);

  useEffect(() => {
    setValue(currentPage);
  }, [currentPage]);

  const handleInputChange = (e) => {
    let newValue = parseInt(e.target.value);

    if (newValue < 1) {
      newValue = null;
    } else if (newValue > numPages) {
      newValue = numPages;
    }
    const pageDifference = newValue - currentPage;
    if (mainContainerRef.current) {
      const scrollableContainer = mainContainerRef.current;
      const containerHeight = scrollableContainer.scrollHeight;
      const pageHeight = containerHeight / numPages;
      const scrollToY = (currentPage - 1 + pageDifference) * pageHeight+3;
      scrollableContainer.scrollTo({
        top: scrollToY,
        behavior: "smooth",
      });
    }
    setCurrentPage(newValue);
  };
  
  return (
    <>  
      <div className="page-no-display">
          <span className="pdf-pages">{currentPage}</span>
          <span className="pdf-pages">/</span>
          <span className="pdf-pages">{numPages}</span>
        </div>
    </>
  )
}

export default PdfDetailsSection
