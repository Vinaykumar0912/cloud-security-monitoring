package cloud_security_monitoring_backend;

import cloud_security_monitoring_backend.util.JwtUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    @Test
    void testAccessTokenGenerationAndValidation() {

        JwtUtil jwtUtil = new JwtUtil(
                "mySecretKeyForCloudSecurityMonitoringSystem123456789",
                3600000,
                86400000
        );

        String token = jwtUtil.generateToken("admin");

        assertNotNull(token);
        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals("admin", jwtUtil.extractUsername(token));
        assertFalse(jwtUtil.isRefreshToken(token));
    }

    @Test
    void testRefreshTokenGenerationAndValidation() {

        JwtUtil jwtUtil = new JwtUtil(
                "mySecretKeyForCloudSecurityMonitoringSystem123456789",
                3600000,
                86400000
        );

        String refreshToken =
                jwtUtil.generateRefreshToken("admin");

        assertNotNull(refreshToken);
        assertTrue(jwtUtil.isTokenValid(refreshToken));
        assertTrue(jwtUtil.isRefreshToken(refreshToken));
        assertEquals(
                "admin",
                jwtUtil.extractUsername(refreshToken)
        );
    }
}