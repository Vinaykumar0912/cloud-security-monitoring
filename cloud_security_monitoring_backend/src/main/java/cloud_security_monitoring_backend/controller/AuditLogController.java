package cloud_security_monitoring_backend.controller;

import cloud_security_monitoring_backend.Entity.AuditLog;
import cloud_security_monitoring_backend.dto.AuditLogRequest;
import cloud_security_monitoring_backend.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @PostMapping
    public ResponseEntity<AuditLog> createAuditLog(
            @RequestBody AuditLogRequest request) {

        return ResponseEntity.ok(
                auditLogService.createAuditLog(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs()
        );
    }
}