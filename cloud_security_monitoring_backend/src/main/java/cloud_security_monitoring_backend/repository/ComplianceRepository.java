package cloud_security_monitoring_backend.repository;

import cloud_security_monitoring_backend.Entity.ComplianceCheck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplianceRepository
        extends JpaRepository<ComplianceCheck, Long> {
}