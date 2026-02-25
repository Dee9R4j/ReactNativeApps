import React, { useRef } from "react";
import { View, TextInput, StyleSheet, Pressable, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchIcon } from "@assets/images/events";

interface SearchBoxProps {
  search: string;
  onSearchChange: (text: string) => void;
  placeholder: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  search,
  onSearchChange,
  placeholder,
}) => {
  const inputRef = useRef<TextInput>(null);

  const clearSearch = () => {
    onSearchChange("");
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchContainer}>
      <SearchIcon width={20} height={20} />
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#B9B9B9"
        value={search}
        onChangeText={onSearchChange}
      />
      {search.length > 0 && (
        <Pressable onPress={clearSearch} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#888" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 48,
    borderColor: "#ffffffff",
    borderWidth: 1,
    backgroundColor: "#black",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 13,
    color: "white",
    fontSize: 16,
    fontFamily: 'CantoraOne-Regular',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SearchBox;
