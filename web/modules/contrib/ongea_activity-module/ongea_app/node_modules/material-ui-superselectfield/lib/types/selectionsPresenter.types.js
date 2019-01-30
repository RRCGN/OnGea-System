'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

exports.default = {
  disabled: _propTypes.bool,
  dropDownIcon: _propTypes.node,
  errorStyle: _propTypes.object,
  errorText: _propTypes.string,
  floatingLabel: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.node]),
  floatingLabelFocusStyle: _propTypes.object,
  floatingLabelStyle: _propTypes.object,
  hintText: _propTypes.string,
  isFocused: _propTypes.bool,
  isOpen: _propTypes.bool,
  muiTheme: _propTypes.object,
  selectedValues: (0, _propTypes.oneOfType)([_propTypes.object, (0, _propTypes.arrayOf)(_propTypes.object)]),
  selectionsRenderer: _propTypes.func,
  underlineErrorStyle: _propTypes.object,
  underlineFocusStyle: _propTypes.object,
  underlineStyle: _propTypes.object
};
module.exports = exports['default'];