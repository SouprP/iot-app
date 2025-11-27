package me.souprpk.iotbackend.api.controller;

import me.souprpk.iotbackend.api.dto.Co2SensorDataDto;
import me.souprpk.iotbackend.api.models.Co2SensorData;
import me.souprpk.iotbackend.api.services.Co2SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/co2")
@CrossOrigin(origins = "*")
public class Co2SensorDataController {

    @Autowired
    private Co2SensorDataService service;

    @GetMapping
    public List<Co2SensorDataDto> getAll(@RequestParam(defaultValue = "20") int amount) {
        return service.getLatest(amount);
    }

    @PostMapping
    public Co2SensorData create(@RequestBody Co2SensorData data) {
        return service.save(data);
    }
}
