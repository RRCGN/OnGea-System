import React, { Component } from 'react'

export default class Image extends Component {
  render() {
      const {src,alt} = this.props;
    return (
      <img {...this.props} src={src} alt={alt || ''} />
    )
  }
}
