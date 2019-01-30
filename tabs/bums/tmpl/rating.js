import React, { Component } from 'react';
import MapView from 'react-native-maps';
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
  Alert,
  ActivityIndicator
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BumsLib from '../../../libs/Bums';
import CacheLib from '../../../libs/Cache';
import Morebtn from '../../comments/tmpl/morebtn';
var BumsModel = new BumsLib();
var Cache = new CacheLib();

class Rating extends Component {
  constructor(props){
    super(props);
    this.state = {
      showActivitiIndicator:true,
      bum:{
        name:'loading...',
        address:'loading...',
        overall_rating:{
          total_rates:0,
          average_overall_rating:0
        },
        bum_rating:{
          level1:0,
          level2:0,
          level3:0,
          level4:0,
          level5:0
        }
      }
    }
  }

  _getBum(){
    var self = this;
    //console.log("rating._getBum._id",self.props);
    BumsModel.getRating(self.props._id,function(result){
      if(result && result.errors){
        Alert.alert(
          result.errors[0].title,
          result.errors[0].detail,
          [
            {text: 'Cancel', onPress: () => console.log('rating Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        )
      } else {
        console.log("rating._getBum",result);
        var bum = {
          bum:{
            name:result.data[0].name,
            address:result.data[0].address,
            overall_rating:{
            total_rates:result.data[0].total_rates,
            average_overall_rating:result.data[0].average_overall_rating
          },
          bum_rating:{
            level1:result.data[0].level1,
            level2:result.data[0].level2,
            level3:result.data[0].level3,
            level4:result.data[0].level4,
            level5:result.data[0].level5
          }
        },
        showActivitiIndicator:false
      }
      self.setState(bum);
      Cache.setRating(self.props._id,bum);
    }
  });
  }

  componentDidMount(){
    //this._getBum();
    var self = this;
    if(this.props.showRating){
      Cache.getRating(self.props._id,function(flag,result){
        //console.log("rating._getBum.componentDidMount","componentDidMount");
        if(flag){
          self.setState(result);
        } else {
          self._getBum();
        }
      });
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    var self = this;
    if(nextProps.showRating){
      Cache.getRating(self.props._id,function(flag,result){
        console.log("rating._getBum.componentWillReceiveProps",flag);
        if(flag){
          self.setState(result);
        } else {
          self._getBum();
        }
      });
    }

    if(nextProps.refreshing){
      self._getBum();
    }
  }

  _addComment(){
    var self = this;
    if(self.props._user){
      self.props.navigation.navigate("AddCommentPage",{_id:self.props.navigation.state.params._id, update:self.props._onRefresh})
    } else {
      self.props.navigation.navigate('ProfileStack');
    }
  }

  _renderAddCommentButton(){
    var self = this;
    if(self.props.showButton){
      return(
        <TouchableOpacity onPress={self._addComment.bind(this)} style={styles.containerTextYourBum}>
          <View style={styles.textInputContainer}>
            <Text style={[styles.textInput]}>
              Text your bum
            </Text>
          </View>
          <View style={styles.actionContainer}>
            <View style={styles.actionLeft}>
              <View style={styles.button}>
                <Icon style={styles.buttonIcon} size={25} name="ios-image" color="#2f8ef9"/>
                <Text>Photo</Text>
              </View>

            </View>
            <View style={styles.actionRight}>
              <View style={styles.button}>
                <Icon style={styles.buttonIcon} size={25} name="ios-pulse-outline" color="orange"/>
                <Text>Rate this gun</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );

    }
  }
  //{uri:self.props.bum.links[0].url}
  render() {
    var self = this;
    if(self.props.showRating && !this.state.showActivitiIndicator){
      const starRating = function(){
        var stars = [];
        for(var i=0;i < 5; i++){
          if(i < self.state.bum.overall_rating.average_overall_rating){
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
        <View>
          <View style={styles.container}>
            <View style={styles.bumDetailInfoHeaderContainer}>
              <View>
                <Text style={styles.bumInfoContainerNameText}>{self.state.bum.name}</Text>
                <Text style={styles.bumInfoContainerAddressText}>{self.state.bum.address}</Text>
              </View>
              <Morebtn navigation={self.props.navigation} _id={self.props._id} _typeOfBtn="bum" _user={self.props._user} />
            </View>
            <View style={styles.overallRating}>
              <Text style={styles.overallRatingText}>General Hygiene:</Text>
              <View style={styles.starRating}>
                {starRating.map(function(obj, i){

                    return (
                      <Icon style={styles.star} key={i} size={20} name={obj}/>
                    );
                  })}
                <Text style={styles.star}> - {self.state.bum.overall_rating.total_rates} rates</Text>
              </View>
            </View>
            <View style={styles.bumRating}>
              <Text style={styles.bumRatingText}>Bum Rating:</Text>
              <View>
                <Text style={styles.bumRatingText}>Trickle - {self.state.bum.bum_rating.level1} rates</Text>
                <Text style={styles.bumRatingText}>Stream flow - {self.state.bum.bum_rating.level2} rates</Text>
                <Text style={styles.bumRatingText}>Garden hose - {self.state.bum.bum_rating.level3} rates</Text>
                <Text style={styles.bumRatingText}>Heave torrent - {self.state.bum.bum_rating.level4} rates</Text>
                <Text style={styles.bumRatingText}>Geyser - {self.state.bum.bum_rating.level5} rates</Text>
              </View>
            </View>
          </View>
          {self._renderAddCommentButton()}
        </View>
      );
    } else {
      return(
        <View style={styles.container}>
          <ActivityIndicator animating={this.state.showActivitiIndicator}></ActivityIndicator>
        </View>
      );
    }


  }
}
const styles = StyleSheet.create({
  container:{
    backgroundColor:"#fff",
    padding:5
  },
  bumDetailInfoHeaderContainer:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingBottom:5,
    borderBottomWidth:StyleSheet.hairlineWidth,
    marginBottom:5
  },
  bumInfoContainerNameText:{
    fontSize:14
  },
  bumInfoContainerAddressText:{
    fontSize:12
  },
  starRating:{
    flexDirection:'row',
    alignItems:'center'
  },
  star:{
    color:"#888",
  },
  overallRating:{
    flexDirection:'column'

  },
  overallRatingText:{
    marginRight:5,
    color:"#888",
  },
  bumRating:{
    flexDirection:'column'
  },
  bumRatingText:{
    color:"#888"
  },
  imageProfile:{
    width:250,
    height: 250
  },
  containerTextYourBum:{
    padding:5,
    backgroundColor:"white",
    marginBottom:5,
    marginTop:5,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderColor:"#ccc"
  },
  textInputContainer:{
    paddingBottom:5,
    flexDirection:'column',
    justifyContent:"center",
    height:40
  },
  textInput:{
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    backgroundColor:"#f1f1f1",
    color:"#aaa"
  },
  actionContainer:{
    flexDirection: 'row',
    paddingTop:5,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderColor:"#ccc"
  },
  actionLeft:{
    flex:1,
    paddingRight:2
  },
  actionRight:{
    flex:1,
    paddingLeft:2,
    borderLeftWidth:StyleSheet.hairlineWidth,
    borderColor:"#ccc"
  },
  button:{
    flexDirection: 'row',
    alignItems:"center",
    padding:5
  },
  buttonIcon:{
    marginRight:10
  },

});
module.exports = Rating;
