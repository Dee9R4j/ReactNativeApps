import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";
import { useFastStore } from "@/state/fast/fast";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import {
  BackIcon,
  BookmarkEmpty,
  BookmarkDot,
  FilterCross,
  FilterIcon,
} from "@assets/images/events";
import DrawerMenuIcon from "@assets/images/homescreen/drawermenu-icon.svg";
import BarcodeIcon from "@assets/images/homescreen/barcode-icon.svg";
import { IEventProps } from "@/utils/events/types";
import SearchBox from "../SearchBox";
import BlackToTransparentGradient from "./Gradient";

interface SearchFilterBarProps {
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  filterVisible: boolean;
  setFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showBookmarks: boolean;
  setShowBookmarks: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  filterVisible,
  setFilterVisible,
  search,
  setSearch,
}) => {
  const hasActiveFilters = useMemo(
    () => selectedCategories.length > 0,
    [selectedCategories]
  );

  const handleFilterPress = useCallback(() => {
    if (filterVisible && hasActiveFilters) {
      setSelectedCategories([]);
      setFilterVisible(false);
    } else {
      setFilterVisible((prev) => !prev);
    }
  }, [filterVisible, hasActiveFilters]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchContainer}>
        <SearchBox
          search={search}
          onSearchChange={setSearch}
          placeholder="Search Events"
        />
        <Pressable
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
          ]}
          onPress={handleFilterPress}
        >
          {filterVisible ? (
            <FilterCross width={32} height={26} />
          ) : (
            <FilterIcon width={32} height={20} />
          )}
        </Pressable>
      </View>

      {filterVisible && (
        <ScrollView
          horizontal
          style={styles.filterDropdown}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {(categories ?? []).map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategorySelect(category)}
                style={[
                  styles.filterBox,
                  isSelected && styles.categorySelectedItem,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categorySelectedText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      {/* <BlackToTransparentGradient /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 13,
    alignItems: "center",
    gap: 12,
  },
  filterButton: {
    borderRadius: 10,
    borderWidth: 1,
  },
  filterDropdown: {
    flexDirection: "row",
    paddingTop: 15,
  },
  filterScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 13,
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "CantoraOne-Regular",
  },
  categorySelectedText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "CantoraOne-Regular",
  },
  categorySelectedItem: {
    backgroundColor: "#fff",
  },
  filterBox: {
    padding: 5,
    // paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "#fff",
    borderWidth: 1,
  },
  filterButtonActive: {},
});

export default SearchFilterBar;
