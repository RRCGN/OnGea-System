import React from 'react';
import ContentView from '../_Views/ContentView';
import {ContentTypes,extendReferenceContentType} from '../../config/content_types';
import {translate} from 'react-i18next';



class Mobilities extends React.Component {

  static defaultProps = {
    //contentType: ContentTypes.Activities,
    //referenceContentType: ContentTypes.Profiles
    contentType: ContentTypes.Mobilities,
    referenceContentType: extendReferenceContentType(ContentTypes.Profiles,ContentTypes.MobilitiesParticipant)//extendReferenceContentType(ContentTypes.Organisations,ContentTypes.ActivityOrganisations)
  
  }
  


  render() {
   
    return (<ContentView
      {...this.props}
      render={(props) => (
      <div></div>
    )}/>);
  }
}

export default translate('translations')(Mobilities);
