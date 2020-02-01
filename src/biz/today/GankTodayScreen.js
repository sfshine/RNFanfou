import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as GankTodayAction from './GankTodayAction';
import GankTodayCell from "./GankTodayCell";

class GankTodayScreen extends React.PureComponent {

  componentDidMount() {
    console.log('GankTodayScreen mounted');
    // this.props.loadDatas();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          keyExtractor={(item, index) => String(index)}
          renderItem={this._renderItem}
        />
      </View>
    )
  }

  _renderItem = ({ item }) => {//这里把data的item数据取出来了!
    console.log(item);
    return (
      <GankTodayCell
        item={item}
        onPress={() => {
          console.log('点击了item：' + item.desc);
          this.props.navigation.navigate('Detail', {
            title: item.desc,
            url: item.url
          });
        }}
      />
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect(
  (state) => ({
    loading: state.gankToday.loading,
    errorMessage: state.gankToday.errorMessage,
    isSuccess: state.gankToday.isSuccess,
    data: state.gankToday.data
  }),
  (dispatch) => ({
    loadDatas: () => dispatch(GankTodayAction.loadToday())
  })
)(GankTodayScreen)