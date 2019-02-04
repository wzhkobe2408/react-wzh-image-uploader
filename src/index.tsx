/**
 * @class ImageUploader
 */

import * as React from 'react';
import axios, { AxiosInstance } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faImages,
  faTimesCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

import styles from './styles.css';

export type Props = {
  /**
   * 是否选择多图上传模式
   */
  multi: boolean;
  /**
   * 上传图片API BASEURL
   */
  baseURL: string;
};

export type Image = {
  url: string;
  fileName: string;
};

export type State = {
  /**
   * 是否正在上传图片
   */
  loading: boolean;
  /**
   * 图片
   */
  images: Array<Image>;
  /**
   * 表单数据
   */
  formData: FormData;
  /**
   * 错误
   */
  err: Error | null;
  /**
   * 是否已经上传
   */
  uploaded: boolean;
};

export default class ImageUploader extends React.Component<Props> {
  state = {
    loading: false,
    images: [],
    formData: new FormData(),
    err: null,
    uploaded: false,
  } as State;
  axiosInstance: AxiosInstance;
  componentDidMount() {
    this.axiosInstance = axios.create({
      baseURL: this.props.baseURL,
      onUploadProgress: function(e) {
        var percentage = Math.round((e.loaded * 100) / e.total) || 0;
        if (percentage < 100) {
          console.log(percentage + '%'); // 上传进度
        }
      },
    });
  }

  componentDidUpdate() {
    console.log('UPDATE: ', this.state);
  }

  onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append(file.name + file.lastModified, file);
    });
    this.setState({
      images: files.map(file => {
        return {
          url: window.URL.createObjectURL(file),
          fileName: file.name + file.lastModified,
        };
      }),
      formData: formData,
    });
  };

  onFileSubmit = () => {
    const { multi } = this.props;
    this.setState({
      err: null,
      loading: true,
    });
    const { formData } = this.state;
    const path = multi ? '/image-upload' : '/image-upload-single';
    // Sending Images
    this.axiosInstance
      .post(path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        this.setState({
          loading: false,
          images: res.data.map(item => {
            return {
              url: item.secure_url.toString(),
              fileName: item.original_filename,
            };
          }),
          formData: new FormData(),
          uploaded: true,
        });
      })
      .catch(err => {
        this.setState({
          err: err,
          loading: false,
        });
      });
  };

  removeImage = (fileName: string) => {
    const { uploaded } = this.state;
    if (uploaded) return;
    let newFormData: FormData = this.state.formData!;
    this.setState((prevState: State) => {
      newFormData.delete(fileName);
      return {
        images: prevState.images.filter(item => item.fileName !== fileName),
        formData: newFormData,
      };
    });
  };
  render() {
    const { multi } = this.props;
    const { images, loading, err, uploaded } = this.state;
    return (
      <div className={styles.container}>
        <label htmlFor="image-uploader">
          <FontAwesomeIcon
            icon={multi ? faImages : faImage}
            color="#3B5998"
            size="10x"
          />
        </label>
        <br />
        <div className={styles.uploadBtn} onClick={this.onFileSubmit}>
          上传
        </div>
        {loading ? <div>正在上传...</div> : null}
        {err ? (
          <div className={styles.errInfo}>
            {err.message || '上传失败，请稍后尝试'}
          </div>
        ) : null}
        <div />
        <input
          className={styles.hiddenInput}
          id="image-uploader"
          type="file"
          multiple={multi}
          onChange={this.onFileUpload}
        />
        <div className={styles.imagesWrapper}>
          {images.length > 0
            ? images.map((image: Image, index: number) => {
                return (
                  <div className={styles.imageBox} key={index}>
                    <div
                      onClick={() => this.removeImage(image.fileName)}
                      className={styles.deleteIcon}
                    >
                      {uploaded ? (
                        <FontAwesomeIcon
                          color="#b0db61"
                          icon={faCheckCircle}
                          size="2x"
                        />
                      ) : (
                        <FontAwesomeIcon
                          color="#db6161"
                          icon={faTimesCircle}
                          size="2x"
                        />
                      )}
                    </div>
                    <img className={styles.showImage} src={image.url} />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}
