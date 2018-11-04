import React from 'react';
import Grid from '@material-ui/core/Grid';
import InfoLabel from './InfoLabel';

export default class FormRowLayout extends React.Component {


	

    render() {
			const {style, infoLabel, infoLabelFullHeight,fullWidth,alignItems} = this.props;
			const size = {
				full: 12,
				xs:12,
				sm:7,
				spacing: 24
			}
			if(fullWidth)size.sm=size.full;
      return (
				
        <div className="formRowLayout" style={style}>
	        <Grid container spacing={size.spacing}>
	    		<Grid align={alignItems || "left"} item xs={size.xs} sm={size.sm}>
	          {this.props.children}
	          </Grid>
	          <Grid item xs={size.xs} sm={(size.full-size.sm > 0)?size.full-size.sm:false}>
	    			{infoLabel ? (<InfoLabel infoLabelFullHeight={infoLabelFullHeight}>{infoLabel}</InfoLabel>) : null}
	   		 </Grid>
	        </Grid>
        </div>
      );
    }
  }