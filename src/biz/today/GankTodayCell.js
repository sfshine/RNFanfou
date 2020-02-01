import React, { Component } from 'react';
import { TouchableHighlight, View, Image, Text, StyleSheet } from 'react-native';

export default class GankTodayCell extends Component {

  render() {
    let { item } = this.props;
    console.log("item: " + item);
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          {
            item.images && item.images.length > 0 ?
              <Image
                source={{ uri: item.images[0] }}
                style={styles.thumbnail}
              /> : null
          }
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{item.desc}</Text>
            <Text style={styles.year}>{item.createdAt}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    borderBottomWidth: 1,
  },
  thumbnail: {
    width: 110,
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'left',
  },
  year: {
    textAlign: 'left',
    color: '#777777',
    marginTop: 10,
  },
  horizontalView: {
    flexDirection: 'row',
    marginTop: 10
  },
  titleTag: {
    color: '#666666',
  },
  score: {
    color: '#ff8800',
    fontWeight: 'bold',
  },
  name: {
    color: '#333333',
    flex: 1
  },
});