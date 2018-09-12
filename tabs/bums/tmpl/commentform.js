import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { NavigationActions } from 'react-navigation'
import {
  StyleSheet,
  AppRegistry,
  View,
  Dimensions,
  TouchableOpacity,
  Navigator,
  Text,
  ScrollView,
  TextInput,
  Image,
  ListView,
  Switch,
  Platform,
  Button,
  Alert,
  Picker,
  ActivityIndicator
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var ImagePicker = require('react-native-image-picker');
import BumsLib from '../../../libs/Bums';
import UploadLib from '../../../libs/Upload';
import Css from '../../../libs/Css';
import CacheLib from '../../../libs/Cache';
import Loading from '../../../commons/loading';
import ModalMenu from '../../../commons/modalmenu';

var UploadModel = new UploadLib();
var BumsModel = new BumsLib();
var Cache = new CacheLib();
var { width, height } = Dimensions.get('window');



class CommentForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible:false,
      inputText:"",
      imageSource:null,
      level:null,
      ratingThisBum:false,
      overall_rating:0,
      showActivitiIndicator:false,
      showModalMenu:false,
      videoSource:null
    }
    //this.toggleCameraMenu.bind(this);
  }

  static navigationOptions = ({navigation}) => {
    return {tabBarLabel: '',
    headerTitle:'Add Comment',
    title:'Add Comment',
    headerRight:(
      <Button title={'Post'} onPress={()=>navigation.state.params.onCreateClick()} />
    ),}
  };

  toggleCameraMenu(){
    this.setState({
      showModalMenu:!this.state.showModalMenu
    });
  }

  toogleActivityIndicator(){
    this.setState({
      showActivitiIndicator:!this.state.showActivitiIndicator
    });
  }

  _onCreateClick(){
    var self = this;

    if(!self.state.showActivitiIndicator){
      self.setState({
        showActivitiIndicator:true
      });
      var inputText = self.state.inputText;
      var imageSource = self.state.imageSource;
      var videoSource = self.state.videoSource;
      var commentData = {
        token:self.props.screenProps.user.token,
        bum:{
          _id:this.props.navigation.state.params._id
        },
        description:inputText,
        media:[]
      };

      if(self.state.ratingThisBum){
        if(self.state.overall_rating > 0){
          commentData.overall_rating = self.state.overall_rating;
        }

        if(self.state.level){
          commentData.bum_rating = self.state.level;
        }
      }

      if(inputText || imageSource || videoSource){
        self.setState({
          imageSource:null,
          inputText:null,
          videoSource:null,
          ratingThisBum:false
        });
        if(imageSource){
          UploadModel.imageUploadToCloud(self.state.imageSource,function(response){
            if(response && response.errors){
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
              commentData.media.push(response);
              //alert("finished upload image");
              BumsModel.addComment(commentData,function(result){
                self.setState({
                    showActivitiIndicator:false
                  });
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
                  self.props.navigation.state.params.update();
                  self.props.navigation.goBack();
                }
              })
              //self.props.navigation.navigate('BumDetail',{_id:result.data._id});
            }
          });
        } else if (videoSource) {
          UploadModel.videoUploadToCloud(self.state.videoSource,function(response){
            console.log(response);
            if(response && response.errors){
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
              commentData.media.push(response);
              //alert("finished upload image");
              BumsModel.addComment(commentData,function(result){
                self.setState({
                    showActivitiIndicator:false
                  });
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
                  
                  self.props.navigation.state.params.update();
                  self.props.navigation.goBack();
                }
              })
              self.props.navigation.navigate('BumDetail',{_id:result.data._id});
            }
          });
        } else if(inputText){
          BumsModel.addComment(commentData,function(result){
            self.setState({
                showActivitiIndicator:false
              });
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
              self.props.navigation.state.params.update();
              self.props.navigation.goBack();
            }
          })
        }

      } else {
        self.setState({
          showActivitiIndicator:false
        });
        Alert.alert(
          "Input missing",
          "Please enter text, choose a media to comment on bum",
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        )
      }
    }

  }

  launchVideoCamera(){
    var self = this;
    var options = {
      mediaType:'video',
      videoQuality:'high',
      durationLimit:3
    };
    ImagePicker.launchCamera(options, (response)  => {
    // Same code as in above section!
    //console.log('launchVideoCamera',response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        self.setState({
          videoSource:response
        });
      }
    });
  }

  launchPictureCamera(){
    var self = this;
    var options = {
      quality: 1.0,
      maxWidth: 800,
      maxHeight: 800,
      allowsEditing:true
    };
    ImagePicker.launchCamera(options, (response)  => {
    // Same code as in above section!
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        self.setState({
          imageSource:source
        });
      }
    });
  }

  launchImageLibrary(){
    var self = this;
    var options = {
      
    };
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        self.setState({
          imageSource:source
        });
      }
    });
  }

  launchVideoLibrary(){
    var self = this;
    var options = {
      mediaType:'video',
      durationLimit:3,
      allowsEditing:true
    };
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        self.setState({
          videoSource:response
        });
      }
    });
  }

  componentDidMount(){
    var self = this;
    self.props.navigation.setParams({
      onCreateClick:self._onCreateClick.bind(this)
    });
  }

  componentWillMount() {
  }

  _ratingThisBum(){
    this.setState({
      ratingThisBum:!this.state.ratingThisBum
    });
  }

  _inputChangeText(text){
    var self = this;
    //var newText = text.replace('\n', 'b')
    self.setState({
      inputText:text
    });
  }

  _starPress(i){
    this.setState({
      overall_rating:i
    });
  }
  //{uri:self.props.bum.links[0].url}
  render() {
    var self = this;

    const starRating = function(){
      var stars = [];
      for(var i=0;i < 5; i++){
        if(i < self.state.overall_rating){
          stars.push('ios-star');
        } else {
          stars.push('ios-star-outline');
        }

        if(i == 4){
          //console.log('stars',stars)
          return stars;
        }
      }
    }();
    return(
      <ScrollView style={Css.container}>
        <Loading close={self.toogleActivityIndicator.bind(this)} visible={this.state.showActivitiIndicator} />
        <ModalMenu
          toggleModal={self.toggleCameraMenu.bind(this)}
          visible={self.state.showModalMenu}
          menus={[
            {
              name:'Take picture',
              func:self.launchPictureCamera.bind(this)
            },
            {
              name:'Take video(3s)',
              func:self.launchVideoCamera.bind(this)
            },
            {
              name:'Choose from photo library',
              func:self.launchImageLibrary.bind(this)
            },
            {
              name:'Choose from video library',
              func:self.launchVideoLibrary.bind(this)
            }
            ]}/>
        <View style={Css.textInputContainer}>
          <TextInput
            placeholder={'Text your bum'}
            style={[Css.textInput]}
            onChangeText={(text) => this._inputChangeText(text)}
            value={this.state.inputText}
            multiline={true}
            returnKeyType={"done"}
            blurOnSubmit={true}
            placeholderTextColor={"#ccc"}
            editable={!this.state.showActivitiIndicator}
          >
          </TextInput>
        </View>
        <View style={Css.actionContainer}>
          <View style={Css.actionLeft}>
            <TouchableOpacity onPress={()=>self.toggleCameraMenu()} style={Css.button}>
              {self.state.imageSource ?
                (
                  <Image style={{width:25,height:25,marginRight:10,borderRadius:10}}  source={self.state.imageSource} />
                ) : (
                  <Icon style={Css.buttonIcon} size={25} name="ios-image" color="#4267b2"/>
                )

              }

              <Text>Photo / Video</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={Css.actionContainer}>
          <View style={Css.actionLeft}>
            <TouchableOpacity onPress={()=>self._ratingThisBum()} style={Css.button}>
              <Icon style={Css.buttonIcon} size={25} name="ios-pulse-outline" color="#4267b2"/>
              <Text>Rate this gun</Text>
            </TouchableOpacity>
            <View>
            { self.state.ratingThisBum &&
              <Icon style={Css.buttonIcon} size={25} name="ios-checkmark-outline" color="#4267b2"/>
            }
            </View>
          </View>
        </View>
        { self.state.ratingThisBum &&
          <View style={[Css.ratingContainers]}>
            <View style={[Css.ratingContainerTop,{alignItems:"center",marginTop:20}]}>
              <Text>Overall Rating</Text>
              <View style={Css.starRatingContainerTop}>
                {starRating.map(function(obj, i){

                  return (
                    <Icon onPress={()=>self._starPress(i+1)} style={Css.star} color="#4267b2" key={i} size={25} name={obj}/>
                  );
                })}
              </View>

            </View>
            <View style={Css.ratingContainerBottom}>
              <Picker
                style={Css.pickerBorderColor}
                selectedValue={this.state.level}
                onValueChange={(itemValue, itemIndex) => this.setState({level: itemValue})}>
                <Picker.Item label="--- Bum Rating ---" value={null} />
                <Picker.Item label="Trickle" value="level1" />
                <Picker.Item label="Stream flow" value="level2" />
                <Picker.Item label="Garden hose" value="level3" />
                <Picker.Item label="Heavy torrent" value="level4" />
                <Picker.Item label="Geyser" value="level5" />
              </Picker>
            </View>
          </View>
        }

      </ScrollView>
    );
  }
}
module.exports = CommentForm;
