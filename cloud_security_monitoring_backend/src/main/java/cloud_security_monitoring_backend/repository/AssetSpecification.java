package cloud_security_monitoring_backend.repository;

import cloud_security_monitoring_backend.Entity.Asset;
import org.springframework.data.jpa.domain.Specification;

public class AssetSpecification {

    public static Specification<Asset> searchAssets(
            String search,
            String status
    ) {

        return (root, query, criteriaBuilder) -> {

            Specification<Asset> specification = null;


            if (search != null && !search.isBlank()) {

                specification = Specification.where(
                        (root1, query1, cb) ->
                                cb.like(
                                        cb.lower(root1.get("assetName")),
                                        "%" + search.toLowerCase() + "%"
                                )
                );
            }

            if (status != null && !status.isBlank()) {

                Specification<Asset> statusSpec =
                        (root1, query1, cb) ->
                                cb.equal(
                                        root1.get("status"),
                                        status
                                );

                specification = specification == null
                        ? statusSpec
                        : specification.and(statusSpec);
            }

            return specification == null
                    ? criteriaBuilder.conjunction()
                    : specification.toPredicate(
                    root,
                    query,
                    criteriaBuilder
            );
        };
    }
}