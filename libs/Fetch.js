import RNFetchBlob from 'rn-fetch-blob';
import Config from './Config';

var Fetch = {};

Fetch.apiPOST = function(api, data, callback){
  if(!api || !data){
    return callback({
      msg:"There are missing params",
      error:[{
        title:"There are missing params",
        etail:"There are missing params"
       }],
       showMessage:true
    });
  }
  console.log('apiPost',data);
  var url = Config.apiPrefix + api;
  fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson || (responseJson.data || responseJson.errors)){
          return callback(responseJson);
        }
        return callback({
          msg:'An error occur please try again later',
          errors:[{
            title:'Server not response'
          }],
          showMessage:true
        });
      });
}
module.exports = Fetch;