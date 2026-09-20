package cloud_security_monitoring_backend.config;

import cloud_security_monitoring_backend.Entity.Role;
import cloud_security_monitoring_backend.Entity.User;
import cloud_security_monitoring_backend.repository.RoleRepository;
import cloud_security_monitoring_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name("ROLE_ADMIN")
                                .build()
                ));

        Role viewerRole = roleRepository.findByName("ROLE_VIEWER")
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name("ROLE_VIEWER")
                                .build()
                ));

        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@example.com")
                    .roles(Set.of(adminRole))
                    .enabled(true)
                    .build();

            userRepository.save(admin);

            System.out.println("Admin user created successfully.");
        }

        if (userRepository.findByUsername("viewer").isEmpty()) {

            User viewer = User.builder()
                    .username("viewer")
                    .password(passwordEncoder.encode("viewer123"))
                    .email("viewer@example.com")
                    .roles(Set.of(viewerRole))
                    .enabled(true)
                    .build();

            userRepository.save(viewer);

            System.out.println("Viewer user created successfully.");
        }
    }
}