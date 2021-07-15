/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"estadocuenta/EstadoCuenta/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});