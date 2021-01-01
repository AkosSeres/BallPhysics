/* eslint-disable no-undef */
import Polygon from '../src/polygon';
import Vec2 from '../src/vec2';

test('flip triangle points order if it is clockwise', () => {
  const triangle = new Polygon([new Vec2(2, 1), new Vec2(1, 4), new Vec2(4, 5)]);
  expect(triangle)
    .toEqual(
      new Polygon([new Vec2(4, 5), new Vec2(1, 4), new Vec2(2, 1)]),
    );

  triangle.makeAntiClockwise();
  expect(triangle).toEqual(
    new Polygon([new Vec2(4, 5), new Vec2(1, 4), new Vec2(2, 1)]),
  );
});

test('flip quadrilateral points order if it is clockwise', () => {
  const quadrilateral = new Polygon([
    new Vec2(2, 1),
    new Vec2(1, 4),
    new Vec2(2, 6),
    new Vec2(4, 5),
  ]);
  expect(quadrilateral)
    .toEqual(
      new Polygon([
        new Vec2(4, 5),
        new Vec2(2, 6),
        new Vec2(1, 4),
        new Vec2(2, 1),
      ]),
    );

  quadrilateral.makeAntiClockwise();
  expect(quadrilateral).toEqual(
    new Polygon([
      new Vec2(4, 5),
      new Vec2(2, 6),
      new Vec2(1, 4),
      new Vec2(2, 1),
    ]),
  );
});

test('flip square points order if it is clockwise', () => {
  const quadrilateral = new Polygon([
    new Vec2(-1, -1),
    new Vec2(-1, 1),
    new Vec2(1, 1),
    new Vec2(1, -1),
  ]);
  expect(quadrilateral)
    .toEqual(new Polygon([
      new Vec2(1, -1),
      new Vec2(1, 1),
      new Vec2(-1, 1),
      new Vec2(-1, -1),
    ]));

  quadrilateral.makeAntiClockwise();
  expect(quadrilateral).toEqual(new Polygon([
    new Vec2(1, -1),
    new Vec2(1, 1),
    new Vec2(-1, 1),
    new Vec2(-1, -1),
  ]));
});

test('flip pentagon points order if it is clockwise', () => {
  const quadrilateral = new Polygon([
    new Vec2(2, 1),
    new Vec2(1, 4),
    new Vec2(-6, 5),
    new Vec2(2, 6),
    new Vec2(4, 5)]);
  expect(quadrilateral)
    .toEqual(
      new Polygon([
        new Vec2(4, 5),
        new Vec2(2, 6),
        new Vec2(-6, 5),
        new Vec2(1, 4),
        new Vec2(2, 1)]),
    );

  quadrilateral.makeAntiClockwise();
  expect(quadrilateral).toEqual(
    new Polygon([
      new Vec2(4, 5),
      new Vec2(2, 6),
      new Vec2(-6, 5),
      new Vec2(1, 4),
      new Vec2(2, 1)]),
  );
});

test('flip points of clockwise order polygon', () => {
  const points = [...Array(100).keys()].map(
    (num) => Vec2.fromAngle((Math.PI * 2 * num) / 100),
  ).reverse();

  expect(new Polygon(points)).toEqual(new Polygon(points.reverse()));
});

test('returns the correct side vector', () => {
  const triangle = new Polygon([new Vec2(4, 5), new Vec2(1, 4), new Vec2(2, 1)]);
  expect(triangle.getSideVector(0)).toEqual(new Vec2(-3, -1));
  expect(triangle.getSideVector(1)).toEqual(new Vec2(1, -3));
  expect(triangle.getSideVector(2)).toEqual(new Vec2(2, 4));
  expect(triangle.getSideVector(3)).toEqual(new Vec2(-3, -1));
  expect(triangle.getSideVector(-1)).toEqual(new Vec2(2, 4));
});

test('throw error if number of points is not enough', () => {
  const createPolygon = (points) => () => new Polygon(points);

  expect(createPolygon([])).toThrow();
  expect(createPolygon([new Vec2(1, 1)])).toThrow();
  expect(createPolygon([new Vec2(1, 1), new Vec2(2, 2)])).toThrow();
  expect(createPolygon([
    new Vec2(1, 1),
    new Vec2(2, 2),
    new Vec2(3, 1),
  ])).not.toThrow();
});

test('right intersection for different polygon orientations', () => {
  const square1 = new Polygon([
    new Vec2(-1, -1),
    new Vec2(1, -1),
    new Vec2(1, 1),
    new Vec2(-1, 1),
  ]);
  const poly2 = new Polygon([
    new Vec2(-12, -14),
    new Vec2(16, -12),
    new Vec2(12, 18),
    new Vec2(-13, 18),
  ]);
  const poly3 = new Polygon([
    new Vec2(-12, -14),
    new Vec2(-16, -12),
    new Vec2(-12, -18),
    new Vec2(-13, -18),
  ]);
  const poly4 = new Polygon([
    new Vec2(1, 2),
    new Vec2(4, 2),
    new Vec2(4, 3),
    new Vec2(1, 3),
  ]);
  const poly5 = new Polygon([
    new Vec2(2, -1),
    new Vec2(3, -1),
    new Vec2(3, 5),
    new Vec2(2, 5),
  ]);
  const poly6 = new Polygon([
    new Vec2(2, 3),
    new Vec2(3, 3),
    new Vec2(3, 2),
    new Vec2(2, 2),
  ].reverse());
  const poly7 = new Polygon([
    new Vec2(-2, 3),
    new Vec2(2, 3),
    new Vec2(2, -3),
    new Vec2(-2, -3),
  ]);
  const poly8 = new Polygon([
    new Vec2(-1, -1),
    new Vec2(-1, -5),
    new Vec2(-5, -5),
    new Vec2(-5, -1),
  ]);
  const poly9 = new Polygon([
    new Vec2(-1, -3),
    new Vec2(-2, -3),
    new Vec2(-2, -1),
    new Vec2(-1, -1),
  ]);
  const poly10 = new Polygon([
    new Vec2(0, 0),
    new Vec2(4, 0),
    new Vec2(4, 4),
    new Vec2(0, 4),
  ]);
  const poly11 = new Polygon([
    new Vec2(-2, 1),
    new Vec2(2, 1),
    new Vec2(2, 3),
    new Vec2(-2, 3),
  ]);
  const poly12 = new Polygon([
    new Vec2(2, 1),
    new Vec2(2, 3),
    new Vec2(0, 3),
    new Vec2(0, 1),
  ]);

  expect(Polygon.intersection(square1, poly2)).toEqual(square1);
  expect(Polygon.intersection(square1, poly3)).toBe(undefined);
  expect(Polygon.intersection(poly4, poly5)).toEqual(poly6);
  expect(Polygon.intersection(poly7, poly8)).toEqual(poly9);
  expect(Polygon.intersection(poly10, poly11)).toEqual(poly12);
});

test('fractures the plane well', () => {
  const fractures = Polygon.fracture([
    new Vec2(0, 0.4),
    new Vec2(-2.2, 0.3),
    new Vec2(2.5, 0.01),
    new Vec2(0.1, 2.2),
    new Vec2(0, -2.32),
  ]);
});
