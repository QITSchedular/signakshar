import React from "react";
import "./BtnGroup.scss";
import { Button } from "devextreme-react/button";
import redIcon from "../../svg/focus-2-line-red.svg";
import blackIcon from "../../svg/focus-2-line-black.svg";
import greenIcon from "../../svg/focus-2-line-green.svg";

export default function BtnGroup({ onColorChange }) {
  return (
    <div className="btnGroupMain">
      <div className="btnGroup">
        <Button
          icon={redIcon}
          type="primary"
          text="Red"
          onClick={() => onColorChange("rgba(145,0,0,1)")}
        />
        <Button
          icon={blackIcon}
          type="primary"
          text="Black"
          onClick={() => onColorChange("rgba(20,33,41,1)")}
        />
        <Button
          icon={greenIcon}
          type="primary"
          text="Green"
          onClick={() => onColorChange("rgba(12,98,48,1)")}
        />
      </div>
    </div>
  );
}
