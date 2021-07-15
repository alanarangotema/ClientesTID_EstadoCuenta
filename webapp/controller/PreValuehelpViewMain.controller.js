sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"estadocuenta/EstadoCuenta/model/models",
	"estadocuenta/EstadoCuenta/constants/constants"
], function (Controller, Model) {
	"use strict";
	
	return Controller.extend("estadocuenta.EstadoCuenta.controller.ViewMain", {
		onInit: function () {
			// lista de clientes
			this.getView().setModel(Model.createClientListModel(), "clients");
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).bindAggregation("items", {
				path : "clients>/d/results",
				template : sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE_ITEM),
				sorter: new sap.ui.model.Sorter("Name1",false)
			});
			
			//Requires
			jQuery.sap.require("sap.ui.core.util.File"); //se agrega para poder guardar archivos al generar PDF, CSV, etc
			
			//Inicialmente no muestra dropdown de clientes de agencia pero inicializo el binding con el template para no genere error de ID duplicado
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).bindAggregation("items", {
				path : "",
				template : sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE_ITEM)
			});
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setVisible(false);
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE).setVisible(false);
		},
		
		limpiarFiltros: function (oEvent) {
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setSelectedItemId();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setSelectedItemId();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setVisible(false);
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE).setVisible(false);
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_DESDE).setValue();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_HASTA).setValue();
			//sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_DOCS_NO_DESC).setState(false);
			//Vacia la tabla
			if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).isBound("rows")) {
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).setModel(new sap.ui.model.json.JSONModel({}));
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).bindRows({
					path: ""
				});
			}
		},
		
		filtrarCliente: function (oEvent) {
			//Se resetea el filtro de subcliente
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setSelectedItemId();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setVisible(false);
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE).setVisible(false);
			
			//Variables
			var valueFiltroCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getValue();
			var valueFiltroCodCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).getValue();
			var fechaDesde = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_DESDE).getValue();
			var fechaHasta = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_HASTA).getValue();
			var error = false;
			
			//Caso de seleccion de cliente con el filtro de cliente
			if (oEvent.getSource().getId() == CONSTESTCUENTA.ID.FILTRO_CLIENTE){
				if (valueFiltroCli != ""){
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue(sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getSelectedItem().getAdditionalText());
				} else {
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue();
				}
			}
			
			//Caso de seleccion de cliente con el filtro de codigo de cliente
			else if (oEvent.getSource().getId() == CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE){
				if (valueFiltroCodCli != ""){
					var cliente = this.obtenerCliente(valueFiltroCodCli); //con el codigo busca el cliente en la lista de clientes
					if (cliente !== null){
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setSelectedItem(cliente);
					} else {
						error = true;
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setValue();
						alert(this.getView().getModel("i18n").getResourceBundle().getText("clienteInexistente"));	
					}
				} else {
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setValue();
				}
			}
			
			//Settea el codigo de cliente a consultar
			var codCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).getValue();
			
			//Si el codigo de cliente no quedo vacio y no hubo error de cliente no existente, hace la consulta de los documentos y llena la tabla
			if(codCli != "" && !error){
				this.getView().setModel(Model.createDataModel(codCli,fechaDesde,fechaHasta),"data");
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).bindRows({
					path: "data>/d/results"
				});
				// Si es una agencia carga la lista de clientes (tiene que haber una "X" en IsAgencia que se guarda en custom data del dropdown)
				// y hace visible el dropdown de clientes de la agencia
				if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getSelectedItem().getCustomData()[0].getValue() == "X"){ 
					
					this.getView().setModel(Model.createSubClientListModel(codCli), "subclients");
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).bindAggregation("items", {
						path : "subclients>/d/results",
						template : sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE_ITEM),
						sorter: new sap.ui.model.Sorter("Name1",false)
					});
					
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setVisible(true);
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE).setVisible(true);
				} 
				//FIN dropdown clientes de agencia
				
				//Aplica los filtros a los nuevos datos de la tabla
				this.filtrar();
				
			}else{
				//Vacia la tabla si el cliente no exite
				if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).isBound("rows")) {
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).setModel(new sap.ui.model.json.JSONModel({}));
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).bindRows({
						path: ""
					});
				}
			}
			
		},
		
		filtrar: function (oEvent) {
			/*var lastCol = sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns().length-1; //la ultima columna está oculta y tiene el flag de descargado
			if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_DOCS_NO_DESC).getState()){
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[lastCol],"N");
			} else{
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[lastCol],"");
			}*/
			if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getValue() != ""){
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[0],sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getSelectedItem().getAdditionalText());
			} else{
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[0],"");
			}
		},
		
		/*filtrarSubCliente: function (oEvent) {
			if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getValue() != ""){
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[0],sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getSelectedItem().getAdditionalText());
			} else{
				this.limpiarFiltroSubcliente();
			}
		},
		
		limpiarFiltroSubcliente: function (oEvent) {
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setSelectedItemId();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[0],"");
		},*/
		
		obtenerCliente: function (CodCli){
			var cliente = null;
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getItems().forEach(function(item){
				if (item.getAdditionalText() == CodCli){
					cliente = item;
				}
			});
			return cliente;
		},
		
		botonFuncionItems: function (oEvent) {
			var items = this.obtenerItemsSeleccionados();
			if(items.length != 0){
				switch (oEvent.getSource().getId()){
					case CONSTESTCUENTA.ID.BTN_DESC_PDF:
						this.downloadFiles(items, false);
						break;
					case CONSTESTCUENTA.ID.BTN_DESC_ZIP:
						this.downloadFiles(items, true);
						break;
					default:
				}
			} else {
				alert(this.getView().getModel("i18n").getResourceBundle().getText("noHayItems"));
			}
		},
		
		downloadFiles: function (items,isZip) {
			var view = this.getView();
			var oBusy = new sap.m.BusyDialog();
			var agencia = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).getValue();
			var i = 1;
			var oThis = this;
			
			oBusy.setText(view.getModel("i18n").getResourceBundle().getText("descargaFactura"));
			console.log(items);
			
			if (isZip) var zip = new JSZip();
			
			items.forEach(function(itemData){
				oBusy.open();
				var oModel = new sap.ui.model.json.JSONModel();
				console.log("URI factura: " + Model.crearUriDescargaArchivo(itemData,agencia));
				oModel.loadData(Model.crearUriDescargaArchivo(itemData, agencia));
				oModel.setDefaultBindingMode("OneWay");
				oModel.attachRequestCompleted(function onCompleted(oEvent) {
					console.log("success:" + oEvent.getParameters().success);
					if (oEvent.getParameters().success){
						view.setModel(oModel, "PDF");
						console.log(view.getModel("PDF"));
						/*
						var pdf = "";
						view.getModel("PDF").getData().d.results.forEach(function(item){
							console.log(item.Line);
							pdf = pdf + item.Line;
						});
						console.log(pdf);*/
						if (view.getModel("PDF").getData().d.Error != "4"){
							//var bin = atob(pdf);
							//Se obtiene PDF en Hex
							var pdfHex = "";
							pdfHex = oModel.getData().d.EPdf;
							console.log("ePDF: " + pdfHex);
							//Se convierte PDF a Archivo Binario
							var binary = new Array();
							for (var j=0; j<pdfHex.length/2; j++) {
								var h = pdfHex.substr(j*2, 2);
								binary[j] = parseInt(h,16);        
							}
							var bin = new Uint8Array(binary);
							
							if (isZip){
								zip.file(Model.obtenerNombrePDFArchivo(itemData) + ".pdf", bin);
								if (i == items.length){
									zip.generateAsync({
									type: "blob"
									})
									.then(function(content) {
										sap.ui.core.util.File.save(content, "download " + new Date().getTime(), "zip");
									});
								}
							} else {
								sap.ui.core.util.File.save(bin, Model.obtenerNombrePDFArchivo(itemData), "pdf", "application/pdf");	
							}
						} else {
							alert(view.getModel("i18n").getResourceBundle().getText("pdfFacturaInexistente") + itemData.Xblnr);
						}
					}
					else{
						//fallo la consulta
						alert(view.getModel("i18n").getResourceBundle().getText("errorConexion"));
					}
					if (i == items.length){
						oBusy.close();
					}
					i++;
				});
			});
		},
		
		obtenerItemsSeleccionados: function(){
			var items = [];
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getSelectedIndices().forEach(function(indexitem){
				items.push(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getContextByIndex(indexitem).getObject());
			});
			return items;
		},
		
		botonFuncionCtaCte: function (oEvent) {
			var valueFiltroCodCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).getValue();
			var valueFiltroSubCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getValue();
			
			// Se determina si es una agencia
			var isAgencia = false;
			if (valueFiltroCodCli != ""){
				isAgencia = (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getSelectedItem().getCustomData()[0].getValue() == "X")
			}
			
			// Se determina si se desea descargar pdf o csv
			var docType = "";
			if (oEvent.getSource().getId() == CONSTESTCUENTA.ID.BTN_DESC_CTA_CTE){
				docType = "pdf"
			}
			if (oEvent.getSource().getId() == CONSTESTCUENTA.ID.BTN_DESC_CTA_CTE_CSV){
				docType = "csv"
			}
			
			
			if (isAgencia){
				if(valueFiltroSubCli != ""){
					var valueCodSubCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getSelectedItem().getAdditionalText();
					this.downloadCtaCte(valueCodSubCli,docType);
				} else {
					alert(this.getView().getModel("i18n").getResourceBundle().getText("noHayCliente"));
				}
			} else{
				if(valueFiltroCodCli != ""){
					this.downloadCtaCte(valueFiltroCodCli,docType);
				} else {
					alert(this.getView().getModel("i18n").getResourceBundle().getText("noHayCliente"));
				}
			}
		},
		
		downloadCtaCte: function (codCli, docType) {
			console.log(docType);
			switch (docType){
				case "csv":
					this.downloadCtaCteCsv(codCli);
					break;
				case "pdf":
					this.downloadCtaCtePdf(codCli);
					break;
				default:
			}
		},
		
		downloadCtaCteCsv: function (codCli) {
			var view = this.getView();
			var oBusy = new sap.m.BusyDialog();
			oBusy.setText(view.getModel("i18n").getResourceBundle().getText("descargaCtaCte"));
			oBusy.open();
			
			var tableData = [];
			console.log(view.getModel("data").getData());
			//Se obtienen los encabezados de las columnas
			var headers = []
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns().forEach(function(tableColumn, columnIndex) {
				headers.push(tableColumn.getLabel().getText());
			});
			tableData.push(headers);
			
			//se obtiene el cliente del cual se desean guardar los datos para filtrarlos ya que se guardan desde el model que no esta filtrado
			var cliente;
			if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getSelectedItem().getCustomData()[0].getValue() == "X")
				cliente = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getSelectedItem().getAdditionalText();
			else
				cliente = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).getValue();
			
			//se obtienen los datos a guardar
			var row;
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.yyyy", UTC: true});
			view.getModel("data").getData().d.results.forEach(function(tableRow){
				if (cliente == tableRow.Kunnr){
					row = [
						tableRow.Kunnr,
						tableRow.Name1,
						tableRow.Xblnr,
						dateFormat.format(new Date(parseInt(tableRow.Bldat.substring(6,19)))),
						dateFormat.format(new Date(parseInt(tableRow.Fvenc.substring(6,19)))),
						tableRow.Wrbtr,
						tableRow.Opubl
					];
					tableData.push(row);
				}
			});
			console.log(tableData);
			
			//Se escriben todos los datos al CSV
			var CsvString = "";
			tableData.forEach(function(RowItem, RowIndex) {
				RowItem.forEach(function(ColItem, ColIndex) {
					CsvString += ColItem + ';';
				});
				CsvString += "\r\n";
			});
			sap.ui.core.util.File.save(CsvString, "test", "csv");
			
			oBusy.close();
		},
		
		downloadCtaCtePdf: function (codCli) {
			
			var view = this.getView();
			var oBusy = new sap.m.BusyDialog();
			oBusy.setText(view.getModel("i18n").getResourceBundle().getText("descargaCtaCte"));
			oBusy.open();
			var fechaDesde = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_DESDE).getValue();
			var fechaHasta = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_HASTA).getValue();
			var oModel = new sap.ui.model.json.JSONModel();
			var oThis = this;
			
			oModel.loadData(Model.crearUriDescargaCtaCte(codCli, fechaDesde, fechaHasta));
			console.log(Model.crearUriDescargaCtaCte(codCli, fechaDesde, fechaHasta));
			oModel.setDefaultBindingMode("OneWay");
			oModel.attachRequestCompleted(function onCompleted(oEvent) {
				if (oEvent.getParameters().success){
					view.setModel(oModel, "PDFCtaCte");
					console.log(view.getModel("PDFCtaCte"));
					/*var pdf = "";
					view.getModel("PDFCtaCte").getData().d.results.forEach(function(item){
						console.log(item.Line);
						pdf = pdf + item.Line;
					});
					console.log(pdf);*/
					
					if (view.getModel("PDFCtaCte").getData().d.Error != "4"){
						//var bin = atob(pdf);
						//Se obtiene PDF en Hex
						var pdfHex = "";
						pdfHex = oModel.getData().d.EPdf;
						console.log("ePDF: " + pdfHex);
						//Se convierte PDF a Archivo Binario
						var binary = new Array();
						for (var j=0; j<pdfHex.length/2; j++) {
							var h = pdfHex.substr(j*2, 2);
							binary[j] = parseInt(h,16);        
						}
						var bin = new Uint8Array(binary);
						var fileName = codCli
						if(fechaDesde != ""){
							fileName = fileName + "_" + fechaDesde;
						}
						if(fechaHasta != ""){
							fileName = fileName + "_" + fechaHasta;
						}
						sap.ui.core.util.File.save(bin, fileName, "pdf", "application/pdf");
					} else {
						alert(view.getModel("i18n").getResourceBundle().getText("pdfCtaCteNoExistente"));
					}
				}
				else{
					//fallo la consulta
					alert(view.getModel("i18n").getResourceBundle().getText("errorConexion"));
				}
				oBusy.close();
			});
		},
		
		hextob64: function (str){
			var targetStr = str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "");
			targetStr = targetStr.split(" "); 
			targetStr = new Uint8Array(targetStr).reduce(function (data, byte) {
			    return data + String.fromCharCode(byte);
			}, '');
			targetStr = btoa(targetStr);
			return targetStr;
		}
	});
});