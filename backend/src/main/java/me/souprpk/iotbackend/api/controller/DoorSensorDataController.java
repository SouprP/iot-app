package me.souprpk.iotbackend.api.controller;

import me.souprpk.iotbackend.api.dto.DoorSensorDataDto;
import me.souprpk.iotbackend.api.models.DoorSensorData;
import me.souprpk.iotbackend.api.services.DoorSensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/door")
@CrossOrigin(origins = "*")
public class DoorSensorDataController {

    @Autowired
    private DoorSensorDataService service;

    @GetMapping
    public List<DoorSensorDataDto> getAll(@RequestParam(defaultValue = "20") int amount) {
        return service.getLatest(amount);
    }

    @PostMapping
    public DoorSensorData create(@RequestBody DoorSensorData data) {
        return service.save(data);
    }
}
