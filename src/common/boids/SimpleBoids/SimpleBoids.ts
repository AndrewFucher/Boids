import { BoidsConfiguration } from '../../../configuration/api/boidsConfiguration'
import Boids from '../base/Boids'

class SimpleBoids extends Boids {
    constructor(boidsConfiguration: BoidsConfiguration) {
        super(boidsConfiguration)
    }
}

export default SimpleBoids
