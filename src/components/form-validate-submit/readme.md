# form-validate-submit



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                                                                              | Default     |
| ---------------- | ----------------- | ----------- | --------------------------------------------------------------------------------- | ----------- |
| `action`         | `action`          |             | `string`                                                                          | `undefined` |
| `formDefinition` | `form-definition` |             | `string \| { prefix?: string; fields: { [indexer: string]: InputDefinition; }; }` | `undefined` |
| `formId`         | `form-id`         |             | `string`                                                                          | `undefined` |
| `inputPrefix`    | `input-prefix`    |             | `string`                                                                          | `undefined` |
| `method`         | `method`          |             | `string`                                                                          | `"GET"`     |


## Events

| Event         | Description                                 | Type                                                                     |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| `resetEvent`  | Through this event action requests are made | `CustomEvent<any>`                                                       |
| `submitEvent` | Through this event action requests are made | `CustomEvent<{ action: string; result?: { [indexer: string]: any; }; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
