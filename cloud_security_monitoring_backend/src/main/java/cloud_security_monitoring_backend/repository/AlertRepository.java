package cloud_security_monitoring_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cloud_security_monitoring_backend.Entity.Alert;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByStatus(Alert.AlertStatus status);

    List<Alert> findByAssetId(Long assetId);

    boolean existsByAssetIdAndSeverityAndStatus(
            Long assetId,
            Alert.AlertSeverity severity,
            Alert.AlertStatus status
    );

    List<Alert> findByStatusOrderByResolvedAtDesc(
            Alert.AlertStatus status
    );
}