# ionic-ui-input-element



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                                   | Type                                 | Default              |
| --------------- | ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------- |
| `clearInput`    | `clear-input`    |                                                                                               | `boolean`                            | `undefined`          |
| `disabled`      | `disabled`       |                                                                                               | `boolean`                            | `undefined`          |
| `inputId`       | `input-id`       | The id of the wrapper component Should be replicated to the inner component with an id prefix | `string`                             | `undefined`          |
| `inputName`     | `input-name`     | The name of the 'form' submitting element. should be prefixed to avoid conflicts              | `string`                             | `undefined`          |
| `inputPrefix`   | `input-prefix`   |                                                                                               | `string`                             | `UIKeys.NAME_PREFIX` |
| `label`         | `label`          |                                                                                               | `string`                             | `undefined`          |
| `labelPosition` | `label-position` |                                                                                               | `"fixed" \| "floating" \| "stacked"` | `"floating"`         |
| `lines`         | `lines`          |                                                                                               | `"full" \| "inset" \| "none"`        | `"none"`             |
| `max`           | `max`            |                                                                                               | `number \| string`                   | `undefined`          |
| `maxlength`     | `maxlength`      |                                                                                               | `number \| string`                   | `undefined`          |
| `min`           | `min`            |                                                                                               | `number \| string`                   | `undefined`          |
| `minlength`     | `minlength`      |                                                                                               | `number \| string`                   | `undefined`          |
| `pattern`       | `pattern`        |                                                                                               | `string`                             | `undefined`          |
| `placeholder`   | `placeholder`    |                                                                                               | `string`                             | `undefined`          |
| `required`      | `required`       | HTML5 validation Attributes                                                                   | `"false" \| "true" \| boolean`       | `undefined`          |
| `step`          | `step`           |                                                                                               | `number \| string`                   | `undefined`          |
| `subtype`       | `subtype`        | To enable custom validators                                                                   | `string`                             | `undefined`          |
| `type`          | `type`           | type of the input field                                                                       | `string`                             | `undefined`          |
| `value`         | `value`          | Value of the input field                                                                      | `string`                             | `undefined`          |


## Events

| Event          | Description        | Type               |
| -------------- | ------------------ | ------------------ |
| `changeEvent`  | HTML5 input events | `CustomEvent<any>` |
| `copyEvent`    |                    | `CustomEvent<any>` |
| `cutEvent`     |                    | `CustomEvent<any>` |
| `focusEvent`   |                    | `CustomEvent<any>` |
| `inputEvent`   |                    | `CustomEvent<any>` |
| `invalidEvent` |                    | `CustomEvent<any>` |
| `pasteEvent`   |                    | `CustomEvent<any>` |


## Methods

### `getNativeElement() => Promise<HTMLInputElement>`

Must return the native Element

#### Returns

Type: `Promise<HTMLInputElement>`



### `getValue() => Promise<any>`

Must return value, in whatever format it has

#### Returns

Type: `Promise<any>`



### `reset() => Promise<void>`

Must clear the value

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
