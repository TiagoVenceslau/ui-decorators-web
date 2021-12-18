# form-validate-submit



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                                                                                                                                                   | Type                                                                                                          | Default     |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| `action`           | `form-action`        | Standard HTML Form action 'url to call'. When defined the form will perform the request with the normal form data. Otherwise will raise a {@link submitEvent} | `string`                                                                                                      | `undefined` |
| `customValidation` | `custom-validation`  | Enables/disables custom validators and custom error messages                                                                                                  | `boolean`                                                                                                     | `true`      |
| `formDefinition`   | `form-definition`    | The form definition according to {@link FormDefinition} in string or object format. If none is provided, the HTML content will be displayed                   | `string \| { prefix?: string; customValidation?: boolean; fields: { [indexer: string]: InputDefinition; }; }` | `undefined` |
| `formId`           | `form-id`            | Translates to the inner form's id attribute                                                                                                                   | `string`                                                                                                      | `undefined` |
| `inputPrefix`      | `input-prefix`       | To avoid conflicts it's better to prefix id and names                                                                                                         | `string`                                                                                                      | `undefined` |
| `method`           | `form-method`        | HTML VERB. defaults to POST                                                                                                                                   | `"GET" \| "POST" \| "PUT"`                                                                                    | `"POST"`    |
| `validateOnChange` | `validate-on-change` | Triggers field validation whenever it's value changes                                                                                                         | `boolean`                                                                                                     | `false`     |


## Events

| Event         | Description                                                             | Type                                                                     |
| ------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `resetEvent`  | Event is raised when the form is reset                                  | `CustomEvent<any>`                                                       |
| `submitEvent` | Event with the form data is raised if no form {@link action} is defined | `CustomEvent<{ action: string; result?: { [indexer: string]: any; }; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
