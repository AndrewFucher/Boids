import { BoidsConfiguration } from '../../configuration/api/boidsConfiguration'
import Boids from '../boids/base/Boids'

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

    constructor(canvas: HTMLCanvasElement, boidsConfiguration: BoidsConfiguration) {
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
        // // console.log(this.canvas.width)
        // let boid = this.boids.arrayOfBoids[0]
        // // console.log(100, 100, 1000, 0, 2 * Math.PI)
        // this.context.beginPath()
        // this.context.arc(1000, 100, 1000, 0, 2 * Math.PI)
        // this.context.fillStyle = 'white'
        // this.context.fill()

        // this.context = this.canvas.getContext('2d')
        // this.context.fillStyle = 'black'
        // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        // this.context.fill()
        // this.context.restore()
        // this.context.fillStyle = 'white'
        // this.context.lineWidth = 20
        // this.context.fillRect(100, 100, 20, 20)
        // this.context.fill()
        // this.context.closePath()
        // console.log(this.context.fillStyle)

        this.boids.arrayOfBoids.forEach((boid) => {
            this.context.beginPath()
            this.context.arc(Math.floor(boid.location.x), Math.floor(boid.location.y), boid.radius, 0, 2 * Math.PI)
            this.context.fillStyle = boid.color
            this.context.fill()
        })
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
