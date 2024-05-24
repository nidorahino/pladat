import React from 'react';
import anime from 'animejs';
import {ReactComponent as Vines} from '../uiComponents/vines.svg';

export default class AnimatedArt extends React.Component {

    componentDidMount() {
        this.vineAnime();
        this.leafAnime();
        this.playAnime();
        this.dotAnime();
        this.circleAnime();
        this.playAnime2();
    }

    playAnime = () => {
        anime({
            targets: '.leaf',
            translateY: [0, 50],
            translateX: [0, 75],
            easing: 'easeInOutSine',
            duration: 3000,
            direction: 'alternate',
            loop: true
          });
    }

    playAnime2 = () => {
        anime({
            targets: '.vine',
            translateY: [0, 30],
            translateX: [0, 45],
            easing: 'easeInOutSine',
            duration: 3000,
            direction: 'alternate',
            loop: true
          });
    }

    dotAnime = () => {
        anime({
            targets: '.dot',
            keyframes: [
              {opacity: 0},
              {opacity: 1},
              {opacity: 0},
              {opacity: 1}
            ],
            duration: 5000,
            easing: 'easeInOutSine',
            loop: true
          });
    }

    vineAnime = () => {
        anime({
            targets: '.vine',
            opacity: 1,
            duration: 3000,
            easing: 'easeInOutSine',
            loop: false
          });
    }


    leafAnime = () => {
        anime({
            targets: '.leaf',
            delay: 3000,
            opacity: 1,
            duration: 3000,
            easing: 'easeInOutSine',
            loop: false
          });
        }

    circleAnime = () => {
        anime({
            targets: '.circle',
            keyframes: [
              {opacity: 1},
              {opacity: 0},
              {opacity: 1}
            ],
            duration: 5000,
            easing: 'easeInOutSine',
            loop: true
          });
    }

    render() {
        return (
            <div><Vines/></div>
        )
    }
}