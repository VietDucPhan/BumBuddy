import {
  AsyncStorage
} from 'react-native';

class Cache {
  constructor(){
    var self = this;
  }

  isExpired(numberMinute, date, callback){
    var seconds = Math.floor((new Date() - new Date(date))/1000);
    var minute = Math.floor(seconds/60) ;
    console.log("minute",minute);
    if(numberMinute > minute){
      return callback(false);
    } else {
      return callback(true);
    }
  }

  setUser(userData){
    if(userData && userData.token && userData.email){
      AsyncStorage.setItem('user',JSON.stringify(userData),function(err){
        if(!err){
          //console.log("login to heroku successful",responseJson.content);
          return true
        } else{
          //console.log("login to heroku fail","something went wrong while trying to store");
          return false;
        }
      });
    } else {
      return false;
    }
  }

  clearUser(){
    AsyncStorage.removeItem('user',function(){
      return true;
     });
  }

  setPushToken(token){
    var self = this;
    if(token){
      AsyncStorage.setItem("pushToken",JSON.stringify(token),function(err){
        if(!err){
          return true;
        } else{
          return false;
        }
      });
    }
  }

  getPushToken(callback){
    AsyncStorage.getItem("pushToken",function(err,result){
      //console.log('getPushToken',err);
      if(result){
        var response = JSON.parse(result);
        return callback(response);
      }
      
      return callback(response);
      
    });
  }

//obsolete
  setDeviceToken(token){
    var self = this;
    if(token){
      token.store_date = new Date();
      AsyncStorage.setItem("deviceToken",JSON.stringify(token),function(err){
        if(!err){
          return true;
        } else{
          return false;
        }
      });
    }
  }
//obsolete
  getDeviceToken(callback){
    AsyncStorage.getItem("deviceToken",function(err,result){
      //console.log('getRating',err);
      var response = JSON.parse(result);
      return callback(response);
    });
  }

  setUserSetting(data){
    var self = this;
    if(data){
      data.store_date = new Date();
      AsyncStorage.setItem("userSetting",JSON.stringify(data),function(err){
        //console.log('cache.set.err',err);
        if(!err){
          //console.log('cache.set',data);
          return true;
        } else{
          return false;
        }
      });
    } else {
      AsyncStorage.setItem("userSetting",JSON.stringify({
        radius:2
      }),function(err){
        //console.log('cache.set.err',err);
        if(!err){
          //console.log('cache.set',data);
          return true;
        } else{
          return false;
        }
      });
    }
  }

  getUserSetting(callback){
    AsyncStorage.getItem("userSetting",function(err,result){
      //console.log('getRating',err);
      var response = JSON.parse(result);
      if(result){
        return callback(response);
      } else{
        return callback({radius:2});
      }
    });
  }

  setRating(_id, data){
    var self = this;
    if(data && _id){
      data.store_date = new Date();
      AsyncStorage.setItem("rating-"+_id,JSON.stringify(data),function(err){
        //console.log('cache.set.err',err);
        if(!err){
          //console.log('cache.set',data);
          return true;
        } else{
          return false;
        }
      });
    } else {
      return false;
    }
  }

  getRating(_id,callback){
    var self = this;
    if(_id && _id != null){
      AsyncStorage.getItem("rating-"+_id,function(err,result){
        //console.log('getRating',err);
        var response = JSON.parse(result)
        if(result){
          self.isExpired(5,response.store_date,function(flag){
            if(flag){
              return callback(false,null);
            } else {
              return callback(true,response);
            }
          })

        } else{
          return callback(false,null);
        }
      });
    }
  }

  setComments(_id, data){
    var self = this;
    if(data && _id){
      data.store_date = new Date();
      AsyncStorage.setItem("comment-"+_id,JSON.stringify(data),function(err){
        console.log('cache.setComments',_id);
        if(!err){
          //console.log('cache.set',data);
          return true;
        } else{
          return false;
        }
      });
    } else {
      return false;
    }
  }

  getComments(_id,callback){
    var self = this;
    if(_id && _id != null){
      AsyncStorage.getItem("comment-"+_id,function(err,result){
        var response = JSON.parse(result);
        console.log("getComments",response)
        if(result){
          self.isExpired(1,response.store_date,function(flag){
            //console.log("getComments",flag)
            if(flag){
              return callback(false,null);
            } else {
              return callback(true,response);
            }
          })
        } else{
          return callback(false,null);
        }
      });
    }
  }
}

module.exports = Cache;
