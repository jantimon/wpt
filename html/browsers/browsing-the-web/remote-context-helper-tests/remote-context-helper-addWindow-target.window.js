// META: title=RemoteContextHelper addWindow target
// META: script=/common/dispatcher/dispatcher.js
// META: script=/common/get-host-info.sub.js
// META: script=/common/utils.js
// META: script=/resources/testharness.js
// META: script=/resources/testharnessreport.js
// META: script=/html/browsers/browsing-the-web/remote-context-helper/resources/remote-context-helper.js
// META: script=./resources/test-helper.js

promise_test(async t => {
  const rcHelper = new RemoteContextHelper({});
  const name = 'a name';
  const main = await rcHelper.addWindow({target: name});
  await assertSimplestScriptRuns(main);
  await assertWindowNameEquals(main, name);
});
