package cloud_security_monitoring_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO {

    private Long id;

    private String assetName;

    private String assetType;

    private String ipAddress;

    private String location;

    private String status;

    private Double cpuUsage;

    private Double memoryUsage;

    private Double diskUsage;

    private Double networkUsage;

    private LocalDateTime date;
}