import { css } from '@emotion/react'
import * as React from 'react'
import Boid from '../../common/boids/boid/Boid'

interface State {
    boid: Boid
}

interface Props {
    boid: Boid
}

class BoidParameters extends React.PureComponent<Props, State> {
    decimalPlaces: number = 4

    constructor(props: any) {
        super(props)
    }

    public render() {
        const boidPropertiesWrapperCSS = css`
            position: absolute;
            width: 240px;
            /* height: 20%; */
            left: 5px;
            top: 5px;
            background-color: rgba(138, 43, 226, 0.3);
            border-radius: 20px;
            pointer-events: none;
            padding: 5px;
            color: #0ccf7a;
            font-family: cursive;
            font-size: 14px;
        `

        const boidTitleCSS = css`
            text-align: center;
        `

        const rounderVector = Math.pow(10, this.decimalPlaces)

        return (
            <div css={boidPropertiesWrapperCSS}>
                <div css={boidTitleCSS}>Boid #{this.props.boid.id}</div>
                <div>
                    Location: [{Math.round(this.props.boid.location.x)}, {Math.round(this.props.boid.location.y)}]
                </div>
                <div>
                    Direction: [{Math.round(this.props.boid.facingDirection.x * rounderVector) / rounderVector},{' '}
                    {Math.round(this.props.boid.facingDirection.y * rounderVector) / rounderVector}]
                </div>
                <div>Radius: {this.props.boid.radius}</div>
            </div>
        )
    }
}

export default BoidParameters
