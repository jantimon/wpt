// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js

'use strict';

const validFocusBehaviors = ['focus-captured-surface', 'no-focus-change'];
const validDisplaySurfaces = ['window', 'browser'];

test(() => {
  assert_own_property(window, 'CaptureController');
}, 'CaptureController in window');

const stopTracks = stream => stream.getTracks().forEach(track => track.stop());

validFocusBehaviors.forEach(
    (focusBehavior) => test(
        (t) => {
          const controller = new CaptureController();
          assert_throws_dom(
              'InvalidStateError',
              () => controller.setFocusBehavior(focusBehavior));
        },
        `setFocusBehavior("${
            focusBehavior}") must throw InvalidStateError if not bound`));


['invalid', null, undefined, {}, true].forEach(
    (focusBehavior) => test(() => {
      const controller = new CaptureController();
      assert_throws_js(
          TypeError, () => controller.setFocusBehavior(focusBehavior));
    }, `setFocusBehavior("${focusBehavior}") must throw TypeError`));

promise_test(async (t) => {
  const controller = new CaptureController();
  await test_driver.bless('getDisplayMedia()');
  const stream = await navigator.mediaDevices.getDisplayMedia({controller});
  t.add_cleanup(() => stopTracks(stream));
  assert_equals(stream.getTracks().length, 1);
  assert_equals(stream.getVideoTracks().length, 1);
  assert_equals(stream.getAudioTracks().length, 0);
}, 'getDisplayMedia({controller}) must succeed');

['invalid', null, {}, true].forEach(
    (controller) => promise_test(
        async (t) => {
          await test_driver.bless('getDisplayMedia()');
          await promise_rejects_js(
              t, TypeError,
              navigator.mediaDevices.getDisplayMedia({controller}));
        },
        `getDisplayMedia({controller: ${
            controller}}) must fail with TypeError`));

promise_test(async (t) => {
  const controller = new CaptureController();

  await test_driver.bless('getDisplayMedia()');
  const stream = await navigator.mediaDevices.getDisplayMedia({controller});
  t.add_cleanup(() => stopTracks(stream));

  await test_driver.bless('getDisplayMedia()');
  const p = navigator.mediaDevices.getDisplayMedia({controller});
  t.add_cleanup(async () => {
    try {
      stopTracks(await p);
    } catch {
    }
  });
  await promise_rejects_dom(
      t, 'InvalidStateError', Promise.race([p, Promise.resolve()]),
      'getDisplayMedia should have returned an already-rejected promise.');
}, 'getDisplayMedia({controller}) must fail with InvalidStateError if controller is bound');

validDisplaySurfaces.forEach((displaySurface) => {
  validFocusBehaviors.forEach(
      (focusBehavior) => promise_test(
          async (t) => {
            const controller = new CaptureController();
            await test_driver.bless('getDisplayMedia()');
            const stream = await navigator.mediaDevices.getDisplayMedia(
                {controller, video: {displaySurface}});
            t.add_cleanup(() => stopTracks(stream));
            controller.setFocusBehavior(focusBehavior);
          },
          `setFocusBehavior("${
              focusBehavior}") must succeed when window of opportunity is opened if capturing a ${
              displaySurface}`));
});

validDisplaySurfaces.forEach((displaySurface) => {
  validFocusBehaviors.forEach(
      (focusBehavior) => promise_test(
          async (t) => {
            const controller = new CaptureController();
            await test_driver.bless('getDisplayMedia()');
            const stream = await navigator.mediaDevices.getDisplayMedia(
                {controller, video: {displaySurface}});
            stopTracks(stream);
            assert_throws_dom(
                'InvalidStateError',
                () => controller.setFocusBehavior(focusBehavior));
          },
          `setFocusBehavior("${
              focusBehavior}") must throw InvalidStateError when video track is stopped if capturing a ${
              displaySurface}`));
});

validFocusBehaviors.forEach(
    (focusBehavior) => promise_test(
        async (t) => {
          const controller = new CaptureController();
          await test_driver.bless('getDisplayMedia()');
          const stream = await navigator.mediaDevices.getDisplayMedia(
              {controller, video: {displaySurface: 'monitor'}});
          t.add_cleanup(() => stopTracks(stream));
          assert_throws_dom(
              'InvalidStateError',
              () => controller.setFocusBehavior(focusBehavior));
        },
        `setFocusBehavior("${
            focusBehavior}") must throw InvalidStateError if capturing a monitor`));


validDisplaySurfaces.forEach((displaySurface) => {
  validFocusBehaviors.forEach(
      (focusBehavior) => promise_test(
          async (t) => {
            const controller = new CaptureController();
            await test_driver.bless('getDisplayMedia()');
            const stream = await navigator.mediaDevices.getDisplayMedia(
                {controller, video: {displaySurface}});
            t.add_cleanup(() => stopTracks(stream));
            await new Promise((resolve) => step_timeout(resolve, 0));
            assert_throws_dom(
                'InvalidStateError',
                () => controller.setFocusBehavior(focusBehavior));
          },
          `setFocusBehavior("${
              focusBehavior}") must throw InvalidStateError when window of opportunity is closed if capturing a ${
              displaySurface}`));
});
