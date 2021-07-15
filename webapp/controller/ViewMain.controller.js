sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"estadocuenta/EstadoCuenta/model/models",
	"estadocuenta/EstadoCuenta/constants/constants"
], function (Controller, Model) {
	"use strict";
	
	return Controller.extend("estadocuenta.EstadoCuenta.controller.ViewMain", {
		onInit: function () {
			/* OLD 200415
			// lista de clientes
			this.getView().setModel(Model.createClientListModel(), "clients");
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).bindAggregation("items", {
				path : "clients>/d/results",
				template : sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE_ITEM),
				sorter: new sap.ui.model.Sorter("Name1",false)
			});
			//Inicialmente no muestra dropdown de clientes de agencia pero inicializo el binding con el template para no genere error de ID duplicado
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).bindAggregation("items", {
				path : "",
				template : sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE_ITEM)
			});
			*/
			//Requires
			//otro coment
			jQuery.sap.require("sap.ui.core.util.File"); //se agrega para poder guardar archivos al generar PDF, CSV, etc
			
			this.getView().setModel(Model.createClientListModel(), "clients");
			//Inicialmente no muestra dropdown de clientes de agencia 
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setVisible(false);
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE).setVisible(false);
			
			//Control para guardar subcliente, por ahora no se muestra pero se deja por si es necesario a futuro.
			//Solo se agrega para que no de error de duplicate ID
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).setVisible(false);
			
			window.gLastFilter = null;
		},
		/* OLD 200415
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
		},*/
		
		limpiarFiltros: function (oEvent) {
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setValue();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setValue();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).setValue();
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
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getFooter().setText();
		},
		
		valueHelpHandlerClientes: function(oEvent){
			var oThis = this;
			
			// Create a SelectDialog and display it; bind to the same
			oEvent._valueHelpSelectDialog = new sap.m.SelectDialog("valueHelpSelectDialog" + oEvent.getSource().getId(), {
				title: "",
				items: {
					path: "/d/results",
					template: new sap.m.StandardListItem({
                        title: "{Name1}",
                        description: "{Kunnr}"
					}),
					sorter: new sap.ui.model.Sorter("Name1",false)
				},
				search: function (oEventSearch) {
					var sValue = oEventSearch.getParameter("value");
					var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter(
							"Kunnr",
							sap.ui.model.FilterOperator.Contains, sValue
						),
						new sap.ui.model.Filter(
							"Name1",
							sap.ui.model.FilterOperator.Contains, sValue
						)
					],
					and: false
					});
					oEventSearch.getSource().getBinding("items").filter([oFilter]);
					
				},
				confirm: function (oEventConfirm) {
					var oSelectedItem = oEventConfirm.getParameter("selectedItem");
					if (oSelectedItem) {
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setValue(oSelectedItem.getTitle());
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue(oSelectedItem.getDescription());
						
						oEventConfirm.getSource().getBinding("items").filter([]);
						//Se destruye value help para que otro control pueda crearlo para pasarle su propio ID en oControlId
						oEvent._valueHelpSelectDialog.destroy(); 
						
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).fireChange();
					} else {
						oEventConfirm.getSource().getBinding("items").filter([]);
						//Se destruye value help para que otro control pueda crearlo para pasarle su propio ID en oControlId
						oEvent._valueHelpSelectDialog.destroy(); 
					}
					
				},
				cancel: function (oEventConfirm) {
					//Se destruye value help para que otro control pueda crearlo para pasarle su propio ID en oControlId
					oEvent._valueHelpSelectDialog.destroy(); 
				}
			});

			oEvent._valueHelpSelectDialog.setModel(this.getView().getModel("clients"));

			oEvent._valueHelpSelectDialog.open()
			
		},
		
		valueHelpHandlerSubClientes: function(oEvent){
			var oThis = this;
			
			// Create a SelectDialog and display it; bind to the same
			oEvent._valueHelpSelectDialog = new sap.m.SelectDialog("valueHelpSelectDialog" + oEvent.getSource().getId(), {
				title: "",
				items: {
					path: "/d/results",
					template: new sap.m.StandardListItem({
                        title: "{Name1}",
                        description: "{Kunnr}"
					}),
					sorter: new sap.ui.model.Sorter("Name1",false)
				},
				search: function (oEventSearch) {
					var sValue = oEventSearch.getParameter("value");
					var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter(
							"Kunnr",
							sap.ui.model.FilterOperator.Contains, sValue
						),
						new sap.ui.model.Filter(
							"Name1",
							sap.ui.model.FilterOperator.Contains, sValue
						)
					],
					and: false
					});
					oEventSearch.getSource().getBinding("items").filter([oFilter]);
					
				},
				confirm: function (oEventConfirm) {
					var oSelectedItem = oEventConfirm.getParameter("selectedItem");
					if (oSelectedItem) {
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setValue(oSelectedItem.getTitle());
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).setValue(oSelectedItem.getDescription());
						
						oEventConfirm.getSource().getBinding("items").filter([]);
						//Se destruye value help para que otro control pueda crearlo para pasarle su propio ID en oControlId
						oEvent._valueHelpSelectDialog.destroy(); 
						
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).fireChange();
					} else {
						oEventConfirm.getSource().getBinding("items").filter([]);
						//Se destruye value help para que otro control pueda crearlo para pasarle su propio ID en oControlId
						oEvent._valueHelpSelectDialog.destroy(); 
					}
					
				},
				cancel: function (oEventConfirm) {
					//Se destruye value help para que otro control pueda crearlo para pasarle su propio ID en oControlId
					oEvent._valueHelpSelectDialog.destroy(); 
				}
			});

			oEvent._valueHelpSelectDialog.setModel(this.getView().getModel("subclients"));

			oEvent._valueHelpSelectDialog.open()
			
		},
		
		filtrarCliente: function (oEvent) {
			//Se resetea el filtro de subcliente
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setValue();
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).setValue();
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
					var cliente = this.obtenerCliente(valueFiltroCodCli); //con el codigo busca el cliente en la lista de clientes
					if (cliente !== null){
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue(cliente.Name1);
					} else {
						error = true;
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue();
						alert(this.getView().getModel("i18n").getResourceBundle().getText("clienteInexistente"));	
					}
				} else {
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).setValue();
				}
			}
			
			//Caso de seleccion de cliente con el filtro de codigo de cliente
			else if (oEvent.getSource().getId() == CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE){
				if (valueFiltroCodCli != ""){
					var cliente = this.obtenerCliente(valueFiltroCodCli); //con el codigo busca el cliente en la lista de clientes
					if (cliente !== null){
						sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).setValue(cliente.Name1);
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
			var clienteSeleccionado =  this.obtenerCliente(codCli);
			
			//Si el codigo de cliente no quedo vacio y no hubo error de cliente no existente, hace la consulta de los documentos y llena la tabla
			if(codCli != "" && !error){
				var oModel = Model.createDataModel(codCli,fechaDesde,fechaHasta);
				this.getView().setModel(oModel,"data");
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).bindRows({
					path: "data>/d/results"
				});
				// Si es una agencia carga la lista de clientes (tiene que haber una "X" en IsAgencia que se guarda en custom data del dropdown)
				// y hace visible el dropdown de clientes de la agencia
				if (clienteSeleccionado.IsAgencia == "X"){ 
					
					this.getView().setModel(Model.createSubClientListModel(codCli), "subclients");
					
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).setVisible(true);
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.LABEL_FILTRO_SUBCLIENTE).setVisible(true);
				} 
				//FIN dropdown clientes de agencia
				
				//Aplica los filtros a los nuevos datos de la tabla, una vez que la misma terminó de cargar
				var oThis = this;
				oModel.attachRequestCompleted(function onCompleted(oEvent) {
					oThis.filtrar();
				});
				
			}else{
				//Vacia la tabla si el cliente no exite
				if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).isBound("rows")) {
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).setModel(new sap.ui.model.json.JSONModel({}));
					sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).bindRows({
						path: ""
					});
				}
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getFooter().setText();
			}
			
		},
		
		/* OLD 200415
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
			if (sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getValue() != ""){
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[0],sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getSelectedItem().getAdditionalText());
			} else{
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[0],"");
			}
		},*/
		
		/*
		Obtiene todos los valores visibles (luego de filtros) de la columna Importe (Wrbtr), los suma y los muestra en el footer de la tabla.
		Esta funcion se triggerea con el evento "filter" de la tabla, es decir cada vez que la tabla se filtra por cualquier metodo.
		Debido a que el evento se triggerea antes de aplicar el filtro, se fuerza la aplicación del filtro dentro de esta funcion para
		poder sumar luego de ya haber aplicado el filtro. Debido a que esta llamada del metodo filter triggerea de nuevo el evento llamando
		en loop a esta función, ese loop se corta en el if verificando si se está queriendo aplicar el mismo filtro dos veces.
		*/
		sumarTotal: function (oEvent) {
			if (gLastFilter && gLastFilter.column.getLabel() == oEvent.getParameters().column.getLabel() && gLastFilter.value == oEvent.getParameters().value){
				//Se ejecuta si volvió a esta función porque se repitió la llamada del mismo filtro.
				gLastFilter = null;
				//Por ahora no hace nada esta parte pero para claridad de la función se deja el if else en lugar de simplificar a un if
			} else {
				//Si es la primera vez que intenta aplicar este filtro, llama a la función "filter" para que ejecute el filtro antes de hacer la suma.
				gLastFilter = oEvent.getParameters(); //Guarda el filtro obtenido para chequear al volver a entrar a esta funcion.
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(oEvent.getParameters().column, oEvent.getParameters().value); //Ejecuta el filtro
				
				//Inicializa variables
				var oVisibleRows = sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getBinding('rows'); //Binding de las filas visibles de la tabla
				var arrModel = this.getView().getModel("data").getProperty("/d/results"); //Datos del model de la tabla (no esta filtrado este)
				var oFooter = sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getFooter(); //Referencia al pie de la tabla
				var total = 0; //Guarda la suma
				
				if (oVisibleRows && oVisibleRows.aIndices.length > 0){
					//Obtiene solo los indices que se estan mostrando y se suman solo esos del modelo.
					
					oVisibleRows.aIndices.forEach(function(item){
						total = total + parseFloat(arrModel[item].Wrbtr); //Wrbtr es el campo de la columna Importe
					}); 
				}
				
				total = total.toFixed(3); //Corrige la suma (Javascrip no suma bien floats si no se agrega esto)
				//Se da formato al número para que coincida con el de la tabla
				var oFloatFormater = new sap.m.Text({
					text:{
						value: total.toString(),
						type: new sap.ui.model.type.Float()
					}
				});
				
				oFooter.setText(this.getView().getModel("i18n").getResourceBundle().getText("totalTabla") + " " + oFloatFormater.getText()); //Setea el footer de la tabla con el total
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
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[1],sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_SUBCLIENTE).getValue());
			} else{
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).filter(sap.ui.getCore().byId(CONSTESTCUENTA.ID.TABLE).getColumns()[1],"");
				sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).setValue();
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
		
		obtenerCliente: function (clienteIn){
			var cliente = null;
			var arrModel = this.getView().getModel("clients").getProperty("/d/results");
			arrModel.forEach(function(item){
				if (item.Kunnr == clienteIn){
					cliente = item;
				}
			});
			return cliente;
		},
		
		/* OLD 200415
		obtenerCliente: function (CodCli){
			var cliente = null;
			sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_CLIENTE).getItems().forEach(function(item){
				if (item.getAdditionalText() == CodCli){
					cliente = item;
				}
			});
			return cliente;
		},*/
		
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
						if (view.getModel("PDF").getData().d.EError != "4"){
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
			var valueFiltroCodSubCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).getValue();
			
			// Se determina si es una agencia
			var isAgencia = false;
			if (valueFiltroCodCli != ""){
				//Verifica si el cliente seleccionado es agencia
				var clienteSeleccionado =  this.obtenerCliente(valueFiltroCodCli);
				isAgencia = (clienteSeleccionado.IsAgencia == "X");
				console.log(clienteSeleccionado);
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
				if(valueFiltroCodSubCli != ""){
					this.downloadCtaCte(valueFiltroCodSubCli,docType);
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
			var valueFiltroCodCli = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_CLIENTE).getValue();
			
			// Se determina si es una agencia
			var isAgencia = false;
			if (valueFiltroCodCli != ""){
				//Verifica si el cliente seleccionado es agencia
				var clienteSeleccionado =  this.obtenerCliente(valueFiltroCodCli);
				isAgencia = (clienteSeleccionado.IsAgencia == "X");
			}
			
			var cliente;
			if (isAgencia)
				cliente = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_COD_SUBCLIENTE).getValue();
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
			
			var fileName = cliente;
			var fechaDesde = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_DESDE).getValue();
			var fechaHasta = sap.ui.getCore().byId(CONSTESTCUENTA.ID.FILTRO_FECHA_HASTA).getValue();
			if(fechaDesde != ""){
				fileName = fileName + "_" + fechaDesde;
			}
			if(fechaHasta != ""){
				fileName = fileName + "_" + fechaHasta;
			}
			sap.ui.core.util.File.save(CsvString, fileName, "csv");
			
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
					
					if (view.getModel("PDFCtaCte").getData().d.EError != "4"){
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