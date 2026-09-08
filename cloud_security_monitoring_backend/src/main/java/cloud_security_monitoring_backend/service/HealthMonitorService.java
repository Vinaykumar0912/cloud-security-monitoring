package cloud_security_monitoring_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import cloud_security_monitoring_backend.Entity.Asset;
import cloud_security_monitoring_backend.repository.AssetRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthMonitorService {

    private final AssetRepository assetRepository;
    private final AlertService alertService;

    private static final double CPU_THRESHOLD = 90.0;
    private static final double MEMORY_THRESHOLD = 80.0;

    @Scheduled(fixedRate = 60000)
    public void checkAssetHealth() {

        List<Asset> assets = assetRepository.findAll();

        for (Asset asset : assets) {

            /*
             * Status represents operational availability.
             * Health conditions must NOT change the status.
             *
             * Currently monitored assets are considered ONLINE.
             * WARNING/CRITICAL conditions are handled through
             * health checks and alerts.
             */
            asset.setStatus("ONLINE");

            // =========================
            // CPU HEALTH CHECK
            // =========================
            if (asset.getCpuUsage() != null
                    && asset.getCpuUsage() >= CPU_THRESHOLD) {

                // Create a new alert only when CPU condition
                // was previously normal.
                if (!asset.isCpuAlertActive()) {

                    alertService.createAlert(
                            asset.getId(),
                            "CRITICAL",
                            "CPU usage is high: "
                                    + asset.getCpuUsage() + "%"
                    );

                    asset.setCpuAlertActive(true);
                }

            } else {

                // CPU condition has returned to normal.
                // This allows a future high CPU condition
                // to generate a new alert.
                asset.setCpuAlertActive(false);
            }

            // =========================
            // MEMORY HEALTH CHECK
            // =========================
            if (asset.getMemoryUsage() != null
                    && asset.getMemoryUsage() >= MEMORY_THRESHOLD) {

                // Create a new alert only when memory condition
                // was previously normal.
                if (!asset.isMemoryAlertActive()) {

                    alertService.createAlert(
                            asset.getId(),
                            "MEDIUM",
                            "Memory usage is high: "
                                    + asset.getMemoryUsage() + "%"
                    );

                    asset.setMemoryAlertActive(true);
                }

            } else {

                // Memory condition has returned to normal.
                asset.setMemoryAlertActive(false);
            }

            assetRepository.save(asset);
        }
    }
}