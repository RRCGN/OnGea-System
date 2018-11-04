'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FlatButton = require('material-ui/FlatButton/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _check = require('material-ui/svg-icons/navigation/check');

var _check2 = _interopRequireDefault(_check);

var _checkBoxOutlineBlank = require('material-ui/svg-icons/toggle/check-box-outline-blank');

var _checkBoxOutlineBlank2 = _interopRequireDefault(_checkBoxOutlineBlank);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  anchorOrigin: { vertical: 'top', horizontal: 'left' },
  autocompleteFilter: function autocompleteFilter(searchText, text) {
    if (!text || typeof text !== 'string' && typeof text !== 'number') return false;
    if (typeof searchText !== 'string' && typeof searchText !== 'number') return false;
    return (text + '').toLowerCase().includes(searchText.toLowerCase());
  },
  autocompleteStyle: {},
  canAutoPosition: true,
  checkPosition: '',
  checkedIcon: _react2.default.createElement(_check2.default, { style: { top: 'calc(50% - 12px)' } }),
  children: [],
  disabled: false,
  elementHeight: 36,
  hintTextAutocomplete: 'Type something',
  keepSearchOnSelect: false,
  menuCloseButton: null,
  multiple: false,
  nb2show: 5,
  noMatchFound: 'No match found',
  noMatchFoundStyle: {},
  onAutoCompleteTyping: function onAutoCompleteTyping() {},
  onChange: function onChange() {},
  onMenuOpen: function onMenuOpen() {},
  onSelect: function onSelect() {},
  openImmediately: false,
  popoverClassName: '',
  popoverWidth: 180,
  resetButton: _react2.default.createElement(_FlatButton2.default, { label: 'reset', hoverColor: 'rgba(69, 90, 100, 0.1)', fullWidth: true }),
  selectAllButton: _react2.default.createElement(_FlatButton2.default, {
    label: 'select all',
    hoverColor: 'rgba(69, 90, 100, 0.1)',
    labelStyle: { whiteSpace: 'nowrap' },
    fullWidth: true
  }),
  showAutocompleteThreshold: 10,
  unCheckedIcon: _react2.default.createElement(_checkBoxOutlineBlank2.default, { style: { top: 'calc(50% - 12px)' } }),
  value: null,
  withResetSelectAllButtons: false
};
module.exports = exports['default'];