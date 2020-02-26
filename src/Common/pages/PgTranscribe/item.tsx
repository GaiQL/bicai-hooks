import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Player, BigPlayButton } from 'video-react';
import "video-react/dist/video-react.css";
import { commonStore } from "Common/pages/store"

export let Render = () => {
    const ref = useRef(null)
    let VideoURL = "https://finsuit.oss-cn-beijing.aliyuncs.com/open_api_bank/h5/video/%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB%E6%96%87%E5%AD%973-6%E7%A7%92.mp4"
    useEffect(() => {
        // @ts-ignore
        ref.current.subscribeToStateChange(handleStateChange)
    })

    function handleStateChange() {
        // @ts-ignore
        let { player } = ref.current.getState(); // 获取播放器状态
        if (!player) return
        if (player.ended) { // 判断是否播放完毕
            player = null
            setTimeout(() => {
                commonStore.Hash.history.push("/faceDiscern?fromPage=open")
            }, 400)
        }
    }
    return (
        <div style={{ height: "100%" }}>
            <Player width='100%' height='100%' fluid={false} ref={ref} videoId="video-1">
                <source src={VideoURL} />
                <BigPlayButton position="center" />
            </Player>
        </div>
    )
}

export default {
    Render
}
