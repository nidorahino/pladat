import React from 'react';

import './styles/TypingText.css';

export default class TypingText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sentences: [],
            currentSentenceArr: [],
            currentLetterIndex: 0,
            typing: false,
            backward: false,
            forward: false,
            curSentenceIndex: 0,
            typingSpeed: 50,
            afterForwardPause: this.props.fpause ? this.props.fpause : 6400,
            afterBackwardPause: 400,
            typeIteration: 0,
            loaded: false,
            paused: false
        };

      
    }

    shouldComponentUpdate() {
        return this.state.typing;
    }


    componentDidMount() {
        this.setState({
            sentences: this.props.statements,
            typing: true
        }, () => {
            this.loadSentence();
        })
    }

    componentWillUnmount() {
        this.setState({
            typing: false,
            forward: false,
            backward: false,
            loaded: false,
            paused: false
        })
    }

    stopTyping() {
        window.onbeforeunload = (event) => {
            event.preventDefault();

            delete event['returnValue'];

            this.setState({
                typing: false,
                forward: false,
                backward: false,
                loaded: false,
                paused: false
            }, () => {
                // event.returnValue = false;
                console.log('type anime stop');
            });


        }
    }

    componentWillUnmount() {
        this.setState({
            typing: false,
            forward: false,
            backward: false,
            paused: false
        })
       
    }

    loadSentence = () => {
        let curIdx = this.state.curSentenceIndex;
        if(curIdx >= this.state.sentences.length) {
            this.setState({
                loaded: true,
                paused: false,
                currentSentenceArr: this.state.sentences[0].split(""),
                curSentenceIndex: 1
            }, () => {
                this.setState({
                    forward: true,
                })
            })
        }
        else {
            this.setState({
                loaded: true,
                paused: false,
                currentSentenceArr: this.state.sentences[curIdx].split(""),
                curSentenceIndex: curIdx+1
            }, () => {
                this.setState({
                    forward: true,
                })
            })
        }
    }

    typeForward = (idx) => {
        if(this.state.loaded && this.state.typing) {
            if(idx >= this.state.currentSentenceArr.length) {
                this.setState({
                    paused: true,
                    forward: false
                }, () => {
                    let blink = setInterval(() => {
                        if(this.state.paused) {
                            this.animateCursorOnPause();
                        }
                    }, 800);
                    setTimeout(() => {
                        clearInterval(blink);
                        this.setState({
                            paused: false
                        }, () => {
                            this.setState({
                                backward: true,
                            })
                        })
                    }, this.state.afterForwardPause)
                });
                
            }
            else {
                setTimeout(() => {
                    let elem = this.state.typeIteration+"typed-letter"+idx;
                    if(this.state.typing) {
                        if(document.getElementById(elem)) {
                            document.getElementById(elem).style.display = "inline-block";
                        }
                    }
                    this.typeForward(idx+1);
                }, this.state.typingSpeed)
            }
        }
    }

    typeBackward = (idx) => {
        if(this.state.loaded && this.state.typing) {
            if(idx < 0) {
                this.setState({
                    backward: false,
                    loaded: false
                }, () => {
                    setTimeout(() => {
                        this.loadSentence();
                    }, this.state.afterBackwardPause)
                })
            }
            else {
                setTimeout(() => {
                    let elem = this.state.typeIteration+"typed-letter"+idx;
                    if(this.state.typing) {
                        if(document.getElementById(elem)) {
                            document.getElementById(elem).style.display = "none";
                        }
                    }
                    this.typeBackward(idx-1);
                }, this.state.typingSpeed)
            }
        }
    }

    typeSentence = () => {
        if(this.state.typing && this.state.loaded) {
            let lastElemIdx = this.state.currentSentenceArr.length-1;
            if(this.state.forward) {
                this.typeForward(0);
            }
            if(this.state.backward) {
                this.typeBackward(lastElemIdx);
            }
        }
    }

    animateCursorOnPause = () => {
        if(this.state.paused && this.state.typing) {
            if(document.getElementById('typed-text-cursor')) {
                document.getElementById('typed-text-cursor').style.display = 'none';
            }
            setTimeout(() => {
                if(this.state.typing) {
                    clearInterval();
                    if(document.getElementById('typed-text-cursor')) {
                        document.getElementById('typed-text-cursor').style.display = 'inline-block';
                    }
                }
            }, 400);
        }
        else {
            if(document.getElementById('typed-text-cursor')) {
                document.getElementById('typed-text-cursor').style.display = 'inline-block';
            }
            // clearInterval();
        }
    }


    render() {
        
        if(this.state.typing === true && this.state.loaded === true) {
            this.typeSentence();
            // this.animateCursorOnPause();
        }
        return (
            <div id='typed-text-holder'>
                {
                    this.state.currentSentenceArr.map((letter, index) => {
                        return (
                            <span key={index} className={"text typed-text " + (letter === " " ? 'space-char': '')} id={this.state.typeIteration+"typed-letter"+index}>
                                {letter}
                            </span>
                        )
                    })
                }
                <span id='typed-text-cursor' className="text"> | </span>
                {/* {this.animateCursorOnPause()} */}
            </div>
        )
    }
}