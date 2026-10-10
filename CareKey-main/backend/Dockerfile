# Multi-stage Dockerfile for Java 21 Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/secureqr-health-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8081
ENV PORT=8081

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
