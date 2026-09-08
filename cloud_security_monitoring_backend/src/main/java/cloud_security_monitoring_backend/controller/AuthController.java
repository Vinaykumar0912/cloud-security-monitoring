package cloud_security_monitoring_backend.controller;

import cloud_security_monitoring_backend.Entity.User;
import cloud_security_monitoring_backend.repository.UserRepository;
import cloud_security_monitoring_backend.util.JwtUtil;
import cloud_security_monitoring_backend.exception.UnauthorizedException;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String rawPassword = credentials.get("password");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UnauthorizedException("Invalid credentials"));
        if (!user.isEnabled()) {
            throw new UnauthorizedException("User account is disabled");
        }
        if (!passwordEncoder.matches(
                rawPassword,
                user.getPassword())) {

            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken =
                jwtUtil.generateToken(username);

        String refreshToken =
                jwtUtil.generateRefreshToken(username);

        String role = user.getRoles()
                .stream()
                .findFirst()
                .map(roleEntity -> roleEntity.getName())
                .orElse("ROLE_VIEWER");

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "role", role
        );
    }
    @PostMapping("/refresh")
    public Map<String, String> refresh(
            @RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        if (!jwtUtil.isTokenValid(refreshToken)
                || !jwtUtil.isRefreshToken(refreshToken)) {

            throw new UnauthorizedException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);

        String newAccessToken = jwtUtil.generateToken(username);

        return Map.of(
                "accessToken", newAccessToken
        );
    }
}