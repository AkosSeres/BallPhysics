/* eslint-disable no-undef */
import Body from '../src/body';
import * as Collision from '../src/collision';
import Vec2 from '../src/vec2';

test('testing the Gilbert–Johnson–Keerthi collision detection algorithm', () => {
  const shape1 = new Body([
    new Vec2(-10, 1), new Vec2(-10, -1), new Vec2(10, -1), new Vec2(10, 1),
  ], new Vec2(0, 0), 0.2, 0, 0);
  const shape2 = new Body([
    new Vec2(3, 3), new Vec2(3, -3), new Vec2(4, -3), new Vec2(4, 3),
  ], new Vec2(0, 0), 0.2, 0, 0);

  expect(Collision.detectCollisionGJK(shape1, shape2)).toEqual(true);
});
