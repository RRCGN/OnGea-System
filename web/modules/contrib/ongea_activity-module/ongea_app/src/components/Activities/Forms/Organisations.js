import React from 'react';
import { ContentTypes,extendReferenceContentType } from '../../../config/content_types';
import ReferenceView from '../../_Views/ReferenceView';
 

export class OrganisationsForm extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Activities,
    referenceContentType: extendReferenceContentType(ContentTypes.Organisations,ContentTypes.ActivityOrganisations)
  }

  render() {
    return (
      <ReferenceView {...this.props} render={(props) => (
        <div>
           
        </div>
      )} />
  );
  }
}

export const Organisations = OrganisationsForm;