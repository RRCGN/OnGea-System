import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Badge from '@material-ui/core/Badge';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import {NavLink} from 'react-router-dom';
import {routes} from '../../config/routes';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    padding: 0,
  }
});

class MainMenu extends React.Component {
  state = {
  };

  handleClick = (e) => {
    
    this.setState({ [e]: !this.state[e] });
   
  };


componentDidMount() {
    this.hideNewButtons();
 } 


hideNewButtons = () => {
  const user = this.props.user;
  var mod_routes = routes.mainMenu;
  const roles = user.roles;
                  
  if(!roles.org_admin && roles.act_admin){
        const org_route = mod_routes.find((route)=>(route.title==='organisation'));
        const proj_route = mod_routes.find((route)=>(route.title==='project'));
        delete org_route.routes;
        delete proj_route.routes;
      
  }
  else if(!roles.org_admin && !roles.act_admin && roles.sender){
        const org_route = mod_routes.find((route)=>(route.title==='organisation'));
        const proj_route = mod_routes.find((route)=>(route.title==='project'));
        const act_route = mod_routes.find((route)=>(route.title==='activity'));
        delete org_route.routes;
        delete proj_route.routes;
        delete act_route.routes;
      
  }
  else{

      
  }

  this.setState(this.state);

}

 
  render() {
    const {classes, t} = this.props;

    return (
      <div className={classes.root}>
        <div className="ongeaAct__main-menu-title">
          OnGea<br/>activity app
          <strong>ADMIN</strong>
        </div>
        <List component="nav" className="ongeaAct__main-menu">
          {routes.mainMenu
            .map((r, i) => 
            <React.Fragment key={'menu-item' + i}>
              <ListItem style={(r.visible===false)?{display: 'none'}:{}} button onClick={this.handleClick.bind(this, r.path)} >
                <NavLink exact={r.exact || false} to={r.path}>
                  {t(r.title, {count: 0})}
                  {/*(r.title==='announcements')&& 
                  <ListItemSecondaryAction>
                    <Badge className="ongeaAct__menu-item--badge" color="secondary" badgeContent={4}><span></span></Badge>
                  </ListItemSecondaryAction>*/}
                </NavLink>
                {(r.routes)?this.state[r.path] ? <ExpandLess /> : <ExpandMore />:<span></span>}
              </ListItem>

             
              {(r.routes && r.routes.length>0) && 
                  <Collapse key={'menu-item' + i} in={this.state[r.path]} timeout="auto" unmountOnExit>
                    <List className="ongeaAct__list--collapsible" component="div" disablePadding>
                      {r.routes
                        .map((subRoute,index) => <ListItem key={'sub-menu-item' + i+"-"+index} button className={classes.nested}>
                          <NavLink to={subRoute.path}>{t(subRoute.title, {count: 0})}</NavLink>
                        </ListItem>)}

                    </List>
                  </Collapse>
              }
            </React.Fragment>
          )}
        </List>
   
      </div>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainMenu);