import React, { useState } from "react";
import { animated, useSpring, useSpringRef, useChain, config } from "react-spring";
import './checkbox.css';

export default function MyCheckbox() {
  const [isChecked, setIsChecked] = useState(false);
  const [checkmarkLength, setCheckmarkLength] = useState(0);

  const checkboxAnimationRef = useSpringRef();
  const checkboxAnimationStyle = useSpring({
    backgroundColor: isChecked ? "#13abc2" : "#fff",
    borderColor: isChecked ? "#13abc2" : "#ddd",
    config: config.gentle,
    ref: checkboxAnimationRef
  });

  const checkmarkAnimationRef = useSpringRef();
  const checkmarkAnimationStyle = useSpring({
    x: isChecked ? 0 : checkmarkLength,
    config: config.gentle,
    ref: checkmarkAnimationRef
  });

  useChain(
    isChecked
      ? [checkboxAnimationRef, checkmarkAnimationRef]
      : [checkmarkAnimationRef, checkboxAnimationRef],
    [0, 0.1] //delay time
  );

  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        style={{ width: '12px', height: '12px' }} // Adjust width and height here
        onChange={() => {
          setIsChecked(!isChecked);
        }}
      />
      <span
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        aria-hidden="true"
      />
      <animated.svg
        style={checkboxAnimationStyle}
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        aria-hidden="true"
        viewBox="0 0 15 11"
        fill="none"
        width={'12px'}
        height={'12px'}
      >
        <animated.path
          ref={(ref) => {
            if (ref) {
              setCheckmarkLength(ref.getTotalLength());
            }
          }}
          d="M1 4.5L5 9L14 1"
          strokeWidth="2"
          stroke="#fff"
          strokeDasharray={checkmarkLength}
          strokeDashoffset={checkmarkAnimationStyle.x}
        />
      </animated.svg>
      <span className="checkbox-label" style={{marginLeft:'5px', fontSize:'12px'}}>Accept privacy policy and terms!</span>
    </label>
  );
}
