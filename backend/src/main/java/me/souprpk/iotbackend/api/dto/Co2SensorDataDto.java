package me.souprpk.iotbackend.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Co2SensorDataDto {
    private Float temperatureC;
    private Float humidityRh;
    private Integer co2Ppm;
    private LocalDateTime receivedAt;
}
