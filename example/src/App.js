import React, { Component } from 'react';

import ImageUploader from 'react-image-uploader';

export default class App extends Component {
  render() {
    return (
      <div>
        <ImageUploader multi={true} baseURL={'http://localhost:8080'} />
      </div>
    );
  }
}
