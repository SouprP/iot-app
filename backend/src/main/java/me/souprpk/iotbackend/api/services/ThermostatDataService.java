package me.souprpk.iotbackend.api.services;

import me.souprpk.iotbackend.api.dto.ThermostatDataDto;
import me.souprpk.iotbackend.api.models.ThermostatData;
import java.util.List;

public interface ThermostatDataService {
    List<ThermostatData> getAll();
    List<ThermostatDataDto> getLatest(int limit);
    ThermostatData save(ThermostatData data);
}
