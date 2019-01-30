
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
 import ModalMenu from '../../../commons/modalmenu';
 import LoadingView from '../../../commons/loading';
 var BumModel = new BumsLib();

class morebtn extends Component {
  constructor(props){
    super(props);
    this.state = {
      loadingVisible:false,
      loadingName:"loading",
      loadingAnimation:true,
      mainModalVisibility:false,
      secondaryModalVisibility:false,
      mainActions:[],
      secondaryActions:[]
    };
  }

  componentDidMount(){}

  toggleMainModal(){
    var self = this;
    self.setState({
      mainModalVisibility:!self.state.mainModalVisibility
    });
  }

  toggleSecondaryModal(){
    var self = this;
    self.setState({
      secondaryModalVisibility:!self.state.secondaryModalVisibility
    });
  }

  more(){
    var self = this;
    var mainActions = [];
    var secondaryActions = [];
    switch (self.props._typeOfBtn) {
      case "comment":
        if(self.props._user){
          mainActions = [
            {
              name:'Report comment',
              func: self.toggleSecondaryModal.bind(this)
            }
          ];
          secondaryActions = [
            {
              name:'It\'s spam',
              func:self._reportSpam.bind(this)
            },
            {
              name:'It\'s inappropriate',
              func:self._reportInappropriate.bind(this)
            }
          ];
            
          } else {
            self.props.navigation.navigate("ProfileStack");
          }
        
        if(self.props._user && self.props._user.email && self.props._user.token && self.props._createdBy === self.props._user.email){
          mainActions.unshift({name: 'Delete comment', func: self._delete.bind(this)});
        }
        break;
      case "bum":
        if(self.props._user){
          mainActions = [{
            name: 'Report doublicate',
            func: self._reportDoublicate.bind(this)
          }];
          
        } else {
          self.props.navigation.navigate("ProfileStack");
        }
        break;
      case "reply":
        if(self.props._user){
          mainActions = [
            {
              name:'Report comment',
              func: self.toggleSecondaryModal.bind(this)
            }
          ];
          secondaryActions = [
            {
              name:'It\'s spam',
              func:self._reportSpam.bind(this)
            },
            {
              name:'It\'s inappropriate',
              func:self._reportInappropriate.bind(this)
            }
          ];
        } else {
          self.props.navigation.navigate("ProfileStack");
        }
        if(self.props._user && self.props._user.email && self.props._user.token && self.props._createdBy === self.props._user.email){
          mainActions.unshift({name: 'Delete reply', func:self._delete.bind(this)});
        }
        break;
    }
    self.setState({
      mainActions: mainActions,
      secondaryActions: secondaryActions
    });
    if(self.props._user){
      self.toggleMainModal();
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

  _reportDoublicate(){
    var self = this;
    self._report('doublicate');
  }

  _reportSpam(){
    var self = this;
    self._report('spam');
  }

  _reportInappropriate(){
    var self = this;
    self._report('inappropriate');
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
        <ModalMenu
          toggleModal={self.toggleMainModal.bind(this)}
          visible={self.state.mainModalVisibility}
          menus={self.state.mainActions}
        />
        <ModalMenu
          toggleModal={self.toggleSecondaryModal.bind(this)}
          visible={self.state.secondaryModalVisibility}
          menus={self.state.secondaryActions}
        />
        <TouchableOpacity onPress={()=>{self.more()}}>
          <Icon style={{padding:10}} size={20} name="ios-more" />
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
