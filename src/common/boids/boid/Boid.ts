import { Vector } from '../../vector/Vector'

interface Boid {
    id: number

    location: Point
    facingDirection: Vector

    color: string
    radius: number
}

export default Boid
