# Expense Service

A Spring Boot microservice for managing expenses and expense categories within the Portfolio-Nexus application.

## Overview

The Expense Service is responsible for tracking user expenses, categorizing them, and providing expense management capabilities. It follows the same architecture patterns as other services in the Portfolio-Nexus ecosystem.

## Features

- **Expense Management**: Create, read, update, and delete expenses
- **Category Management**: Organize expenses into categories with optional parent-child relationships
- **Multi-tenancy**: All data is scoped to individual users via `userId`
- **MySQL Database**: Persistent storage with JPA/Hibernate
- **Kafka Integration**: Ready for event-driven architecture (currently disabled)
- **Health Checks**: Spring Boot Actuator endpoints for monitoring

## Database Schema

### Expense Entity
- `id` (Long, Primary Key)
- `externalId` (String, UUID, Unique)
- `userId` (String, Not Null)
- `amount` (BigDecimal, Not Null)
- `description` (String, Not Null)
- `expenseDate` (LocalDate, Not Null)
- `category_id` (Foreign Key to ExpenseCategory)
- `createdAt` (Instant, Auto-generated)
- `updatedAt` (Instant, Auto-updated)

### ExpenseCategory Entity
- `id` (Long, Primary Key)
- `userId` (String, Not Null)
- `name` (String, Not Null)
- `parentId` (Long, Nullable) - For hierarchical categories

## Configuration

The service runs on **port 9812** and connects to its own MySQL database `expenseservice`.

### Environment Variables
- `MYSQL_HOST`: MySQL server hostname (default: localhost)
- `MYSQL_PORT`: MySQL server port (default: 3306)
- `MYSQL_DB`: Database name (default: expenseservice)
- `MYSQL_USER`: Database user (default: root)
- `MYSQL_PASSWORD`: Database password (default: password)
- `KAFKA_HOST`: Kafka broker hostname (default: localhost)
- `KAFKA_PORT`: Kafka broker port (default: 9092)

## Building and Running

### Local Development
```bash
./gradlew bootRun
```

### Docker
```bash
docker-compose up expenseservice
```

### Build JAR
```bash
./gradlew build
```

## API Endpoints

Health check endpoint is available at:
- `GET /health` - Service health status

## Technology Stack

- **Java 17**
- **Spring Boot 3.1.0**
- **Spring Data JPA**
- **MySQL 8.3.0**
- **Lombok**
- **Gradle**
- **Docker**

## Future Enhancements

- REST API endpoints for expense CRUD operations
- Kafka event publishing for expense creation/updates
- Advanced querying and filtering capabilities
- Expense analytics and reporting
- Budget management integration
