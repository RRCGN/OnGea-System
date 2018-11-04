'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = global.React || require('react');
var PropTypes = global.PropTypes || require('prop-types');

var window = require('./utils/window');

require('./utils/establish-polyfills');
var scaleEnum = require('./utils/scaleEnum');
var infiniteHelpers = require('./utils/infiniteHelpers');
var _isFinite = require('lodash.isfinite');

var checkProps = require('./utils/checkProps');

var Infinite = function (_React$Component) {
  _inherits(Infinite, _React$Component);

  _createClass(Infinite, null, [{
    key: 'containerHeightScaleFactor',
    value: function containerHeightScaleFactor(factor) {
      if (!_isFinite(factor)) {
        throw new Error('The scale factor must be a number.');
      }
      return {
        type: scaleEnum.CONTAINER_HEIGHT_SCALE_FACTOR,
        amount: factor
      };
    }
  }]);

  function Infinite(props) {
    _classCallCheck(this, Infinite);

    var _this = _possibleConstructorReturn(this, (Infinite.__proto__ || Object.getPrototypeOf(Infinite)).call(this, props));

    _initialiseProps.call(_this);

    var nextInternalState = _this.recomputeInternalStateFromProps(props);

    _this.computedProps = nextInternalState.computedProps;
    _this.utils = nextInternalState.utils;
    _this.shouldAttachToBottom = props.displayBottomUpwards;

    var state = nextInternalState.newState;
    state.scrollTimeout = undefined;
    state.isScrolling = false;

    _this.state = state;
    return _this;
  }

  // Properties currently used but which may be
  // refactored away in the future.


  // Refs


  _createClass(Infinite, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextInternalState = this.recomputeInternalStateFromProps(nextProps);

      this.computedProps = nextInternalState.computedProps;
      this.utils = nextInternalState.utils;

      this.setState(nextInternalState.newState);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      if (this.props.displayBottomUpwards) {
        this.preservedScrollState = this.utils.getScrollTop() - this.loadingSpinnerHeight;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this.loadingSpinnerHeight = this.utils.getLoadingSpinnerHeight();

      if (!prevProps.useWindowAsScrollContainer && this.props.useWindowAsScrollContainer) {
        this.utils.subscribeToScrollListener();
      }

      if (this.props.displayBottomUpwards) {
        var lowestScrollTop = this.getLowestPossibleScrollTop();
        if (this.shouldAttachToBottom && this.utils.getScrollTop() < lowestScrollTop) {
          this.utils.setScrollTop(lowestScrollTop);
        } else if (prevProps.isInfiniteLoading && !this.props.isInfiniteLoading) {
          this.utils.setScrollTop(this.state.infiniteComputer.getTotalScrollableHeight() - prevState.infiniteComputer.getTotalScrollableHeight() + this.preservedScrollState);
        }
      }

      var hasLoadedMoreChildren = this.state.numberOfChildren !== prevState.numberOfChildren;
      if (hasLoadedMoreChildren) {
        var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(this.state, this.utils.getScrollTop());
        this.setState(newApertureState);
      }

      var isMissingVisibleRows = hasLoadedMoreChildren && !this.hasAllVisibleItems() && !this.state.isInfiniteLoading;
      if (isMissingVisibleRows) {
        this.onInfiniteLoad();
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.utils.subscribeToScrollListener();

      if (!this.hasAllVisibleItems()) {
        this.onInfiniteLoad();
      }

      if (this.props.displayBottomUpwards) {
        var lowestScrollTop = this.getLowestPossibleScrollTop();
        if (this.shouldAttachToBottom && this.utils.getScrollTop() < lowestScrollTop) {
          this.utils.setScrollTop(lowestScrollTop);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.utils.unsubscribeFromScrollListener();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var displayables;
      if (this.state.numberOfChildren > 1) {
        displayables = this.computedProps.children.slice(this.state.displayIndexStart, this.state.displayIndexEnd + 1);
      } else {
        displayables = this.computedProps.children;
      }

      var infiniteScrollStyles = {};
      if (this.state.isScrolling) {
        infiniteScrollStyles.pointerEvents = 'none';
      }

      var topSpacerHeight = this.state.infiniteComputer.getTopSpacerHeight(this.state.displayIndexStart),
          bottomSpacerHeight = this.state.infiniteComputer.getBottomSpacerHeight(this.state.displayIndexEnd);

      // This asymmetry is due to a reluctance to use CSS to control
      // the bottom alignment
      if (this.computedProps.displayBottomUpwards) {
        var heightDifference = this.computedProps.containerHeight - this.state.infiniteComputer.getTotalScrollableHeight();
        if (heightDifference > 0) {
          topSpacerHeight = heightDifference - this.loadingSpinnerHeight;
        }
      }

      var loadingSpinner = this.computedProps.infiniteLoadBeginEdgeOffset === undefined ? null : React.createElement(
        'div',
        {
          ref: function ref(c) {
            _this2.loadingSpinner = c;
          }
        },
        this.state.isInfiniteLoading ? this.computedProps.loadingSpinnerDelegate : null
      );

      // topSpacer and bottomSpacer take up the amount of space that the
      // rendered elements would have taken up otherwise
      return React.createElement(
        'div',
        {
          className: this.computedProps.className,
          ref: function ref(c) {
            _this2.scrollable = c;
          },
          style: this.utils.buildScrollableStyle(),
          onScroll: this.utils.nodeScrollListener
        },
        React.createElement(
          'div',
          {
            ref: function ref(c) {
              _this2.smoothScrollingWrapper = c;
            },
            style: infiniteScrollStyles
          },
          React.createElement('div', {
            ref: function ref(c) {
              _this2.topSpacer = c;
            },
            style: infiniteHelpers.buildHeightStyle(topSpacerHeight)
          }),
          this.computedProps.displayBottomUpwards && loadingSpinner,
          displayables,
          !this.computedProps.displayBottomUpwards && loadingSpinner,
          React.createElement('div', {
            ref: function ref(c) {
              _this2.bottomSpacer = c;
            },
            style: infiniteHelpers.buildHeightStyle(bottomSpacerHeight)
          })
        )
      );
    }
  }]);

  return Infinite;
}(React.Component);

Infinite.propTypes = {
  children: PropTypes.any,

  handleScroll: PropTypes.func,

  // preloadBatchSize causes updates only to
  // happen each preloadBatchSize pixels of scrolling.
  // Set a larger number to cause fewer updates to the
  // element list.
  preloadBatchSize: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    type: PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
    amount: PropTypes.number.isRequired
  })]),
  // preloadAdditionalHeight determines how much of the
  // list above and below the container is preloaded even
  // when it is not currently visible to the user. In the
  // regular scroll implementation, preloadAdditionalHeight
  // is equal to the entire height of the list.
  preloadAdditionalHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    type: PropTypes.oneOf(['containerHeightScaleFactor']).isRequired,
    amount: PropTypes.number.isRequired
  })]), // page to screen ratio

  // The provided elementHeight can be either
  //  1. a constant: all elements are the same height
  //  2. an array containing the height of each element
  elementHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  // This is the total height of the visible window. One
  // of
  containerHeight: PropTypes.number,
  useWindowAsScrollContainer: PropTypes.bool,

  displayBottomUpwards: PropTypes.bool.isRequired,

  infiniteLoadBeginEdgeOffset: PropTypes.number,
  onInfiniteLoad: PropTypes.func,
  loadingSpinnerDelegate: PropTypes.node,

  isInfiniteLoading: PropTypes.bool,
  timeScrollStateLastsForAfterUserScrolls: PropTypes.number,

  className: PropTypes.string,

  styles: PropTypes.shape({
    scrollableStyle: PropTypes.object
  }).isRequired
};
Infinite.defaultProps = {
  handleScroll: function handleScroll() {},

  useWindowAsScrollContainer: false,

  onInfiniteLoad: function onInfiniteLoad() {},
  loadingSpinnerDelegate: React.createElement('div', null),

  displayBottomUpwards: false,

  isInfiniteLoading: false,
  timeScrollStateLastsForAfterUserScrolls: 150,

  className: '',

  styles: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.shouldAttachToBottom = false;
  this.preservedScrollState = 0;
  this.loadingSpinnerHeight = 0;

  this.generateComputedUtilityFunctions = function (props) {
    var utilities = {};
    utilities.getLoadingSpinnerHeight = function () {
      var loadingSpinnerHeight = 0;
      if (_this3.loadingSpinner) {
        loadingSpinnerHeight = _this3.loadingSpinner.offsetHeight || 0;
      }
      return loadingSpinnerHeight;
    };
    if (props.useWindowAsScrollContainer) {
      utilities.subscribeToScrollListener = function () {
        window.addEventListener('scroll', _this3.infiniteHandleScroll);
      };
      utilities.unsubscribeFromScrollListener = function () {
        window.removeEventListener('scroll', _this3.infiniteHandleScroll);
      };
      utilities.nodeScrollListener = function () {};
      utilities.getScrollTop = function () {
        return window.pageYOffset;
      };
      utilities.setScrollTop = function (top) {
        window.scroll(window.pageXOffset, top);
      };
      utilities.scrollShouldBeIgnored = function () {
        return false;
      };
      utilities.buildScrollableStyle = function () {
        return {};
      };
    } else {
      utilities.subscribeToScrollListener = function () {};
      utilities.unsubscribeFromScrollListener = function () {};
      utilities.nodeScrollListener = _this3.infiniteHandleScroll;
      utilities.getScrollTop = function () {
        return _this3.scrollable ? _this3.scrollable.scrollTop : 0;
      };

      utilities.setScrollTop = function (top) {
        if (_this3.scrollable) {
          _this3.scrollable.scrollTop = top;
        }
      };
      utilities.scrollShouldBeIgnored = function (event) {
        return event.target !== _this3.scrollable;
      };

      utilities.buildScrollableStyle = function () {
        return Object.assign({}, {
          height: _this3.computedProps.containerHeight,
          overflowX: 'hidden',
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch'
        }, _this3.computedProps.styles.scrollableStyle || {});
      };
    }
    return utilities;
  };

  this.recomputeInternalStateFromProps = function (props) {
    checkProps(props);
    var computedProps = infiniteHelpers.generateComputedProps(props);
    var utils = _this3.generateComputedUtilityFunctions(props);

    var newState = {};

    newState.numberOfChildren = React.Children.count(computedProps.children);
    newState.infiniteComputer = infiniteHelpers.createInfiniteComputer(computedProps.elementHeight, computedProps.children);

    if (computedProps.isInfiniteLoading !== undefined) {
      newState.isInfiniteLoading = computedProps.isInfiniteLoading;
    }

    newState.preloadBatchSize = computedProps.preloadBatchSize;
    newState.preloadAdditionalHeight = computedProps.preloadAdditionalHeight;

    newState = Object.assign(newState, infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(newState, utils.getScrollTop()));

    return {
      computedProps: computedProps,
      utils: utils,
      newState: newState
    };
  };

  this.infiniteHandleScroll = function (e) {
    if (_this3.utils.scrollShouldBeIgnored(e)) {
      return;
    }
    _this3.computedProps.handleScroll(_this3.scrollable);
    _this3.handleScroll(_this3.utils.getScrollTop());
  };

  this.manageScrollTimeouts = function () {
    // Maintains a series of timeouts to set this.state.isScrolling
    // to be true when the element is scrolling.

    if (_this3.state.scrollTimeout) {
      clearTimeout(_this3.state.scrollTimeout);
    }

    var that = _this3,
        scrollTimeout = setTimeout(function () {
      that.setState({
        isScrolling: false,
        scrollTimeout: undefined
      });
    }, _this3.computedProps.timeScrollStateLastsForAfterUserScrolls);

    _this3.setState({
      isScrolling: true,
      scrollTimeout: scrollTimeout
    });
  };

  this.getLowestPossibleScrollTop = function () {
    return _this3.state.infiniteComputer.getTotalScrollableHeight() - _this3.computedProps.containerHeight;
  };

  this.hasAllVisibleItems = function () {
    return !(_isFinite(_this3.computedProps.infiniteLoadBeginEdgeOffset) && _this3.state.infiniteComputer.getTotalScrollableHeight() < _this3.computedProps.containerHeight);
  };

  this.passedEdgeForInfiniteScroll = function (scrollTop) {
    var edgeOffset = _this3.computedProps.infiniteLoadBeginEdgeOffset;
    if (typeof edgeOffset !== 'number') {
      return false;
    }

    if (_this3.computedProps.displayBottomUpwards) {
      return !_this3.shouldAttachToBottom && scrollTop < edgeOffset;
    } else {
      return scrollTop > _this3.state.infiniteComputer.getTotalScrollableHeight() - _this3.computedProps.containerHeight - edgeOffset;
    }
  };

  this.onInfiniteLoad = function () {
    _this3.setState({ isInfiniteLoading: true });
    _this3.computedProps.onInfiniteLoad();
  };

  this.handleScroll = function (scrollTop) {
    _this3.shouldAttachToBottom = _this3.computedProps.displayBottomUpwards && scrollTop >= _this3.getLowestPossibleScrollTop();

    _this3.manageScrollTimeouts();

    var newApertureState = infiniteHelpers.recomputeApertureStateFromOptionsAndScrollTop(_this3.state, scrollTop);

    if (_this3.passedEdgeForInfiniteScroll(scrollTop) && !_this3.state.isInfiniteLoading) {
      _this3.setState(Object.assign({}, newApertureState));
      _this3.onInfiniteLoad();
    } else {
      _this3.setState(newApertureState);
    }
  };
};

module.exports = Infinite;
global.Infinite = Infinite;