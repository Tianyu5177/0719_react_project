import React, {Component} from 'react'
import {Upload,Icon,Modal} from 'antd';
import {BASE_URL} from '../../config'

//将图片变成base64编码形式
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  state = {
    previewVisible: false, //是否展示预览窗
    previewImage: '',//要预览的图片的URL地址或base64编码
    fileList: [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done', 
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }
    ],
  };

  //关闭预览窗
  handleCancel = () => this.setState({ previewVisible: false });

  //展示预览窗
  handlePreview = async (file) => {
    //如果图片没有url也没有转换过base64，那么调用如下方法把图片转成base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //当图片状态发生改变的回调
  handleChange = ({file,fileList}) => {

    if(file.status === 'done'){
      console.log(file.response.data.url);
      fileList[fileList.length-1].url = file.response.data.url
      fileList[fileList.length-1].name = file.response.data.name
    }

    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${BASE_URL}/manage/img/upload`}//发送上传请求的地址
          method="post"
          name="image"
          listType="picture-card"//照片墙的展示方式
          fileList={fileList}//图片列表，一个数组里面包含着多个图片对象{uid:xxxx,name:xxx,status:xxx,url:xxx}
          onPreview={this.handlePreview}//点击预览按钮的回调
          onChange={this.handleChange}//图片状态改变的回调（图片上传中、图片被删除、图片成功上传）
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
