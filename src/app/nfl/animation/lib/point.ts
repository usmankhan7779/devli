export class Point {
  x: number;
  y: number;

  static clone(p: Point) {
    return {
      x: p.x,
      y: p.y
    };
  }

  static equals(p1: Point, p2: Point) {
    return p1.x === p2.x && p1.y === p2.y;
  }

  static distance(p1: Point, p2: Point) {
    const deltaX = p1.x - p2.x;
    const deltaY = p1.y - p2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
}
