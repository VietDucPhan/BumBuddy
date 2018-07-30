
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
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl
 } from 'react-native';
 var { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import BumsLib from '../../libs/Bums';
import CacheLib from '../../libs/Cache';
var BumsModel = new BumsLib();
var Cache = new CacheLib();

class commentdetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      seachText:"",
      bums:[],
      bumsSearchByText:[],
      showActivitiIndicator:true,
      refreshing:false
    };
    this._searchInputChangeText.bind(this);
  }
  static navigationOptions = {
    tabBarLabel: '',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-search' : 'ios-search-outline'} />
    )
  };

  getSurroundBum(){
    var self = this;
    navigator.geolocation.getCurrentPosition (
      (position) => {
        console.log("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);


        Cache.getUserSetting(function(result){
          var data = {
            coordinate:[position.coords.longitude, position.coords.latitude],
            radius:result.radius
          };
          console.log("getUserSetting",result);
          BumsModel.getSurroundBum(data,function(result){
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
              console.log("getSurroundBum",result);
              self.setState({
                bums:result.data,
                showActivitiIndicator:false,
                refreshing:false
              });
            }
          });
        });

      },
      function(error){console.log('map._locatorOnPress',error)}
    );
  }

  _onRefresh(){
    this.setState({
      refreshing:true
    });
    this.getSurroundBum();
  }

  _searchInputChangeText(text){
    var self = this;
    self.setState({
      seachText:text,
      showActivitiIndicator:true
    });
    if(text && text !== ""){
      BumsModel.searchBumByName(text,function(result){
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
            bumsSearchByText:result.data,
            showActivitiIndicator:false
          });
        }
      });
    } else {
      self.setState({
        showActivitiIndicator:false
      });
    }

  }

  _addNewBum(){
    var self = this;
    if(self.props.screenProps.user){
      self.props.navigation.navigate('CreateBumForm',{bumID:0,bumNameText:self.state.seachText});
    } else {
      self.props.navigation.navigate('ProfileStack');
    }

  }

  componentDidMount(){
    var self = this;
    self.getSurroundBum();
  }

  render() {
    var self = this;
    return(
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <Icon size={20} name={'ios-search-outline'} />
          <TextInput
            multiline = {false}
            style={styles.searchInput}
            onChangeText={(text) => this._searchInputChangeText(text)}
            placeholder={'Where are you?'}
            value={this.state.seachText}
          />
        </View>
        {this.state.showActivitiIndicator &&
          <ActivityIndicator animating={this.state.showActivitiIndicator}></ActivityIndicator>
        }

          <ScrollView style={styles.bumsAround}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
          {self.state.bumsSearchByText && self.state.bumsSearchByText[0] &&
            self.state.bumsSearchByText.map(function(obj, i){
                return (
                  <View key={i} style={styles.addNewBumContainer}>
                    <TouchableOpacity onPress={()=>self.props.navigation.navigate('BumDetail',{_id:obj._id})}>
                      <View style={styles.addNewBumContentContainer}>
                        <Icon style={styles.bumIcon} size={30} name={'ios-woman'} />
                        <Text>{obj.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
          }
            {self.state.bums && self.state.bums[0] &&
              <View style={styles.bumsNearYouContainer}>
                <Text style={styles.bumsNearYouText}>Bums near you</Text>
              </View>
            }
            {self.state.bums.map(function(obj, i){
                return (
                  <View key={i} style={styles.addNewBumContainer}>
                    <TouchableOpacity onPress={()=>self.props.navigation.navigate('BumDetail',{_id:obj._id})}>
                      <View style={styles.addNewBumContentContainer}>
                        <Icon style={styles.bumIcon} size={30} name={'ios-woman'} />
                        <Text>{obj.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            {this.state.seachText != "" &&
              <View style={styles.addNewBumContainer}>
                <TouchableOpacity onPress={()=>self._addNewBum()}>
                  <View style={styles.addNewBumContentContainer}>
                    <Icon style={styles.addNewIcon} size={30} name={'ios-add-circle-outline'} />
                    <Text>Add "{this.state.seachText}" to bum collection</Text>
                  </View>
                </TouchableOpacity>
              </View>
              }
          </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingRight:5,
    paddingLeft:5
  },
  searchInputContainer:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'#ccc',
    flexDirection:'row',
    alignItems:'center'

  },
  searchInput: {
    height: 40,
    paddingLeft:5,
    paddingRight:5,
    width:width
  },
  bumsNearYouContainer:{
    padding:2,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'#ccc',
  },
  bumsNearYouText:{
    color:"#ccc"
  },
  addNewBumContainer:{
    flex:1,
    paddingTop:5,
    paddingBottom:5,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:'#ccc',
    borderStyle:'solid'
  },
  addNewBumContentContainer:{
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  bumsAround: {
    flex:1
  },
  bumIcon:{
    paddingTop:5,
    paddingRight:15,
    paddingBottom:5,
    paddingLeft:15,
    borderRightWidth:StyleSheet.hairlineWidth,
    borderRightColor:'#ccc',
    marginRight:10,
    borderStyle:'dotted'
  },
  addNewIcon:{
    paddingTop:5,
    paddingRight:15,
    paddingBottom:5,
    paddingLeft:15,
    borderStyle:'dotted',
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#ccc',
    marginRight:10
  }
});
module.exports = commentdetail;
