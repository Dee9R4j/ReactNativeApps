import React, {useEffect, useState} from "react"
import {StyleSheet, TouchableOpacity, View} from "react-native"
import {r_h, r_t, r_w} from "@utils/responsive";
import PlaySVG from "@/../assets/images/shows/play.svg"

interface proptypes {
    source: string;
}
export function PlayAudio(props: proptypes) {

    const toggleAudio = () => {

    }

    return (
        <TouchableOpacity style={{
        }} onPress={toggleAudio}>
            <PlaySVG height={r_h(44)} width={r_w(44)}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})