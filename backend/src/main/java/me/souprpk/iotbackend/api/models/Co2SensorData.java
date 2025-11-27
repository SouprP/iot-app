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
@Table(name = "co2_sensor_data")
public class Co2SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "dev_eui", nullable = false)
    private String devEui;

    @Column(name = "f_cnt")
    private Integer fCnt;

    @Column(name = "report_type")
    private String reportType;

    @Column(name = "sample_index")
    private Integer sampleIndex;

    @Column(name = "base_timestamp")
    private LocalDateTime baseTimestamp;

    @Column(name = "storage_interval_seconds")
    private Integer storageIntervalSeconds;

    @Column(name = "sample_time")
    private LocalDateTime sampleTime;

    @Column(name = "temperature_c")
    private Float temperatureC;

    @Column(name = "humidity_rh")
    private Float humidityRh;

    @Column(name = "co2_ppm")
    private Integer co2Ppm;

    @Column(name = "battery_percent")
    private Integer batteryPercent;

    private Integer rssi;
    private Float snr;

    @Column(name = "gateway_id")
    private String gatewayId;

    @Column(name = "lorawan_time")
    private LocalDateTime lorawanTime;

    @Column(name = "payload_raw", columnDefinition = "TEXT")
    private String payloadRaw;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;
}
