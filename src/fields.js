function Field(type, dir, pos) {
  this.type = type;
  if (pos) this.pos = pos;
  this.dir = dir;

  this.setStrength = function (a) {
    if (this.type == "point") this.dir *= a;
    else this.dir.mult(a);
  }
}

function PointField(pos, strength) {
  var r = new Field("point", -1 * strength, pos);
  return r;
}

function RepulsivePointField(pos, strength) {
  var r = new Field("point", strength, pos);
  return r;
}

function ConservativeField(dir, optionalStrength) {
  if (optionalStrength) var r = new Field("conservative", dir.copy().mult(optionalStrength));
  else var r = new Field("conservative", dir.copy());
  return r;
}
