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
import CacheLib from '../../../libs/Cache';
import Loading from '../../../commons/loading';
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
      showActivitiIndicator:false
    }
  }

  static navigationOptions = ({navigation}) => {
    return {tabBarLabel: '',
    headerTitle:'Add Comment',
    title:'Add Comment',
    headerRight:(
      <Button title={'Post'} onPress={()=>navigation.state.params.onCreateClick()} />
    ),}
  };

  _onCreateClick(){
    var self = this;

    if(!self.state.showActivitiIndicator){
      if(self.state.inputText || self.state.imageSource){
        self.setState({
          showActivitiIndicator:true
        });
        var commentData = {
          token:self.props.screenProps.user.token,
          bum:{
            _id:this.props.navigation.state.params._id
          },
          description:self.state.inputText,
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



        if(self.state.imageSource){
          UploadModel.imageUploadToCloud(self.state.imageSource,function(response){
            if(response && response.errors){
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
                    showActivitiIndicator:false
                  });
                  self.props.navigation.state.params.update();
                  self.props.navigation.goBack();
                }
              })
              //self.props.navigation.navigate('BumDetail',{_id:result.data._id});
            }
          });
        } else if(self.state.inputText){
          BumsModel.addComment(commentData,function(result){
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
              //console.log("commentform.addcomment",result);
              self.setState({
                showActivitiIndicator:false
              });
              self.props.navigation.state.params.update();
              self.props.navigation.goBack();
            }
          })
        }

      } else {
        Alert.alert(
          "Input missing",
          "Please enter text or choose an image to comment on bum",
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        )
      }
    }

  }

  _getImageFromPhone(){
    var self = this;
    var options = {
      title: 'Select Image',
      quality: 1.0,
      maxWidth: 800,
      maxHeight: 800,
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    if(self.state.imageSource != null){
      options.customButtons.push({name: 'Remove', title: 'Remove image'});
    }
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        self.setState({
          imageSource:null
        });
      }
      else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        self.setState({
          imageSource:source
        });

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
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
      <ScrollView style={styles.container}>
        <Loading visible={this.state.showActivitiIndicator} />
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder={'Text your bum'}
            style={[styles.textInput]}
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
        <View style={styles.actionContainer}>
          <View style={styles.actionLeft}>
            <TouchableOpacity onPress={()=>self._getImageFromPhone()} style={styles.button}>
              {self.state.imageSource ?
                (
                  <Image style={{width:25,height:25,marginRight:10,borderRadius:10}}  source={self.state.imageSource} />
                ) : (
                  <Icon style={styles.buttonIcon} size={25} name="ios-image" color="#4267b2"/>
                )

              }

              <Text>Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.actionLeft}>
            <TouchableOpacity onPress={()=>self._ratingThisBum()} style={styles.button}>
              <Icon style={styles.buttonIcon} size={25} name="ios-pulse-outline" color="#4267b2"/>
              <Text>Rate this bum</Text>
            </TouchableOpacity>
            <View>
            { self.state.ratingThisBum &&
              <Icon style={styles.buttonIcon} size={25} name="ios-checkmark-outline" color="#4267b2"/>
            }
            </View>
          </View>
        </View>
        { self.state.ratingThisBum &&
          <View style={[styles.ratingContainers]}>
            <View style={[styles.ratingContainerTop,{alignItems:"center",marginTop:20}]}>
              <Text>Overall Rating</Text>
              <View style={styles.starRatingContainerTop}>
                {starRating.map(function(obj, i){

                  return (
                    <Icon onPress={()=>self._starPress(i+1)} style={styles.star} color="#4267b2" key={i} size={25} name={obj}/>
                  );
                })}
              </View>

            </View>
            <View style={styles.ratingContainerBottom}>
              <Picker
                style={styles.pickerBorderColor}
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
const styles = StyleSheet.create({
  container:{
    backgroundColor:"white",
    flex:1
  },
  loadingContainer:{
    height:50
  },
  actionContainer:{
    flexDirection: 'row',
    paddingTop:5,
    paddingBottom:5,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderColor:"#ccc",

  },
  ratingContainers:{
    paddingRight:10,
    paddingLeft:10,
  },
  ratingContainerTop:{
    borderTopWidth:StyleSheet.hairlineWidth,
    borderRightWidth:StyleSheet.hairlineWidth,
    borderLeftWidth:StyleSheet.hairlineWidth,
    borderColor:"#4267b2"
  },
  starRatingContainerTop:{
    flexDirection:'row'
  },
  ratingContainerBottom:{
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:"#4267b2"
  },
  pickerBorderColor:{
    borderColor:"#aaa"
  },
  actionLeft:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  actionRight:{
    flex:1,
    paddingLeft:2,
  },
  button:{
    flex:1,
    flexDirection: 'row',
    alignItems:"center",
    padding:5
  },
  buttonIcon:{
    padding:5,
    marginRight:10
  },
  textInputContainer:{
    paddingBottom:5,
      padding:5
  },
  textInput:{
    padding:5,
    height:150,
    fontSize:18
  }
});
module.exports = CommentForm;
