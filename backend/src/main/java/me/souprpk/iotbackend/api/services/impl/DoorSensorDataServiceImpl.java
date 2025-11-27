package me.souprpk.iotbackend.api.services.impl;

import me.souprpk.iotbackend.api.dto.DoorSensorDataDto;
import me.souprpk.iotbackend.api.models.DoorSensorData;
import me.souprpk.iotbackend.api.repository.DoorSensorDataRepository;
import me.souprpk.iotbackend.api.services.DoorSensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoorSensorDataServiceImpl implements DoorSensorDataService {

    @Autowired
    private DoorSensorDataRepository repository;

    @Override
    public List<DoorSensorData> getAll() {
        return repository.findAll();
    }

    @Override
    public List<DoorSensorDataDto> getLatest(int limit) {
        return repository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "id")))
                .getContent()
                .stream()
                .map(data -> new DoorSensorDataDto(data.getDoorOpen(), data.getBattery(), data.getReceivedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public DoorSensorData save(DoorSensorData data) {
        return repository.save(data);
    }
}
