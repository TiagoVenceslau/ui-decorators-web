# basic-ui-input-element



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                   | Type                                               | Default              |
| ------------- | -------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------- |
| `inputId`     | `input-id`     | The id of the wrapper component Should be replicated to the inner component with an id prefix | `string`                                           | `undefined`          |
| `inputName`   | `input-name`   | The name of the 'form' submitting element. should be prefixed to avoid conflicts              | `string`                                           | `undefined`          |
| `inputPrefix` | `input-prefix` |                                                                                               | `string`                                           | `UIKeys.NAME_PREFIX` |
| `label`       | `label`        |                                                                                               | `string`                                           | `undefined`          |
| `max`         | `max`          |                                                                                               | `number \| string`                                 | `undefined`          |
| `maxlength`   | `maxlength`    |                                                                                               | `number \| string`                                 | `undefined`          |
| `min`         | `min`          |                                                                                               | `number \| string`                                 | `undefined`          |
| `minlength`   | `minlength`    |                                                                                               | `number \| string`                                 | `undefined`          |
| `pattern`     | `pattern`      |                                                                                               | `string`                                           | `undefined`          |
| `placeholder` | `placeholder`  |                                                                                               | `string`                                           | `undefined`          |
| `required`    | `required`     | HTML5 validation Attributes                                                                   | `"false" \| "true" \| boolean`                     | `false`              |
| `step`        | `step`         |                                                                                               | `number \| string`                                 | `undefined`          |
| `type`        | `type`         | type of the input field                                                                       | `"date" \| "email" \| "number" \| "text" \| "url"` | `"text"`             |
| `value`       | `value`        | Value of the input field                                                                      | `string`                                           | `undefined`          |


## Events

| Event          | Description        | Type               |
| -------------- | ------------------ | ------------------ |
| `blurEvent`    |                    | `CustomEvent<any>` |
| `changeEvent`  | HTML5 input events | `CustomEvent<any>` |
| `copyEvent`    |                    | `CustomEvent<any>` |
| `cutEvent`     |                    | `CustomEvent<any>` |
| `focusEvent`   |                    | `CustomEvent<any>` |
| `inputEvent`   |                    | `CustomEvent<any>` |
| `invalidEvent` |                    | `CustomEvent<any>` |
| `pasteEvent`   |                    | `CustomEvent<any>` |


## Methods

### `checkValidity() => Promise<any>`

HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle

#### Returns

Type: `Promise<any>`



### `reportValidity() => Promise<any>`



#### Returns

Type: `Promise<any>`



### `setCustomValidity(errors: string) => Promise<any>`



#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
