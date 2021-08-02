import ColorProperties from '../../common/api/ColorProperties'

export interface BoidsConfiguration {
    range: BoidsRange
    speed: Point
    count: number
    radius: number

    force: Force

    weight: Weight

    colorProperties: ColorProperties
}

interface BoidsRange {
    alignment: number
    separation: number
    cohesion: number
    wall: number
}

interface Force {
    maxForce: MaxForce
}

interface MaxForce {
    alignment: number
    separation: number
    cohesion: number
    wall: number
    total: number
}

interface Weight {
    alignment: number
    separation: number
    cohesion: number
}
