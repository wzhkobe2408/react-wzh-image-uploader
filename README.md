# react-wzh-image-uploader

> A React Component for upload image(single or multiple)

[![NPM](https://img.shields.io/npm/v/react-image-uploader.svg)](https://www.npmjs.com/package/react-image-uploader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-image-uploader
```

## Usage

```tsx
import React, { Component } from 'react';

import ImageUploader from 'react-image-uploader';

export default class App extends Component {
  render() {
    return (
      <div>
        <ImageUploader multi={false} baseURL={'http://localhost:8080'} />
      </div>
    );
  }
}
```

## Example

### preview

![](preview.png)

### uploading

![](uploading.png)

### finished

![](finished.png)

### cloudinary

![](cloudinary.png)

## License

MIT © [wzhkobe2408](https://github.com/wzhkobe2408)
