package cloud_security_monitoring_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CloudSecurityMonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(
				CloudSecurityMonitoringApplication.class,
				args
		);
	}
}