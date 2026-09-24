package cloud_security_monitoring_backend.service;

import cloud_security_monitoring_backend.Entity.AuditLog;
import cloud_security_monitoring_backend.dto.AuditLogRequest;
import cloud_security_monitoring_backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog createAuditLog(AuditLogRequest request) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUsername(request.getUsername());
        auditLog.setAction(request.getAction());
        auditLog.setResource(request.getResource());
        auditLog.setIpAddress(request.getIpAddress());

        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }
}