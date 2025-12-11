package me.souprpk.iotbackend.api.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SetpointValueDto {
    private BigDecimal desiredSetpoint;
}
