import React from 'react';
import Panel from '../Panel';

export default class DisplayFormState extends React.Component {

  flattenJSON = (o) => {
    var cache = [];

    var JSONString = JSON.stringify(o, function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return undefined;
        }
        // Store value in our collection
        cache.push(value);
      }

      return value;
    }, 2);

    return JSONString;
    //cache = null;
  }

  render() {
    const props = this.props;
    return (<div></div>);
    /*return (
      <Panel label="Form output">
      <div style={{
        margin: '1rem 0'
      }}>
        <pre style={{ fontSize: '.65rem' }}>
            <strong>props</strong> ={' '}
            { this.flattenJSON(props.values) }
           
          </pre>
        </div>
        </Panel>
    );*/
  }
}
