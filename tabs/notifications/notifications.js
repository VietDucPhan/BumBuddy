
import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  Dimensions,
  TouchableOpacity,
  Navigator,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginView from '../profile/tmpl/login';
import BumsLib from '../../libs/Bums';

var BumModel = new BumsLib();

class notifications extends Component {
  constructor(props){
    super(props);
    this.state = {
      refreshing:false,
      notifications:[],
      showActivitiIndicator:true
    };
    //console.log('bumdetail.constructor',this.props.screenProps);
  }

  static navigationOptions = ({navigation}) => {
    console.log('Map.navigationOptions',navigation);
    return {tabBarLabel: 'Notifications',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-notifications' : 'ios-notifications-outline'} />
    ),
    headerTitle:'Notification',
    title:'Notification'
    }
  }

  _getNotification(){
    var self = this;
    //console.log('bumdetail._getBumDetail',_id);
    if(this.props.screenProps.user && this.props.screenProps.user._id){
      BumModel.getUserNotifications(this.props.screenProps.user._id,function(result){
        console.log("_getNotification", result);
        if(result && result.errors){
          Alert.alert(
            result.errors[0].title,
            result.errors[0].detail,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          );
        } else {
          self.setState({
            refreshing: false,
            showActivitiIndicator:false,
            notifications:result.data
          });
        }
      });
    }
  }

  componentDidMount(){
    var self = this;
    self._getNotification();

    //setTimeout(()=>this.setState({statusBarHeight: 1}),500);
    //this._getBumDetail(state.params._id);
  }

  _onRefresh() {
    var self = this;

    self.setState({refreshing: true});
    self._getNotification();
  }

  navigateToUserProfile(_id, username){
    var self = this;
    self.props.navigation.navigate("UserDetailStack",{user_id:_id,username:username});
  }

  navigateToComment(_id){
    var self = this;
    self.props.navigation.navigate("CommentStack",{commentID:_id});
  }

  render() {
    const {state} = this.props.navigation;
    var self = this;
    var notificationList = [];
    notificationList.push(
      <View style={styles.notificationContainer}>
        <TouchableOpacity>
          <View style={[styles.notificationContentConatiner]}>
            <View style={styles.noNotificationContent}>
              <Text style={styles.noNotificationText}>No notification</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
    if(self.state.notifications.length > 0){
      notificationList = [];
      
      self.state.notifications.map(function(obj, i){
        if(obj && obj.from && obj.from.profile_picture){
          notificationList.push(
            <View style={styles.notificationContainer}>
              <TouchableOpacity onPress={()=>self.navigateToUserProfile(obj.from._id,obj.from.username)}>
                <View style={styles.notificationProfileContainer}>
                  <Image source={{uri: obj.from.profile_picture.secure_url}}
             style={{width: 40, height: 40, borderRadius:20}} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>self.navigateToComment(obj.onID)}>
                <View style={[styles.notificationContentConatiner]}>
                  <View style={styles.notificationContent}><Text>{obj.body}</Text></View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }
      })
    }
    if(this.props.screenProps.user == null){
      return (
        <LoginView signOut={self.props.screenProps.signOut} signIn={self.props.screenProps.signIn}/>
      )
    } else {
      return(
        <ScrollView
        style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
        {notificationList}
        </ScrollView>
      );
    }
  }
}
  const styles = StyleSheet.create({
    container:{
      flex:1
    },
    notificationContainer:{
      flex:1,
      flexDirection: 'row',
      backgroundColor:"#fff",

    },
    notificationProfileContainer:{
      backgroundColor: "#fff",
      padding:5,

    },
    notificationContentConatiner:{
      flex:1,
      justifyContent: 'center',
    },
    notificationContent:{
      flexDirection: 'row'
    },
    noNotificationContent:{
      flex:1
    },
    noNotificationText:{
      flex:1,
      textAlign: 'center',
      width: Dimensions.get('window').width
    }
  });
module.exports = notifications;
