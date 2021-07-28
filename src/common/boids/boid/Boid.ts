import { Vector } from '../../vector/Vector'

interface Boid {
    location: Point
    facingDirection: Vector

    color: string
    radius: number
}

export default Boid
