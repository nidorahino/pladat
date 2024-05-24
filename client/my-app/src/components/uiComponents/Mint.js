import React from 'react';
import anime from 'animejs';
import {ReactComponent as MintLogo} from '../uiComponents/mint.svg';

export default class MintAnimation extends React.Component {

    componentDidMount() {
        this.playAnime();
    }

    playAnime = () => {
        anime({
            targets: '.mint',
            translateY: [0, -30],
            // translateX: [0, 75],
            easing: 'easeInOutSine',
            duration: 2000,
            direction: 'alternate',
            loop: true
          });
        }

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%', textAlign:'center', alignItems: 'center'}}><MintLogo/></div>
        )
    }
}