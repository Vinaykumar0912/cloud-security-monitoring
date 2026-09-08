package cloud_security_monitoring_backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
@Slf4j
public class AlertService {

    private final AlertRepository alertRepository;
    private final AssetRepository assetRepository;
    private final NotificationMailService notificationMailService;
    private final SmsService smsService;

    @Value("${spring.mail.username}")
    private String notificationRecipient;

    @Value("${twilio.notification.recipient}")
    private String smsRecipient;


    public AlertDTO createAlert(Long assetId, String severity, String message) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found: " + assetId));

        Alert.AlertSeverity alertSeverity;

        try {
            alertSeverity = Alert.AlertSeverity.valueOf(
                    severity.trim().toUpperCase()
            );
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException(
                    "Invalid alert severity. Allowed values: LOW, MEDIUM, HIGH, CRITICAL."
            );
        }

        // Prevent duplicate OPEN alerts for the same asset and severity
        if (alertRepository.existsByAssetIdAndSeverityAndStatus(
                assetId,
                alertSeverity,
                Alert.AlertStatus.OPEN)) {

            log.info(
                    "Duplicate alert skipped for asset {} with severity {}",
                    assetId,
                    severity
            );

            return alertRepository.findByAssetId(assetId)
                    .stream()
                    .filter(alert ->
                            alert.getSeverity() == alertSeverity &&
                                    alert.getStatus() == Alert.AlertStatus.OPEN
                    )
                    .findFirst()
                    .map(this::toDTO)
                    .orElseThrow();
        }

        Alert alert = Alert.builder()
                .asset(asset)
                .severity(alertSeverity)
                .message(message)
                .status(Alert.AlertStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();


        Alert savedAlert = alertRepository.save(alert);


        // Send email notification only for HIGH and CRITICAL alerts
        if (alert.getSeverity() == Alert.AlertSeverity.HIGH ||
                alert.getSeverity() == Alert.AlertSeverity.CRITICAL) {

            try {

                notificationMailService.sendAlertEmail(
                        notificationRecipient,
                        String.valueOf(asset.getAssetType()),
                        String.valueOf(asset.getStatus()),
                        severity,
                        message
                );

                log.info(
                        "Alert notification email sent successfully for {} severity",
                        severity
                );

            } catch (Exception e) {

                log.error(
                        "Failed to send alert notification email",
                        e
                );
            }
        }

        try {

            smsService.sendAlertSms(
                    smsRecipient,
                    String.valueOf(asset.getAssetType()),
                    String.valueOf(asset.getStatus()),
                    severity,
                    message
            );

            log.info("Alert notification SMS sent successfully");

        } catch (Exception e) {

            log.error("Failed to send alert notification SMS", e);
        }


        return toDTO(savedAlert);
    }


    public AlertDTO resolveAlert(Long alertId) {

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found: " + alertId));

        // Prevent duplicate resolution notifications
        if (alert.getStatus() == Alert.AlertStatus.RESOLVED) {
            return toDTO(alert);
        }

        alert.setStatus(Alert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        Alert savedAlert = alertRepository.save(alert);

        Asset asset = alert.getAsset();

        // Send resolution email only for HIGH and CRITICAL alerts
        if (alert.getSeverity() == Alert.AlertSeverity.HIGH ||
                alert.getSeverity() == Alert.AlertSeverity.CRITICAL) {

            try {

                notificationMailService.sendAlertEmail(
                        notificationRecipient,
                        String.valueOf(asset.getAssetType()),
                        String.valueOf(asset.getStatus()),
                        alert.getSeverity().name(),
                        "ALERT RESOLVED: " + alert.getMessage()
                );

                log.info(
                        "Alert resolution email sent successfully for {} severity",
                        alert.getSeverity()
                );

            } catch (Exception e) {

                log.error(
                        "Failed to send alert resolution email",
                        e
                );
            }
        }

        // Send resolution SMS for all severities
        try {

            smsService.sendAlertSms(
                    smsRecipient,
                    String.valueOf(asset.getAssetType()),
                    String.valueOf(asset.getStatus()),
                    alert.getSeverity().name(),
                    "ALERT RESOLVED: " + alert.getMessage()
            );

            log.info("Alert resolution SMS sent successfully");

        } catch (Exception e) {

            log.error(
                    "Failed to send alert resolution SMS",
                    e
            );
        }

        return toDTO(savedAlert);
    }


    public List<AlertDTO> getOpenAlerts() {

        return alertRepository
                .findByStatus(Alert.AlertStatus.OPEN)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AlertDTO> getAlertHistory() {

        return alertRepository
                .findByStatusOrderByResolvedAtDesc(
                        Alert.AlertStatus.RESOLVED
                )
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
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