
import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Text
 } from 'react-native';
 import Icon from 'react-native-vector-icons/Ionicons';
 import BumsLib from '../../../libs/Bums';
 import LoadingView from '../../../commons/loading';
 var BumModel = new BumsLib();

class morebtn extends Component {
  constructor(props){
    super(props);
    this.state = {
      loadingVisible:false,
      loadingName:"loading",
      loadingAnimation:true
    };
  }

  componentDidMount(){}

  more(){
    var self = this;
    var actions = [
      {text: 'Cancel', onPress: () => console.log('Report this bum')}
    ];

    switch (self.props._typeOfBtn) {
      case "comment":
        actions.unshift({text: 'Report comment', onPress: () => {
          if(self.props._user){
            Alert.alert(
                  "Report",
                  "",
                  [
                    {text: 'It\'s spam', onPress: () => self._report("spam")},
                    {text: 'It\'s inappropriate', onPress: () => self._report("inappropriate")},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  ],
                  { cancelable: false }
                )
          } else {
            self.props.navigation.navigate("ProfileStack");
          }
        }});
        if(self.props._user && self.props._user.email && self.props._user.token && self.props._createdBy === self.props._user.email){
          actions.unshift({text: 'Delete comment', onPress: () => self._delete()});
        }
        break;
      case "bum":
        actions.unshift({text: 'Report doublicate', onPress: () => {
          if(self.props._user){
            self._report("doublicate");
          } else {
            self.props.navigation.navigate("ProfileStack");
          }
        }});
        break;
      case "reply":
        actions.unshift({text: 'Report reply', onPress: () => {
          if(self.props._user){
            Alert.alert(
                  "Report",
                  "",
                  [
                    {text: 'It\'s spam', onPress: () => self._report("spam")},
                    {text: 'It\'s inappropriate', onPress: () => self._report("inappropriate")},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  ],
                  { cancelable: false }
                )
          } else {
            self.props.navigation.navigate("ProfileStack");
          }
        }});
        if(self.props._user && self.props._user.email && self.props._user.token && self.props._createdBy === self.props._user.email){
          actions.unshift({text: 'Delete reply', onPress: () => self._delete()});
        }
        break;
    }
    if(self.props._id){
      Alert.alert(
        '',
        'Please choose option below',
        actions,
        { cancelable: true }
      );
    } else {
      Alert.alert(
        'Error',
        'There was an error, Please try again later',
        [{text: 'Cancle', onPress: () => console.log('Report this bum')}],
        { cancelable: true }
      );
    }

  }

  _delete(){
    var self = this;
    if(self.props._user && self.props._user.email && self.props._user.token){
      var data = {
        _id:self.props._id,
        token:self.props._user.token,
        typeOfDelete:self.props._typeOfBtn,
      };
      self.setState({
        loadingVisible:true
      });
      BumModel.delete(data,function(result){
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
          console.log("morebtn._report",result);
          self.setState({
            loadingName:"done"
          });
        }
      })
    } else {
      self.props.navigation.navigate("ProfileStack");
    }
  }

  _report(description){
    var self = this;
    self.setState({
      loadingVisible:true
    });
    if(self.props._user && self.props._user.email && self.props._user.token){
      var data = {
        _id:self.props._id,
        token:self.props._user.token,
        typeOfReport:self.props._typeOfBtn,
        description:description
      };


      BumModel.report(data,function(result){
        if(result && result.errors){
          self.setState({
            loadingName:"error"
          });
        } else {
          self.setState({
            loadingName:"done"
          });
          console.log("morebtn._report",result);
        }
      })
    } else {
      self.props.navigation.navigate("ProfileStack");
    }
  }

  _closeBtn(){
    this.setState({
      loadingVisible:!this.state.loadingVisible
    });
  }

  render(){
    var self = this;
    return(
      <View>
        <TouchableOpacity onPress={()=>{self.more()}}>
          <Icon style={{padding:5}} size={20} name="ios-more" />
        </TouchableOpacity>
        <LoadingView close={self._closeBtn.bind(this)} name={self.state.loadingName} visible={self.state.loadingVisible} loadingAnimation={self.state.loadingAnimation} />
      </View>
    );
  }
}
  const styles = StyleSheet.create({
    modalContainer:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:'rgba(241,242,243,0.7)'
    },
    middleBox:{
      backgroundColor:"#fff",
      padding:10,
      borderRadius:10,
      width:300,
      height:100,
      borderColor:"#eee",
      alignItems:"center",
      borderWidth:StyleSheet.hairlineWidth
    }
  });
module.exports = morebtn;
