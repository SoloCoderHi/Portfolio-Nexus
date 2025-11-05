package authservice.config;

import authservice.entities.UserInfo;
import authservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.UUID;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        UserInfo existingAdmin = userRepository.findByUsername("admin");
        
        if (existingAdmin == null) {
            log.info("Creating default admin user...");
            
            // Create admin user with fixed UUID for consistency
            UserInfo adminUser = new UserInfo(
                "550e8400-e29b-41d4-a716-446655440000",
                "admin",
                passwordEncoder.encode("password"),
                new HashSet<>()
            );
            
            userRepository.save(adminUser);
            log.info("Default admin user created successfully with username: admin, password: password");
        } else {
            log.info("Admin user already exists. Skipping initialization.");
        }
    }
}
