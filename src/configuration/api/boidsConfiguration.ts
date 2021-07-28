export interface BoidsConfiguration {
    range: BoidsRange
    speed: Point
    count: number
    radius: number

    colorProperties: ColorProperties
}

interface BoidsRange {
    alignment: number
    separation: number
    cohesion: number
    wall: number
}
