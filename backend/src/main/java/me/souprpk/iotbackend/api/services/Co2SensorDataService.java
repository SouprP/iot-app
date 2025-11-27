package me.souprpk.iotbackend.api.services;

import me.souprpk.iotbackend.api.dto.Co2SensorDataDto;
import me.souprpk.iotbackend.api.models.Co2SensorData;
import java.util.List;

public interface Co2SensorDataService {
    List<Co2SensorData> getAll();
    List<Co2SensorDataDto> getLatest(int limit);
    Co2SensorData save(Co2SensorData data);
}
