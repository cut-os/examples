package com.sts.cutos.gw.app.demo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sts.cutos.gw.app.AppService;
import com.sts.cutos.gw.app.IPC;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {
    private static final Logger logger = LogManager.getLogger(DemoApplication.class.getName());

    static String gwUrl = "ws://www.cut-os.com:61614";
    static String appAdminName = "xxxxx应用服务";
    static String appAdminHome = "http://192.168.1.30:4000/index.html";
    static String userId = "xxxxx";
    static String password = "xxxxx";

    public static AppService appService;

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);


        IPC gwIPC = new IPC(gwUrl, userId, password);
        appService = new AppService(gwIPC);
        gwIPC.connect((status, message) -> {
            logger.info("on ready {} {}", status, message);
            if (!"success".equals(status)) {
                return;
            }
            /*
             * payload
             * {
             *     response: {
             *         "result": "success",
             *     }
             * }
             */
            appService.registerAppAdmin(appAdminName, appAdminHome, (topic, payload) -> {
                logger.info("register ack {}", payload);
                JSONObject jsonObject = JSON.parseObject(payload);
                String result = jsonObject.getJSONObject("response").getString("result");

            });
        });
    }

}
