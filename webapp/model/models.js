sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"estadocuenta/EstadoCuenta/constants/constants"
], function (JSONModel, Device) {
	"use strict";

	return {

		createClientListModel: function () {
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.loadData(CONSTESTCUENTA.URI.CURRENT_USER);
			var oModel = new sap.ui.model.json.JSONModel();
			oUserModel.attachRequestCompleted(function onCompleted(oEvent) {
				oModel.loadData(CONSTESTCUENTA.URI.LISTA_CLIENTES + "$filter=Usuario eq '" + oUserModel.getProperty("/name") + "'");
				oModel.attachRequestCompleted(function onCompleted(oEvent) {
					oBusy.close();
				});
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createSubClientListModel: function (codAgencia) {
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(CONSTESTCUENTA.URI.LISTA_SUBCLIENTES + "$filter=Agencia eq '" + codAgencia + "'");
			oModel.attachRequestCompleted(function onCompleted(oEvent) {
				oBusy.close();
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createDataModel: function (codCli, fechaDesde, fechaHasta) {
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var oModel = new sap.ui.model.json.JSONModel(this.buildPath(codCli, fechaDesde, fechaHasta));
			oModel.attachRequestCompleted(function onCompleted(oEvent) {
					oBusy.close();
			});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		buildPath: function (codCli, fechaDesde, fechaHasta) {
			
			/*
			Ejemplo para usar en SAP con la trx /n/iwfnd/gw_client
			/sap/opu/odata/sap/zscp_zcap_clie_ctacte2_srv/ZSCP_ZCAP_CLIE_CTACTE2Set?$filter=Cliente eq 'AR006' 
			and Desde eq datetime'2015-01-01T00:00:00' and Hasta eq datetime'2019-01-01T00:00:00'
			*/
			
			var path;
			var pathBase = CONSTESTCUENTA.URI.DATOS_TABLA + "$filter=Cliente eq ";
			var pathCli = "'" + codCli + "' ";
			
			var fechaDesdeYYYY = fechaDesde.substring(0,4);
			var fechaDesdeMM = fechaDesde.substring(4,6);
			var fechaDesdeDD = fechaDesde.substring(6);
			var fechaHastaYYYY = fechaHasta.substring(0,4);
			var fechaHastaMM = fechaHasta.substring(4,6);
			var fechaHastaDD = fechaHasta.substring(6);
			var pathDesde = "and Desde eq datetime'" + fechaDesdeYYYY + "-" + fechaDesdeMM + "-" + fechaDesdeDD + "T00:00:00' ";
			var pathHasta = "and Hasta eq datetime'" + fechaHastaYYYY + "-" + fechaHastaMM + "-" + fechaHastaDD + "T00:00:00' ";
			
			//HACER BIEN LOS PATH SEGUN LA FUNCION A LLAMAR EN CADA CASO, NO ES SOLO SUMAR LAS PARTES POR ESO HAY DISTINTOS CASOS
			
			/*
			Campos para mapear
			
			Codigo de cliente: Kunnr
			Nombre de cliente: Name1
			Tipo de documento: Blart
			Número de factura: Xblnr
			Fecha de documento: Bldat
			Fecha de vencimiento: Fvenc
			Monto: Importe Wrbtr, Importe ML Dmbtr, usar el primero pero queda el 2do como nota
			Moneda: Moneda Waers, moneda ML Monml, usar el primero pero queda el 2do como nota
			Período de servicio: 
			Orden de Publicación: 
			Anunciante:
			Señal: Arktx
			Rango de dem:
			
			*/
			
			//Para poder parsearla, la fecha viene en formato yyyyMMdd setteado en ViewMain.view.
			
			if (fechaDesde != "" && fechaHasta != ""){
				path = pathBase + pathCli + pathDesde + pathHasta;
			}
			else if(fechaDesde != ""){
				path = pathBase + pathCli + pathDesde;
			}
			else if(fechaHasta != ""){
				path = pathBase + pathCli + pathHasta;
			}
			else{
				path = pathBase + pathCli;
			}
			return path;
		},
		
		crearUriDescargaArchivo: function(itemData, agencia){
			console.log(itemData)
			var urlBase = CONSTESTCUENTA.URI.DESCARGA_PDF + "(Archivo='";
			var tipoDoc = itemData.Blart;
			var Sociedad = itemData.Bukrs;
			var factura = itemData.Vbeln;
			var ejer = itemData.Gjahr;
			var claseDoc = itemData.Blart;
			var refDoc = itemData.Xblnr;
			var docComp = itemData.Augbl;
			var cliente = itemData.Kunnr;
			var docsap = itemData.Belnr;
			var buzei  = itemData.Buzei;
			return urlBase + this.obtenerNombrePDFArchivo(itemData) + "',Tipodoc='" + tipoDoc + "',Sociedad='" + Sociedad
			+ "',Factura='" + factura 
			+ "',Agencia='" + agencia
			+ "',Bukrs='" + Sociedad
			+ "',Gjahr='" + ejer 
			+ "',Belnr='" + docsap
			+ "',Blart='" + claseDoc
			+ "',Xblnr='" + refDoc
			+ "',Augbl='" + docComp
			+ "',Awkey='" + factura
			+ "',Kunnr='" + cliente
			+ "',Buzei='" + buzei
			+ "')";
			
			/*
			METODO ANTERIOR CON GETENTITYSET(QUERY)
			var urlBase = CONSTESTCUENTA.URI.DESCARGA_PDF + "$filter=Archivo eq '";
			var tipoDoc = itemData.Blart;
			var Sociedad = itemData.Bukrs;
			var factura = itemData.Vbeln;
			var ejer = itemData.Gjahr;
			var claseDoc = itemData.Blart;
			var refDoc = itemData.Xblnr;
			var docComp = itemData.Augbl;
			var cliente = itemData.Kunnr;
			var docsap = itemData.Belnr;
			var buzei  = itemData.Buzei;
			return urlBase + this.obtenerNombrePDFArchivo(itemData) + "' and Tipodoc eq '" + tipoDoc + "'" 
			+ " and Sociedad eq '" + Sociedad 
			+ "' and Factura eq '" + factura
			+ "' and Gjahr eq '" + ejer 
			+ "' and Blart eq '" + claseDoc
			+ "' and Xblnr eq '" + refDoc
			+ "' and Augbl eq '" + docComp
			+ "' and Kunnr eq '" + cliente
			+ "' and Agencia eq '" + agencia
			+ "' and Belnr eq '" + docsap
			+ "' and Buzei eq '" + buzei
			+ "'";*/
		},
		
		obtenerNombrePDFArchivo: function(itemData){
			var codCli = itemData.Kunnr;
			
			var nroDocumento = itemData.Xblnr;
			
			var tipoDoc = itemData.Blart;
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyyMMdd", UTC: true});
			var fechaDoc = dateFormat.format(new Date(parseInt(itemData.Bldat.substring(6,19))));
			
			var bukrs = itemData.Bukrs;
			
			var nombreDoc = "";
			
			if (tipoDoc === "RC"){
				nombreDoc = bukrs + "_" + codCli + "_" + nroDocumento;
			}
			else{
				nombreDoc = codCli + "_" + nroDocumento + "_" + tipoDoc + "_" + fechaDoc;
			}
			
			return nombreDoc;
		},
		
		crearUriDescargaCtaCte: function(codCli, fechaDesde, fechaHasta){
			// Fecha: día de hoy.
			// /sap/opu/odata/sap/ZSCP_READ_PDF_CTA_CTE_SRV/ZSCP_READ_PDF_CTA_CTESet?$filter=Cliente eq 'AR005' 
			// and Fecha eq datetime'2019-04-03T00:00:00' and Desde eq datetime'2015-01-01T00:00:00' and Hasta eq datetime'2019-04-03T00:00:00'
			var urlBase = CONSTESTCUENTA.URI.DESCARGA_CTACTE + "(Cliente='";
			var fechaActual = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-ddTHH:mm:ss", UTC: true}).format(new Date());
			var pathFechaActual = ",Fecha=datetime'" + fechaActual + "'";
			
			if(fechaDesde != ""){
				var fechaDesdeYYYY = fechaDesde.substring(0,4);
				var fechaDesdeMM = fechaDesde.substring(4,6);
				var fechaDesdeDD = fechaDesde.substring(6);
				var pathDesde = ",Desde=datetime'" + fechaDesdeYYYY + "-" + fechaDesdeMM + "-" + fechaDesdeDD + "T00:00:00'";
			} else {
				pathDesde = ",Desde=datetime'1990-01-01T00:00:00'";
			}
			
			if(fechaHasta != ""){
				var fechaHastaYYYY = fechaHasta.substring(0,4);
				var fechaHastaMM = fechaHasta.substring(4,6);
				var fechaHastaDD = fechaHasta.substring(6);
				var pathHasta = ",Hasta=datetime'" + fechaHastaYYYY + "-" + fechaHastaMM + "-" + fechaHastaDD + "T00:00:00'";	
			} else {
				pathHasta = ",Hasta=datetime'" + fechaActual + "'";
			}
			
			return urlBase + codCli + "'" + pathFechaActual + pathDesde + pathHasta + ")";
		}

	};
});