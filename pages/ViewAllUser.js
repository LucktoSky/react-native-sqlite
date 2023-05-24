import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, Pressable, Button, Alert } from 'react-native';
import NewButton from './components/newButton';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('mydb.db');
const ViewAllUser = ({navigation}) => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_user',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        }
      );
    });
  }, [flatListItems]);


  const updateUser =(user_id) => {
    navigation.navigate('Register', {user_id: user_id})
  }
  const deleteUser = (user_id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  table_user where user_id=?',
        [user_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ViewAll'),
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Please insert a valid User Id');
          }
        },
      );
    });
  };
  let listItemView = (item) => {
    return (
      
        <View
          key={item.user_id}
          className="bg-slate-200 p-3  border-b-2 border-green-600"
          >
          <Text>Name: {item.user_name}</Text>
          <Text>Contact: {item.user_contact}</Text>
          <Text>Address: {item.user_address}</Text>
          <View className="flex flex-row justify-center gap-4">
            <View>
              <Button
              onPress={()=>updateUser(item.user_id)}
              title='Update'
              />
            </View>
            <View>
              <NewButton
              bgStyle = "bg-red-500 p-2 rounded"
              textStyle = "text-white text-center" 
              onPress={()=>deleteUser(item.user_id)}
              title='Delete'
              /> 
            </View>
          </View>
        </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex">
          <View className="flex flex-row justify-end gap-1  bg-slate-200  border-b-2 border-green-600 py-1">
            <View>
              <Button
              className={"bg-red-500"}
              onPress={()=>navigation.navigate('HomeScreen')}
              title='go to Home'
              />
            </View>
            <View>
              <Button 
              onPress={()=>navigation.navigate('Register', {user_id: 1})}
              title='go to Register'
              /> 
            </View>
          </View>
        <View className="flex">
          <FlatList
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewAllUser;