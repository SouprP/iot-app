package me.souprpk.iotbackend.api.repository;

import me.souprpk.iotbackend.api.models.Setpoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SetpointRepository extends JpaRepository<Setpoint, String> {
	Setpoint findFirstByOrderByDevEuiAsc();
}
