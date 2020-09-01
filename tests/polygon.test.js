const Polygon = require('../src/polygon');
const Vec2 = require('../src/vec2');

test('flip triangle points order if it is clockwise', () => {
    let triangle =
        new Polygon([new Vec2(2, 1), new Vec2(1, 4), new Vec2(4, 5)]);
    expect(triangle)
        .toEqual(
            new Polygon([new Vec2(4, 5), new Vec2(1, 4), new Vec2(2, 1)]));

    triangle.makeAntiClockwise();
    expect(triangle).toEqual(
        new Polygon([new Vec2(4, 5), new Vec2(1, 4), new Vec2(2, 1)]));
});

test('flip quadrilateral points order if it is clockwise', () => {
    let quadrilateral =
        new Polygon(
            [new Vec2(2, 1), new Vec2(1, 4), new Vec2(2, 6), new Vec2(4, 5)]);
    expect(quadrilateral)
        .toEqual(
            new Polygon(
                [new Vec2(4, 5), new Vec2(2, 6), new Vec2(1, 4), new Vec2(2, 1)]));

    quadrilateral.makeAntiClockwise();
    expect(quadrilateral).toEqual(
        new Polygon(
            [new Vec2(4, 5), new Vec2(2, 6), new Vec2(1, 4), new Vec2(2, 1)]));
});

test('flip square points order if it is clockwise', () => {
    let quadrilateral =
        new Polygon(
            [new Vec2(-1, -1), new Vec2(-1, 1), new Vec2(1, 1), new Vec2(1, -1)]);
    expect(quadrilateral)
        .toEqual(
            new Polygon(
                [new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1), new Vec2(-1, -1)]));

    quadrilateral.makeAntiClockwise();
    expect(quadrilateral).toEqual(
        new Polygon(
            [new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1), new Vec2(-1, -1)]));
});

test('flip pentagon points order if it is clockwise', () => {
    let quadrilateral =
        new Polygon(
            [new Vec2(2, 1), new Vec2(1, 4), new Vec2(-6, 5), new Vec2(2, 6), new Vec2(4, 5)]);
    expect(quadrilateral)
        .toEqual(
            new Polygon(
                [new Vec2(4, 5), new Vec2(2, 6), new Vec2(-6, 5), new Vec2(1, 4), new Vec2(2, 1)]));

    quadrilateral.makeAntiClockwise();
    expect(quadrilateral).toEqual(
        new Polygon(
            [new Vec2(4, 5), new Vec2(2, 6), new Vec2(-6, 5), new Vec2(1, 4), new Vec2(2, 1)]));
});

test('flip points of clockwise order polygon', () => {
    let points = [...Array(100).keys()].map((num) => {
        return Vec2.fromAngle(Math.PI * 2 * num / 100);
    }).reverse();

    expect(new Polygon(points)).toEqual(new Polygon(points.reverse()));
});

test('returns the correct side vector', () => {
    let triangle =
        new Polygon([new Vec2(4, 5), new Vec2(1, 4), new Vec2(2, 1)]);
    expect(triangle.getSideVector(0)).toEqual(new Vec2(-3, -1));
    expect(triangle.getSideVector(1)).toEqual(new Vec2(1, -3));
    expect(triangle.getSideVector(2)).toEqual(new Vec2(2, 4));
    expect(triangle.getSideVector(3)).toEqual(new Vec2(-3, -1));
    expect(triangle.getSideVector(-1)).toEqual(new Vec2(2, 4));
});

test('throw error if number of points is not enough', () => {
    const createPolygon = (points) => {
        return () => {
            return new Polygon(points);
        };
    };

    expect(createPolygon([])).toThrow();
    expect(createPolygon([new Vec2(1, 1)])).toThrow();
    expect(createPolygon([new Vec2(1, 1), new Vec2(2, 2)])).toThrow();
    expect(createPolygon([new Vec2(1, 1), new Vec2(2, 2), new Vec2(3, 1)])).not.toThrow();
});
