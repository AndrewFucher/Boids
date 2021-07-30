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
            let facingDirection: Vector = new Vector(Math.random(), Math.random())
            // let facingDirection: Vector = new Vector(0, 1)
            facingDirection.normilize()

            const boid: Boid = {
                id: i,
                color: this.boidsConfiguration.colorProperties.color,
                facingDirection: facingDirection,
                location: boidLocaton,
                radius: this.boidsConfiguration.radius,
            }
            this.arrayOfBoids.push(boid)
            // console.log(boid.facingDirection)
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
        let numberOfBoidsInRangeOfSeparation: number = 0

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
            numberOfBoidsInRangeOfSeparation = 0

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
                if (i === j) {
                    return
                }

                rangeBetweenBoids = new Vector(
                    currentBoid.location.x - neighbourBoid.location.x,
                    currentBoid.location.y - neighbourBoid.location.y
                ).getLenght()

                // Calculation of vectors
                // separation
                if (rangeBetweenBoids <= this.boidsConfiguration.range.separation) {
                    let a = new Vector(
                        neighbourBoid.location.x - currentBoid.location.x,
                        neighbourBoid.location.y - currentBoid.location.y
                    )
                    a.normilize()
                    a.divideSelf(rangeBetweenBoids)
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
            if (numberOfBoidsInRangeOfSeparation !== 0) {
                separationVector.divideSelf(numberOfBoidsInRangeOfSeparation)
                separationVector.normilize()
                separationVector.multiplySelf(this.boidsConfiguration.weight.separation)
                separationVector.substractFromSelf(currentBoid.facingDirection.x, currentBoid.facingDirection.y)
                separationVector.limitSelf(this.boidsConfiguration.force.maxForce.separation)
            }

            if (numberOfBoidsInRangeOfAlignment !== 0) {
                alignmentVector.divideSelf(numberOfBoidsInRangeOfAlignment)
                alignmentVector.normilize()
                alignmentVector.multiplySelf(this.boidsConfiguration.weight.alignment)
                alignmentVector.substractFromSelf(currentBoid.facingDirection.x, currentBoid.facingDirection.y)
                alignmentVector.limitSelf(this.boidsConfiguration.force.maxForce.alignment)
            }

            if (numberOfBoidsInRangeOfCohesion !== 0) {
                cohesionVector.divideSelf(numberOfBoidsInRangeOfCohesion)
                // cohesionVector.normilize()
                // console.log(cohesionVector)
                // cohesionVector.multiplySelf(this.boidsConfiguration.weight.cohesion)
                // console.log(cohesionVector)
                cohesionVector.substractFromSelf(currentBoid.location.x, currentBoid.location.y)
                // console.log(cohesionVector)
                cohesionVector.normilize()
                cohesionVector.multiplySelf(this.boidsConfiguration.weight.cohesion)
                cohesionVector.substractFromSelf(currentBoid.facingDirection.x, currentBoid.facingDirection.y)
                cohesionVector.limitSelf(this.boidsConfiguration.force.maxForce.cohesion)
            }

            facingDirection = new Vector()

            // console.log(cohesionVector)

            if (i === 0) {
                const a = 'asdfsdf'
                // console.log(`
                // facingDirection: [${currentBoid.facingDirection.x}, ${currentBoid.facingDirection.y}]
                // separationVector: [${-separationVector.x}, ${-separationVector.y}]
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
            facingDirection.addToSelf(this.getVectorAgainstWallIfNeeded(currentBoid))
            // facingDirection.normilize()
            facingDirection.limitSelf(this.boidsConfiguration.force.maxForce.total)

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
        let vectorOppositeToWalls: Vector = new Vector()
        if (boid.location.x - maxRangeToWall < 0) vectorOppositeToWalls.x = 1 / boid.location.x
        if (boid.location.x + maxRangeToWall > this.canvasWidth)
            vectorOppositeToWalls.x = -1 / (this.canvasWidth - boid.location.x)
        if (boid.location.y - maxRangeToWall < 0) vectorOppositeToWalls.y = 1 / boid.location.y
        if (boid.location.y + maxRangeToWall > this.canvasHeight)
            vectorOppositeToWalls.y = -1 / (this.canvasHeight - boid.location.y)
        return vectorOppositeToWalls
    }

    // If I calculate everything separatly then it will be really slow! Like 3 times slower then it is now

    // private separate() {

    // }

    // private align() {

    // }

    // private cohere() {

    // }
}

export default Boids
