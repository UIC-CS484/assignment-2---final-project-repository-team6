import ReCAPTCHA from "react-google-recaptcha";
// import React, {useState, useRef} from 'react';

// Site theme may change if implemented. These booleans are placeholders for a future functionality
const dark_theme = false;
const light_theme = true;
let cap_theme = ""

if (light_theme){
  cap_theme = "light"
}
else{
  cap_theme = "dark"
}

const Captcha = () => {
  function onChange(value) {
    console.log('Captcha value:', value);
  }
  return (
    <div className="Captcha">
      <ReCAPTCHA
        sitekey="6LfUBakcAAAAAGhxM1OFfCIatnj5EO9WlOYCklq0"
        onChange={onChange}
        theme = {cap_theme}
        // onExpire={handleExpire}
      />
    </div>
  );
};
export default Captcha;