const assert = require("assert");
const strio = require("./index.js");

(() => {
  const fmt = strio.Object({
    name: strio.String(10),
    age: strio.String(3),
    book: strio.Object({
      type: strio.String(10),
      title: strio.String(10)
    })
  });
  const data = {
    name: "Nicolas".padEnd(10, " "),
    age: "37".padEnd(3, " "),
    book: {
      type: "comics".padEnd(10, " "),
      title: "Black Hole".padEnd(10, " ")
    }
  };
  assert.equal(strio.write(fmt, data),
    "Nicolas   37 comics    Black Hole");
  assert.deepEqual(
    strio.read(fmt,
      "Nicolas   37 comics    Black Hole"),
    data);
})();

(() => {
  const arr = [41, 0xa987, 43, 44];
  const fmt = strio.Array(
    4,
    strio.Number(2, false, false));
  const out = strio.write(fmt, arr);
  const inp = strio.read(fmt, out);
  assert.deepEqual(inp, arr);
})();

(() => {
  const fmt = strio.Number(2, false, true);
  const out = strio.write(fmt, 10);
  assert.equal(out.charCodeAt(0), 0);
  assert.equal(out.charCodeAt(1), 10);
  assert.equal(strio.read(fmt, out), 10);
})();

(() => {
  const fmt = strio.Number(2, false, true);
  const out = strio.write(fmt, 1032);
  assert.equal(out.charCodeAt(0), 4);
  assert.equal(out.charCodeAt(1), 8);
  assert.equal(strio.read(fmt, out), 1032);
})();

(() => {
  const fmt = strio.Number(2, false, false);
  const out = strio.write(fmt, 10);
  assert.equal(out.charCodeAt(1), 0);
  assert.equal(out.charCodeAt(0), 10);
  assert.equal(strio.read(fmt, out), 10);
})();

(() => {
  const fmt = strio.Number(2, false, false);
  const out = strio.write(fmt, 1032);
  assert.equal(out.charCodeAt(1), 4);
  assert.equal(out.charCodeAt(0), 8);
  assert.equal(strio.read(fmt, out), 1032);
})();

(() => {
  const n = 1032;
  const fmt = strio.Number(2, true, true);
  const out = strio.write(fmt, n);
  assert.equal(out.charCodeAt(0), 4);
  assert.equal(out.charCodeAt(1), 8);
  assert.equal(strio.read(fmt, out), n);
})();

(() => {
  const n = -1032;
  const fmt = strio.Number(2, true, true);
  const out = strio.write(fmt, n);
  assert.equal(out.charCodeAt(0), 132);
  assert.equal(out.charCodeAt(1), 8);
  assert.equal(strio.read(fmt, out), n);
})();

(() => {
  const n = 1032;
  const fmt = strio.Number(2, true, false);
  const out = strio.write(fmt, n);
  assert.equal(out.charCodeAt(1), 4);
  assert.equal(out.charCodeAt(0), 8);
  assert.equal(strio.read(fmt, out), n);
})();

(() => {
  const n = -1032;
  const fmt = strio.Number(2, true, false);
  const out = strio.write(fmt, n);
  assert.equal(out.charCodeAt(1), 132);
  assert.equal(out.charCodeAt(0), 8);
  assert.equal(strio.read(fmt, out), n);
})();

