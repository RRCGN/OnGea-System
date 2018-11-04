import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
//import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {matchPath} from 'react-router';
import { getCleanPath } from '../../../config/routes';


function TabContainer({children, dir}) {
  return (
    <Typography component="div" dir={dir} style={{
      padding: 8 * 3
    }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%'
  }
});

const getCurrentTabIndex = (path, childs) => {

  const children = childs.length > 0
    ? childs
    : [childs];

  var index = 0;
  
  children.some(function (child, i) {
    let _matchPath = matchPath(path, {
      path: child.props.path,
      exact: (child.props.exact === "true")
        ? true
        : false,//true
      strict: false
    });

    if (_matchPath && _matchPath.isExact) {
      index = i;
      return true;
    }
    else{
      return false;
    }
  });
 
  return (index < 0)
    ? 0
    : index;
}

class TabsContainer extends React.Component {

  constructor(props) {
    super(props);
    let defaultTabIndex = getCurrentTabIndex(this.props.location.pathname, this.props.children) || 0;

    this.state = {
      value: defaultTabIndex
    };
  }

  componentWillReceiveProps(nextProps) {
    const newPath = nextProps.location.pathname;
    
    

    this.setState({
      value: getCurrentTabIndex(newPath, this.props.children)
    });

    
  }

  handleChange = (event, value) => {

    //this.setState({value});
    
    
    
  };

  handleChangeIndex = index => {
   // this.setState({value: index});

    
  };

  render() {
    const {classes, theme} = this.props;
   
    const children = this.props.children.length > 0
      ? this.props.children
      : [this.props.children];
    return (
      <div className={classes.root+" ongeaAct__tabs"}>
       
       <div className="ongeaAct__tabs-header">
        <Tabs
          style={(children.length<2)?{'display':'none'}:{}}
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="secondary"
          fullWidth>
          {children.length
            ? children.map( (child, index) => {
              
              return (<Tab
                //component={Link}
                //to={getCleanPath(child.props.path)}
                disabled={child.props.disabled || false}
                href={'#'+getCleanPath(child.props.path)}
                key={'tab-' + index}
                className={(child.props.visible === 'false')
                ? "ongeaAct__tab hidden"
                : "ongeaAct__tab show"}
                label={child.props.label || '[no-label]'}/>);

            })
            : ('Child elements are missing.')}
        </Tabs>
        </div>
        <SwipeableViews
          axis={theme.direction === 'rtl'
          ? 'x-reverse'
          : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}>
          {children.length
            ? children.map(function (child, index) {

              return (
                <TabContainer key={'tabContainer-' + index} dir={theme.direction}>
                 
                  {child}
                </TabContainer>
              );

            })
            : ('Child elements are missing.')}
        </SwipeableViews>

      </div>
    );
  }
}

TabsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

//export default withStyles(styles, {withTheme: true})(TabsContainer);

/*ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired
};
function mapStateToProps(state, ownProps) {
  return {projects: state.projects}
}
*/

export default compose(
//connect(mapStateToProps), translate('translation'),
withStyles(styles, {withTheme: true}), withRouter)(TabsContainer);