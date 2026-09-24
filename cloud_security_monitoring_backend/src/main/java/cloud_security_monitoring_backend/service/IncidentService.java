package cloud_security_monitoring_backend.service;

import cloud_security_monitoring_backend.Entity.Incident;
import cloud_security_monitoring_backend.dto.IncidentRequest;
import cloud_security_monitoring_backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Incident createIncident(IncidentRequest request) {

        Incident incident = new Incident();

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(
                request.getStatus() == null || request.getStatus().isBlank()
                        ? "OPEN"
                        : request.getStatus()
        );
        incident.setAssignedTo(request.getAssignedTo());

        return incidentRepository.save(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Incident not found with id: " + id));
    }

    public Incident updateIncident(Long id, IncidentRequest request) {

        Incident incident = getIncidentById(id);

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setStatus(request.getStatus());
        incident.setAssignedTo(request.getAssignedTo());

        if ("RESOLVED".equalsIgnoreCase(request.getStatus())) {
            if (incident.getResolvedAt() == null) {
                incident.setResolvedAt(LocalDateTime.now());
            }
        } else {
            incident.setResolvedAt(null);
        }

        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {

        if (!incidentRepository.existsById(id)) {
            throw new RuntimeException("Incident not found with id: " + id);
        }

        incidentRepository.deleteById(id);
    }
}