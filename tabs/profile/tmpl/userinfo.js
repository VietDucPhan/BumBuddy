
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ActivityIndicator
 } from 'react-native';

 import BumsLib from '../../../libs/Bums';
 var BumModel = new BumsLib();

class userinfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      showActivitiIndicator:true,
      userInfo:null
    };
    //console.log('bumdetail.constructor',this.props.screenProps);
  }

  _getUserInfo(){
    var self = this;
    if(self.props.user_id){
      BumModel.getUserProfileInfo(self.props.user_id,function(result){
        console.log("_getUserInfo",result);
        if(result && result.errors){
          Alert.alert(
            result.errors[0].title,
            result.errors[0].detail,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        } else {
          self.setState({
            userInfo:result.data[0],
            showActivitiIndicator:false
          });
        }
      });
    }
  }

  componentDidMount(){
    var self = this;
    self._getUserInfo();
    //navigationOptions.headerTitle = self.props.navigation.state.params.username
    //setTimeout(()=>this.setState({statusBarHeight: 1}),500);
    //this._getBumDetail(state.params._id);
  }

  render() {
    const {state} = this.props.navigation;
    var self = this;
    if(self.state.userInfo){
      return(
        <View style={styles.profileNavigatorContainer}>
          <View>
          {
            self.state.userInfo && self.state.userInfo.profile_picture &&
            <Image source={{uri: self.state.userInfo.profile_picture.secure_url}}
       style={[{width:50,height:50}]} />
          }
          </View>

          <View style={styles.profileName}>
            <Text>{self.state.userInfo.username}</Text>
          </View>
        </View>
      );
    } else {
      return(
        <View>
          <ActivityIndicator animating={self.state.showActivitiIndicator}></ActivityIndicator>
        </View>
      );

    }

  }
}
  const styles = StyleSheet.create({
    container:{
      flex:1
    },
    profileNavigatorContainer:{
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: '#ccc',
      //marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:5,
      paddingRight:5,
      backgroundColor:"#fff",
      flexDirection: 'row'
    },
    profileName:{
      marginLeft:10
    },
  });
module.exports = userinfo;
