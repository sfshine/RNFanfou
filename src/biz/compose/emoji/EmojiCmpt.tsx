import React from "react";
import {Text,FlatList,TouchableOpacity} from 'react-native';
import {emojiStr} from "~/biz/compose/emoji/emoji";

const emojiArray = emojiStr.split(" ")
export default ({onChoose}) => {
    return <FlatList
        style={{
            height: "40%",
            flexGrow:0}}
        data={emojiArray}
        renderItem={({ item }) => (
            <TouchableOpacity
                onPress ={()=>{
                    onChoose(item)
                }}
                style={{
                    alignItems:"center",
                    justifyContent:"center",
                    flex:1,
                }}>
                <Text style={{fontSize:30}}>{item}</Text>
            </TouchableOpacity>
        )}
        //Setting the number of column
        numColumns={8}
        keyExtractor={(item, index) => index.toString()}
    />
}
