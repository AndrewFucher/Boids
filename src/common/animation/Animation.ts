import { BoidsConfiguration } from '../../configuration/api/boidsConfiguration'
import Boids from '../boids/base/Boids'
import Boid from '../boids/boid/Boid'

class Animation {
    // Configuration
    boidsConfiguration: BoidsConfiguration

    // Canvas
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    // Animation
    isAnimating: boolean
    fps: number
    timeIntervalBetweenFrames: number

    // Animation time frame
    prevFrameTime: number
    deltaTimeBetweenCalls: number

    // Boids data
    boids: Boids

    // Selected boid
    indexOfSelectedBoid: number
    updateSelectedBoid: (boid: Boid) => void

    constructor(
        canvas: HTMLCanvasElement,
        boidsConfiguration: BoidsConfiguration,
        updateSelectedBoid: (boid: Boid) => void
    ) {
        this.canvas = canvas
        this.boidsConfiguration = boidsConfiguration
        // console.log(canvas)
        this.context = this.canvas.getContext('2d')

        this.isAnimating = false
        this.fps = 60
        this.timeIntervalBetweenFrames = Math.ceil(1000 / 60)

        this.boids = new Boids(boidsConfiguration)
        this.checkCanvasSizes()
        this.boids.updateCanvasSize(canvas.width, canvas.height)
        this.boids.initializeNewBoids()

        this.prevFrameTime = Date.now()

        this.updateSelectedBoid = updateSelectedBoid
        this.indexOfSelectedBoid = -1

        this.registerHandlers()
    }

    registerHandlers() {
        this.canvas.onclick = this.canvasOnClickHandler
    }

    public start() {
        if (this.isAnimating) return
        this.isAnimating = true
        this.mainLoop()
    }

    public stop() {
        this.isAnimating = false
    }

    private runGameWorkflow() {
        // let t1 = Date.now()
        this.boids.runWorkflow()
        // console.log(Date.now() - t1)
        this.drawBoids()
    }

    private drawBoids() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Math.floor(boid.location.x), Math.floor(boid.location.y)

        this.boids.arrayOfBoids.forEach((boid, indexOfBoid) => {
            if (this.indexOfSelectedBoid === indexOfBoid) {
                this.context.beginPath()
                this.context.arc(boid.location.x, boid.location.y, boid.radius, 0, 2 * Math.PI)
                this.context.fillStyle = boid.color
                this.context.fill()
                return
            }
            this.context.beginPath()
            this.context.arc(boid.location.x, boid.location.y, boid.radius, 0, 2 * Math.PI)
            this.context.fillStyle = boid.color
            this.context.fill()
        })

        if (this.indexOfSelectedBoid !== -1) {
            this.drawBoidRanges(this.boids.arrayOfBoids[this.indexOfSelectedBoid])
        }
    }

    private drawBoidRanges(boid: Boid) {
        this.context.beginPath()
        this.context.arc(boid.location.x, boid.location.y, this.boidsConfiguration.range.separation, 0, 2 * Math.PI)
        // this.context.fillStyle = 'rgba(138, 43, 226, 0.3)'
        this.context.strokeStyle = 'rgba(138, 43, 226, 0.3)'
        this.context.lineWidth = 2
        this.context.stroke()
        // this.context.closePath()

        // this.context.restore()

        this.context.beginPath()
        this.context.arc(boid.location.x, boid.location.y, this.boidsConfiguration.range.alignment, 0, 2 * Math.PI)
        // this.context.fillStyle = 'rgba(138, 43, 226, 0.3)'
        this.context.strokeStyle = 'rgba(252, 186, 3, 0.3)'
        this.context.lineWidth = 2
        this.context.stroke()
        // this.context.closePath()

        this.context.beginPath()
        this.context.arc(boid.location.x, boid.location.y, this.boidsConfiguration.range.cohesion, 0, 2 * Math.PI)
        // this.context.fillStyle = 'rgba(138, 43, 226, 0.3)'
        this.context.strokeStyle = 'rgba(7, 232, 135, 0.3)'
        this.context.lineWidth = 2
        this.context.stroke()
        // this.context.closePath()
    }

    canvasOnClickHandler = (event: MouseEvent) => {
        this.indexOfSelectedBoid = -1
        this.boids.arrayOfBoids.forEach((boid, indexOfBoid) => {
            if (
                Math.abs(event.x - boid.location.x) <= boid.radius * 2 &&
                Math.abs(event.y - boid.location.y) <= boid.radius * 2
            ) {
                this.indexOfSelectedBoid = indexOfBoid
                return
            }
        })

        // this.context.fillStyle = 'rgba(123, 120, 1, 0.3)'
        // this.context.fillRect(event.x - 5, event.y - 5, 10, 10)

        // this.stop()

        if (this.indexOfSelectedBoid === -1) this.updateSelectedBoid(null)
    }

    mainLoop = () => {
        // console.log(this.isAnimating)
        if (this.isAnimating === false) return

        // Doing some stuff with FPS
        const currentTime = Date.now()
        this.deltaTimeBetweenCalls = currentTime - this.prevFrameTime
        if (this.deltaTimeBetweenCalls > this.timeIntervalBetweenFrames) {
            // let t1 = Date.now()
            this.runGameWorkflow()
            this.checkCanvasSizes()
            if (this.indexOfSelectedBoid !== -1)
                this.updateSelectedBoid(this.boids.arrayOfBoids[this.indexOfSelectedBoid])
            // console.log(Date.now() - t1)
        }

        // console.log(this.deltaTimeBetweenCalls)

        // console.log(currentTime)
        // console.log(this.deltaTimeBetweenCalls)
        window.requestAnimationFrame(this.mainLoop)
    }

    checkCanvasSizes() {
        if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
        }

        if (this.boids.canvasWidth !== this.canvas.width || this.boids.canvasHeight !== this.canvas.height) {
            this.boids.updateCanvasSize(this.canvas.width, this.canvas.height)
            this.context = this.canvas.getContext('2d')
        }
    }
}

export default Animation
