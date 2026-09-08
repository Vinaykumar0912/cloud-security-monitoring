package cloud_security_monitoring_backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO {

    private Long id;

    @NotBlank(message = "Asset name is required")
    private String assetName;

    @NotBlank(message = "Asset type is required")
    private String assetType;

    @NotBlank(message = "IP address is required")
    @Pattern(
            regexp = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}"
                    + "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
            message = "Invalid IPv4 address"
    )
    private String ipAddress;

    @NotBlank(message = "Location is required")
    private String location;

    private String status;

    @DecimalMin(value = "0.0", message = "CPU usage cannot be negative")
    @DecimalMax(value = "100.0", message = "CPU usage cannot exceed 100")
    private Double cpuUsage;

    @DecimalMin(value = "0.0", message = "Memory usage cannot be negative")
    @DecimalMax(value = "100.0", message = "Memory usage cannot exceed 100")
    private Double memoryUsage;

    @DecimalMin(value = "0.0", message = "Disk usage cannot be negative")
    @DecimalMax(value = "100.0", message = "Disk usage cannot exceed 100")
    private Double diskUsage;

    @DecimalMin(value = "0.0", message = "Network usage cannot be negative")
    @DecimalMax(value = "100.0", message = "Network usage cannot exceed 100")
    private Double networkUsage;

    private LocalDateTime date;
}