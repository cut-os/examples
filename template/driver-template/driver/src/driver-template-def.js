// Common data shared between devices and drivers: types and commands.
// Utilizing constants TYPE and CMD for device types and command types.

/*
  * Device Types (TYPE):
    - TYPE constant: key 'TEMPLATE', value 'device-template'.
    - Indicates a template type, identifying the category of device.

  * Command Types (CMD):
    - CMD constant with two pairs:
      - CONNECT: 'connect' represents the connect command.
      - CUSTOM_CMD: 'custom-cmd' represents a custom command for specific devices.

  Abstracting information into constants ensures standardized interactions, enhancing maintainability and scalability.
*/

const TYPE = 'driver-template';
const CMD = {CONNECT: 'connect', CUSTOM_CMD: 'custom-cmd' };

// Uncomment the line below and include "import { TYPE, CMD } from './device-template-def.js';" in device-template.js to import constants.
//export { TYPE, CMD };

// Uncomment the line below and include "const { TYPE, CMD } = require('./device-template-def.js');" in driver-template.js to import constants.
module.exports = { TYPE, CMD };
