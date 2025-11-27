package me.souprpk.iotbackend.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "thermostat_data")
public class ThermostatData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "dev_eui")
    private String devEui;

    @Column(name = "f_cnt")
    private Integer fCnt;

    private Boolean heater;

    @Column(name = "set_point")
    private Integer setPoint;

    private Integer rssi;
    private Float snr;

    @Column(name = "gateway_id")
    private String gatewayId;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "payload_raw", columnDefinition = "TEXT")
    private String payloadRaw;
}
