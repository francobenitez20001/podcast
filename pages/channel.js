import 'isomorphic-fetch';
import {Link} from '../routes';
import React, { Component } from 'react'
import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid';
import Error from 'next/error';
import slug from '../helpers/slug';
import PodcastPlayer from '../components/PodcastPlayer';

export default class channel extends Component {

    constructor(props){
        super(props);
        this.state = {
            openPodcast:null
        }   
    }


    static async getInitialProps({query,res}){
        let idChannel = query.id;
        try {
            let [reqChannel,reqAudios,reqSeries] = await Promise.all([
                fetch(`https://api.audioboom.com/channels/${idChannel}`),
                fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`),
                fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`)
            ])
    
            if(reqChannel.status >=400){
                res.statusCode = reqChannel.status;
                return {channel:null,audios:null,series:null,statusCode:reqChannel.status}
            }

            if(reqAudios.status >=400){
                res.statusCode = reqAudios.status;
                return {channel:null,audios:null,series:null,statusCode:reqAudios.status}
            }

            if(reqSeries.status >=400){
                res.statusCode = reqSeries.status;
                return {channel:null,audios:null,series:null,statusCode:reqSeries.status}
            }
    
            let dataChannel = await reqChannel.json();
            let channel = dataChannel.body;
    
            let dataAudios = await reqAudios.json();
            let audios = dataAudios.body;
    
            let dataSeries = await reqSeries.json();
            let series = dataSeries.body;
            return {channel,audios,series,statusCode:200};
        } catch (error) {
            return {channel:null,audios:null,series:null,statusCode:503}
        }
    }

    openPodcast = (event,podcast)=>{
        event.preventDefault();
        this.setState({
            openPodcast:podcast
        })
    }

    closePodcast=(event)=>{
        event.preventDefault();
        this.setState({openPodcast:null});
    }

    render() {
        if(this.props.statusCode!==200){
            return <Error statusCode={this.props.statusCode}/>
        }
        const {channel:{channel:channel},audios:{audio_clips:audios},series:{channels:series}} = this.props;
        const {openPodcast} = this.state;
        return (
            <div>
                <Layout title={channel.title}>
                    <h1 style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }}>{channel.title}</h1>

                    {openPodcast && 
                    <div className='modal'>
                        <PodcastPlayer podcast={this.state.openPodcast} onClose={this.closePodcast}/>
                    </div>}


                    <div className="wrapper">
                        <div className="series">
                            <ChannelGrid channels={series}/>
                        </div>
                        <div className="podcasts">
                            {audios.map((audio,key)=>(
                                <a route='podcast' key={key} params={{
                                    slugChannel:slug(channel.title),
                                    idChannel:channel.id,
                                    slug:slug(audio.title),
                                    id:audio.id
                                }} onClick={(event)=>this.openPodcast(event,audio)}>
                                    <div className="channel">
                                        <div key={key} className="audio_container">
                                            <img src={audio.urls.image} alt={audio.title}/>
                                            {audio.title}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </Layout>

                <style jsx>{`
                    h1{
                        text-align:center;
                        padding:50px;
                        margin:0;
                    }
                    .audio_container{
                        padding:10px;
                        box-shadow: 0px 2px 6px rgba(0,0,0,0.15);
                        margin:15px 10px;
                    }

                    .wrapper{
                        display:flex;
                    }    

                    .wrapper .series{
                        width:70%
                    }

                    .wrapper .podcasat{
                        width:30%
                    }

                    .audio_container{
                        display: flex;
                        align-items: center;
                    }

                    .channel{
                        color:#000 !important;
                        text-decoration:none;
                        cursor:pointer
                    }

                    .audio_container img{
                        width:30px
                    }

                    .modal{
                        position:fixed;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        z-index:99999;
                    }

                    @media(max-width:768px){
                        .wrapper{
                            display:block;
                        } 
                        .series , .podcast{
                            width:100% !important;
                        }
                    } 
                    }
                `}</style>
            </div>
        )
    }
}
