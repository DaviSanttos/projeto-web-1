export class IdGenerator {
  static generate(): number {
    const timestamp = Date.now(); // ex: 1717864153123
    const random = Math.floor(Math.random() * 1000); // ex: 382
    return Number(`${timestamp}${random}`); // ex: 1717864153123382
  }
}