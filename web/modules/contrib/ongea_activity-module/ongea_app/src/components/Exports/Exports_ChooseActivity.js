import React from 'react';
import ContentView from '../_Views/ContentView';
import { ContentTypes,extendReferenceContentType } from '../../config/content_types';
import ListView from '../_Views/ListView';
import { translate } from 'react-i18next';

class Exports_ChooseActivity extends React.Component {
 
static defaultProps = {
    contentType: ContentTypes.Exports,
    referenceContentType: extendReferenceContentType(ContentTypes.Activities,ContentTypes.ActivityExports)
      }


  render() {
    const {t,referenceContentType,match} = this.props;
    //referenceContentType.api.get = ContentTypes.Activities.api.getEntire;
        return (
     <React.Fragment>
       { //TODO EDIT ROUTING AND DONT JUST DONT RENDER CONTENT
         match.isExact &&
    <ContentView {...this.props} hideTabs render={() => (
      <div className="ongeaAct__container--with-padding">
        <h2>{t('Select activity whose Export-Lists you want to view')}</h2>
        <ListView {...this.props} contentType={referenceContentType}></ListView>
      </div>
    )} />}
    </React.Fragment>
  );
  }
}

export default translate('translations')(Exports_ChooseActivity);
 