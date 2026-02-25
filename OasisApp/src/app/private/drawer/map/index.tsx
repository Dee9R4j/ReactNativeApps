import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { getPlaceByName, places } from "@utils/places";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { getStatusBarHeight } from "@utils/safeArea";
import CustomHandle from "@components/CustomHandle";
import CustomDropdown from "@components/CustomDropdown";
import { useFonts } from "expo-font";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { r_h, r_t, r_w } from "@utils/responsive";
import {
  Defs,
  LinearGradient,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";
import { useFastStore } from "@/state/fast/fast";
import ScreenHeader from "@/components/ScreenHeader";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";

type LatLng = {
  latitude: number;
  longitude: number;
};

interface DropdownItem {
  label: string;
  value: string;
}

export default function aboutUs() {
  const isUserStoreTester = useFastStore((state) => state.signedStoreIn);
  const { showSnackbar } = useSnackbar();
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);

  const [sourceValue, setSourceValue] = useState<string | null>(null);
  const [isSourceFocus, setIsSourceFocus] = useState(false);
  const [destinationValue, setDestinationValue] = useState<string | null>(null);
  const [isDestinationFocus, setIsDestinationFocus] = useState(false);

  const navigation = useNavigation();
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const apiKey = Constants.expoConfig?.extra?.googleApiKey ?? "";

  const sourceData: DropdownItem[] = [
    { label: "MY LOCATION...", value: "Your Location" },
    ...places.map((place) => ({
      label: place.name,
      value: place.name,
    })),
  ];

  const dropdownData: DropdownItem[] = places.map((place) => ({
    label: place.name,
    value: place.name,
  }));

  const snapPoints = useMemo(() => ["30%", "45%", "75%"], []);

  const openTo40 = () => sheetRef.current?.snapToIndex(1);
  const openTo25 = () => sheetRef.current?.snapToIndex(0);

  const prefStore = useFastStore((state) => state.signedStoreIn);
  const handleBackPress = !prefStore
    ? () => navigation.dispatch(DrawerActions.jumpTo("index"))
    : () => router.replace("/private/home/events" as any);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentLocation) {
          setOrigin({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          });
        }
        setDestination(null);
        setSourceValue("Your Location");
        setDestinationValue(null);
      };
    }, [currentLocation]),
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to use this feature.",
        );
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const region: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      setCurrentLocation(region);
      setOrigin(region);
      setSourceValue("Your Location");
      setLoading(false);

      mapRef.current?.animateToRegion(region, 1000);
    })();
  }, []);

  function getBearing(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const dLon = toRad(endLng - startLng);
    const lat1 = toRad(startLat);
    const lat2 = toRad(endLat);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = Math.atan2(y, x);

    return (toDeg(brng) + 360) % 360;
  }

  useEffect(() => {
    if (mapRef.current && destination && origin) {
      const bearing = getBearing(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude,
      );
      mapRef.current.animateCamera(
        {
          center: { latitude: origin.latitude, longitude: origin.longitude },
          pitch: 60,
          heading: bearing,
          zoom: 18,
        },
        { duration: 1000 },
      );
    }
  }, [destination, origin]);

  const goToPlace = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000,
    );
  };

  const handleSource = (name: string) => {
    if (name === "Your Location" && currentLocation) {
      const coords = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      setOrigin(coords);
      goToPlace(coords.latitude, coords.longitude);
    } else {
      const place = getPlaceByName(name);
      if (place) {
        setOrigin(place.latLng);
        goToPlace(place.latLng.latitude, place.latLng.longitude);
      }
    }
  };

  const handleRoute = (name: string) => {
    const place = getPlaceByName(name);
    if (place) {
      setDestination(place.latLng);
      goToPlace(place.latLng.latitude, place.latLng.longitude);
    }
  };

  const selectDestination = (name: string) => {
    handleRoute(name);
    setDestinationValue(name);
    openTo25();
  };

  const [fontsLoaded] = useFonts({
    BreakBrush: require("@assets/fonts/Break-Brush.ttf"),
    LastShuriken: require("@assets/fonts/The-Last-Shuriken.ttf"),
    CantoraOne: require("@assets/fonts/CantoraOne-Regular.ttf"),
  });

  const glow = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: glow.value * 0.8,
  }));

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.container}>
        {loading || !fontsLoaded ? (
          <>
            <View style={styles.content}>
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  size="large"
                  color="#ffffff"
                  style={styles.loaderIndicator}
                />
                <Text style={styles.loadingText}>LOADING...</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <ScreenHeader title="MAP" />

            <View style={styles.content}>
              {currentLocation && (
                <MapView
                  ref={mapRef}
                  style={StyleSheet.absoluteFillObject}
                  provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                  mapType="standard"
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  initialRegion={currentLocation}
                >
                  {origin && <Marker coordinate={origin} title="Start" />}
                  {destination && (
                    <Marker coordinate={destination} title="End" />
                  )}
                  {origin && destination && (
                    <MapViewDirections
                      apikey={apiKey}
                      origin={origin}
                      destination={destination}
                      strokeWidth={4}
                      strokeColor="#4750b7"
                      optimizeWaypoints={true}
                      mode="WALKING"
                      onError={(errorMessage) => {
                        showSnackbar({
                          message: "Error fetching directions:" + errorMessage,
                          type: "error",
                        });
                      }}
                    />
                  )}
                </MapView>
              )}

              <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enableHandlePanningGesture={true}
                backdropComponent={(props) => (
                  <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={0}
                    appearsOnIndex={1}
                    pressBehavior="collapse"
                  />
                )}
                backgroundStyle={{ backgroundColor: "#000" }}
                handleComponent={(props) => <CustomHandle {...props} />}
              >
                <BottomSheetView style={styles.bottomSheetContent}>
                  <Pressable
                    onPress={openTo40}
                    style={styles.pressableContainer}
                  >
                    <View style={styles.dropdownContainer}>
                      <CustomDropdown
                        data={sourceData}
                        value={sourceValue}
                        onFocus={() => setIsSourceFocus(true)}
                        onBlur={() => setIsSourceFocus(false)}
                        onChange={(item) => {
                          setSourceValue(item.value);
                          handleSource(item.label);
                        }}
                        labelField="label"
                        valueField="value"
                        placeholder="MY LOCATION..."
                        mode={"source"}
                        dropdownPosition="bottom"
                        isFocused={isSourceFocus}
                        selectedTextStyle={styles.selectedTextStyle}
                        placeholderStyle={styles.selectedTextStyle}
                      />

                      <CustomDropdown
                        data={dropdownData}
                        value={destinationValue}
                        onFocus={() => setIsDestinationFocus(true)}
                        onBlur={() => setIsDestinationFocus(false)}
                        onChange={(item) => {
                          setDestinationValue(item.value);
                          handleRoute(item.value);
                          openTo25();
                        }}
                        labelField="label"
                        valueField="value"
                        placeholder="DESTINATION..."
                        mode={"destination"}
                        dropdownPosition="bottom"
                        containerStyle={styles.dropdownMargin}
                        isFocused={isDestinationFocus}
                        selectedTextStyle={styles.selectedTextStyle}
                        placeholderStyle={styles.placeholderStyle}
                      />
                    </View>

                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>POPULAR LOCATIONS</Text>
                      <View style={styles.buttonRow}>
                        <Pressable
                          onPress={() => selectDestination("MAIN AUDI")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/map1.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>

                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  MAIN AUDI
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  MAIN AUDI
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  MAIN AUDI
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  MAIN AUDI
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  MAIN AUDI
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                MAIN AUDI
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>

                        <Pressable
                          onPress={() => selectDestination("VK LAWNS")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/map2.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  VK LAWNS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  VK LAWNS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  VK LAWNS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  VK LAWNS
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  VK LAWNS
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                VK LAWNS
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>
                      </View>

                      <View style={styles.buttonRow}>
                        <Pressable
                          onPress={() => selectDestination("M LAWNS")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/map3.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  M LAWNS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  M LAWNS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  M LAWNS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  M LAWNS
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  M LAWNS
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                M LAWNS
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>

                        <Pressable
                          onPress={() => selectDestination("SOUTH PARK")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/map4.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  SOUTH PARK
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  SOUTH PARK
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  SOUTH PARK
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  SOUTH PARK
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  SOUTH PARK
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                SOUTH PARK
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>
                      </View>
                      {!isUserStoreTester && (
                        <View style={styles.bigButtonRow}>
                          <Pressable
                            onPress={() => selectDestination("MY ACCOMODATION")}
                            style={styles.imageButtonContainer}
                          >
                            <ImageBackground
                              source={require("@assets/images/map/map5.png")}
                              style={styles.imageButton}
                              imageStyle={styles.imageStyle}
                            >
                              <View style={styles.textWrapper}>
                                <Svg
                                  style={[
                                    styles.textBehind,
                                    { width: "100%", height: r_t(22) * 1.5 },
                                  ]}
                                >
                                  <Defs>
                                    <LinearGradient
                                      id="grad"
                                      x1="0%"
                                      y1="100%"
                                      x2="0%"
                                      y2="0%"
                                    >
                                      <Stop offset="0.3333" stopColor="#F00" />
                                      <Stop
                                        offset="0.8485"
                                        stopColor="#990000"
                                        stopOpacity="0"
                                      />
                                    </LinearGradient>
                                  </Defs>
                                  <SvgText
                                    fill="black"
                                    fontFamily="BreakBrush"
                                    fontSize={r_t(22)}
                                    x="50%"
                                    y="50%"
                                    dy={r_t(22) * 0.35 - 1}
                                    dx="-1"
                                    textAnchor="middle"
                                  >
                                    MY ACCOMODATION
                                  </SvgText>
                                  <SvgText
                                    fill="black"
                                    fontFamily="BreakBrush"
                                    fontSize={r_t(22)}
                                    x="50%"
                                    y="50%"
                                    dy={r_t(22) * 0.35 - 1}
                                    dx="1"
                                    textAnchor="middle"
                                  >
                                    MY ACCOMODATION
                                  </SvgText>
                                  <SvgText
                                    fill="black"
                                    fontFamily="BreakBrush"
                                    fontSize={r_t(22)}
                                    x="50%"
                                    y="50%"
                                    dy={r_t(22) * 0.35 + 1}
                                    dx="-1"
                                    textAnchor="middle"
                                  >
                                    MY ACCOMODATION
                                  </SvgText>
                                  <SvgText
                                    fill="black"
                                    fontFamily="BreakBrush"
                                    fontSize={r_t(22)}
                                    x="50%"
                                    y="50%"
                                    dy={r_t(22) * 0.35 + 1}
                                    dx="1"
                                    textAnchor="middle"
                                  >
                                    MY ACCOMODATION
                                  </SvgText>
                                  <SvgText
                                    fill="url(#grad)"
                                    fontFamily="BreakBrush"
                                    fontSize={r_t(22)}
                                    x="50%"
                                    y="50%"
                                    dy={r_t(22) * 0.35}
                                    textAnchor="middle"
                                  >
                                    MY ACCOMODATION
                                  </SvgText>
                                </Svg>
                                <Text
                                  style={[styles.textButton2, styles.textFront]}
                                >
                                  MY ACCOMODATION
                                </Text>
                              </View>
                            </ImageBackground>
                          </Pressable>
                        </View>
                      )}
                    </View>

                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>CAMPUS EATERIES</Text>

                      <View style={styles.buttonRow}>
                        <Pressable
                          onPress={() => selectDestination("ANC")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/food1.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  ANC
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  ANC
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  ANC
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  ANC
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  ANC
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                ANC
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>

                        <Pressable
                          onPress={() => selectDestination("TOTT")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/food2.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  TOTT
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  TOTT
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  TOTT
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  TOTT
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  TOTT
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                TOTT
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>
                      </View>

                      <View style={styles.buttonRow}>
                        <Pressable
                          onPress={() => selectDestination("LOOTERS")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/food3.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  LOOTERS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  LOOTERS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  LOOTERS
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  LOOTERS
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  LOOTERS
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                LOOTERS
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>

                        <Pressable
                          onPress={() => selectDestination("FOOD MINISTRY")}
                          style={styles.imageButtonContainer}
                        >
                          <ImageBackground
                            source={require("@assets/images/map/food4.png")}
                            style={styles.imageButton}
                            imageStyle={styles.imageStyle}
                          >
                            <View style={styles.textWrapper}>
                              <Svg
                                style={[
                                  styles.textBehind,
                                  { width: "100%", height: r_t(22) * 1.5 },
                                ]}
                              >
                                <Defs>
                                  <LinearGradient
                                    id="grad"
                                    x1="0%"
                                    y1="100%"
                                    x2="0%"
                                    y2="0%"
                                  >
                                    <Stop offset="0.3333" stopColor="#F00" />
                                    <Stop
                                      offset="0.8485"
                                      stopColor="#990000"
                                      stopOpacity="0"
                                    />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  FOOD MINISTRY
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 - 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  FOOD MINISTRY
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="-1"
                                  textAnchor="middle"
                                >
                                  FOOD MINISTRY
                                </SvgText>
                                <SvgText
                                  fill="black"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35 + 1}
                                  dx="1"
                                  textAnchor="middle"
                                >
                                  FOOD MINISTRY
                                </SvgText>
                                <SvgText
                                  fill="url(#grad)"
                                  fontFamily="BreakBrush"
                                  fontSize={r_t(22)}
                                  x="50%"
                                  y="50%"
                                  dy={r_t(22) * 0.35}
                                  textAnchor="middle"
                                >
                                  FOOD MINISTRY
                                </SvgText>
                              </Svg>
                              <Text
                                style={[styles.textButton2, styles.textFront]}
                              >
                                FOOD MINISTRY
                              </Text>
                            </View>
                          </ImageBackground>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                </BottomSheetView>
              </BottomSheet>
            </View>
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    paddingTop: getStatusBarHeight(),
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171616",
  },
  glowCircle: {
    position: "absolute",
    width: r_w(180),
    height: r_w(180),
    borderRadius: r_w(90),
    backgroundColor: "#FF0000",
    shadowColor: "#ffffff",
    shadowOpacity: 1,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  loaderIndicator: {
    zIndex: 2,
    transform: [{ scale: 1.1 }],
  },
  loadingText: {
    marginTop: r_h(30),
    color: "#ffffff",
    fontSize: r_t(20),
    fontFamily: "LastShuriken",
    textShadowColor: "#ffffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    letterSpacing: r_w(3),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: r_w(16),
    paddingVertical: r_h(12),
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#000000",
  },
  backButton: {
    width: r_w(40),
    height: r_h(40),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: r_t(36),
    color: "#ffffff",
    fontFamily: "LastShuriken",
  },
  content: {
    flex: 1,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: r_w(24),
    paddingTop: r_h(8),
    backgroundColor: "#000000",
  },
  pressableContainer: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    fontSize: r_t(22),
    fontWeight: "600",
    marginBottom: r_h(16),
    color: "#ffffff",
  },
  dropdownContainer: {
    width: "98%",
  },
  sectionContainer: {
    width: "100%",
    marginVertical: r_h(4),
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: r_t(24),
    fontFamily: "LastShuriken",
    alignSelf: "flex-start",
    marginBottom: r_h(8),
    color: "#ffffff",
    textShadowColor: "#ffffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: r_h(10),
  },
  imageButtonContainer: {
    flex: 1,
    marginHorizontal: r_w(5),
    overflow: "hidden",
  },
  imageButton: {
    width: "100%",
    height: r_h(47),
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  textWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton2: {
    color: "#ffffff",
    fontSize: r_t(17),
    paddingHorizontal: r_w(0),
    paddingVertical: r_h(4),
    borderRadius: r_w(6),
    fontFamily: "LastShuriken",
    textAlign: "center",
  },
  textBehind: {
    position: "absolute",
    top: r_h(8),
    color: "#FF0000",
    fontFamily: "BreakBrush",
    opacity: 0.8,
    fontSize: r_t(22),
  },
  textFront: {
    fontFamily: "LastShuriken",
    color: "#ffffff",
  },
  bigButtonRow: {
    justifyContent: "space-between",
    width: "100%",
    marginBottom: r_h(10),
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4750b7",
    paddingVertical: r_h(12),
    marginHorizontal: r_w(5),
    backgroundColor: "#f0f0f8",
  },
  textButton: {
    color: "#4750b7",
    fontWeight: "600",
  },
  icon: {
    marginRight: r_w(8),
  },
  placeholderStyle: {
    fontSize: r_t(16),
    color: "#CCCCCC",
    paddingLeft: r_w(2),
    fontFamily: "LastShuriken",
  },
  selectedTextStyle: {
    color: "#CCCCCC",
    fontSize: r_t(16),
    paddingLeft: r_w(2),
    fontFamily: "LastShuriken",
  },
  iconStyle: {
    tintColor: "#fff",
    width: r_w(24),
    height: r_h(24),
  },
  item: {
    backgroundColor: "#111",
    padding: r_w(16),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemText: {
    fontSize: r_t(16),
    color: "#fff",
  },
  dropdownMargin: {
    marginTop: r_h(8),
  },
});
