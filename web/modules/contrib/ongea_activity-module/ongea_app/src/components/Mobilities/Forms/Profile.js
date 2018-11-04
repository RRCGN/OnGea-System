import React from 'react';
import {Basic as ProfileBasic} from '../../Profiles/Forms/Basic';
import {ContentTypes} from '../../../config/content_types';
 

export class ProfileForm extends React.Component {
  

  static defaultProps = {
    contentType: ContentTypes.Mobilities
  }


  

  render() {
    

    

    return (
      

     

          <ProfileBasic data={this.props.data.participant} readOnly={true} />

        
    );



  }
}
export const Profile = ProfileForm;
