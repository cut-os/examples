# Introduction


@cutos/device-receipt-printer is a JavaScript library that provides a unified interface for accessing and controlling printers
that support the Receipt command set.
Developers can use this interface to send and receive data, configure printer parameters, and handle printer events.

# Receipt Printer SDK

### Installation

`
npm install @cutos/core
`

`
npm install @cutos/device-receipt-printer
`

### Import dependencies

```js
import {CoreAPI} from '@cutos/core';
import {DeviceReceiptPrinter} from '@cutos/device-Receipt-printer';
```

### DeviceReceiptPrinter

Constructor, create receipt printer device instance

```js
let devReceiptPrinter = new DeviceReceiptPrinter(name);
```

* name: Receipt printer device name

##### Example:

```js
devReceiptPrinter = new DeviceReceiptPrinter('device-receipt-printer');
```

### DeviceReceiptPrinter.init

Receipt Printer device initialization

```js
devReceiptPrinter.init(callback);
```

* callback: Callback function

##### Example:

```js
devReceiptPrinter.init((result, error) => {
	if (!error) {
		console.log('onDeviceCreate', result)
	} else {
		console.log(error)
	}
});
```

- Return response example:

```js
"Driver device-receipt-printer loaded"
```

### DeviceReceiptPrinter.connect

Connect Receipt Printer

```js
devReceiptPrinter.connect(path, callback);
```

* path: Device port
* callback: Callback function

##### Example:

```js
 devReceiptPrinter.connect('/ttyS1', (response) => {
	console.log(response)
})
```

- Return response example:

```json
{
  "status": true,
  "msg": "already connected"
}
```

### DeviceReceiptPrinter.print

Print Text

```js
devReceiptPrinter.print(text, callback);
```

* text: Print text
* callback: Callback function

##### Example：

```js
 devReceiptPrinter.print('test result', (response) => {
	console.log(response)
})
```

- Return response example:

```json
{
  "status": true,
  "msg": "print success"
}
```

### DeviceReceiptPrinter.printQrcode

Print Qrcode

```js
devReceiptPrinter.printQrcode(text, callback);
```
* text: Text for Qrcode
* callback: Callback function

##### Example：

```js
 devReceiptPrinter.printQrcode('hello cutos', (response) => {
	console.log(response)
})
```

- Return response example:

```json
{
  "status": true,
  "msg": "print qrcode success"
}
```

### DeviceReceiptPrinter.setAlign

Alignment setting.

```js
 setAlign(align, callback)
```

* align: Alignment setting，Valid values: 'left', 'center', 'right'
* callback: Callback function

##### Example：

```js
devReceiptPrinter.setAlign('left', (response) => {
	console.log(response)
})
```

- Return response example:

```json
{
  "status": true,
  "msg":"set align success"
}
```


### DeviceReceiptPrinter.setFontSize

Print font size setting

```js
devReceiptPrinter.setFontSize(width, height, callback)
```

* width:Font width（1-7）
* height:Font height（1-7）
* callback:Callback function


##### Example：

```js
devReceiptPrinter.setFontSize(2, 2, (response) => {
	console.log(response)
})
```

- Return response example:

```json
{
  "status": true,
  "msg":"set fontSize success"
}
```

### DeviceReceiptPrinter.feed

Print blank line

```js
devReceiptPrinter.feed(lines, callback)
```

* lines:Blank line count，Blank lines have the same height as text lines（1-255）.
* callback:Callback function

##### Example:

```js
devReceiptPrinter.feed(1, (response) => {
	console.log(response)
})
```

- Return response example:

```json
{
  "status": true,
  "msg":"feed success"
}
```
