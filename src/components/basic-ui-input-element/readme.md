# basic-ui-input-element



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                               | Type                                               | Default              |
| ------------- | -------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------- |
| `disabled`    | `disabled`     | sets the field as disabled                                                                | `boolean`                                          | `undefined`          |
| `inputId`     | `input-id`     | will translate to the form id attribute                                                   | `string`                                           | `undefined`          |
| `inputName`   | `input-name`   | will translate to the form name attribute                                                 | `string`                                           | `undefined`          |
| `inputPrefix` | `input-prefix` | Will be used the prefix the fields names and ids to avoid conflicts with naive properties | `string`                                           | `UIKeys.NAME_PREFIX` |
| `label`       | `label`        | The label text                                                                            | `string`                                           | `undefined`          |
| `max`         | `max`          | defines the maximum accepted value (inclusive)                                            | `number \| string`                                 | `undefined`          |
| `maxlength`   | `maxlength`    | defines the maximum accepted length                                                       | `number \| string`                                 | `undefined`          |
| `min`         | `min`          | defines the minimum accepted value (inclusive)                                            | `number \| string`                                 | `undefined`          |
| `minlength`   | `minlength`    | defines the minimum accepted length                                                       | `number \| string`                                 | `undefined`          |
| `pattern`     | `pattern`      | defines the accepted REGEXP pattern                                                       | `string`                                           | `undefined`          |
| `placeholder` | `placeholder`  | Placeholder attribute                                                                     | `string`                                           | `undefined`          |
| `required`    | `required`     | Sets the field as required when set to true                                               | `"false" \| "true" \| boolean`                     | `false`              |
| `step`        | `step`         | defined the accepted value step                                                           | `number \| string`                                 | `undefined`          |
| `subtype`     | `subtype`      | Subtype attribute. used for custom validation                                             | `string`                                           | `undefined`          |
| `type`        | `type`         | The field type                                                                            | `"date" \| "email" \| "number" \| "text" \| "url"` | `"text"`             |
| `value`       | `value`        | value holding attribute                                                                   | `string`                                           | `undefined`          |


## Methods

### `bindNativeEvents(form: FormDefinition) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `checkValidity() => Promise<any>`

HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle

#### Returns

Type: `Promise<any>`



### `getNativeElement() => Promise<HTMLInputElement>`

Retrieves the native {@link HTMLInputElement}

#### Returns

Type: `Promise<HTMLInputElement>`



### `getValue() => Promise<any>`

Returns the field value

#### Returns

Type: `Promise<any>`



### `reportValidity() => Promise<any>`

HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle

#### Returns

Type: `Promise<any>`



### `reset() => Promise<void>`

Resets the field value

#### Returns

Type: `Promise<void>`



### `setCustomValidity(errors: string) => Promise<any>`

HTML5 validation methods. Will be bound via {@link bindNativeInput} during the 'componentWillLoad' lifecyle

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
