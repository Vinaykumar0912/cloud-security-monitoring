package cloud_security_monitoring_backend.service;

import cloud_security_monitoring_backend.dto.DashboardSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cloud_security_monitoring_backend.Entity.Asset;
import cloud_security_monitoring_backend.dto.AssetDTO;
import cloud_security_monitoring_backend.repository.AssetRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    // Get All Assets
    public List<AssetDTO> getAllAssets() {
        return assetRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get Asset By Id
    public AssetDTO getAssetById(Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset Not Found"));

        return toDTO(asset);
    }

    // Create Asset
    // Create Asset
    public AssetDTO createAsset(AssetDTO dto) {

        Asset asset = Asset.builder()
                .assetName(dto.getAssetName())
                .assetType(dto.getAssetType())
                .ipAddress(dto.getIpAddress())
                .location(dto.getLocation())
                .cpuUsage(dto.getCpuUsage())
                .memoryUsage(dto.getMemoryUsage())
                .diskUsage(dto.getDiskUsage())
                .networkUsage(dto.getNetworkUsage())
                .status(dto.getStatus())
                .date(dto.getDate())
                .build();

        return toDTO(assetRepository.save(asset));
    }

    // Convert Entity to DTO
    private AssetDTO toDTO(Asset asset) {

        AssetDTO dto = new AssetDTO();

        dto.setId(asset.getId());
        dto.setAssetName(asset.getAssetName());
        dto.setAssetType(asset.getAssetType());
        dto.setIpAddress(asset.getIpAddress());
        dto.setLocation(asset.getLocation());
        dto.setStatus(asset.getStatus());
        dto.setCpuUsage(asset.getCpuUsage());
        dto.setMemoryUsage(asset.getMemoryUsage());
        dto.setDiskUsage(asset.getDiskUsage());
        dto.setNetworkUsage(asset.getNetworkUsage());
        dto.setDate(asset.getDate());

        return dto;
    }

    // Convert DTO to Entity
    private Asset toEntity(AssetDTO dto) {

        Asset asset = new Asset();

        asset.setId(dto.getId());
        asset.setAssetName(dto.getAssetName());
        asset.setAssetType(dto.getAssetType());
        asset.setIpAddress(dto.getIpAddress());
        asset.setLocation(dto.getLocation());
        asset.setStatus(dto.getStatus());
        asset.setCpuUsage(dto.getCpuUsage());
        asset.setMemoryUsage(dto.getMemoryUsage());
        asset.setDiskUsage(dto.getDiskUsage());
        asset.setNetworkUsage(dto.getNetworkUsage());
        asset.setDate(dto.getDate());

        return asset;
    }
    public DashboardSummaryDTO getDashboardSummary() {

        List<Asset> all = assetRepository.findAll();

        long total = all.size();

        long online = all.stream()
                .filter(a -> "ONLINE".equalsIgnoreCase(a.getStatus()))
                .count();

        long offline = all.stream()
                .filter(a -> "OFFLINE".equalsIgnoreCase(a.getStatus()))
                .count();

        long critical = all.stream()
                .filter(a -> "CRITICAL".equalsIgnoreCase(a.getStatus()))
                .count();

        double avgCpu = all.stream()
                .filter(a -> a.getCpuUsage() != null)
                .mapToDouble(Asset::getCpuUsage)
                .average()
                .orElse(0);

        double avgMem = all.stream()
                .filter(a -> a.getMemoryUsage() != null)
                .mapToDouble(Asset::getMemoryUsage)
                .average()
                .orElse(0);

        double uptime = total == 0
                ? 0
                : ((double) online / total) * 100;

        return DashboardSummaryDTO.builder()
                .totalAssets(total)
                .uptimePercentage(uptime)
                .onlineAssets(online)
                .offlineAssets(offline)
                .criticalAlerts(critical)
                .avgCpuUsage(avgCpu)
                .avgMemoryUsage(avgMem)
                .build();
    }
}