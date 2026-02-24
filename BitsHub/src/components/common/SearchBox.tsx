import { r_h, r_t, r_w } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Keyboard, StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

interface SearchBoxProps { value: string; onChangeText: (text: string) => void; placeholder?: string; showFilter?: boolean; onFilterPress?: () => void; filterActive?: boolean; containerStyle?: StyleProp<ViewStyle>; inputStyle?: StyleProp<ViewStyle>; autoFocus?: boolean }

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChangeText, placeholder = "Search...", showFilter = false, onFilterPress, filterActive = false, containerStyle, inputStyle, autoFocus = false }) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.searchContainer, inputStyle]}>
        <Ionicons name="search" size={r_w(20)} color="#AFAFAF" style={styles.searchIcon} />
        <TextInput ref={inputRef} style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#AFAFAF" autoFocus={autoFocus} returnKeyType="search" onSubmitEditing={Keyboard.dismiss} autoCapitalize="none" autoCorrect={false} />
        {value.length > 0 && <TouchableOpacity onPress={() => { onChangeText(""); inputRef.current?.blur(); Keyboard.dismiss(); }} style={styles.clearButton} activeOpacity={0.7}><Ionicons name="close-circle" size={r_w(20)} color="#888" /></TouchableOpacity>}
      </View>
      {showFilter && onFilterPress && (
        <TouchableOpacity style={[styles.filterButton, filterActive && styles.filterButtonActive]} onPress={onFilterPress} activeOpacity={0.7}><Ionicons name={filterActive ? "close" : "options"} size={r_w(22)} color="#fff" /></TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: r_w(10), paddingHorizontal: r_w(20) },
  searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#2a2a2a", borderRadius: r_w(8), paddingHorizontal: r_w(12), height: r_h(44) },
  searchIcon: { marginRight: r_w(8) },
  input: { flex: 1, fontSize: r_t(16), color: "#fff", paddingVertical: 0 },
  clearButton: { padding: r_w(4), marginLeft: r_w(4) },
  filterButton: { width: r_w(44), height: r_h(44), borderRadius: r_w(8), backgroundColor: "#2a2a2a", justifyContent: "center", alignItems: "center" },
  filterButtonActive: { backgroundColor: "#4a4a4a" },
});

export default SearchBox;
