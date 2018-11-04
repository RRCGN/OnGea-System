import React from 'react';
import { ContentTypes } from '../../../config/content_types';
import ReferenceView from '../../_Views/ReferenceView';
 

export class OrganisationsForm extends React.Component {
 
  static defaultProps = {
    contentType: ContentTypes.Project,
    referenceContentType: ContentTypes.Organisations
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