/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import firebase from 'react-native-firebase';

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
  lazy:false
}

if(Platform.OS === "ios"){
  tabNavigatorOptions.lazy = true;
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
  UserDetailStack:{screen:UserDetailStack}
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
      user:null
    };
    // this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
    //this._signIn = this._signIn.bind(this)
  }

  _signOut(){
    var self = this;
    console.log('App._signOut',this.state);
    Auth.signOutBoth(function(response){
      self.setState({user:null});
    });
  }

  _signIn(callback){
    var self = this;
    Auth.isLogedIn(function(response){
      console.log('App._signIn');
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
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
  }

  render() {
    var self = this;
    return (
        <StackPage ref={nav => { this.navigator = nav; }} screenProps={{
          user:self.state.user,
          signIn:self._signIn.bind(this),
          signOut:self._signOut.bind(this)
        }} />
      );
  }
}
