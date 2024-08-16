package com.sts.cutos.gw.app.demo;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;

@RestController
public class DemoController {

    private static final Logger logger = LogManager.getLogger(DemoController.class.getName());


    @RequestMapping(value = "/test", method = RequestMethod.GET)
    @ResponseBody
    public String test(HttpServletRequest request) {

        String appId = request.getHeader("appId");
        String session = request.getHeader("session");
        if (appId == null || session == null || !DemoApplication.appService.validateAppAdminSession(appId, session)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        return "test";
    }
}
