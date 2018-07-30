import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  Text
 } from 'react-native';

class DateFormat extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
  }

  formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    if(year == currentYear){
      return monthNames[monthIndex] + ' '+ day ;
    } else {
      return monthNames[monthIndex] + ' '+ day + ' ' + year;
    }

  }
  //{uri:self.props.bum.links[0].url}
  render() {
    var self = this;
    var renderDate = self.formatDate(new Date(self.props.created_date));
    var seconds = Math.floor((new Date() - new Date(self.props.created_date))/1000);
    var minute = Math.floor(seconds/60) ;
    var hours = Math.floor(minute/24);

    if(seconds < 5){
      renderDate = "just now";
    }else if(seconds >= 5 && seconds < 60){
      renderDate = seconds + " seconds ago";
    } else if(minute < 60){
      renderDate = minute + " minutes ago";
    } else if(hours < 24){
      renderDate = hours + " hours ago";
    } else{

    }
    return(
      <Text style={{fontSize:10,color:"#ccc"}}>{renderDate}</Text>
    );

  }
}
module.exports = DateFormat;
