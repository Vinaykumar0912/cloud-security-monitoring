package cloud_security_monitoring_backend.repository;

import cloud_security_monitoring_backend.Entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
}