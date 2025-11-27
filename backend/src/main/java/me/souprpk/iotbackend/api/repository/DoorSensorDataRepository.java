package me.souprpk.iotbackend.api.repository;

import me.souprpk.iotbackend.api.models.DoorSensorData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoorSensorDataRepository extends JpaRepository<DoorSensorData, Integer> {
}
