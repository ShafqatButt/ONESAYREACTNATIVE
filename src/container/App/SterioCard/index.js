
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Spacer } from '../../../res/spacer';
// style themes and components
import { GlobalFlex } from '../../../res/globalStyles';
import { BackHeader } from '../../../components/BackHeader';
import { CardComponent } from "../../../components/CardComponent";
import { STERIO_DATA } from "../../../res/data";
// Third Party library
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import SoundPlayer from 'react-native-sound-player';

export default SterioCard = (props) => {

    const [playAudio, setPlayAudio] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [totalTime, setTotalTime] = useState(0)


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
            <BackHeader onBackPress={() => { props.navigation.goBack() }} is_center_text title={"Buzzmi"} />
            <Spacer space={hp(1)} />

            <FlatList
                data={STERIO_DATA}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => `${item.ID}`}
                renderItem={({ item }) => (
                    <CardComponent
                        key={item.ID}
                        navigation={props.navigation}
                        item={item}
                        playAudio={playAudio}
                        onPlaySong={() => { onPlaySong(item) }}
                        onPauseSong={() => { onPauseSong(item) }}
                        currentTime={currentTime}
                        totalTime={totalTime}
                        hideCommentsAvatart={false}
                        CardStyle={{ width: wp(80) }}
                    />
                )}
            />
        </GlobalFlex>
    );
}

