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
  ActivityIndicator,
  Slider,
  Text,
  ScrollView,
  Button,
  TextInput
} from 'react-native';

var Auth = new AuthLib();
var Cache = new CacheLib();

class SettingView extends Component {
  constructor(props){
    super(props);
    this.state = {
      radius:2,
      username:this.props.screenProps.user.username,
      showActivitiIndicator:false
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      tabBarLabel: '',
      headerTitle:'Settings',
      title:'Settings',
      headerRight:(
        <Button title="Save"  onPress={()=>navigation.state.params.onSaveClick()} />
      )
    }

  };

  componentDidMount(){
    var self = this;
    self.props.navigation.setParams({
      onSaveClick:self._onSaveClick.bind(this)
    });
    Cache.getUserSetting(function(data){
      self.setState({
        radius:data.radius
      });
    })
  }

  _onSaveClick(){
    var self = this;
    self.setState({
      showActivitiIndicator:true
    });
    if(self.props.screenProps.user && self.props.screenProps.user.token){
      var data = {
        settings:{
          radius:self.state.radius
        }
      }

      if(self.props.screenProps.user.username !== self.state.username){
        data.username = self.state.username;
      }
      Auth.updateProfile(self.props.screenProps.user.token,data,function(result){
        if(result && result.errors){
          self.setState({
            showActivitiIndicator:false
          });
          Alert.alert(
            result.errors[0].title,
            result.errors[0].detail,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        } else {
          AsyncStorage.setItem('user',JSON.stringify(result.data[0]),function(err){
            console.log("AsyncStorage.setItem",err);
            self.props.screenProps.signIn(function(val){
              self.setState({
                showActivitiIndicator:false
              });
            });

          });
        }
      });
    } else {
      AsyncStorage.setItem('userSetting',JSON.stringify({radius:self.state.radius}),function(err){
        console.log("AsyncStorage.setItem",err);
        self.setState({
          showActivitiIndicator:false
        });
      });
    }
  }

  _onValueChange(e){
    var self = this;
    self.setState({
      radius:e
    });
  }

  _inputChangeText(text){
    var self = this;
    //var newText = text.replace('\n', 'b')
    var newText = text.replace(/[^a-z0-9._-]/gi, '_').replace(/_{2,}/g, '_').replace(/-{2,}/g, '_').toLowerCase();
    self.setState({
      username:newText
    });
  }

  render(){
    var self = this;

      return (
        <ScrollView style={styles.container}>
          <Loading visible={this.state.showActivitiIndicator} />

          <Text style={styles.settingLable}>Profile</Text>
          <View style={styles.settingSessionContainer}>
            {self.props.screenProps.user &&
              <TextInput
                style={[styles.textInput]}
                onChangeText={(text) => self._inputChangeText(text)}
                value={self.state.username}
                returnKeyType={"done"}
                placeholderTextColor={"#ccc"}
              />
            }
          </View>

          <Text style={styles.settingLable}>Bums radius</Text>
          <View style={styles.settingSessionContainer}>
            <View style={{alignItems:'center'}}><Text>{self.state.radius} Km</Text></View>
              <Slider
              onValueChange={self._onValueChange.bind(this)}
              onSlidingComplete={(e)=>(console.log("SettingView",e))}
              style={styles.radiusBarLength} step={1} value={self.state.radius} minimumValue={1} maximumValue={10} />

          </View>

        </ScrollView>
      )

  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    backgroundColor:"#e8e8e8"
  },
  radiusBarLength:{
    flex:1
  },
  settingSessionContainer:{
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    borderColor: '#ccc',
    marginBottom:10,
    paddingTop:10,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:"#fff"
  },
  settingLable:{
    color:"#bbb"
  },
  loginBtn:{
    marginBottom:10
  },
  textInput:{
    height:25,
  }
});
module.exports = SettingView;
