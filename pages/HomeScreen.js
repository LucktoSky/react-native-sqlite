import React, { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import NewButton from './components/newButton';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('mydb.db');

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
              []
            );
          }
        }
      );
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <Text className= "text-2xl p-2">SQLite Example</Text>
          <NewButton
            title="Register"
            bgStyle = "bg-green-600 my-1 rounded mx-20 p-3"
            textStyle = "text-center text-xl text-white"
            customClick={() => navigation.navigate('Register',{user_id:0})}
          />
          <NewButton
            title="View All"
            bgStyle = "bg-green-600 my-1 mx-20 rounded p-3"
            textStyle = "text-center text-xl text-white"
            customClick={() => navigation.navigate('ViewAll')}
          />
          
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;