package cloud_security_monitoring_backend.controller;

import cloud_security_monitoring_backend.Entity.ComplianceCheck;
import cloud_security_monitoring_backend.repository.ComplianceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compliance")
@CrossOrigin
public class ComplianceController {

    private final ComplianceRepository complianceRepository;

    public ComplianceController(
            ComplianceRepository complianceRepository) {

        this.complianceRepository = complianceRepository;
    }

    @PostMapping
    public ResponseEntity<ComplianceCheck> createComplianceCheck(
            @RequestBody ComplianceCheck complianceCheck) {

        return ResponseEntity.ok(
                complianceRepository.save(complianceCheck)
        );
    }

    @GetMapping
    public ResponseEntity<List<ComplianceCheck>> getAllComplianceChecks() {

        return ResponseEntity.ok(
                complianceRepository.findAll()
        );
    }
}