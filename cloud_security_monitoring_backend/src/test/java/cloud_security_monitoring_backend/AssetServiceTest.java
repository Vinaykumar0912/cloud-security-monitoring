package cloud_security_monitoring_backend;

import cloud_security_monitoring_backend.Entity.Asset;
import cloud_security_monitoring_backend.repository.AssetRepository;
import cloud_security_monitoring_backend.service.AssetService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.jpa.domain.Specification;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetService assetService;

    @Test
    void testSearchAssets() {

        Asset asset = Asset.builder()
                .id(11L)
                .assetName("Test Server")
                .assetType("SERVER")
                .ipAddress("192.168.1.50")
                .location("Bangalore")
                .status("ONLINE")
                .cpuUsage(50.0)
                .memoryUsage(40.0)
                .diskUsage(30.0)
                .networkUsage(20.0)
                .build();

        when(assetRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(asset));

        List<Asset> result =
                assetService.searchAndFilter("Test", null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Server",
                result.get(0).getAssetName());

        verify(assetRepository, times(1))
                .findAll(any(Specification.class));
    }

    @Test
    void testSearchAssetsByStatus() {

        Asset asset = Asset.builder()
                .id(11L)
                .assetName("Test Server")
                .assetType("SERVER")
                .status("ONLINE")
                .build();

        when(assetRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(asset));

        List<Asset> result =
                assetService.searchAndFilter(
                        null,
                        "ONLINE"
                );

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ONLINE",
                result.get(0).getStatus());

        verify(assetRepository, times(1))
                .findAll(any(Specification.class));
    }
}