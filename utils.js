export function constructDefaultFormData(properties) {
  const defaultFormData = {};
  properties.map((prop) => {
    switch (prop.type) {
      case "number":
      case "range":
        defaultFormData[prop.id] = prop.defaultValue ?? 0;
        break;
      //TODO: FormInputs für ButtonGroupt
      case "checkbox":
        defaultFormData[prop.id] = prop.defaultValue ?? false;
        break;
      case "code":
      case "text":
      // is this the right default value for relation?
      case "relation":
      case "textarea":
        defaultFormData[prop.id] = prop.defaultValue ?? "";
        break;
      case "accordion":
        defaultFormData[prop.id] = prop.items.reduce((acc, item) => {
          acc[item.id] = constructDefaultFormData(item.properties);
          return acc;
        }, {});
        break;
      case "select":
        defaultFormData[prop.id] = prop.defaultValue ?? {};
        break;
      default:
        break;
    }
  });
  return defaultFormData;
}
