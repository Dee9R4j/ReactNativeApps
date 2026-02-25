import { GeneralButton } from "@/components/GeneralButton";
import { r_t, r_w } from "@/utils/responsive";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";

const { width, height } = Dimensions.get("window");
import ArrowBack from "@assets/images/onboarding/arrow-back.svg";
import ArrowForward from "@assets/images/onboarding/arrow-forward.svg";
import { router } from "expo-router";
import { useFastStore } from "@/state/fast/fast";

const slides = [
  { id: "1", image: require("@assets/images/onboarding/Onboarding.png") },
  { id: "2", image: require("@assets/images/onboarding/Onboarding-1.png") },
  { id: "3", image: require("@assets/images/onboarding/Onboarding-2.png") },
  { id: "4", image: require("@assets/images/onboarding/Onboarding-3.png") },
  { id: "5", image: require("@assets/images/onboarding/Onboarding-4.png") },
  { id: "6", image: require("@assets/images/onboarding/Onboarding-5.png") },
];

export default function OnboardingScreen() {
  const pref = useFastStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

  // 🔹 Animate indicator only when index changes
  useEffect(() => {
    animateIndicatorFill();
  }, [currentIndex]);

  // 🔹 Full slide animation (used for auto transitions)
  const animateSlide = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // 🔹 Next slide handler (auto/manual)
  const completeOnboarding = () => {
    pref.setHasSeenOnboarding(true);
    pref.setShouldShowOnboarding(false);
    router.replace("/private/home");
  };

  const handleNext = (isAuto = false) => {
    if (currentIndex < slides.length - 1) {
      if (isAuto) {
        // Auto: full fade + slide animation
        animateSlide();
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        // Manual: only fade, no vertical movement
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          flatListRef.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true,
          });
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }
    } else if (!isAuto) {
      completeOnboarding();
    }
  };

  // 🔹 Progress fill animation
  const animateIndicatorFill = () => {
    fillAnim.setValue(0);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 5000, // 5s per slide
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && currentIndex < slides.length - 1) {
        handleNext(true); // auto move
      }
    });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.slide,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <ImageBackground
              source={item.image}
              resizeMode="cover"
              style={styles.imageBackground}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          </Animated.View>
        )}
      />

      <View style={styles.indicatorWrapperMain}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => {
            const fillWidth =
              i < currentIndex
                ? 1 // Past slides are full
                : i === currentIndex
                  ? fillAnim // Current slide is animating
                  : 0;

            return (
              <View key={i} style={styles.indicatorWrapper}>
                <View style={styles.indicatorBackground}>
                  <Animated.View
                    style={[
                      styles.indicatorFill,
                      {
                        transform: [{ scaleX: fillWidth }],
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* 🔹 Slide Count just below the bars */}
        <View style={{ alignSelf: "flex-end", paddingRight: r_w(45) }}>
          <Text style={styles.slideCountText}>
            {currentIndex + 1} of {slides.length}
          </Text>
        </View>
      </View>

      {/* 🔹 Bottom Controls */}
      <View style={styles.bottomContainer}>
        {currentIndex === slides.length - 1 ? (
          <View
            style={{ width: "100%", alignItems: "center", bottom: r_t(45) }}
          >
            <GeneralButton
              disabled={false}
              onPress={handleSkip}
              textButton="Get Started"
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, currentIndex === 0 && { opacity: 0 }]}
              onPress={handleBack}
              disabled={currentIndex === 0}
            >
              <ArrowBack />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNext()}
            >
              <ArrowForward />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  slide: {
    width,
    height,
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  indicatorWrapperMain: {
    position: "absolute",
    top: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6, // Adds small gap between bars and text
  },
  indicatorWrapper: {
    width: 40,
    height: 4,
    marginHorizontal: 5,
    overflow: "hidden",
    borderRadius: 2,
  },
  indicatorBackground: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    overflow: "hidden",
  },
  indicatorFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#930000ff",
    transform: [{ scaleX: 0 }],
    transformOrigin: "left center",
  },

  slideCountText: {
    color: "#FFFFFF",
    fontSize: r_t(14),
    fontFamily: "Quattrocento Sans",
    textAlign: "center",
    opacity: 0.9,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: {
    color: "#BABABA",
    fontSize: r_t(16),
    fontFamily: "Quattrocento Sans",
    textDecorationLine: "underline",
  },
});
