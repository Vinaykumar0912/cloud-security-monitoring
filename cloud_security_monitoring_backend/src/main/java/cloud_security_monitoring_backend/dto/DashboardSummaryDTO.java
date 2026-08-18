package cloud_security_monitoring_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {

    private Long totalAssets;

    private Double uptimePercentage;

    private Long onlineAssets;

    private Long offlineAssets;

    private Long criticalAlerts;

    private Double avgCpuUsage;

    private Double avgMemoryUsage;
}