import { css, SerializedStyles } from '@emotion/react'
import * as React from 'react'
import Animation from '../../common/animation/Animation'
import Boid from '../../common/boids/boid/Boid'
import { BoidsConfiguration } from '../../configuration/api/boidsConfiguration'
import BoidParameters from '../boidParameters/BoidParameters'

interface Props {
    boidsConfiguration: BoidsConfiguration
}

interface State {
    boid: Boid
}

class AnimationCanvas extends React.Component<Props, State> {
    animationCanvasRef: React.MutableRefObject<HTMLCanvasElement>
    animationCanvas: JSX.Element
    game: Animation

    constructor(props: any) {
        super(props)

        this.animationCanvasRef = React.createRef()

        this.state = {
            boid: null,
        }
    }

    componentDidMount() {
        this.game = new Animation(
            this.animationCanvasRef.current,
            this.props.boidsConfiguration,
            this.updateSelectedBoid
        )

        this.game.start()
    }

    private updateSelectedBoid = (newBoidInfo: Boid) => {
        if (newBoidInfo === null && this.state.boid === null) return
        if (newBoidInfo === null) {
            this.setState({
                boid: null,
            })
            return
        }
        this.setState({
            boid: {
                ...newBoidInfo,
            },
        })
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
                {this.state.boid === null ? null : <BoidParameters boid={this.state.boid} />}
                <canvas css={canvasStyle} ref={this.animationCanvasRef} />
            </div>
        )
    }
}

export default AnimationCanvas
