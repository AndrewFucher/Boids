import { Global, css } from '@emotion/react'
import * as React from 'react'
// import './theme.css'
import { BoidsConfiguration } from '../configuration/api/boidsConfiguration'
import boidsConfigurationJSON from '../configuration/boidsConfiguration.json'
import AnimationCanvas from './animation/AnimationCanvas'

interface State {
    boidsConfiguration: BoidsConfiguration
}

// let s: string = JSON.stringify(boidsConfigurationJSON)
// s = 'asfdsdf'
// console.log(typeof (boidsConfigurationJSON as string))
// console.log(typeof s)
// console.log(boidsConfigurationJSON)

class App extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            boidsConfiguration: JSON.parse(JSON.stringify(boidsConfigurationJSON)),
        }
    }

    public render() {
        return (
            <div
                css={css`
                    padding: 0;
                    margin: 0;
                    height: 100%;
                    width: 100%;
                    background-color: white;
                `}
            >
                <Global
                    styles={css`
                        body {
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                    `}
                />
                <AnimationCanvas boidsConfiguration={this.state.boidsConfiguration} />
            </div>
        )
    }
}

export default App
