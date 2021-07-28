import { css, SerializedStyles } from '@emotion/react'
import * as React from 'react'
import Animation from '../../common/animation/Animation'
import { BoidsConfiguration } from '../../configuration/api/boidsConfiguration'

interface Props {
    boidsConfiguration: BoidsConfiguration
}

class AnimationCanvas extends React.PureComponent<Props> {
    animationCanvasRef: React.MutableRefObject<HTMLCanvasElement>
    animationCanvas: JSX.Element
    game: Animation

    constructor(props: any) {
        super(props)

        this.animationCanvasRef = React.createRef()
    }

    componentDidMount() {
        this.game = new Animation(this.animationCanvasRef.current, this.props.boidsConfiguration)

        this.game.start()
    }

    public render() {
        const canvas_wrapper = css`
            position: fixed;
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;

            background-color: white;
        `

        const canvasStyle = css`
            /* background-color: #080839; */
            background-color: black;
            height: 100%;
            width: 100%;
        `

        return (
            <div css={canvas_wrapper}>
                <canvas css={canvasStyle} ref={this.animationCanvasRef} />
            </div>
        )
    }
}

export default AnimationCanvas
