'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidNumber;

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _getNumberType = require('./getNumberType');

var _getNumberType2 = _interopRequireDefault(_getNumberType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if a given phone number is valid.
 *
 * If the `number` is a string, it will be parsed to an object,
 * but only if it contains only valid phone number characters (including punctuation).
 * If the `number` is an object, it is used as is.
 *
 * The optional `defaultCountry` argument is the default country.
 * I.e. it does not restrict to just that country,
 * e.g. in those cases where several countries share
 * the same phone numbering rules (NANPA, Britain, etc).
 * For example, even though the number `07624 369230`
 * belongs to the Isle of Man ("IM" country code)
 * calling `isValidNumber('07624369230', 'GB', metadata)`
 * still returns `true` because the country is not restricted to `GB`,
 * it's just that `GB` is the default one for the phone numbering rules.
 * For restricting the country see `isValidNumberForRegion()`
 * though restricting a country might not be a good idea.
 * https://github.com/googlei18n/libphonenumber/blob/master/FAQ.md#when-should-i-use-isvalidnumberforregion
 *
 * Examples:
 *
 * ```js
 * isValidNumber('+78005553535', metadata)
 * isValidNumber('8005553535', 'RU', metadata)
 * isValidNumber('88005553535', 'RU', metadata)
 * isValidNumber({ phone: '8005553535', country: 'RU' }, metadata)
 * ```
 */
function isValidNumber(arg_1, arg_2, arg_3) {
  var _sort_out_arguments = (0, _getNumberType.sort_out_arguments)(arg_1, arg_2, arg_3),
      input = _sort_out_arguments.input,
      metadata = _sort_out_arguments.metadata;

  if (!input) {
    return false;
  }

  if (!input.country) {
    return false;
  }

  if (!metadata.hasCountry(input.country)) {
    throw new Error('Unknown country: ' + input.country);
  }

  metadata.country(input.country);

  if (metadata.hasTypes()) {
    return (0, _getNumberType2.default)(input, metadata.metadata) !== undefined;
  }

  return true;
}
//# sourceMappingURL=validate.js.map