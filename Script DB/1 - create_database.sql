CREATE DATABASE IF NOT EXISTS `aridos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE IF NOT EXISTS `access_level` (
  `id` int NOT NULL,
  `nombre` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;   

CREATE TABLE IF NOT EXISTS `security_groups` (
  `id` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  UNIQUE KEY `descripcion_UNIQUE` (`descripcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user_base` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `alias` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `date_creation` datetime NOT NULL,
  `state` tinyint(1) NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `alias_UNIQUE` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user_security` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_base_id` int DEFAULT NULL,
  `access_level_id` int DEFAULT NULL,
  `security_groups_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_user_base_idx` (`user_base_id`),
  KEY `FK_access_level_idx` (`access_level_id`),
  KEY `FK_security_groups_idx` (`security_groups_id`),
  CONSTRAINT `FK_access_level` FOREIGN KEY (`access_level_id`) REFERENCES `access_level` (`id`),
  CONSTRAINT `FK_security_groups` FOREIGN KEY (`security_groups_id`) REFERENCES `security_groups` (`id`),
  CONSTRAINT `FK_user_base` FOREIGN KEY (`user_base_id`) REFERENCES `user_base` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;