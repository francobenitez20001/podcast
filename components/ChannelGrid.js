import React, { Component } from 'react'
import {Link} from '../routes';
import slug from '../helpers/slug';

export default class ChannelGrid extends Component {
    render() {
        const {channels} = this.props;
        return (
            <div className="channels">
                {channels.map((channel,key)=>(
                    //prefetch lo que permite es precargar el html,css y js de /channel en este caso, para evitar cargarlo una vez que sea clickea. SOLO FUNCIONA EN PRODUCCION
                    <Link route='channel' key={key} prefetch params={{
                        slug:slug(channel.title),
                        id:channel.id
                    }}>
                        <a className="channel">
                            <img src={channel.urls.logo_image.original} alt={channel.title}/>
                            <h2>{channel.title}</h2>
                        </a>
                    </Link>
                ))}
                <style jsx>{`
                    .channels {
                        display: grid;
                        grid-gap: 15px;
                        padding: 15px;
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    }
                    a.channel {
                        display: block;
                        margin-bottom: 0.5em;
                        color: #333;
                        text-decoration: none;
                    }
                    .channel img {
                        border-radius: 3px;
                        box-shadow: 0px 2px 6px rgba(0,0,0,0.15);
                        width: 100%;
                    }
                    h2 {
                        padding: 5px;
                        font-size: 0.9em;
                        font-weight: 600;
                        margin: 0;
                        text-align: center;
                    }     
                `}</style>
            </div>
        )
    }
}
