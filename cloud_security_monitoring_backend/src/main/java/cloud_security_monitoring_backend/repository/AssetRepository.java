package cloud_security_monitoring_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import cloud_security_monitoring_backend.Entity.Asset;

import java.util.List;

@Repository
public interface AssetRepository
        extends JpaRepository<Asset, Long>,
        JpaSpecificationExecutor<Asset> {

    List<Asset> findByAssetType(String assetType);
    List<Asset> findByStatus(String status);
}
