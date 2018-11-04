import React from 'react';
import Panel from '../../elements/Panel';
import EditView from '../../_Views/EditView';
import { ContentTypes } from '../../../config/content_types';
import {SignUpFormElement} from '../../elements/FormElements/SignUpFormElement';


 



export class OnlineSignupForm extends React.Component {
   
  static defaultProps = {
    contentType: ContentTypes.Activities
  }
  
 
    render() {

      
      

       return (
           <EditView {...this.props} render={(props) => (

              <SignUpFormElement
                id="signUpForm"
                value={props.values.signUpForm}
                setFieldValue={props.setFieldValue}
                error={props.touched.signUpForm && props.errors.signUpForm}
                t={props.t}
                dirty={props.dirty}
              />
            
          )} />
        );
    }
}
export const OnlineSignup = OnlineSignupForm;
