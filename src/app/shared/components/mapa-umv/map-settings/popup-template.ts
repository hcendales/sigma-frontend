export class PopupTemplate {
  public static template : any = {
    title: "Elemento PK: {PK_ID_ELEMENTO}",
    dockEnabled: true,
    content: [{
      type: "fields",
      fieldInfos: [{
        fieldName: "PK_ID_ELEMENTO",
        label: "PK_ID_ELEMENTO",
        visible: true
      }, {
        fieldName: "DESCRIPCION_ELEMENTO",
        label: "Elemento",
        visible: true
      }, {
        fieldName: "TIPOMALLA",
        label: "Tipo malla",
        visible: true
      }, {
        fieldName: "TIPOSUPERFICIE",
        label: "Superficie",
        visible: true
      }, {
        fieldName: "EJE_VIAL",
        label: "Eje vial",
        visible: true
      }, {
        fieldName: "DESDE",
        label: "Desde",
        visible: true
      }, {
        fieldName: "HASTA",
        label: "Hasta",
        visible: true
      }]
    }],
    actions: [{
      title: "Ver Registro",
      id: "show-row",
      className: "esri-icon-filter"
    }]
  };
}
