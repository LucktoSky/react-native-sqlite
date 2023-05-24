import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const NewButton = (props) => {
  return (
    <TouchableOpacity
      className={props.bgStyle}
      onPress={props.customClick}>
      <Text className={props.textStyle}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default NewButton;