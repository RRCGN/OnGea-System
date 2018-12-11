import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';


export default class InfoLabel extends React.Component {

	constructor(props) {
      super(props);
     
      this.infoLabelDiv = React.createRef();
      this.state = {
          fullHeight:false || this.props.infoLabelFullHeight,
          expandable:false 
        };
        


     }



     componentDidUpdate(prevProps) {
      const {children} = prevProps;
      //console.log('children',children);
      if(children !== this.props.children){
        this.calculateIfExpandable();

      }
     }

    componentDidMount(){

     	
      this.calculateIfExpandable();

    }

     

    calculateIfExpandable = () =>{
      const minHeight = (this.props.minHeight)?this.props.minHeight:59;
      const scrollHeight = this.infoLabelDiv.scrollHeight;
      if(scrollHeight > minHeight && !this.props.infoLabelFullHeight){
        this.setState({expandable:true});
      }else{
        this.setState({expandable:false});
      }
    }


	toggleHeight(){

		if(this.state.expandable){
			this.setState({fullHeight:!this.state.fullHeight});
		}
	}


    render() {

    	const {fullHeight, expandable} = this.state;
      
      return (
      	<div className="ongeaAct__infoLabel_Wrapper" style={expandable ? {cursor:'pointer'}:null}>
	        <div ref={div => this.infoLabelDiv = div} className="ongeaAct__infoLabel"  onClick={ expandable ? this.toggleHeight.bind(this) : null} style={fullHeight ? {maxHeight:200+'px'} : null}>
	         
	          {this.props.children}
	           
	        </div>
	        {expandable && !fullHeight ? <span className='ongeaAct__infoLabel_more'>...</span> : null}
	        <div className="expandIcon" onClick={this.toggleHeight.bind(this)} style={!expandable ? {display:'none'}:null}>{fullHeight ? <ExpandLessIcon/> : <ExpandMoreIcon/>}</div>
	    </div>
      );
    }
  }