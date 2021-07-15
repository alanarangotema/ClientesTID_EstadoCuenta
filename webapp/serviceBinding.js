function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZSCP_ZCAP_GET_AGENCIA_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}