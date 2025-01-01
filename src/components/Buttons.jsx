import React from "react";
import Ripples from "react-ripples";

const Buttons = React.forwardRef((props, _) => {
  return (
    <Ripples className={` ${props.ellipsis ? "max-full" : ""}`}>
      <button
        className={`ui-button ${props.className ? props.className : ""}`}
        onClick={props.onClick}
        type={props.type}
        style={props.style}
        title={props.title}
      >
        {props.children}
      </button>
    </Ripples>
  );
});

Buttons.displayName = "Buttons";

export default Buttons;
