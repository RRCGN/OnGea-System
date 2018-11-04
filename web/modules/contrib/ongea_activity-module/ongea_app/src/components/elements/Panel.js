import React from 'react';
import Switch from '@material-ui/core/Switch';


export default class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: (props.toggle!==undefined)?props.toggle:true
    };

    //this.updateChildElementState();
  }
  
  //TODO LOOP THROUGH ALL CHILDREN AND DISABLE ELEMENTS
  /*updateChildElementState = value => {
    if(this.props.toggle!==undefined){
          const {children} = this.props;
    const childrenFound = children.length > 0
    ? children
    : [children];

    if(childrenFound && childrenFound.length>0){
     childrenFound.map((child) => {console.log(child);})
      }
    }
  }*/

  toggleState = name => event => {    
    //this.updateChildElementState();

    this.setState({ enabled: event.target.checked });
  };

    render() {
      return (
        <div className={this.props.className+" ongeaAct__panel "+((!this.state.enabled)?"disabled":"")}>
         {(this.props.label || this.props.toggle) &&
          <div className="ongeaAct__panel-title">
            <h3>{this.props.label}</h3>
            {(this.props.toggle!==undefined) &&
            <Switch
          className="ongeaAct__panel-toggle"
          checked={this.state.enabled}
          onChange={this.toggleState()}
          value="enabled"
        />}

          </div>
         }
         
          <div className="ongeaAct__panel-content">{this.props.children}</div>
        </div>
      );
    }
  }