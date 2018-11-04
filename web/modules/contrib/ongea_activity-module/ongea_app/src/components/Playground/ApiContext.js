import React from 'react';

const AppContext = React.createContext()
class AppProvider extends React.Component {
  state = {
    number: 10,
    setNumber: (val) => {
        this.setState({
          number: parseInt(val,10)
        })
      },
    inc: (val) => {
      this.setState({
        number: this.state.number + val
      })
    },
    dec: (val) => {
        this.setState({
          number: this.state.number - val
        })
      }
  }
  render() {
    return <AppContext.Provider value={this.state}>
      {this.props.children}
    </AppContext.Provider>
  }
}
const Green = () => (
  <div className="green">
    <AppContext.Consumer>
      {(context) => context.number}
    </AppContext.Consumer>
  </div>
)

/*
const Blue = () => (
  <div className="blue">
    <AppContext.Consumer>
        {(context) => <button onClick={context.inc}>INC</button>}
      </AppContext.Consumer>
    <Green />
  </div>
)
*/

class Blue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 1
    }
    this.handleChange = this
      .handleChange
      .bind(this);
  }
  handleChange(event) {
    this.setState({num: parseInt(event.target.value,10)});
  }
  render() {
    return <div className="blue">
      <input type="number" value={this.state.num} onChange={this.handleChange}/>
      <AppContext.Consumer>
        {(context) => <div>
            <input type="number" value={this.state.num}  onChange={(event) =>  {
                           event.preventDefault();
                           context.setNumber(event.target.value);
                       }} />
            <button onClick={() => { context.dec(this.state.num) }}>{'- '+this.state.num}</button>
            <button onClick={() => { context.inc(this.state.num) }}>{'+ '+this.state.num}</button>
        </div>}
      </AppContext.Consumer>
      <Green/>
    </div>
  }
}
export default class ApiContext extends React.Component {
  render() {
    return <AppProvider>
      <div className="red">
        <AppContext.Consumer>
          {(context) => context.number}
        </AppContext.Consumer>
        <Blue/>
      </div>
    </AppProvider>
  }
}