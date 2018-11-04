'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ConstantInfiniteComputer = require('../computers/constantInfiniteComputer.js');
var ArrayInfiniteComputer = require('../computers/arrayInfiniteComputer.js');
var scaleEnum = require('./scaleEnum');
var React = global.React || require('react');
var window = require('./window');

function createInfiniteComputer(data, children) {
  var computer;
  var numberOfChildren = React.Children.count(children);

  // This should be guaranteed by checkProps
  if (Array.isArray(data)) {
    computer = new ArrayInfiniteComputer(data, numberOfChildren);
  } else {
    computer = new ConstantInfiniteComputer(data, numberOfChildren);
  }
  return computer;
}

// Given the scrollTop of the container, computes the state the
// component should be in. The goal is to abstract all of this
// from any actual representation in the DOM.
// The window is the block with any preloadAdditionalHeight
// added to it.
function recomputeApertureStateFromOptionsAndScrollTop(_ref, scrollTop) {
  var preloadBatchSize = _ref.preloadBatchSize,
      preloadAdditionalHeight = _ref.preloadAdditionalHeight,
      infiniteComputer = _ref.infiniteComputer;

  var blockNumber = preloadBatchSize === 0 ? 0 : Math.floor(scrollTop / preloadBatchSize),
      blockStart = preloadBatchSize * blockNumber,
      blockEnd = blockStart + preloadBatchSize,
      apertureTop = Math.max(0, blockStart - preloadAdditionalHeight),
      apertureBottom = Math.min(infiniteComputer.getTotalScrollableHeight(), blockEnd + preloadAdditionalHeight);

  return {
    displayIndexStart: infiniteComputer.getDisplayIndexStart(apertureTop),
    displayIndexEnd: infiniteComputer.getDisplayIndexEnd(apertureBottom)
  };
}

function generateComputedProps(props) {
  // These are extracted so their type definitions do not conflict.
  var containerHeight = props.containerHeight,
      preloadBatchSize = props.preloadBatchSize,
      preloadAdditionalHeight = props.preloadAdditionalHeight,
      handleScroll = props.handleScroll,
      onInfiniteLoad = props.onInfiniteLoad,
      oldProps = _objectWithoutProperties(props, ['containerHeight', 'preloadBatchSize', 'preloadAdditionalHeight', 'handleScroll', 'onInfiniteLoad']);

  var newProps = {};
  containerHeight = typeof containerHeight === 'number' ? containerHeight : 0;
  newProps.containerHeight = props.useWindowAsScrollContainer ? window.innerHeight : containerHeight;

  newProps.handleScroll = handleScroll || function () {};
  newProps.onInfiniteLoad = onInfiniteLoad || function () {};

  var defaultPreloadBatchSizeScaling = {
    type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
    amount: 0.5
  };
  var batchSize = preloadBatchSize && preloadBatchSize.type ? preloadBatchSize : defaultPreloadBatchSizeScaling;

  if (typeof preloadBatchSize === 'number') {
    newProps.preloadBatchSize = preloadBatchSize;
  } else if ((typeof batchSize === 'undefined' ? 'undefined' : _typeof(batchSize)) === 'object' && batchSize.type === scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR) {
    newProps.preloadBatchSize = newProps.containerHeight * batchSize.amount;
  } else {
    newProps.preloadBatchSize = 0;
  }

  var defaultPreloadAdditionalHeightScaling = {
    type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
    amount: 1
  };
  var additionalHeight = preloadAdditionalHeight && preloadAdditionalHeight.type ? preloadAdditionalHeight : defaultPreloadAdditionalHeightScaling;
  if (typeof preloadAdditionalHeight === 'number') {
    newProps.preloadAdditionalHeight = preloadAdditionalHeight;
  } else if ((typeof additionalHeight === 'undefined' ? 'undefined' : _typeof(additionalHeight)) === 'object' && additionalHeight.type === scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR) {
    newProps.preloadAdditionalHeight = newProps.containerHeight * additionalHeight.amount;
  } else {
    newProps.preloadAdditionalHeight = 0;
  }

  return Object.assign(oldProps, newProps);
}

function buildHeightStyle(height) {
  return {
    width: '100%',
    height: Math.ceil(height)
  };
}

module.exports = {
  createInfiniteComputer: createInfiniteComputer,
  recomputeApertureStateFromOptionsAndScrollTop: recomputeApertureStateFromOptionsAndScrollTop,
  generateComputedProps: generateComputedProps,
  buildHeightStyle: buildHeightStyle
};