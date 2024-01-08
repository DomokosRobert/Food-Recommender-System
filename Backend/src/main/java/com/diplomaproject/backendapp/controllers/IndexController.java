package com.diplomaproject.backendapp.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {
    @GetMapping(value = "/")
    public ResponseEntity<String> getStatus(){
        return new ResponseEntity<>("Food Recommender System is working...", HttpStatus.OK);
    }

}
