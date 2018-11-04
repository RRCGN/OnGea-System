import React, { Component } from 'react'

export default class Container extends Component {
  render() {
    return (
      <div className="ongeaAct__container ongeaAct__container--with-padding">
        {this.props.children}
      </div>
    )
  }
}
