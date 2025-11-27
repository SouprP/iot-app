package me.souprpk.iotbackend.api.services.impl;

import me.souprpk.iotbackend.api.dto.Co2SensorDataDto;
import me.souprpk.iotbackend.api.models.Co2SensorData;
import me.souprpk.iotbackend.api.repository.Co2SensorDataRepository;
import me.souprpk.iotbackend.api.services.Co2SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class Co2SensorDataServiceImpl implements Co2SensorDataService {

    @Autowired
    private Co2SensorDataRepository repository;

    @Override
    public List<Co2SensorData> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Co2SensorDataDto> getLatest(int limit) {
        return repository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "id")))
                .getContent()
                .stream()
                .map(data -> new Co2SensorDataDto(data.getTemperatureC(), data.getHumidityRh(), data.getCo2Ppm(), data.getReceivedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public Co2SensorData save(Co2SensorData data) {
        return repository.save(data);
    }
}
