var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { cloneElement } from 'react';

import FloatingLabel from './FloatingLabel';
import UnderLine from './UnderLine';
import { arrowDownIconTypes, selectionsPresenterTypes } from './types';
import { arrowDownIconDefaultProps, selectionsPresenterDefaultProps } from './defaultProps';

var styles = {
  column: { display: 'flex', flexDirection: 'column', flex: 'auto' },
  error: { marginTop: 5, color: 'red', fontSize: 12 },
  row: {
    alignItems: 'center',
    display: 'flex',
    flex: 'auto',
    justifyContent: 'flex-end',
    position: 'relative'
  },
  selections: { flex: 1 }
};

var rotatingIconStyle = function rotatingIconStyle(isOpen) {
  return {
    // fill: this.context.muiTheme.textField.borderColor,
    transform: 'rotate(' + (isOpen ? 180 : 0) + 'deg)'
  };
};

var ArrowDownIcon = function ArrowDownIcon(_ref) {
  var style = _ref.style,
      customIcon = _ref.customIcon;
  return cloneElement(customIcon, { style: style });
};
ArrowDownIcon.propTypes = arrowDownIconTypes;
ArrowDownIcon.defaultProps = arrowDownIconDefaultProps;

var isValidObject = function isValidObject(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).includes('value') && obj.value !== null;
};

SelectionsPresenter.propTypes = process.env.NODE_ENV !== "production" ? selectionsPresenterTypes : {};
SelectionsPresenter.defaultProps = selectionsPresenterDefaultProps;

export default function SelectionsPresenter(_ref2) {
  var disabled = _ref2.disabled,
      dropDownIcon = _ref2.dropDownIcon,
      errorStyle = _ref2.errorStyle,
      errorText = _ref2.errorText,
      floatingLabel = _ref2.floatingLabel,
      floatingLabelFocusStyle = _ref2.floatingLabelFocusStyle,
      floatingLabelStyle = _ref2.floatingLabelStyle,
      hintText = _ref2.hintText,
      isFocused = _ref2.isFocused,
      isOpen = _ref2.isOpen,
      muiTheme = _ref2.muiTheme,
      selectedValues = _ref2.selectedValues,
      selectionsRenderer = _ref2.selectionsRenderer,
      underlineErrorStyle = _ref2.underlineErrorStyle,
      underlineFocusStyle = _ref2.underlineFocusStyle,
      underlineStyle = _ref2.underlineStyle;
  var _muiTheme$textField = muiTheme.textField,
      borderColor = _muiTheme$textField.borderColor,
      floatingLabelColor = _muiTheme$textField.floatingLabelColor,
      focusColor = _muiTheme$textField.focusColor;

  // Conditions for shrinking the floating Label

  var isShrunk = !!(hintText && hintText.length) || Array.isArray(selectedValues) && (!!selectedValues.length || isFocused) || !Array.isArray(selectedValues) && (isValidObject(selectedValues) || selectedValues === null && isFocused) || isOpen;

  var Error = function Error() {
    return React.createElement(
      'div',
      { style: _extends({}, styles.error, errorStyle) },
      errorText
    );
  };

  return React.createElement(
    'div',
    { style: styles.column },
    React.createElement(
      'div',
      { style: styles.row },
      React.createElement(
        'div',
        { style: styles.selections },
        floatingLabel && React.createElement(
          FloatingLabel,
          {
            defaultColors: { floatingLabelColor: floatingLabelColor, focusColor: focusColor },
            disabled: disabled,
            floatingLabelFocusStyle: floatingLabelFocusStyle,
            floatingLabelStyle: floatingLabelStyle,
            isFocused: isFocused,
            shrink: isShrunk
          },
          floatingLabel
        ),
        (!floatingLabel || isShrunk) && selectionsRenderer(selectedValues, hintText)
      ),
      React.createElement(ArrowDownIcon, { customIcon: dropDownIcon, style: rotatingIconStyle(isOpen) })
    ),
    React.createElement(UnderLine, {
      disabled: disabled,
      errorText: errorText,
      isFocused: isFocused,
      isOpen: isOpen,
      themeBorderColor: borderColor,
      themeFocusColor: focusColor,
      underlineErrorStyle: underlineErrorStyle,
      underlineFocusStyle: underlineFocusStyle,
      underlineStyle: underlineStyle
    }),
    errorText && React.createElement(Error, null)
  );
}