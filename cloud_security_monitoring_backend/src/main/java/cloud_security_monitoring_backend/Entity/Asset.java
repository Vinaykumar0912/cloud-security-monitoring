package cloud_security_monitoring_backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor


public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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