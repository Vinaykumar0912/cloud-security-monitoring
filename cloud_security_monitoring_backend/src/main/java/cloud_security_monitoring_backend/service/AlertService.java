package cloud_security_monitoring_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import cloud_security_monitoring_backend.Entity.Alert;
import cloud_security_monitoring_backend.Entity.Asset;
import cloud_security_monitoring_backend.dto.AlertDTO;
import cloud_security_monitoring_backend.repository.AlertRepository;
import cloud_security_monitoring_backend.repository.AssetRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final AssetRepository assetRepository;

    // Create Alert
    public AlertDTO createAlert(Long assetId, String severity, String message) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() ->
                        new RuntimeException("Asset not found: " + assetId));

        Alert alert = Alert.builder()
                .asset(asset)
                .severity(Alert.AlertSeverity.valueOf(severity))
                .message(message)
                .status(Alert.AlertStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        return toDTO(alertRepository.save(alert));
    }

    // Resolve Alert
    public AlertDTO resolveAlert(Long alertId) {

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found: " + alertId));

        alert.setStatus(Alert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        return toDTO(alertRepository.save(alert));
    }

    // Get Open Alerts
    public List<AlertDTO> getOpenAlerts() {

        return alertRepository
                .findByStatus(Alert.AlertStatus.OPEN)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Convert Entity to DTO
    private AlertDTO toDTO(Alert alert) {

        return AlertDTO.builder()
                .id(alert.getId())
                .assetId(alert.getAsset().getId())
                .assetName(alert.getAsset().getAssetName())
                .severity(alert.getSeverity().name())
                .message(alert.getMessage())
                .status(alert.getStatus().name())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}