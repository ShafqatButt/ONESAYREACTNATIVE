import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Spacer } from '../../../../res/spacer';
// style themes and components
import { CardComponent } from '../../../../components/CardComponent';
import { GlobalFlex } from '../../../../res/globalStyles';
import { BackHeader } from '../../../../components/BackHeader';
import { STERIO_DATA } from "../../../../res/data";
import { styles, Text, CandInnerWrapper, CandInnerContainerWrapper } from './style';
// Third Party library
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import SoundPlayer from 'react-native-sound-player';
import { colors } from '../../../../res/colors';
import SoundCloudWaveform from 'react-native-soundcloud-waveform';
import * as Icons from "react-native-heroicons/outline";
import * as mIcons from "react-native-heroicons/solid";
import { fonts } from '../../../../res/fonts';

export default SterioCardDetail = (props) => {

    const { item } = props.route.params;


    const [playAudio, setPlayAudio] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [Item, setItem] = useState(item)



    useEffect(() => {
        let interval = null;
        if (playAudio == true) {
            interval = setInterval(() => {
                getInfo();
            }, 100)
        } else if (!playAudio) {
            clearInterval(interval);
            SoundPlayer.pause()
            setCurrentTime(0)
        }
        return () => { clearInterval(interval) };
    }, [playAudio])


    const playSong = (item) => {
        try {
            SoundPlayer.playUrl(item?.SoundFile)
        } catch (e) {
            alert('Cannot play the file')
        }
    }

    const getInfo = async () => { // You need the keyword `async`
        try {
            const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
            setCurrentTime(info.currentTime)
            setTotalTime(info.duration)
        } catch (e) {
            console.log('There is no song playing', e)
        }
    }

    const onPlaySong = (item) => {
        STERIO_DATA.map((data) => { data.ID == item.ID ? data.play = true : data.play = false })
        playSong(item), setPlayAudio(!playAudio)
    }


    const onPauseSong = (item) => {
        setPlayAudio(!playAudio), SoundPlayer.pause(), item.play = false, setCurrentTime(0)
    }


    return (
        <GlobalFlex>
            <BackHeader textColor={{ color: colors.WHITE }} background={{ backgroundColor: item?.Background }} onBackPress={() => { props.navigation.goBack() }} is_center_text title={"Closes in 16:02"} />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {item &&
                    <CardComponent
                        key={item.ID}
                        navigation={props.navigation}
                        item={item}
                        playAudio={playAudio}
                        onPlaySong={() => { onPlaySong(item) }}
                        onPauseSong={() => { onPauseSong(item) }}
                        currentTime={currentTime}
                        totalTime={totalTime}
                        hideCommentsAvatart={true}
                        style={{ width: wp(100) }}
                        wrapperstyle={{ borderRadius: 0 }}
                        CardStyle={{ width: wp(90) }}
                    />
                }
                <FlatList
                    bounces={false}
                    data={item?.CommentBy}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(data, index) => `${index.toString()}`}
                    renderItem={({ item }) => (
                        <>
                            <View style={{ width: wp(90), alignSelf: "center", marginBottom: wp(2) }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontSize: wp(3), marginBottom: wp(2), fontFamily: fonts.REGULAR, textAlign: 'left' }}>{item?.Name}</Text>
                                </View>
                                <TouchableOpacity style={styles.musicContainer} >
                                    <Image source={{ uri: item?.Profile }} resizeMode={"contain"} style={{ width: wp(15), height: wp(15) }} />
                                    <TouchableOpacity style={{ alignSelf: 'center', marginLeft: wp(4) }} >
                                        <mIcons.PlayIcon color={Item?.Background} size={wp(6)} />
                                    </TouchableOpacity>
                                    <SoundCloudWaveform waveformUrl="https://w1.sndcdn.com/PP3Eb34ToNki_m.png"
                                        percentPlayable={0}
                                        setTime={() => {

                                        }}
                                        active={colors.DARK_AUDIO_WAVE}
                                        percentPlayed={0}
                                        height={20}
                                        width={wp(65)}
                                        activeInverse={Item?.Background}
                                        activePlayable={Item?.Background}
                                        activePlayableInverse={Item?.Background}
                                        inactive={colors.DARK_AUDIO_WAVE}
                                        inactiveInverse={colors.DARK_AUDIO_WAVE}
                                    />
                                </TouchableOpacity>
                                <Spacer space={hp(0.5)} />
                                <CandInnerWrapper>
                                    <View style={{ flexDirection: "row" }}>
                                        <CandInnerContainerWrapper>
                                            <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center" }} onPress={() => alert("share")} >
                                                <Icons.HeartIcon color={colors.DARK_GRAY_91} size={wp(6)} />
                                                <Text style={[{ color: colors.DARK_GRAY_91, marginLeft: wp(1), fontSize: wp(3.5), textAlign: 'left', fontFamily: fonts.REGULAR, alignSelf: "center" }]}>{"React"}</Text>
                                            </TouchableOpacity>
                                            {/* <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                            <mIcons.ShareIcon color={colors.BLACK} size={wp(6)} />
                                            <Text style={[{ color: colors.BLACK, fontSize: wp(3.5), textAlign: 'left', fontFamily: fonts.REGULAR, alignSelf: "center" }]} >{"Reply"}</Text>
                                        </View> */}
                                        </CandInnerContainerWrapper>
                                    </View>
                                    <TouchableOpacity onPress={() => alert("share")} >
                                        <Icons.ShareIcon color={colors.DARK_GRAY_91} size={wp(6)} />
                                    </TouchableOpacity>
                                </CandInnerWrapper>
                            </View>
                            <Spacer space={hp(0.5)} />
                        </>
                    )}
                />
            </ScrollView>
        </GlobalFlex>
    );
}

