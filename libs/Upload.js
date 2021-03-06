
import {
  AsyncStorage,
  Platform
} from 'react-native';
import Sha1 from './Sha1';
import RNFetchBlob from 'rn-fetch-blob';
class Upload {
  constructor(){
    this.api_key = '955818184181287';
    this.appendix_key = '7YWoy9IjOttmpg7pNm-ejOjIg-s';
    this.prependix_url = 'https://api.cloudinary.com/v1_1/dsthiwwp4/';
  }

  /**
  @return json { public_id: 'dbmwb1guio83i7bcionl',
  	  version: 1471803488,
  	  signature: '7e8036a4afc2981ed5e114e9b836d0ab07874185',
  	  width: 500,
  	  height: 332,
  	  format: 'jpg',
  	  resource_type: 'image',
  	  created_at: '2016-08-21T18:18:08Z',
  	  tags: [],
  	  bytes: 247660,
  	  type: 'upload',
  	  etag: '69def6e0dcb51d29a80b4859344a3922',
  	  url: 'http://res.cloudinary.com/dsthiwwp4/image/upload/v1471803488/dbmwb1guio83i7bcionl.jpg',
  	  secure_url: 'https://res.cloudinary.com/dsthiwwp4/image/upload/v1471803488/dbmwb1guio83i7bcionl.jpg' }
  **/
  imageUploadToCloud(mediaData,callback){
    var self = this;
    //console.log("upload.imageUploadToCloud",mediaData);
    RNFetchBlob.fetch('POST','https://api.cloudinary.com/v1_1/dsthiwwp4/image/upload', 
      {
        'Accept': 'application/json',
        'Content-Type': 'octet-stream',
      },
      [
        {name:"file", data: mediaData.uri},
        {name:"upload_preset", data:"noryv4a6"}
      ]
    )
    .then((response) => response.json())
    .then((responseJson) => {
      return callback(responseJson);
    })
    .catch((error) => {
      console.log("upload.imageUploadToCloud.error",error);
      return callback({
        errors:
        [
          {
            status:'m009',
            source:{pointer:"libs/upload.imageUploadToCloud"},
            title:"Could not upload image",
            detail:error.message
          }
        ]
      });
    });
  }

  async videoUploadToCloud(mediaData,callback){
    var self = this;
    var uriArr = mediaData.uri.split("/");
    var lastIndex = uriArr.length - 1;
    var fetchBlobWrap = '';
    if(Platform.OS === "ios"){
      fetchBlobWrap = mediaData.uri.replace("file://","");
    } else {
      fetchBlobWrap = mediaData.path;
    }

    try {
      RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/dsthiwwp4/video/upload/',
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'file', filename: uriArr[lastIndex], data: RNFetchBlob.wrap(fetchBlobWrap)},
        {name: 'upload_preset', data: 'noryv4a6'}
      ]).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          responseJson.secure_url = "https://res.cloudinary.com/dsthiwwp4/video/upload/so_0,eo_3,w_360,h_480,c_fill/e_loop/" + responseJson.public_id + ".gif";
          return callback(responseJson);
        }).catch((err) => {
        console.log(err);
        return callback({
          msg:'There is an error while uploading video, please try again later',
          errors:
          [
            {
              status:'m009',
              source:{pointer:"libs/upload.imageUploadToCloud"},
              title:"Could not upload video",
              detail:error.message
            }
          ]
          });
      });
    } catch(err) {
      return callback({
        msg:err.message,
        errors:
        [
          {
            status:'m009',
            source:{pointer:"libs/upload.imageUploadToCloud"},
            title:err.message,
            detail:err.message
          }
        ]
      });
    }
  }



  uploadProfilePictureUsingUrl(url,public_id,callback){
    var self = this;
    //console.log("upload.imageUploadToCloud",mediaData);
    fetch('https://api.cloudinary.com/v1_1/dsthiwwp4/image/upload', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: url,
        upload_preset: "noryv4a6",
        public_id:public_id
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
      })
      .catch((error) => {
        console.log("upload.imageUploadToCloud.error",error);
        return callback({
          errors:
          [
            {
              status:'m009',
              source:{pointer:"libs/upload.imageUploadToCloud"},
              title:"Could not upload image",
              detail:error.message
            }
          ]
        });

      });
  }
}

module.exports = Upload;
