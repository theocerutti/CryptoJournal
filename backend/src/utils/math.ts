export class MyMath {
  static min(n1: number, n2: number): number {
    if (n1 === null || n1 === undefined) return n2;
    if (n2 === null || n2 === undefined) return n1;
    return Math.min(n1, n2);
  }

  static max(n1: number, n2: number): number {
    if (n1 === null || n1 === undefined) return n2;
    if (n2 === null || n2 === undefined) return n1;
    return Math.max(n1, n2);
  }
}
