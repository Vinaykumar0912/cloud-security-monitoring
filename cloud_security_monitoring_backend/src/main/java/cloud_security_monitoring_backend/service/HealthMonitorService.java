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

            // Check CPU usage
            if (asset.getCpuUsage() != null
                    && asset.getCpuUsage() >= CPU_THRESHOLD) {

                asset.setStatus("CRITICAL");

                alertService.createAlert(
                        asset.getId(),
                        "CRITICAL",
                        "CPU usage is high: "
                                + asset.getCpuUsage() + "%"
                );
            }

            // Check Memory usage
            else if (asset.getMemoryUsage() != null
                    && asset.getMemoryUsage() >= MEMORY_THRESHOLD) {

                asset.setStatus("WARNING");

                alertService.createAlert(
                        asset.getId(),
                        "MEDIUM",
                        "Memory usage is high: "
                                + asset.getMemoryUsage() + "%"
                );
            }

            // Asset is healthy
            else {
                asset.setStatus("ONLINE");
            }

            assetRepository.save(asset);
        }
    }
}