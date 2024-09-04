import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-remix-icon';
import { Image } from 'react-native';
import { router, usePathname } from 'expo-router';

type FormField = {
  value?: string;
  placeholder?: string;
  handleChangeText?: (e: any) => void;
  otherStyles?: string;
  keyboardType?: string;
  initialQuery?: string | string[] | undefined;
};

const SearchInput = ({ value, placeholder, handleChangeText, otherStyles, keyboardType, initialQuery }: FormField) => {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  return (
    <View className={`flex-row items-center rounded-md px-2 py-1 ${otherStyles}`}>
      <TextInput
        className="flex-1 items-center justify-center text-xs font-normal"
        value={query}
        placeholder={placeholder}
        placeholderTextColor={'#CDCDE0'}
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity>
        <Icon name="search-2-line" size={16}></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
