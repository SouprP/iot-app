package me.souprpk.iotbackend.api.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "thermostat_control")
public class Setpoint {
	@Id
	@Column(name = "dev_eui", length = 32)
	private String devEui;

	@Column(name = "desired_setpoint", precision = 10, scale = 2)
	private BigDecimal desiredSetpoint;
}
