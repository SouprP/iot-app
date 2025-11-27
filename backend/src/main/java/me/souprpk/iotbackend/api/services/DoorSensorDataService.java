package me.souprpk.iotbackend.api.services;

import me.souprpk.iotbackend.api.dto.DoorSensorDataDto;
import me.souprpk.iotbackend.api.models.DoorSensorData;
import java.util.List;

public interface DoorSensorDataService {
    List<DoorSensorData> getAll();
    List<DoorSensorDataDto> getLatest(int limit);
    DoorSensorData save(DoorSensorData data);
}
