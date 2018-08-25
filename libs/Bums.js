
import { AsyncStorage } from 'react-native';

class Bums {
  constructor(){
    return true
  }

  createBum(data,callback){
    fetch('https://bumbuddy.herokuapp.com/api/create-bum',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("Bums._uploadToHeroku.then",responseJson);
      return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m002',
          source:{pointer:"libs/bums.createBum"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  searchBumByName(text,callback){
    fetch('https://bumbuddy.herokuapp.com/api/find-bum-name',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({name:text})
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("Bums._uploadToHeroku.then",responseJson);
      return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m002',
          source:{pointer:"libs/bums.createBum"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  getSurroundBum(data,callback){
    fetch('https://bumbuddy.herokuapp.com/api/get-surround-bum',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("getSurroundBum",responseJson);
      return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m006',
          source:{pointer:"libs/bums.createBum"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  addComment(data,callback){
    fetch('https://bumbuddy.herokuapp.com/api/comment-bum',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m006',
          source:{pointer:"libs/bums.createBum"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  getRating(_id,callback){
    var self = this;
    fetch('https://bumbuddy.herokuapp.com/api/get-rating',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({_id:_id})
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
        console.log('Bums.getBum',error);
        return callback({errors:[
          {
            status:'m003',
            source:{pointer:"libs/bums.getRating"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
    });
  }

  getBumComments(data,callback){
    var self = this;
    //console.log("Bums.getComments",_id);
    fetch('https://bumbuddy.herokuapp.com/api/get-bum-comments',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({data:data})
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
        console.log('Bums.getComments',error);
        return callback({errors:[
          {
            status:'m004',
            source:{pointer:"libs/bums.getComments"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
    });
  }

  getComment(_id,callback){
    var self = this;
    console.log("Bums.getComments",_id);
    fetch('https://bumbuddy.herokuapp.com/api/get-comment',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({_id:_id})
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
        console.log('Bums.getComments',error);
        return callback({errors:[
          {
            status:'m004',
            source:{pointer:"libs/bums.getComments"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
    });
  }

  getBumsComments(data, callback){
    var self = this;
    //console.log("Bums.getBumsComments",data);
    fetch('https://bumbuddy.herokuapp.com/api/get-bums-comments',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({data:data})
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
        console.log('Bums.getBumsComments.erros',error);
        return callback({errors:[
          {
            status:'m005',
            source:{pointer:"libs/bums.getComments"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
    });
  }

  addComment(data,callback){
    var self = this;
    fetch('https://bumbuddy.herokuapp.com/api/add-comment',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.getComments"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  addReply(data,callback){
    var self = this;
    console.log("addReply data",data);
    fetch('https://bumbuddy.herokuapp.com/api/add-reply',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.getComments"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  report(data, callback){
    var self = this;
    fetch('https://bumbuddy.herokuapp.com/api/report',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.reports"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  delete(data, callback){
    var self = this;
    fetch('https://bumbuddy.herokuapp.com/api/delete',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.reports"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  getReplies(_id,callback){
    var self = this;
    fetch('https://bumbuddy.herokuapp.com/api/get-replies',
    {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({_id:_id})
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.getComments"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  getBums(callback){
    var self = this;
    fetch('https://bumbuddy.herokuapp.com/api/get-bums',
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        return callback(responseJson);
    }).catch((error) => {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.getComments"},
          title:"Unknown error",
          detail:error.message
        }
      ]});
    });
  }

  getUserNotifications(_id,callback){
    if(_id){
      fetch('https://bumbuddy.herokuapp.com/api/get-user-notifications',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({_id:_id})
      }).then((response) => response.json())
        .then((responseJson) => {
          return callback(responseJson);
      }).catch((error) => {
        return callback({errors:[
          {
            status:'m005',
            source:{pointer:"libs/bums.getComments"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
      });
    } else {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.getNotifications"},
          title:"No user was selected",
          detail:"No user was selected"
        }
      ]});
    }
  }

  getUserProfileInfo(_id,callback){
    if(_id){
      fetch('https://bumbuddy.herokuapp.com/api/get-userprofile',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({_id:_id})
      }).then((response) => response.json())
        .then((responseJson) => {
          return callback(responseJson);
      }).catch((error) => {
        return callback({errors:[
          {
            status:'m005',
            source:{pointer:"libs/bums.getComments"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
      });
    } else {
      return callback({errors:[
        {
          status:'m005',
          source:{pointer:"libs/bums.getNotifications"},
          title:"No user was selected",
          detail:"No user was selected"
        }
      ]});
    }
  }

  vote(_id, point, token, callback){
    console.log(_id);
    if(_id && point && token){
      var self = this;
      fetch('https://bumbuddy.herokuapp.com/api/vote-comment',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          _id:_id,
          vote:point,
          token:token
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          return callback(responseJson);
      }).catch((error) => {
        return callback({errors:[
          {
            status:'m009',
            source:{pointer:"libs/bums.vote"},
            title:"Unknown error",
            detail:error.message
          }
        ]});
      });
    } else {
      return callback({errors:[
        {
          status:'m008',
          source:{pointer:"libs/bums.vote"},
          title:"Unknown error",
          detail:"Please try again latter"
        }
      ]});
    }

  }

  getBums_dev(callback){
    return callback([
      {
        "_id": "595f5789e18fec110049d4d2"
        ,
        "name": "Let see",
        "address": "4 Nguyen Tat Thanh",
        "zipcode": "",
        "coordinate": {
            "longitude": -122.01980697,
            "latitude": 37.32840089999998
        },
        "created_by": {
            "_id": "57fca5de4ce7a0110064ae6d",
            "name": "Duc Viet Phan",
            "email": "joomdaily@gmail.com",
            "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13315230_10205973406004658_3891134162845750917_n.jpg?oh=19f9ca64ddc5fabef4c0dbfa5c474346&oe=58A9C315",
            "type": "facebook"
        },
        "created_date": {
            "$date": "2017-07-07T09:42:33.112Z"
        }
      }
    ])
  }
}


module.exports = Bums;
