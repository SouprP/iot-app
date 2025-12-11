package me.souprpk.iotbackend.api.controller;

import me.souprpk.iotbackend.api.models.Setpoint;
import me.souprpk.iotbackend.api.repository.SetpointRepository;
import me.souprpk.iotbackend.api.dto.SetpointValueDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/setpoint")
@CrossOrigin(origins = "*")
public class SetpointController {

    @Autowired
    private SetpointRepository repository;
    @GetMapping
    public ResponseEntity<BigDecimal> getSetpoint() {
        Setpoint sp = repository.findFirstByOrderByDevEuiAsc();
        if (sp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sp.getDesiredSetpoint());
    }

    @PostMapping
    public ResponseEntity<BigDecimal> setSetpoint(@RequestBody SetpointValueDto dto) {
        BigDecimal value = dto.getDesiredSetpoint();
        Setpoint sp = repository.findFirstByOrderByDevEuiAsc();
        if (sp == null) {
            sp = new Setpoint("default", value);
        } else {
            sp.setDesiredSetpoint(value);
        }
        Setpoint saved = repository.save(sp);
        return ResponseEntity.ok(saved.getDesiredSetpoint());
    }
}
