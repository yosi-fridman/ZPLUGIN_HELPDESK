/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zplugin_hd/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});