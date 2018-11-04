import React, {Component} from 'react'
import  {LoadingIndicator} from './elements';
import {Tabs, Tab} from 'material-ui';
import SwipeableViews from 'react-swipeable-views';
import {Styles} from '../libs/utils/constants'
import {NewMessage} from './NewMessage';


const DATA_MESSAGES = [
  {
    key: '1',
    subject: 'Tomorrow Meeting',
    text: 'Looking forward meeting with you'
  }, {
    key: '2',
    subject: 'Fooooood',
    text: 'We are meeting at 12 at the golden Möwe.'
  }
];

export default class Announcements extends Component {
  state = {
    messages: DATA_MESSAGES,
    slideIndex: 0
  }

  componentWillUnmount() {
    //this.onBrowserHistoryChanged();
  }

  handleTabIndexChange = (index) => {
    this.setState({slideIndex: index});
  };

  render() {
    const {messages, slideIndex} = this.state
    return (
      <div>
        <Tabs onChange={this.handleTabIndexChange} value={slideIndex}>
          <Tab style={Styles.Tab} label="Messages" to="messages" value={0}/>
          <Tab style={Styles.Tab} label="New message to participants" to="new-message" value={1}/>
        </Tabs>

        <SwipeableViews index={slideIndex} onChangeIndex={this.handleTabIndexChange}>
          <div style={Styles.TabSlide}>
            <h3>Messages</h3>
            {messages
          ? (
            <ul>
                {messages.map(((message, index) => (
                  <li key={'message-'+index}><strong>{message.subject}</strong><p>{message.text}</p></li>
                )))}
             </ul>
          )
          : (
            <LoadingIndicator></LoadingIndicator>
          )}
          </div>
          <div style={Styles.TabSlide}>
            <h3>Message participants</h3>
            <NewMessage />
          </div>
        </SwipeableViews>
      </div>
    )
  }
}
