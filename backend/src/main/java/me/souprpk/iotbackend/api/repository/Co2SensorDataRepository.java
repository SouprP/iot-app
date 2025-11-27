package me.souprpk.iotbackend.api.repository;

import me.souprpk.iotbackend.api.models.Co2SensorData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Co2SensorDataRepository extends JpaRepository<Co2SensorData, Integer> {
}
