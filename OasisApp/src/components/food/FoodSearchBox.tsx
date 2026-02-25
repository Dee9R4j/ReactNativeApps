import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchIconSvg from "@assets/images/food/search-icon.svg";
import FilterIconSvg from "@assets/images/food/filter-icon.svg";
import { r_w, r_h, r_t } from "@/utils/responsive";

interface FoodSearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showFilter?: boolean;
  onFilterPress?: () => void;
  width?: any;
  filterOpen?: boolean;
}

const FoodSearchBox: React.FC<FoodSearchBoxProps> = ({
  value,
  onChangeText,
  placeholder,
  showFilter = false,
  onFilterPress,
  width = r_w(306),
  filterOpen = false,
}) => {
  const inputRef = React.useRef<TextInput>(null);

  const handleClearText = () => {
    onChangeText("");
    // Blur the input to remove focus and hide keyboard
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { width }]}>
        <View style={styles.iconContainer}>
          <SearchIconSvg width={24} height={22} fill="#B9B9B9" />
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B9B9B9"
          blurOnSubmit
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
          textAlignVertical="center"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClearText}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={26} color="#B9B9B9" />
          </TouchableOpacity>
        )}
      </View>

      {showFilter && onFilterPress && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          {filterOpen ? (
            <Ionicons name="close" size={28} color="#FFF" />
          ) : (
            <FilterIconSvg width={28} height={18} fill="#FFF" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  searchContainer: {
    height: r_h(45),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    borderWidth: 2,
    borderColor: "#FFF",
    paddingHorizontal: r_w(12),
  },
  iconContainer: {
    marginRight: r_w(8),
  },
  input: {
    flex: 1,
    color: "#B9B9B9",
    fontFamily: "Proza Libre",
    fontSize: r_t(14),
    fontWeight: "400",
    lineHeight: r_h(18),
    letterSpacing: 1,
    paddingVertical: Platform.select({ ios: 0, default: 0 }),
    height: "100%",
    includeFontPadding: false,
    paddingTop: r_h(3),
    paddingLeft: r_w(5),
  },
  clearButton: {
    width: r_w(24),
    height: r_h(24),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: r_w(4),
  },
  filterButton: {
    width: r_w(40),
    height: r_h(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    position: "relative",
    left: r_w(8),
  },
});

export default FoodSearchBox;
