
import React, { Component } from 'react';
import {
  StyleSheet,
  View
 } from 'react-native';
 import CommentsView from '../../comments/comments';

class bumdetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      refreshing:false
    };
    //console.log('bumdetail.constructor',this.props.screenProps);
  }

  static navigationOptions = {
    headerTitle:'Bum Guns',
    title:'Bum Guns'
  };

  componentDidMount(){

    //setTimeout(()=>this.setState({statusBarHeight: 1}),500);
    //this._getBumDetail(state.params._id);
  }

  render() {
    const {state} = this.props.navigation;
    var self = this;
    return(
      <View style={styles.container}>
        <CommentsView screenProps={{user:self.props.screenProps.user}} _id={state.params._id} navigation={this.props.navigation}/>
      </View>
    );
  }
}
  const styles = StyleSheet.create({
    container:{
      flex:1
    }
  });
module.exports = bumdetail;
