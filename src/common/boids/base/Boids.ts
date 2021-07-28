import { BoidsConfiguration } from '../../../configuration/api/boidsConfiguration'
import { Vector } from '../../vector/Vector'
import Boid from '../boid/Boid'

class Boids {
    boidsConfiguration: BoidsConfiguration

    arrayOfBoids: Array<Boid>

    canvasWidth: number
    canvasHeight: number

    constructor(boidsConfiguration: BoidsConfiguration) {
        this.boidsConfiguration = boidsConfiguration
    }

    public initializeNewBoids() {
        this.arrayOfBoids = new Array()
        const rangeBetweenBoids = this.boidsConfiguration.radius * 3
        const maxInRow = Math.floor((this.canvasWidth - 200) / rangeBetweenBoids)
        const inversiveCount = 1 / this.boidsConfiguration.count
        for (let i = 0; i < this.boidsConfiguration.count; i++) {
            let temp = (i % maxInRow) + 1
            let boidLocaton: Point = {
                x: rangeBetweenBoids * temp + 100,
                y: rangeBetweenBoids * Math.floor(i / maxInRow) + rangeBetweenBoids + 200,
            }
            // let facingDirection: Vector = new Vector(Math.random(), Math.random())
            let facingDirection: Vector = new Vector(1, 1)
            facingDirection.normilize()

            const boid: Boid = {
                color: this.boidsConfiguration.colorProperties.color,
                facingDirection: facingDirection,
                location: boidLocaton,
                radius: this.boidsConfiguration.radius,
            }
            this.arrayOfBoids.push(boid)
            console.log(boid.facingDirection)
        }

        // console.log(this.arrayOfBoids)
    }

    public updateCanvasSize(newWidth: number, newHeight: number) {
        this.canvasWidth = newWidth
        this.canvasHeight = newHeight
    }

    public runWorkflow() {
        this.runReevaluationOfVectors()

        this.moveBoids()
    }

    private moveBoids() {
        this.arrayOfBoids.map((boid) => {
            boid.location.x += boid.facingDirection.x * this.boidsConfiguration.speed.x
            boid.location.y += boid.facingDirection.y * this.boidsConfiguration.speed.y
            // console.log(boid)
        })
    }

    private runReevaluationOfVectors() {
        let newArrayOfBoids: Array<Boid> = this.arrayOfBoids.slice()

        // Steps
        let separationVector: Vector = new Vector()

        let alignmentVector: Vector = new Vector()
        let numberOfBoidsInRangeOfAlignment: number = 0

        let cohesionVector: Vector = new Vector()
        let numberOfBoidsInRangeOfCohesion: number = 0

        // Range between two boids
        let rangeBetweenBoids: number = 0

        // Final vector
        let facingDirection: Vector = new Vector()

        this.arrayOfBoids.forEach((currentBoid, i) => {
            separationVector = new Vector()

            alignmentVector = new Vector()
            numberOfBoidsInRangeOfAlignment = 0

            cohesionVector = new Vector()
            numberOfBoidsInRangeOfCohesion = 0

            let tempVector: Vector = this.getVectorOutIfBoidIsInWall(currentBoid)
            if (tempVector) {
                this.arrayOfBoids[i].facingDirection = tempVector
                return
            }

            this.arrayOfBoids.forEach((neighbourBoid, j) => {
                if (i === j) return

                rangeBetweenBoids = currentBoid.facingDirection
                    .substract(neighbourBoid.facingDirection.x, neighbourBoid.facingDirection.y)
                    .getLenght()

                // Calculation of vectors
                // separation
                if (rangeBetweenBoids <= this.boidsConfiguration.range.separation) {
                    let a = neighbourBoid.facingDirection.substract(
                        currentBoid.facingDirection.x,
                        currentBoid.facingDirection.y
                    )
                    a.normilize()
                    separationVector.addToSelf(a)
                }

                // alignment
                if (rangeBetweenBoids <= this.boidsConfiguration.range.alignment) {
                    alignmentVector.addToSelf(neighbourBoid.facingDirection)
                    numberOfBoidsInRangeOfAlignment++
                }

                // cohesion
                if (rangeBetweenBoids <= this.boidsConfiguration.range.cohesion) {
                    cohesionVector.addToSelf(neighbourBoid.location.x, neighbourBoid.location.y)
                    numberOfBoidsInRangeOfCohesion++
                }
            })

            // Final steps in calculations
            // separationVector.normilize()

            alignmentVector.x /= numberOfBoidsInRangeOfAlignment
            alignmentVector.y /= numberOfBoidsInRangeOfAlignment
            alignmentVector.normilize()

            cohesionVector.x /= numberOfBoidsInRangeOfCohesion
            cohesionVector.y /= numberOfBoidsInRangeOfCohesion
            cohesionVector.substractFromSelf(currentBoid.location.x, currentBoid.location.y)
            cohesionVector.normilize()

            facingDirection = new Vector()

            // console.log(cohesionVector)

            if (i === 0) {
                const a = 'asdfsdf'
                // console.log(`
                // facingDirection: [${currentBoid.facingDirection.x}, ${currentBoid.facingDirection.y}]
                // separationVector: [${separationVector.x}, ${separationVector.y}]
                // alignmentVector: [${alignmentVector.x}, ${alignmentVector.x}]
                // cohesionVector: [${cohesionVector.x}, ${cohesionVector.y}]
                // againstWallVector: [${this.getVectorAgainstWallIfNeeded(currentBoid).x}, ${
                //     this.getVectorAgainstWallIfNeeded(currentBoid).y
                // }]`)
            }

            facingDirection.addToSelf(currentBoid.facingDirection)
            facingDirection.addToSelf(separationVector.getOppositeVector())
            facingDirection.addToSelf(alignmentVector)
            facingDirection.addToSelf(cohesionVector)
            // facingDirection.addToSelf(this.getVectorAgainstWallIfNeeded(currentBoid))
            facingDirection.normilize()

            newArrayOfBoids[i].facingDirection = facingDirection
        })

        this.arrayOfBoids = newArrayOfBoids
    }
    private getVectorOutIfBoidIsInWall(boid: Boid) {
        const maxRangeToWall: number = this.boidsConfiguration.radius
        if (boid.location.x - maxRangeToWall < 0) return new Vector(1, 0)
        if (boid.location.x + maxRangeToWall > this.canvasWidth) return new Vector(-1, 0)
        if (boid.location.y - maxRangeToWall < 0) return new Vector(0, 1)
        if (boid.location.y + maxRangeToWall > this.canvasHeight) return new Vector(0, -1)
        return null
    }
    private getVectorAgainstWallIfNeeded(boid: Boid): Vector {
        const maxRangeToWall: number = this.boidsConfiguration.range.wall + this.boidsConfiguration.radius
        if (boid.location.x - maxRangeToWall < 0) return new Vector(1, 0)
        if (boid.location.x + maxRangeToWall > this.canvasWidth) return new Vector(-1, 0)
        if (boid.location.y - maxRangeToWall < 0) return new Vector(0, 1)
        if (boid.location.y + maxRangeToWall > this.canvasHeight) return new Vector(0, -1)
        return new Vector(0, 0)
    }

    // If I calculate everything separatly then it will be really slow!

    // private separate() {

    // }

    // private align() {

    // }

    // private cohere() {

    // }
}

export default Boids
