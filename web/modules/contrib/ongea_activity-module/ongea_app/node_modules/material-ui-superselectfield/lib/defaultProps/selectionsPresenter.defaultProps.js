'use strict';

exports.__esModule = true;
exports.default = {
  errorStyle: {},
  errorText: '',
  hintText: '',
  selectionsRenderer: function selectionsRenderer(values, hintText) {
    if (!values) return hintText;
    var value = values.value,
        label = values.label;

    if (Array.isArray(values)) {
      return values.length ? values.map(function (_ref) {
        var value = _ref.value,
            label = _ref.label;
        return label || value;
      }).join(', ') : hintText;
    } else if (label || value) return label || value;else return hintText;
  },
  underlineErrorStyle: {}
};
module.exports = exports['default'];