import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Modal
} from 'react-native';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import AuthLib from './libs/Auth';
import CacheLib from './libs/Cache';
import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
//Tabs
import ProfileTab from './tabs/profile/profile';
import CommentsTab from './tabs/comments/comments';
import MapTab from './tabs/map/map';
import NotificationTab from './tabs/notifications/notifications';
//Stacks
import CommentDetailStack from './tabs/comments/tmpl/commentdetail';
import BumDetailStack from './tabs/bums/tmpl/bumdetail';
import AddCommentStack from './tabs/bums/tmpl/commentform';
import CreateBumStack from './tabs/bums/tmpl/createbumform';
import SearchStack from './tabs/search/search';
import SettingsStack from './tabs/profile/tmpl/settings';
import CommentStack from './tabs/comment/comment';
import UserDetailStack from './tabs/profile/tmpl/userdetail';
import WebViewStack from './commons/webview';


const tabBarOptions = {
  showLabel:false,
  showIcon:true,
  style: {
    backgroundColor:'#fff'
  },
  indicatorStyle:{
    display:'none'
  }
}

const tabsManagement = {
  Comments : { screen: CommentsTab },
  Map:{screen:MapTab},
  Notificiations:{screen:NotificationTab},
  Profile : { screen: ProfileTab }
}

var tabNavigatorOptions = {
  tabBarOptions:tabBarOptions,
  tabBarPosition:'bottom',
  animationEnabled:false,
  lazy:true
}

const Tabs = TabNavigator(
  tabsManagement,
  tabNavigatorOptions
);

const stackMangement = {
  Main:{screen:Tabs},
  CommentDetail:{screen:CommentDetailStack},
  BumDetail:{screen:BumDetailStack},
  CreateBumForm:{screen:CreateBumStack},
  SearchPage:{screen:SearchStack},
  AddCommentPage:{screen:AddCommentStack},
  ProfileStack : { screen: ProfileTab },
  SettingsStack:{ screen:SettingsStack },
  CommentStack:{screen:CommentStack},
  UserDetailStack:{screen:UserDetailStack},
  WebViewStack:{screen:WebViewStack}
}
const StackPage = StackNavigator(stackMangement);

var Auth = new AuthLib();
var Cache = new CacheLib();



type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isConnected:null,
      user:null,
      announcementVisible:true
    };
    const channel = new firebase.notifications.Android.Channel('bum-buddy', 'Bum Buddy', firebase.notifications.Android.Importance.High)
      .setDescription('Bum Buddy notification');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
    // this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
    //this._signIn = this._signIn.bind(this)
  }

  _signOut(){
    var self = this;
    //console.log('App._signOut',this.state);
    Auth.signOutBoth(function(response){
      self.setState({user:null});
    });
  }

  _signIn(callback){
    var self = this;
    Auth.isLogedIn(function(response){
      //console.log('App._signIn');
      if(response){
          self.setState({
          user:response
        });
        Cache.setUserSetting(response.settings);
        return callback(true);
      }
      return callback(false);
    });
  }

  componentDidMount() {
    var self = this;
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (!enabled) {
          firebase.messaging().requestPermission().then(() => {
              // User has authorised  
          })
          .catch(error => {
            console.log(error);
            // User has rejected permissions  
          });
        }
      });
    Cache.getPushToken(function(cacheToken){
      console.log('cacheToken',cacheToken);
      if(!cacheToken){
        //console.log('cacheToken in if',cacheToken);
        firebase.messaging().getToken().then(fcmToken => {
          //console.log('getToken',fcmToken);
          if (fcmToken) {
                  Cache.setPushToken(fcmToken);
              }
        });
      }
    });
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      // Process your token as required
      Cache.getPushToken(function(cacheToken){
        if(fcmToken && fcmToken != cacheToken){
          Cache.setPushToken(fcmToken);
        }
      });
    });
    this._signIn(function(res){
      
    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      // Get the action triggered by the notification being opened
      const notification: Notification = notificationOpen.notification;
      //console.log(notification.data.content);
        if(notification && notification.data && notification.data.content){
          var data_payload = JSON.parse(notification.data.content);
          if(data_payload.typeOfNotification == "voted" || data_payload.typeOfNotification == "replied"){
            //console.log('data_payload.onID',data_payload.onID);
            if(self.navigator){
              self.navigator.dispatch(
                NavigationActions.navigate({ routeName: "CommentStack", params:{commentID:data_payload.onID} })
              );
            }
          }
        }
    });
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        console.log('notificationDisplayedListener',notification);
    });
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // listen when app in the foreground
      if(notification && notification.notificationId){
        let title = 'Bum Buddy';
        let body = 'You have a new notification';
        let id = notification.notificationId;
        let data = {};
        var setParamsAction = NavigationActions.setParams({
          key:'Notificiations',
          params:{
            isNewNotification:true
          }
        });
        self.navigator.dispatch(setParamsAction);
        //console.log('new notification');
        if(notification.title){
          title = notification.title;
        }

        if(notification.body){
          body = notification.body;
        }

        if(notification.data){
          data = notification.data;
        }
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(id)
          .setTitle(title)
          .setBody(body)
          .setData(data)
          .setSound('default')
          .android.setChannelId('bum-buddy')
          .android.setPriority(firebase.notifications.Android.Priority.Max)
          .android.setVibrate([1000, 1000, 1000]);
        firebase.notifications().displayNotification(localNotification);
      }
    });
    firebase.notifications().getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        
        if (notificationOpen) {
          const action = notificationOpen.action;
          const notification: Notification = notificationOpen.notification;  
          if(notification.data && notification.data.content){
            var data_payload = JSON.parse(notification.data.content);

            if(data_payload.typeOfNotification == "voted" || data_payload.typeOfNotification == "replied"){
              if(self.navigator){
                self.navigator.dispatch(
                  NavigationActions.navigate({ routeName: "CommentStack", params:{commentID:data_payload.onID} })
                );
              }
            }
          }
        }
      });
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.notificationOpenedListener();
    this.notificationDisplayedListener();
    this.notificationListener();
  }

  render() {
    var self = this;
    return (
      <StackPage ref={nav => { self.navigator = nav; }} screenProps={{
        user:self.state.user,
        signIn:self._signIn.bind(this),
        signOut:self._signOut.bind(this)
      }} />
    );
  }
}
