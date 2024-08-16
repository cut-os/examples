package com.sts.demo.printer;

import com.sts.cutos.gw.app.CloudDevicePrinter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.paho.client.mqttv3.MqttException;

public class CloudDevicePrinterMain {
    private static final Logger logger = LogManager.getLogger(CloudDevicePrinterMain.class.getName());

    private static CloudDevicePrinter cloudPrinter;
    private static String gwUrl = "ws://www.cut-os.com:61614";
    private static String userId = "xxxxx";
    private static String password = "xxxxx";
    private static String printerId = "1010";
    private static String dataUrl = "https://content.17donor.com/content/56/news/shanghaitest.pdf";

    public CloudDevicePrinterMain() {
    }

    public static void main(String[] args) throws RuntimeException, MqttException {
        CloudDevicePrinter cloudPrinter = new CloudDevicePrinter(gwUrl, userId, password);

        cloudPrinter.onState((topic, payload) -> {
            //topic = "gw/<gwi>/lwa/<clientId>/state"
            logger.info(payload);
        });

        while (!cloudPrinter.isReady()) {
            try {
                Thread.sleep(100);
            } catch (Exception ignored) {
            }
        }

        while (true) {
            try {
                Thread.sleep(10 * 1000);

                logger.info("readDeviceInfo {}", printerId);
                cloudPrinter.readDeviceInfo(printerId, null, (topic, payload) -> {
                    logger.info("readDeviceInfo 2 {} {}", printerId, payload);
                });

                boolean state = cloudPrinter.getClientState(printerId);
                logger.info("getClientState {} {}", printerId, state);

                logger.info("printDataUrl {} {}", printerId, dataUrl);
                cloudPrinter.printDataUrl(printerId, dataUrl, null, (topic, payload) -> {
                    logger.info("printDataUrl 2 {} {}", printerId, payload);
                });
            } catch (Exception ignored) {
            }
        }
        //      cloudPrinter.close();
    }
}
