import React from 'react';
import { ContentTypes } from '../../config/content_types';
import ListView from '../_Views/ListView';
import Section from '../elements/Section';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {NewAnnouncement} from '../Announcements/NewAnnouncement';
import SwipeableViews from 'react-swipeable-views';
import {translate} from "react-i18next";



class AnnouncementsWidget extends React.Component {
 

  constructor(props) {
    super(props);
    this.state = {
        value:0
      
            }
  }

  static defaultProps = {
    contentType: ContentTypes.Announcements
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {

    const {value} = this.state;
    const {t} = this.props;
    
    return (
      <Section>
        <h2>{t('announcement_plural')}</h2>
          <Tabs value={value} onChange={this.handleChange} fullWidth>
            <Tab label={t("announcement_plural")} />
            <Tab label={t("New Announcement")} />
          </Tabs>
          <SwipeableViews
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
           >
          <ListView {...this.props} />
            <NewAnnouncement t={t}/>
           </SwipeableViews>
           
         
      </Section>
  );
  }
}

export default translate('translations')(AnnouncementsWidget);


