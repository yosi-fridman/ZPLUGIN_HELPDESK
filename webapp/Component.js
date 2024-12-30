sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast"
], function (Component, Button, Bar, MessageToast) {

	return Component.extend("zplugin_hd.Component", {
		metadata: {
			"manifest": "json"
		},

		init: function () {
			var oBundle = this.getModel("i18n").getResourceBundle();
			var rendererPromise = this._getRenderer();
			var sUrl = "https://nsd.ness-os.com/";

			// This is example code. Please replace with your implementation!

			/**
			 * Add two buttons to the options bar (previous called action menu) in the Me Area.
			 * The first button is only visible if the Home page of SAP Fiori launchpad is open.
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.addActionButton("sap.m.Button", {
					id: "myHomeButton",
					icon: "sap-icon://headset",
					text: oBundle.getText("CONTACT_HELPDESK"),
					press: function () {
						sap.m.URLHelper.redirect(sUrl, true);
					}
				}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.Home]);

				/*
				 * The second button is only visible when an app is open.
				 */

				//  oRenderer.addActionButton("sap.m.Button", {
				// 	id: "myAppButton",
				// 	icon: "sap-icon://sys-help",
				// 	text: "Help for App page",
				// 	press: function () {
				// 		MessageToast.show("You pressed the button that opens a help for apps page.");
				// 	}
				// }, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.App]);

			});
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});