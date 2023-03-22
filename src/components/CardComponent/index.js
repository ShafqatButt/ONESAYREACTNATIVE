import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import * as Icons from "react-native-heroicons/outline";
import * as mIcons from "react-native-heroicons/solid";
// style component
import { fonts } from '../../res/fonts';
import { colors } from '../../res/colors';
import { Spacer } from '../../res/spacer';
// third party library
import { CardContainer, CardWrapper, styles, Text, CandInnerWrapper, CandInnerContainerWrapper } from './style';
import SoundCloudWaveform from 'react-native-soundcloud-waveform';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


export const CardComponent = (props) => {
    return (
        <CardContainer activeOpacity={!props.hideCommentsAvatart ? 0.7 : 1} style={[props.style]} onPress={() => { props.navigation.navigate("StereoCardDetail", { "item": props.item }) }}>
            <CardWrapper style={[{ backgroundColor: props.item?.Background }, props.wrapperstyle]}>
                <View style={{ paddingHorizontal: wp(5) }}>
                    <Spacer space={hp(1)} />
                    <View style={{ flexDirection: "row" }}>
                        <View style={[styles.image_wrapper, { backgroundColor: props.item?.Background_light }]}>
                            <Image resizeMode={"contain"} source={{ uri: props.item?.Profile_image }} style={{ width: wp(10), height: wp(10) }} />
                        </View>
                        <View style={styles.left_align}>
                            <Text style={[{ color: colors.WHITE, fontSize: wp(3.5), textAlign: 'left' }]}>{props.item?.Fullname}</Text>
                            <Text style={[{ opacity: 0.6, color: colors.WHITE, fontSize: wp(3.5), textAlign: 'left', fontFamily: fonts.REGULAR }]}>{"Closes in 15:08:30"}</Text>
                        </View>
                    </View>
                    <Spacer space={hp(0.6)} />
                    <Text style={[{ color: colors.WHITE, fontSize: wp(4.5), textAlign: 'left', alignSelf: 'center', width: wp(80) }, props.CardStyle]}>{props.item?.Description}</Text>
                    <Spacer space={hp(0.6)} />
                    <TouchableOpacity style={styles.musicContainer} onPress={() => { !props.playAudio ? props.onPlaySong() : props.onPauseSong() }} >
                        <TouchableOpacity style={{ alignSelf: 'center', marginLeft: wp(4) }} onPress={() => { !props.playAudio ? props.onPlaySong() : props.onPauseSong() }} >
                            {(props.playAudio && props.item.play) ?
                                <mIcons.PauseIcon color={props.item?.Background} size={wp(6)} />
                                :
                                <mIcons.PlayIcon color={props.item?.Background} size={wp(6)} />
                            }
                        </TouchableOpacity>
                        <SoundCloudWaveform waveformUrl="https://w1.sndcdn.com/PP3Eb34ToNki_m.png"
                            percentPlayable={0}
                            setTime={() => {
                                !props.playAudio ? props.onPlaySong() : props.onPauseSong()
                            }}
                            active={colors.DARK_AUDIO_WAVE}
                            percentPlayed={props.item.play ? (props.currentTime / props.totalTime) : 0}
                            height={20}
                            width={wp(75)}
                            activeInverse={props.item?.Background}
                            activePlayable={props.item?.Background}
                            activePlayableInverse={props.item?.Background}
                            inactive={colors.DARK_AUDIO_WAVE}
                            inactiveInverse={colors.DARK_AUDIO_WAVE}
                        />
                    </TouchableOpacity>
                    {props.item?.IsInnerCard &&
                        <>
                            <Spacer space={hp(1)} />
                            <View style={[styles.image_container, { backgroundColor: props.item?.Background_light }, props.CardStyle]}>
                                <View>
                                    <Image resizeMode={"cover"} source={props.item?.InnerImage} style={styles.image_bg} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[{ color: colors.WHITE, fontSize: wp(3.5), textAlign: 'left' }]} numberOfLines={2} >{props.item?.InnerTitle}</Text>
                                    <Text style={[{ color: '#FFC599', fontSize: wp(3.2), textAlign: 'left' }]} >{props.tem?.InnerWeb}</Text>
                                </View>
                            </View>
                        </>
                    }
                    <Spacer space={hp(1)} />
                    <CandInnerWrapper style={[props.CardStyle]}>
                        <View style={{ flexDirection: "row" }}>
                            <CandInnerContainerWrapper>
                                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                    <Icons.HeartIcon color={colors.WHITE} size={wp(6)} />
                                    <Text style={[{ color: colors.WHITE, fontSize: wp(3.5), textAlign: 'left', fontFamily: fonts.REGULAR, alignSelf: "center" }]}>{props.item?.Total_like}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                    <Icons.ChatBubbleOvalLeftIcon color={colors.WHITE} size={wp(6)} />
                                    <Text style={[{ color: colors.WHITE, fontSize: wp(3.5), textAlign: 'left', fontFamily: fonts.REGULAR, alignSelf: "center" }]} >{props.item?.Total_comment}</Text>
                                </View>
                            </CandInnerContainerWrapper>
                        </View>
                        <TouchableOpacity onPress={() => alert("share")} >
                            <Icons.ShareIcon color={colors.WHITE} size={wp(6)} />
                        </TouchableOpacity>
                    </CandInnerWrapper>
                    <Spacer space={hp(!props.hideCommentsAvatart ? 2 : 1)} />
                    {!props.hideCommentsAvatart &&
                        <View style={{ alignSelf: "center", flexDirection: "row" }}>
                            {props.item?.CommentBy.map((data) => {
                                return (
                                    <Image source={{ uri: data?.Profile }} style={styles.image_mg} />
                                )
                            })}
                        </View>
                    }
                </View>
            </CardWrapper>
        </CardContainer >
    )
}