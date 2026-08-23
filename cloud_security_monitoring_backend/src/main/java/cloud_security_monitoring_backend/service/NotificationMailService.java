package cloud_security_monitoring_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationMailService {

    private final JavaMailSender mailSender;

    public void sendAlertEmail(
            String recipient,
            String assetType,
            String assetStatus,
            String severity,
            String message) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setTo(recipient);

        mailMessage.setSubject(
                "Cloud Security Monitoring - Security Alert"
        );

        mailMessage.setText(
                "Security Alert Notification\n\n" +
                        "Asset Type: " + assetType + "\n" +
                        "Asset Status: " + assetStatus + "\n" +
                        "Severity: " + severity + "\n" +
                        "Alert Message: " + message + "\n\n" +
                        "Please check the Cloud Security Monitoring System."
        );

        mailSender.send(mailMessage);
    }
}