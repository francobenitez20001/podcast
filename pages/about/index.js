import React, { Component } from 'react'

export default class About extends Component {
    render() {
        return (
            <div>
                <img src="/platzi-logo.png" alt="logo"/>
                <h1>Hecha mi Franco Benitez</h1>
                <style jsx>{`
                    div{
                        position:fixed;
                        top:0px;
                        left:0px:
                        rigth:0px;
                        bottom:0px;
                        width:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background-color:#b6b6b6;
                        flex-direction:column;
                    }
                    img{
                        width:100px;
                        heigth:100px;
                        margin-bottom:40px
                    }
                `}</style>
            </div>
        )
    }
}
