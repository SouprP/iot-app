package me.souprpk.iotbackend.api.repository;

import me.souprpk.iotbackend.api.models.ThermostatData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThermostatDataRepository extends JpaRepository<ThermostatData, Integer> {
}
