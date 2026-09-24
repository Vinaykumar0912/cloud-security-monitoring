package cloud_security_monitoring_backend.repository;

import cloud_security_monitoring_backend.Entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}