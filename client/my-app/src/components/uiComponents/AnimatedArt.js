import React from 'react';
import anime from 'animejs'

export default class AnimatedArt extends React.Component {

    componentDidMount() {
        this.playAnime();
    }

    playAnime = () => {
        anime({
            targets: '.leafpath',
            strokeDashoffset: [anime.setDashoffset, 0],
            translateY: [0, 150],
            translateX: [0, 50],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: function(el, i) { return i * 250 },
            direction: 'alternate',
            loop: true
          });
    }

    render() {
        return (
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="492px" height="512px" viewBox="0 0 4920 5120" preserveAspectRatio="xMidYMid meet">
                <g id="layer101" fill="#38ce99" stroke="none">
                <path className="leafpath" d="M4844 5078 c-22 -24 -96 -113 -164 -198 -229 -285 -449 -525 -558 -608 l-33 -25 -147 27 c-966 173 -1758 104 -2398 -210 -643 -316 -1094 -884 -1339 -1691 -104 -338 -169 -734 -196 -1188 -19 -328 4 -1185 33 -1185 4 0 88 25 186 54 248 77 462 132 867 226 841 195 1046 247 1346 345 456 150 832 339 1103 554 425 340 696 805 810 1389 53 271 60 360 61 762 0 377 -12 585 -40 694 -7 28 -10 55 -7 61 3 5 49 69 102 140 180 242 281 406 343 550 46 109 107 290 107 320 0 39 -32 31 -76 -17z m-1229 -1666 c-133 -258 -384 -579 -627 -804 -299 -275 -506 -429 -1218 -905 -516 -345 -752 -525 -973 -742 l-118 -116 62 115 c284 531 520 863 822 1156 255 248 468 397 1177 822 239 144 543 331 675 415 132 84 242 152 243 151 2 -1 -17 -43 -43 -92z"/>
                </g>
            </svg>
        )
    }
}