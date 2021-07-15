(function (window) {
    "use strict";
    
    window.CONSTESTCUENTA = {
    	ID : {
        	FILTRO_CLIENTE_ITEM : "idCuentaFiltroCliTemplate",
        	FILTRO_SUBCLIENTE_ITEM : "idCuentaFiltroSubCliTemplate",
        	FILTRO_CLIENTE : "idCuentaFiltroCli",
        	LABEL_FILTRO_SUBCLIENTE : "idCuentaFiltroSubCliLabel",
        	FILTRO_SUBCLIENTE : "idCuentaFiltroSubCli",
        	FILTRO_COD_CLIENTE : "idCuentaFiltroCodCli",
        	FILTRO_COD_SUBCLIENTE : "idCuentaFiltroCodSubCli",
        	FILTRO_FECHA_DESDE : "idCuentaFechaDesde",
        	FILTRO_FECHA_HASTA : "idCuentaFechaHasta",
        	FILTRO_DOCS_NO_DESC : "idCuentaFiltroDocsNoDesc",
        	LIMPIAR_FILTROS : "idCuentaLimpFiltros",
        	BTN_DESC_PDF : "idCuentaDescPDF",
        	BTN_DESC_ZIP : "idCuentaDescZIP",
        	BTN_DESC_CTA_CTE : "idCuentaCtaCtePdf",
        	BTN_DESC_CTA_CTE_CSV : "idCuentaCtaCteCsv",
        	TABLE : "idCuentaTabla",
        	APP : "idAppEstadoCuenta"
    	},
    	URI: {
    		CURRENT_USER : "/services/userapi/currentUser x",
    		LISTA_CLIENTES : "/sap/opu/odata/sap/ZSCP_ZCAP_GET_CUSTOMER_srv/ZSCP_ZCAP_GET_CUSTOMERSet?",
    		LISTA_SUBCLIENTES: "/sap/opu/odata/sap/ZSCP_ZCAP_GET_AGENCIA_srv/ZSCP_ZCAP_GET_AGENCIASet?",
    		DATOS_TABLA : "/sap/opu/odata/sap/zscp_zcap_clie_ctacte2_srv/ZSCP_ZCAP_CLIE_CTACTE2Set?",
    		DESCARGA_PDF : "/sap/opu/odata/sap/zscp_read_pdf_srv_01/ZSCP_READ_PDFSet",
    		DESCARGA_CTACTE : "/sap/opu/odata/sap/ZSCP_READ_PDF_CTA_CTE_SRV/ZSCP_READ_PDF_CTA_CTESet"
    		
    	}
    };
}(window)); 