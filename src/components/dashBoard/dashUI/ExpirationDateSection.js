import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import { ReactComponent as CheckboxLine } from "../../../icons/checkbox-line page-2.svg";
import SelectBox from "devextreme-react/select-box";
import { NumberBox, NumberBoxTypes } from "devextreme-react/number-box";
import axios from "axios";
import { format } from 'date-fns';

function ExpirationDateSection({
  scheduledDate,
  handleScheduledDateChange,
  maxAndMinLabel,
  expirationDays,
  handleReminderChange,
  reminderDays,
  reminderOptions,
  handleExpirationChange,
  greminderDays,
  gexpirationDays
}) {
  const dateBoxLabel = { "aria-label": "Date" };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  return (
    <div className="section5">
      <div className="Add-ExpirationDate">Expiration Date</div>
      <div className="cale-sec">
        <div className="calander">
          <span>Calendar</span>
          <span className="star2">*</span>
          <DateBox
            placeholder="Select the date"
            stylingMode="outlined"
            className="custom-textbox4"
            value={scheduledDate}
            onValueChange={(e) => handleScheduledDateChange(e)}
            // displayFormat="dd/MM/yyyy"
            inputAttr={dateBoxLabel}
            min={new Date()}
          />
        </div>
        <div className="calander2">
          <span>Expiration Days</span>
          <span className="star2">*</span>
          <NumberBox
            defaultValue={0}
            min={0}
            max={31}
            className="custom-textbox4"
            showSpinButtons={true}
            inputAttr={maxAndMinLabel}
            value={gexpirationDays ? gexpirationDays : expirationDays}
            valueChangeEvent="keyup"
            onValueChanged={handleExpirationChange}
          />
        </div>
      </div>
      <div className="Checkboxline-icon">
        <CheckboxLine />
        <span className="checkbox-text">
          Alert 1 day before expiration date
        </span>
      </div>
      <div className="Reminder">Reminder</div>
      <div className="role">
        <SelectBox
          className="custom-textbox4"
          stylingMode="outlined"
          placeholder="Select an interval of reminder"
          items={reminderOptions}
          displayExpr={"text"}
          valueExpr={"value"}
          value={reminderDays}
          onValueChange={handleReminderChange}
        />
      </div>
    </div>
  );
}

ExpirationDateSection.propTypes = {
  reminderOptions: PropTypes.array.isRequired,
};

export default ExpirationDateSection;
