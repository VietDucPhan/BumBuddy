import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {
  AsyncStorage
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken
} = FBSDK;

 import UploadLib from './Upload';
 var Upload = new UploadLib();

class Auth {
  constructor(){
    var self = this;
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
        //console.log("hasPlayServices");
        GoogleSignin.configure({
          iosClientId: '315634877630-isklnqj79dtsf1oaoml9big6eq90jrtv.apps.googleusercontent.com',
          webClientId: '315634877630-gfoq4ovb7to7jh67j216017urb0eu7gj.apps.googleusercontent.com',
          offlineAccess: false
        }).then(() => {
          // you can now call currentUserAsync()
          //console.log("hasPlayServices.then");
        });
        //
        GoogleSignin.currentUserAsync().then((user) => {
          //console.log('USER', user);
        }).done();

      })
      .catch((err) => {
        console.log("Play services error", err.code, err.message);
      });
      //facebook login
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          //console.log(data);
          if(data && data.accessToken){
            self.getFacebookInfoViaAccessToken(data.accessToken,function(result){
              //console.log("facebook info", result);
            });
          }
      });
  }



  isLogedIn(callback){
    AsyncStorage.getItem('user',function(error,result){
      var response = JSON.parse(result);
      if(!error && response && response.type){
        //console.log('Auth.isLogedIn',response);
        return callback(response);
      } else {
        return callback(null);;
      }
    });
  }

  updateProfile(token,data,callback){
    fetch('https://bumbuddy.herokuapp.com/api/update-profile',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        token:token,
        data:data
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
      });
  }

  storeUserInfo(userInfo,callback){
    var self = this;
    if(typeof userInfo != "object"){return false;}
    if(userInfo && userInfo.name && userInfo.email){
      AsyncStorage.getItem("deviceToken",function(err,result){
        //console.log('getRating',err);
        var response = JSON.parse(result);
        userInfo.device_token = response;

        fetch('https://bumbuddy.herokuapp.com/api/login',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(userInfo)
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.status){
              var content = responseJson.content;
              if(responseJson.content && responseJson.content.profile_picture && responseJson.content.profile_picture.secure_url && responseJson.content.profile_picture.secure_url.search(responseJson.content._id) == -1){
                Upload.uploadProfilePictureUsingUrl(responseJson.content.profile_picture.secure_url,responseJson.content._id,function(response){
                  console.log("storeUserInfo1",response);
                  self.updateProfile(responseJson.content.token,{profile_picture:response},function(respond){

                    if(respond.error){
                      return callback(false);
                    } else {
                      console.log("updateProfile",respond);
                      AsyncStorage.setItem('user',JSON.stringify(respond.data[0]),function(err){
                        if(!err){
                          //console.log("login to heroku successful",responseJson.content);
                          return callback(true,respond.data[0]);
                        } else{
                          //console.log("login to heroku fail","something went wrong while trying to store");
                          return callback(false);
                        }
                      });
                    }
                  })
                });
              } else {
                console.log("profile picture already exist continue login");
                AsyncStorage.setItem('user',JSON.stringify(responseJson.content),function(err){
                  if(!err){
                    //console.log("login to heroku successful",responseJson.content);
                    return callback(true,responseJson.content);
                  } else{
                    //console.log("login to heroku fail","something went wrong while trying to store");
                    return callback(false);
                  }
                });
              }
            } else {
              console.log("login to heroku fail","something went wrong while trying to loggin");
              return callback(false);
            }
          }).catch((error) => {
            return callback(false);
            console.error("_save error",error);
          });
        });
      } else {
        console.log("wrong user info","there is no email and name");
      }

  }

  getGoogleInfoViaIDToken(IDToken,callback){
    if(IDToken){
      fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+IDToken)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson && responseJson.name && responseJson.email){
          if(typeof callback == 'function'){
            if(responseJson.picture){
              return callback({
                name:responseJson.name,
                email:responseJson.email,
                profile_picture:{secure_url:responseJson.picture},
                type:"google"
              });
            } else {
              return callback({
                name:responseJson.name,
                email:responseJson.email,
                profile_picture:null,
                type:"google"
              });
            }

          } else{
            return responseJson;
          }
        } else {
          if(typeof callback == 'function'){
            return callback(null);
          } else{
            return null;
          }
        }
      }).catch((error) => {
        console.error(error);
        return false;
      });
    } else {
      return false;
    }
  }

  signInWithGoogle(callback){
    console.log('signInWithGoogle 1');
    var self = this;
    try{
      GoogleSignin.signIn()
      .then((user) => {
        //https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=
        console.log('GoogleSignin.signIn');
        if(user && user.idToken){
          self.getGoogleInfoViaIDToken(user.idToken, function(result){
            self.storeUserInfo(result,function(responseObj){
              if(responseObj){
                console.log('Login google was successful');
                return callback(true,responseObj);
              } else {
                console.log('Login google was failed');
                return callback(false,responseObj);
              }
            })
          });
        } else {
          console.log('GoogleSignin.signIn callback false');
          return callback(false);
        }
       console.log('GoogleSignin.signIn.then');
      })
      .done();
    } catch(err){
      console.log('WRONG SIGNIN',err);
    }

 }

 signOutWithGoogle(){
   GoogleSignin.signOut()
   .then(() => {
     AsyncStorage.removeItem('user',function(){
       console.log('delete user');
     });
   })
   .catch((err) => {

   });
 }

  getFacebookInfoViaAccessToken(accessToken,callback){
    if(accessToken){
      fetch('https://graph.facebook.com/v2.9/me?access_token='+accessToken+'&fields=id,name,email,picture')
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson && responseJson.id && responseJson.name && responseJson.email){
          if(typeof callback == 'function'){
            if(responseJson.picture && responseJson.picture.data){
              return callback({
                name:responseJson.name,
                email:responseJson.email,
                profile_picture:{secure_url:responseJson.picture.data.url},
                type:"facebook"
              });
            } else {
              return callback({
                name:responseJson.name,
                email:responseJson.email,
                profile_picture:null,
                type:"facebook"
              });
            }

          } else{
            return responseJson;
          }
        } else {
          if(typeof callback == 'function'){
            return callback(null);
          } else{
            return null;
          }
        }
      }).catch((error) => {
        console.error(error);
        return false;
      });
    } else {
      return false;
    }
  }
  signInWithFacebook(callback){
    var THIS = this;
    LoginManager.logInWithReadPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login was cancelled');
          return callback(false);
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              if(data && data.accessToken){
                THIS.getFacebookInfoViaAccessToken(data.accessToken,function(result){
                  //console.log('getFacebookInfoViaAccessToken');
                  THIS.storeUserInfo(result,function(status,responseObj){
                    if(status){
                      console.log('Login facebook was successful');
                      return callback(true,responseObj);
                    } else {
                      console.log('Login facebook was failed');
                      return callback(false,responseObj);
                    }
                  })

                });
              }

            }
          )
        }
      },
      function(error) {
        console.log('Login failed with error: ' , error);
        return callback(false);
      }
    );
  }

  signOutWithFacebook(){
    AsyncStorage.removeItem('user',function(){
      LoginManager.logOut();
      return true;
    });
  }

 signOutBoth(callback){
   var self = this;
   AsyncStorage.getItem("user",function(err,result){
     var response = JSON.parse(result);
     self.signOutWithGoogle();
     self.signOutWithFacebook();
     AsyncStorage.getItem("deviceToken",function(err,resultDeviceToken){
       var parsedResultDeviceToken = JSON.parse(resultDeviceToken);
       response.device_token = parsedResultDeviceToken;
       fetch('https://bumbuddy.herokuapp.com/api/logout',
       {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body:JSON.stringify(response)
       }).then((responseServer) => responseServer.json())
         .then((responseJson) => {

           return callback(true);
         });
     });
   });
 }
}

module.exports = Auth;
