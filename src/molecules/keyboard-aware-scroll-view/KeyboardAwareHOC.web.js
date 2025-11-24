import React from "react";

const BypassHOC = (Comp) => {
  return (props) => {
    function _handleRef(ref) {
      typeof props.innerRef === 'function' && props.innerRef(ref);
    }
    
    return React.createElement(Comp, {
      ...props,
      ref: _handleRef,
    }, props.children);

  }
}

/** In the browser, just return the component as-is */
let listenToKeyboardEvents = (configOrComp) => {
  if (typeof configOrComp === "object" && !configOrComp.displayName) {
    return (Comp) => BypassHOC(Comp);
  } else {
    return BypassHOC(configOrComp);
  }
};

export default listenToKeyboardEvents;
