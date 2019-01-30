var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

import { underLineTypes } from './types';

var styles = {
  hr: {
    borderBottom: '1px solid',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    bottom: 0,
    boxSizing: 'content-box',
    left: 0,
    margin: 0,
    position: 'absolute',
    width: '100%'
  },
  underline: { position: 'relative', marginTop: 4 }
};

UnderLine.propTypes = process.env.NODE_ENV !== "production" ? underLineTypes : {};

export default function UnderLine(_ref) {
  var disabled = _ref.disabled,
      errorText = _ref.errorText,
      isFocused = _ref.isFocused,
      isOpen = _ref.isOpen,
      themeBorderColor = _ref.themeBorderColor,
      themeFocusColor = _ref.themeFocusColor,
      underlineErrorStyle = _ref.underlineErrorStyle,
      underlineFocusStyle = _ref.underlineFocusStyle,
      underlineStyle = _ref.underlineStyle;

  var baseHRstyle = _extends({}, styles.hr, {
    borderColor: themeBorderColor
  }, underlineStyle, errorText ? _extends({ borderColor: 'red' }, underlineErrorStyle) : {});

  var focusedHRstyle = errorText ? underlineStyle : _extends({
    borderBottom: '2px solid',
    borderColor: isFocused && !disabled || isOpen ? themeFocusColor : themeBorderColor,
    transform: 'scaleX( ' + (isFocused && !disabled || isOpen ? 1 : 0) + ' )',
    transition: '450ms cubic-bezier(0.23, 1, 0.32, 1)' }, underlineFocusStyle);

  return React.createElement(
    'div',
    { style: styles.underline },
    React.createElement('hr', { style: baseHRstyle }),
    React.createElement('hr', { style: _extends({}, baseHRstyle, focusedHRstyle) })
  );
}