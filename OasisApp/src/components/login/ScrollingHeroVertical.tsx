import React from "react"
import {StyleSheet, View} from "react-native"
import {VerticalCarousel} from "@components/login/VerticalCarousel";
import {r_h, r_w} from "@utils/responsive";

interface proptypes {

}
export function ScrollingHeroVertical(props: proptypes) {

    const image_data_1 = [
        require("@/../assets/images/login/1.png"),
        require("@/../assets/images/login/2.png"),
        require("@/../assets/images/login/3.png"),
    ]

    const image_data_2 = [
        require("@/../assets/images/login/4.png"),
        require("@/../assets/images/login/5.png"),
        require("@/../assets/images/login/6.png"),
    ]

    const image_data_3 = [
        require("@/../assets/images/login/7.png"),
        require("@/../assets/images/login/8.png"),
        require("@/../assets/images/login/9.png"),
    ]

    const duration = 12000

    return (
        <View style={styles.arrangement}>
            <VerticalCarousel width={r_w(160)} imageHeight={r_h(177)} height={r_h(326)} direction={"up"} duration={duration} images={image_data_1}/>
            <VerticalCarousel width={r_w(160)} imageHeight={r_h(177)} height={r_h(326)} direction={"down"} duration={duration} images={image_data_2}/>
            <VerticalCarousel width={r_w(160)} height={r_h(326)} imageHeight={r_h(177)} direction={"up"} duration={duration-500} images={image_data_3}/>
        </View>
    )
}

const styles = StyleSheet.create({
    arrangement: {
        flexDirection: "row",
        gap: r_w(6),
        justifyContent: "center"
    }
})