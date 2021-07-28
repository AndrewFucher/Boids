export class Vector {
    public x: number
    public y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    public addToSelf(vector: Vector): void
    public addToSelf(x: number, y: number): void
    public addToSelf(xOrVectorOrPoint: number | Vector, y?: number): void {
        // console.log(typeof xOrVectorOrPoint)
        if (xOrVectorOrPoint instanceof Vector) {
            this.x += (xOrVectorOrPoint as Vector).x
            this.y += (xOrVectorOrPoint as Vector).y
        } else if (typeof xOrVectorOrPoint === 'number') {
            this.x += xOrVectorOrPoint as number
            this.y += y
        }
    }

    public add(vector: Vector): Vector
    public add(x: number, y: number): Vector
    public add(xOrVector: number | Vector, y?: number) {
        if (typeof xOrVector === typeof Vector) {
            return new Vector(this.x + (xOrVector as Vector).x, this.y + (xOrVector as Vector).y)
        } else if (typeof xOrVector === typeof Number) {
            return new Vector(this.x + (xOrVector as number), this.y + y)
        }
    }

    public substractFromSelf(x: number, y: number) {
        this.x -= x
        this.y -= y
    }

    public substract(x: number, y: number) {
        return new Vector(this.x - x, this.y - y)
    }

    public getOppositeVector() {
        return new Vector(-this.x, -this.y)
    }

    public copy() {
        return new Vector(this.x, this.y)
    }

    public getLenght() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    public normilize() {
        const invSqrt = this.fastInvSqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))

        this.x *= invSqrt
        this.y *= invSqrt
    }

    private fastInvSqrt(x: number): number {
        let i = this.floatToUInt32(x)
        i = 0x5f3759df - (i >> 1)
        const y = this.uint32ToFloat(i)
        return y * (1.5 - 0.5 * x * y * y)
    }

    private floatToUInt32(x: number): number {
        const buf = new ArrayBuffer(4)
        new Float32Array(buf)[0] = x
        return new Uint32Array(buf)[0]
    }

    private uint32ToFloat(i: number): number {
        const buf = new ArrayBuffer(4)
        new Uint32Array(buf)[0] = i
        return new Float32Array(buf)[0]
    }
}
