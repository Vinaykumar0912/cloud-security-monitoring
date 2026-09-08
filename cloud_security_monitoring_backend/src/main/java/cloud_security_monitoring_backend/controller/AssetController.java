package cloud_security_monitoring_backend.controller;
import cloud_security_monitoring_backend.Entity.Asset;
import cloud_security_monitoring_backend.dto.DashboardSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import cloud_security_monitoring_backend.dto.AssetDTO;
import cloud_security_monitoring_backend.service.AssetService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public List<AssetDTO> getAllAssets() {
        return assetService.getAllAssets();
    }
    @GetMapping("/search")
    public List<Asset> searchAssets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {
        return assetService.searchAndFilter(
                search,
                status
        );
    }
    @GetMapping("/{id}")
    public AssetDTO getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AssetDTO createAsset(@Valid @RequestBody AssetDTO dto) {
        return assetService.createAsset(dto);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AssetDTO updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssetDTO dto
    ) {
        return assetService.updateAsset(id, dto);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }
    @GetMapping("/dashboard/summary")
    public DashboardSummaryDTO getDashboardSummary() {
        return assetService.getDashboardSummary();
    }
}