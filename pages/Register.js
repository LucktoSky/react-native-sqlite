import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('mydb.db');

const RegisterUser = ({ navigation, route }) => {
  let [userName, setUserName] = useState('');
  let [userContact, setUserContact] = useState('');
  let [userAddress, setUserAddress] = useState('');

  let register_user = () => {
    console.log(userName, userContact, userAddress);

    if (!userName) {
      alert('Please fill name');
      return;
    }
    if (!userContact) {
      alert('Please fill Contact Number');
      return;
    }
    if (!userAddress) {
      alert('Please fill Address');
      return;
    }
    if(route.params.user_id==0){
        db.transaction(function (tx) {
            tx.executeSql(
              'INSERT INTO table_user (user_name, user_contact, user_address) VALUES (?,?,?)',
              [userName, userContact, userAddress],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'You are Registered Successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('ViewAll'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else alert('Registration Failed');
              }
            );
          });
    }
    else {
        db.transaction((tx) => {
            tx.executeSql(
              'UPDATE table_user set user_name=?, user_contact=? , user_address=? where user_id=?',
              [userName, userContact, userAddress, route.params.user_id],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'User updated successfully',
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('HomeScreen'),
                      },
                    ],
                    {cancelable: false},
                  );
                } else alert('Updation Failed');
              },
            );
          });
    }

  };
  let updateAllStates = (name, contact, address) => {
    setUserName(name);
    setUserContact(contact);
    setUserAddress(address);
  };
  useEffect(()=>{
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_user where user_id = ?',
        [route.params.user_id],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            updateAllStates(res.user_name, res.user_contact, res.user_address);
          } else {
            updateAllStates('', '', '');
          }
        },
      );
    });
  },[])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Enter Name"
                value={userName}
                onChangeText={
                  (userName) => setUserName(userName)
                }
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Enter Contact No"
                value={'' + userContact}
                onChangeText={
                  (userContact) => setUserContact(userContact)
                }
                maxLength={10}
                keyboardType="numeric"
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Enter Address"
                value={userAddress}
                onChangeText={
                  (userAddress) => setUserAddress(userAddress)
                }
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{ textAlignVertical: 'top', padding: 10 }}
              />
              <Mybutton title="Submit" customClick={register_user} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterUser;