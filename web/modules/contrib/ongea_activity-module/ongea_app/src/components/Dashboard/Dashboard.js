import React from 'react';
import ContentView from '../_Views/ContentView'
import Intro from './Intro'
import { ContentTypes } from '../../config/content_types';
import MobilitiesWidget from '../Mobilities/MobilitiesWidget';


class Dashboard extends React.Component {
  static defaultProps = {
    contentType: ContentTypes.Dashboard
  }

  render() {
    return (
      <div>
      <ContentView
          {...this.props}
          render={(props) => (
            <div>
          <Intro t={props.t}></Intro>
          
          </div>
        )}
      />

      {/* 
       <AnnouncementsWidget />*/}
       <MobilitiesWidget />
      <div>
        <h1><span aria-label="emoji: under-construction" role="img">🚧</span> &nbsp;More content will follow soon.</h1>
      </div>
       
    </div>
      );
  }
}

export default Dashboard; 