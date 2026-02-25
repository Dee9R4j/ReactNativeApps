import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PolygonButton } from "@/components/PolygonButton";
import ActiveFilterCloud from "@assets/images/food/stallsreen-active-filterbtn-cloud.svg";
import { r_w, r_h, r_t } from "@/utils/responsive";

type Point = { x: number; y: number };

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  button1Label?: string;
  button2Label?: string;
  button1Value?: string;
  button2Value?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedValues,
  onValueChange,
  button1Label = "VK Lawns",
  button2Label = "M Lawns",
  button1Value = "VK Lawns",
  button2Value = "M Lawns",
}) => {
  const handleButtonPress = (value: string) => {
    console.log("Filter button pressed:", value);
    console.log("Current selectedValues:", selectedValues);

    if (selectedValues.includes(value)) {
      // Deselect if already selected
      const newValues = selectedValues.filter((v) => v !== value);
      console.log("Deselecting, new values:", newValues);
      onValueChange(newValues);
    } else {
      // Add to selection
      const newValues = [...selectedValues, value];
      console.log("Selecting, new values:", newValues);
      onValueChange(newValues);
    }
  };

  const handleClose = () => {
    // Clear all selections and close
    onValueChange([]);
    onClose();
  };

  if (!visible) return null;

  const buttonWidth = r_w(120);
  const buttonHeight = r_h(44);
  const skewOffset = r_w(10);

  // Button 1 shape: top-left skewed inward, bottom-right skewed inward
  const button1Shape = {
    p1: { x: 0, y: 0 },
    p2: { x: buttonWidth, y: 0 },
    p3: { x: buttonWidth - skewOffset, y: buttonHeight },
    p4: { x: 0, y: buttonHeight },
  };

  // Button 2 shape: top-right skewed inward, bottom-left skewed inward (mirror of button 1)
  const button2Shape = {
    p1: { x: skewOffset, y: 0 },
    p2: { x: buttonWidth, y: 0 },
    p3: { x: buttonWidth, y: buttonHeight },
    p4: { x: 0, y: buttonHeight },
  };

  const isButton1Selected = selectedValues.includes(button1Value);
  const isButton2Selected = selectedValues.includes(button2Value);

  return (
    <View style={styles.dropdownOverlay} pointerEvents="box-none">
      <View style={styles.dropdownContainer}>
        <View style={styles.buttonRow}>
          {/* Button 1 */}
          <View style={styles.filterBtnWrap} pointerEvents="box-none">
            {isButton1Selected && (
              <ActiveFilterCloud
                width={r_w(120)}
                height={r_h(44)}
                style={styles.activeCloud}
                pointerEvents="none"
              />
            )}
            <PolygonButton
              p1={button1Shape.p1}
              p2={button1Shape.p2}
              p3={button1Shape.p3}
              p4={button1Shape.p4}
              onPress={() => {
                console.log("Button 1 clicked!", button1Value);
                handleButtonPress(button1Value);
              }}
              width={buttonWidth}
              height={buttonHeight}
              fillColor={isButton1Selected ? "#FFFFFF" : "transparent"}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  isButton1Selected && styles.filterBtnTextActive,
                ]}
              >
                {button1Label}
              </Text>
            </PolygonButton>
          </View>

          {/* Button 2 */}
          <View style={styles.filterBtnWrap} pointerEvents="box-none">
            {isButton2Selected && (
              <ActiveFilterCloud
                width={r_w(120)}
                height={r_h(44)}
                style={styles.activeCloud}
                pointerEvents="none"
              />
            )}
            <PolygonButton
              p1={button2Shape.p1}
              p2={button2Shape.p2}
              p3={button2Shape.p3}
              p4={button2Shape.p4}
              onPress={() => {
                console.log("Button 2 clicked!", button2Value);
                handleButtonPress(button2Value);
              }}
              width={buttonWidth}
              height={buttonHeight}
              fillColor={isButton2Selected ? "#FFFFFF" : "transparent"}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  isButton2Selected && styles.filterBtnTextActive,
                ]}
              >
                {button2Label}
              </Text>
            </PolygonButton>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownOverlay: {
    width: "100%",
    zIndex: 1,
  },
  dropdownContainer: {
    marginHorizontal: r_w(16),
    paddingVertical: r_h(5),
    paddingHorizontal: r_w(8),
    borderRadius: r_w(8),
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: r_w(12),
    flexWrap: "wrap",
  },
  filterBtnWrap: {
    width: r_w(110),
    height: r_h(44),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeCloud: {
    position: "absolute",
    zIndex: 2,
    left: r_w(-6),
    right: r_w(-6),
  },
  filterBtnText: {
    zIndex: 3,
    color: "white",
    fontSize: r_t(14),
    fontWeight: "600",
    textAlign: "center",
  },
  filterBtnTextActive: {
    color: "#000",
  },
});

export default FilterModal;
