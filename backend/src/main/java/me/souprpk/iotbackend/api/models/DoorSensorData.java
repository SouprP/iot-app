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
@Table(name = "door_sensor_data")
public class DoorSensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "dev_eui")
    private String devEui;

    @Column(name = "f_cnt")
    private Integer fCnt;

    @Column(name = "door_open")
    private Boolean doorOpen;

    private Integer battery;
    private Boolean tamper;
    private Integer rssi;
    private Float snr;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "payload_raw", columnDefinition = "TEXT")
    private String payloadRaw;

    @Column(name = "event_code")
    private Integer eventCode;

    @Column(name = "event_counter")
    private Integer eventCounter;

    @Column(name = "gateway_id")
    private String gatewayId;
}
