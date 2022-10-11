// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.gradient.radial.transform.1
// Description:Radial gradient coordinates are relative to the coordinate space at the time of filling
// Note:

importScripts("/resources/testharness.js");
importScripts("/html/canvas/resources/canvas-tests.js");

var t = async_test("Radial gradient coordinates are relative to the coordinate space at the time of filling");
var t_pass = t.done.bind(t);
var t_fail = t.step_func(function(reason) {
    throw reason;
});
t.step(function() {

var canvas = new OffscreenCanvas(100, 50);
var ctx = canvas.getContext('2d');

var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 11.2);
g.addColorStop(0, '#0f0');
g.addColorStop(0.5, '#0f0');
g.addColorStop(0.51, '#f00');
g.addColorStop(1, '#f00');
ctx.fillStyle = g;
ctx.translate(50, 25);
ctx.scale(10, 10);
ctx.fillRect(-5, -2.5, 10, 5);
_assertPixel(canvas, 25,25, 0,255,0,255);
_assertPixel(canvas, 50,25, 0,255,0,255);
_assertPixel(canvas, 75,25, 0,255,0,255);
t.done();

});
done();
