import React, {Component} from 'react';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthLib from '../../../libs/Auth';
import CacheLib from '../../../libs/Cache';
import Loading from '../../../commons/loading';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  ActivityIndicator
} from 'react-native';

var Auth = new AuthLib();
var Cache = new CacheLib();

class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      showActivitiIndicator:false
    }
    this.facebookLogin = this.facebookLogin.bind(this);
    this.processLogin = this.processLogin.bind(this);
  }
  facebookLogin(){
    var self = this;
    console.log("login.facebookLogin");
    self.setState({
      showActivitiIndicator:true
    });
    Auth.signInWithFacebook((res)=>self.processLogin(res));
  }
  googleLogin(){
    var self = this;
    self.setState({
      showActivitiIndicator:true
    });
    Auth.signInWithGoogle((res)=>self.processLogin(res));
  }

  processLogin(res){
    var self = this;
    console.log(res);
    self.setState({
          showActivitiIndicator:false
        });
    if(res.data){
      self.props.signIn(function(err){
        
      });
    } else if(res.errors && res.showMessage) {
      alert(res.msg);
    }
  }

  sendNotification(){
    Cache.getDeviceToken(function(token){
      //console.log("getDeviceToken",token);
      var tokenString = JSON.stringify(token);
      //alert("token: "+tokenString);
    });
  }

  _closeBtn(){
    var self = this;
    self.setState({
      showActivitiIndicator: !self.state.showActivitiIndicator
    });
  }

  render(){
    var self = this;
      return (
        <View style={styles.container}>
          <Loading close={self._closeBtn.bind(this)} visible={self.state.showActivitiIndicator} />
          <View style={styles.loginBtn}>
              <Icon.Button onPress={()=>self.facebookLogin()} name="facebook" backgroundColor="#4267b2">
                Login with Facebook
              </Icon.Button>
            </View>

            <Icon.Button onPress={()=>self.googleLogin()} name="google" backgroundColor="#dd4b39">
              Login with Google
            </Icon.Button>
        </View>
      )

  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  loginBtn:{
    marginBottom:10
  }
});
module.exports = LoginView;
