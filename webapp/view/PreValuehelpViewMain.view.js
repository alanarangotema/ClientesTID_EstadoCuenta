sap.ui.jsview("estadocuenta.EstadoCuenta.view.ViewMain", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.ViewMain
	 */
	getControllerName: function () {
		return "estadocuenta.EstadoCuenta.controller.ViewMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.ViewMain
	 */
	createContent: function (oController) {
		var oCustomData = new sap.ui.core.CustomData({ 
			key: "isAgencia",
			value: "{clients>IsAgencia}"
		});
		var oFiltroClienteItem = new sap.ui.core.ListItem(CONSTESTCUENTA.ID.FILTRO_CLIENTE_ITEM,{
			text:"{clients>Name1}",
			additionalText:"{clients>Kunnr}", 
			customData: oCustomData
		});
		var oFiltroSubClienteItem = new sap.ui.core.ListItem(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE_ITEM,{
			text:"{subclients>Name1}",
			additionalText:"{subclients>Kunnr}"
		});
		
		var oLabelFiltroCliente = new sap.m.Label({
			text: "{i18n>clienteFiltro}",
			textAlign:"End"
		}).addStyleClass("labelFiltro");
		var oFiltroCliente = new sap.m.ComboBox(CONSTESTCUENTA.ID.FILTRO_CLIENTE,{
			showSecondaryValues: true,
			change: [oController.filtrarCliente, oController]
		}).addStyleClass("controlFiltro");
		
		var oLabelFiltroSubCliente = new sap.m.Label(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE,{
			text: "{i18n>subClienteFiltro}",
			textAlign:"End"
		}).addStyleClass("labelFiltro");
		var oFiltroSubCliente = new sap.m.ComboBox(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE,{
			showSecondaryValues: true,
			change: [oController.filtrar, oController]
		}).addStyleClass("controlFiltro");
		
		var oLabelFiltroCodCliente = new sap.m.Label({
			text: "{i18n>codClienteFiltro}",
			textAlign:"End"
		}).addStyleClass("labelFiltro");
		var oFiltroCodCliente = new sap.m.Input(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE,{
			maxLength:10,
			change: [oController.filtrarCliente, oController]
		}).addStyleClass("controlFiltro"); 
				
		var oLabelFiltroFechaDesde = new sap.m.Label({
			text:"{i18n>fechaDesdeFiltro}",
			textAlign:"End"
		}).addStyleClass("labelFiltro");
		var oFiltroFechaDesde = new sap.m.DatePicker(CONSTESTCUENTA.ID.FILTRO_FECHA_DESDE,{
			change: [oController.filtrarCliente, oController],
			valueFormat: "yyyyMMdd"
		}).addStyleClass("controlFiltro");
		
		var oLabelFiltroFechaHasta = new sap.m.Label({
			text:"{i18n>fechaHastaFiltro}",
			textAlign:"End"
		}).addStyleClass("labelFiltro");
		var oFiltroFechaHasta = new sap.m.DatePicker(CONSTESTCUENTA.ID.FILTRO_FECHA_HASTA,{
			change: [oController.filtrarCliente, oController],
			valueFormat: "yyyyMMdd"
		}).addStyleClass("controlFiltro");/*
		var oLabelFiltroDocsNoDescargados = new sap.m.Label({
			text: "{i18n>docsNoDescargadosFiltro}",
			textAlign:"End"
		}).addStyleClass("labelFiltro");
		var oFiltroDocsNoDescargados = new sap.m.Switch(CONSTESTCUENTA.ID.FILTRO_DOCS_NO_DESC,{
			customTextOff:" ",
			customTextOn:" ",
			change: [oController.filtrar, oController]
		}).addStyleClass("filtroDocNoDesc");*/
		var oBtnLimpiarFiltros = new sap.m.Button(CONSTESTCUENTA.ID.LIMPIAR_FILTROS,{
			text: "{i18n>limpiarFiltros}", 
			press: [oController.limpiarFiltros, oController]
		}).addStyleClass("sapMBtnLimpiarFiltros");
		
		var oSeparator = new sap.m.Label({
			text: "",
			width:"100%"
		});
		
		
		var oBtnDescPDF = new sap.m.Button(CONSTESTCUENTA.ID.BTN_DESC_PDF,{
			text: "{i18n>descargarPDF}",
			press: [oController.botonFuncionItems, oController]
		}).addStyleClass("sapMBtnFacturas");
		var oBtnDescZIP = new sap.m.Button(CONSTESTCUENTA.ID.BTN_DESC_ZIP,{
			text: "{i18n>descargarZIP}",
			press: [oController.botonFuncionItems, oController]
		}).addStyleClass("sapMBtnFacturas");
		var oBtnCtaCte = new sap.m.Button(CONSTESTCUENTA.ID.BTN_DESC_CTA_CTE,{
			text: "{i18n>imprimirCtaCte}",
			press: [oController.botonFuncionCtaCte, oController]
		}).addStyleClass("sapMBtnFacturas");
		var oBtnCtaCteCsv = new sap.m.Button(CONSTESTCUENTA.ID.BTN_DESC_CTA_CTE_CSV,{
			text: "{i18n>imprimirCtaCteCsv}",
			press: [oController.botonFuncionCtaCte, oController]
		}).addStyleClass("sapMBtnFacturas");
		
		var oCol1 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>codigoCliente}"}),
			template:new sap.m.Text({text:"{data>Kunnr}"}),
			sortProperty: "Kunnr",
			filterProperty: "Kunnr"
		});
		var oCol2 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>nombreCliente}"}),
			template:new sap.m.Text({text:"{data>Name1}"}),
			sortProperty: "Name1",
			filterProperty: "Name1"
		});
		var oCol3 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>claseDocumento}"}),
			template:new sap.m.Text({text:"{data>Blart}"}),
			sortProperty: "Blart",
			filterProperty: "Blart"
		});
		var oCol4 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>numeroFactura}"}),
			template:new sap.m.Text({text:"{data>Xblnr}"}),
			sortProperty: "Xblnr",
			filterProperty: "Xblnr"
		});
		var oCol5 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>periodoServicio}"}),
			template:new sap.m.Text({text:"{data>Mserv}"}),
			sortProperty: "Mserv",
			filterProperty: "Mserv"
		});
		var oCol6 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>ordenPublicidad}"}),
			template:new sap.m.Text({text:"{data>Opubl}"}),
			sortProperty: "Awkey",
			filterProperty: "Awkey"
		});
		var oCol7 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>anunciante}"}),
			template:new sap.m.Text({text:"{data>Anunc}"}),
			sortProperty: "Arktx",
			filterProperty: "Arktx"
		});
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.yyyy", UTC: true});
		var oCol8 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>fechaDocumento}"}),
			template:new sap.m.Text({
				text: {
				path: "data>Bldat",
				formatter: function(oVal){
					var date = "";
					if (oVal !== null){
						date = dateFormat.format(new Date(parseInt(oVal.substring(6,19))));
					}
					return date;
				}
			}
			}),
			sortProperty: "Bldat"
			
		});
		var oCol9 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>importe}"}),
			hAlign: sap.ui.core.HorizontalAlign.Right,
			template:new sap.m.Text({
				text:{
					path: "data>Wrbtr",
					type: new sap.ui.model.type.Float()
				}
			}),
			sortProperty: "Wrbtr",
			filterProperty: "Wrbtr"
		});
		var oCol10 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>moneda}"}),
			template:new sap.m.Text({text:"{data>Waers}"}),
			sortProperty: "Waers",
			filterProperty: "Waers"
		});
		var oCol11 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>fechaVencimiento}"}),
			template:new sap.m.Text({
				text: {
				path: "data>Fvenc",
				formatter: function(oVal){
					var date = "";
					if (oVal !== null){
						date = dateFormat.format(new Date(parseInt(oVal.substring(6,19))));
					}
					return date;
				}
			}
			}),
			sortProperty: "Fvenc",
			filterProperty: "Fvenc"
		});
		var oCol12 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>senal}"}),
			template:new sap.m.Text({text:"{data>Arktx}"}),
			sortProperty: "Arktx",
			filterProperty: "Arktx"
		});
		var oCol13 = new sap.ui.table.Column({
			label:new sap.m.Label({text:"{i18n>rangoDemora}"}),
			template:new sap.m.Text({text:"{data>Rdemo}"}),
			sortProperty: "RangoDemora",
			filterProperty: "RangoDemora"
		});
		
		var oCol14 = new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"", icon : "sap-icon://download", textAlign : sap.ui.core.TextAlign.End}),
			template:new sap.m.CheckBox({
				displayOnly : true,
				selected : {
					path : 'data>Descargado',
					formatter: function(value) {
						return(value === "Y");
					}
				}
			}),
			width: "56px",
			hAlign: sap.ui.core.HorizontalAlign.End,
			sortProperty: "Descargado",
			filterProperty: "Descargado"
		});
		
		var oTable = new sap.ui.table.Table(CONSTESTCUENTA.ID.TABLE,{
			title: "",
			columns:[
				oCol1,
				oCol2,
				//oCol3,
				oCol4,
				oCol8,
				oCol11,
				oCol9,
				//oCol10,
				//oCol5,
				oCol6
				//,
				//oCol14
				//oCol7,
				//oCol12,
				//oCol13
			]
		});
		this.addColumnSorterAndFilter(oCol9, this.compareIntegers);
		
		var oPage = new sap.m.Page({
			title: "{i18n>title}",
			content: [
				oLabelFiltroCliente,
				oFiltroCliente,
				oLabelFiltroCodCliente,
				oFiltroCodCliente,
				oLabelFiltroFechaDesde,
				oFiltroFechaDesde,
				oLabelFiltroFechaHasta,
				oFiltroFechaHasta,/*
				oLabelFiltroDocsNoDescargados,
				oFiltroDocsNoDescargados,*/
				oLabelFiltroSubCliente,
				oFiltroSubCliente,
				oSeparator,
				oBtnDescPDF,
				oBtnDescZIP,
				oBtnCtaCte,
				oBtnCtaCteCsv,
				oBtnLimpiarFiltros,
				oTable
			]
		});

		var app = new sap.m.App(CONSTESTCUENTA.ID.APP, {
			
		});
		app.addPage(oPage);
		app.setInitialPage(oPage);
		return app;
	},
	
	//Funciones custom para poder ordenar y filtrar valores numericos
	addColumnSorterAndFilter: function (oColumn, comparator) {
		var oTable = oColumn.getParent();
		var oCustomMenu = new sap.ui.commons.Menu();
		
		//Menu custom para ordenar numeros ascendentemente
	    oCustomMenu.addItem(new sap.ui.commons.MenuItem({
            text: "Sort ascending",
            icon:"sap-icon://sort-ascending",
            select:function() {
            	var oSorter = new sap.ui.model.Sorter(oColumn.getSortProperty(), false);
            	oSorter.fnCompare=comparator;
            	oTable.getBinding("rows").sort(oSorter);
            	for (var i=0;i<oTable.getColumns().length; i++) oTable.getColumns()[i].setSorted(false);                
            	oColumn.setSorted(true);
            	oColumn.setSortOrder(sap.ui.table.SortOrder.Ascending);
            }
	    }));
	    
	    //Menu custom para ordenar numeros descendentemente
	    oCustomMenu.addItem(new sap.ui.commons.MenuItem({
			text: "Sort descending",
			icon:"sap-icon://sort-descending",
			select:function(oControlEvent) {
				 var oSorter = new sap.ui.model.Sorter(oColumn.getSortProperty(), true);
				 oSorter.fnCompare=comparator;
				 oTable.getBinding("rows").sort(oSorter);
				 for (var i=0;i<oTable.getColumns().length; i++) oTable.getColumns()[i].setSorted(false);
				 oColumn.setSorted(true);
				 oColumn.setSortOrder(sap.ui.table.SortOrder.Descending);
			}
	    }));
	    
		//Menu custom para filtrar numeros
		oCustomMenu.addItem(new sap.ui.commons.MenuTextFieldItem({
			icon: "sap-icon://filter",
			select: function(oControlEvent) {
				var filterValue = parseFloat(oControlEvent.getParameters().item.getValue());
				var filterProperty = oControlEvent.getSource().getParent().getParent().mProperties.sortProperty;
				var filters = [];
				if (filterValue) {
					var oFilter1 = new sap.ui.model.Filter(filterProperty, sap.ui.model.FilterOperator.EQ, filterValue);
					filters = [oFilter1];   
					
				}
				oTable.getBinding("rows").filter(filters, sap.ui.model.FilterType.Application);
		  }
	    }));
	    oColumn.setMenu(oCustomMenu);
	    return oColumn;
	},
	
	compareIntegers: function (value1, value2) {
		if ((value1 == null || value1 == undefined || value1 == "") &&
		(value2 == null || value2 == undefined || value2 == "")) return 0;
		if ((value1 == null || value1 == undefined || value1 == "")) return -1;
		if ((value2 == null || value2 == undefined || value2 == "")) return 1;
		if(parseFloat(value1) < parseFloat(value2)) return -1;
		if(parseFloat(value1) == parseFloat(value2)) return 0;
		if(parseFloat(value1) > parseFloat(value2)) return 1;           
	}

});