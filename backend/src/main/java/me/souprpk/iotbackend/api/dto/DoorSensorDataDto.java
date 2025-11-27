package me.souprpk.iotbackend.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoorSensorDataDto {
    private Boolean doorOpen;
    private Integer battery;
    private LocalDateTime receivedAt;
}
