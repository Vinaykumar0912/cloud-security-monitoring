package cloud_security_monitoring_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {

    private Long id;

    private Long assetId;

    private String assetName;

    private String severity;

    private String message;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;
}