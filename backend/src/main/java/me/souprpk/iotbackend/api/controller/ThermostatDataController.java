package me.souprpk.iotbackend.api.controller;

import me.souprpk.iotbackend.api.dto.ThermostatDataDto;
import me.souprpk.iotbackend.api.models.ThermostatData;
import me.souprpk.iotbackend.api.services.ThermostatDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thermostat")
@CrossOrigin(origins = "*")
public class ThermostatDataController {

    @Autowired
    private ThermostatDataService service;

    @GetMapping
    public List<ThermostatDataDto> getAll(@RequestParam(defaultValue = "20") int amount) {
        return service.getLatest(amount);
    }

    @PostMapping
    public ThermostatData create(@RequestBody ThermostatData data) {
        return service.save(data);
    }
}
