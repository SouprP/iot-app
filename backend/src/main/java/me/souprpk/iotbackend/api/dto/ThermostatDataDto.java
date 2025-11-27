package me.souprpk.iotbackend.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThermostatDataDto {
    private Boolean heater;
    private Integer setPoint;
    private LocalDateTime receivedAt;
}
