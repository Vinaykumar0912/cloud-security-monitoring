package cloud_security_monitoring_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import cloud_security_monitoring_backend.dto.AssetDTO;
import cloud_security_monitoring_backend.service.AssetService;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    // Get All Assets
    @GetMapping
    public List<AssetDTO> getAllAssets() {
        return assetService.getAllAssets();
    }

    // Get Asset By Id
    @GetMapping("/{id}")
    public AssetDTO getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    // Create Asset
    @PostMapping
    public AssetDTO createAsset(@RequestBody AssetDTO dto) {
        return assetService.createAsset(dto);
    }

    // Dashboard Summary (Milestone 2)

}