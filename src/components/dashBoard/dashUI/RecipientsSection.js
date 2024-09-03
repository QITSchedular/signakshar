// RecipientsSection.js
import React from "react";
import PropTypes from "prop-types";
import List, { ItemDragging } from "devextreme-react/list";

function RecipientsSection({
  recipientCount,
  handleAddRecipient,
  handleDeleteRecipient,
  itemTemplate,
}) {
  return (
    <>
      <div className="recipients-section">
        <List
          dataSource={Array.from({ length: recipientCount }, (_, i) => i)}
          itemRender={itemTemplate}
          // height={354}
        >
          <ItemDragging
            allowReordering={true}
            group="tasks"
            data="plannedTasks"
            showDragIcons={true}
          />
        </List>
      </div>
    </>
  );
}

RecipientsSection.propTypes = {
  recipientCount: PropTypes.number.isRequired,
  handleAddRecipient: PropTypes.func.isRequired,
  handleDeleteRecipient: PropTypes.func.isRequired,
  itemTemplate: PropTypes.func.isRequired,
};

export default RecipientsSection;
