import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
 
  
export default class AssignEventsForm extends React.Component{

 
  

  render(){
    const {handleSubmit, isLoadingAction, setProgress} = this.props;
    
    return( <div>

         

        
        <div className='buttonWrapper'>
            <Button
                variant="contained"
                disabled={isLoadingAction}
                color="primary"
                onClick={()=>{
                    handleSubmit(setProgress);
                }}
                >
                clean stays
              </Button>
              {isLoadingAction && <CircularProgress size={24} className='buttonProgress'/>}
        </div>
        
  
     </div> );

  }
}