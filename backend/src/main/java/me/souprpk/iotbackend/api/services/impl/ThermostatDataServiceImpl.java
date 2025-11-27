package me.souprpk.iotbackend.api.services.impl;

import me.souprpk.iotbackend.api.dto.ThermostatDataDto;
import me.souprpk.iotbackend.api.models.ThermostatData;
import me.souprpk.iotbackend.api.repository.ThermostatDataRepository;
import me.souprpk.iotbackend.api.services.ThermostatDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThermostatDataServiceImpl implements ThermostatDataService {

    @Autowired
    private ThermostatDataRepository repository;

    @Override
    public List<ThermostatData> getAll() {
        return repository.findAll();
    }

    @Override
    public List<ThermostatDataDto> getLatest(int limit) {
        return repository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "id")))
                .getContent()
                .stream()
                .map(data -> new ThermostatDataDto(data.getHeater(), data.getSetPoint(), data.getReceivedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public ThermostatData save(ThermostatData data) {
        return repository.save(data);
    }
}
