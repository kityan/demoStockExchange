-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema demo_stock_exchange
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema demo_stock_exchange
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `demo_stock_exchange` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `demo_stock_exchange` ;

-- -----------------------------------------------------
-- Table `demo_stock_exchange`.`companies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demo_stock_exchange`.`companies` ;

CREATE TABLE IF NOT EXISTS `demo_stock_exchange`.`companies` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `code` VARCHAR(6) NULL COMMENT '',
  `budget` DECIMAL(10,2) UNSIGNED NULL COMMENT '',
  `bid` INT UNSIGNED NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `code_UNIQUE` (`code` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `demo_stock_exchange`.`categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demo_stock_exchange`.`categories` ;

CREATE TABLE IF NOT EXISTS `demo_stock_exchange`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `title` VARCHAR(255) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `title_UNIQUE` (`title` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `demo_stock_exchange`.`companies_has_categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demo_stock_exchange`.`companies_has_categories` ;

CREATE TABLE IF NOT EXISTS `demo_stock_exchange`.`companies_has_categories` (
  `companies_id` INT NOT NULL COMMENT '',
  `categories_id` INT NOT NULL COMMENT '',
  PRIMARY KEY (`companies_id`, `categories_id`)  COMMENT '',
  INDEX `fk_companies_has_catergories_catergories1_idx` (`categories_id` ASC)  COMMENT '',
  INDEX `fk_companies_has_catergories_companies_idx` (`companies_id` ASC)  COMMENT '',
  CONSTRAINT `fk_companies_has_catergories_companies`
    FOREIGN KEY (`companies_id`)
    REFERENCES `demo_stock_exchange`.`companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_companies_has_catergories_catergories1`
    FOREIGN KEY (`categories_id`)
    REFERENCES `demo_stock_exchange`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `demo_stock_exchange`.`countries`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demo_stock_exchange`.`countries` ;

CREATE TABLE IF NOT EXISTS `demo_stock_exchange`.`countries` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `code` VARCHAR(6) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '',
  UNIQUE INDEX `code_UNIQUE` (`code` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `demo_stock_exchange`.`companies_has_countries`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `demo_stock_exchange`.`companies_has_countries` ;

CREATE TABLE IF NOT EXISTS `demo_stock_exchange`.`companies_has_countries` (
  `companies_id` INT NOT NULL COMMENT '',
  `countries_id` INT NOT NULL COMMENT '',
  PRIMARY KEY (`companies_id`, `countries_id`)  COMMENT '',
  INDEX `fk_companies_has_countries_countries1_idx` (`countries_id` ASC)  COMMENT '',
  INDEX `fk_companies_has_countries_companies1_idx` (`companies_id` ASC)  COMMENT '',
  CONSTRAINT `fk_companies_has_countries_companies1`
    FOREIGN KEY (`companies_id`)
    REFERENCES `demo_stock_exchange`.`companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_companies_has_countries_countries1`
    FOREIGN KEY (`countries_id`)
    REFERENCES `demo_stock_exchange`.`countries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `demo_stock_exchange` ;

-- -----------------------------------------------------
-- Placeholder table for view `demo_stock_exchange`.`stock_exchange_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `demo_stock_exchange`.`stock_exchange_state` (`CompanyID` INT, `Countries` INT, `Budget` INT, `Bid` INT, `Category` INT);

-- -----------------------------------------------------
-- View `demo_stock_exchange`.`stock_exchange_state`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `demo_stock_exchange`.`stock_exchange_state` ;
DROP TABLE IF EXISTS `demo_stock_exchange`.`stock_exchange_state`;
USE `demo_stock_exchange`;
CREATE  OR REPLACE VIEW `stock_exchange_state` AS
SELECT 
companies.code AS `CompanyID`, 
GROUP_CONCAT(DISTINCT countries.code ORDER BY countries.code ASC SEPARATOR ', ') AS `Countries` ,  
CONCAT(companies.budget, '$') AS `Budget`,
CONCAT(companies.bid, ' cent') AS `Bid`,
GROUP_CONCAT(DISTINCT categories.title ORDER BY categories.title ASC SEPARATOR ', ') AS `Category`
FROM companies 
LEFT JOIN companies_has_countries ON companies.id = companies_has_countries.companies_id 
LEFT JOIN countries ON  companies_has_countries.countries_id = countries.id 
LEFT JOIN companies_has_categories ON companies.id = companies_has_categories.companies_id 
LEFT JOIN categories ON  companies_has_categories.categories_id = categories.id 
GROUP BY companies.code
;

-- -----------------------------------------------------
-- Data for table `demo_stock_exchange`.`companies`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo_stock_exchange`;
INSERT INTO `demo_stock_exchange`.`companies` (`id`, `code`, `budget`, `bid`) VALUES (1, 'C1', 1, 10);
INSERT INTO `demo_stock_exchange`.`companies` (`id`, `code`, `budget`, `bid`) VALUES (2, 'C2', 2, 30);
INSERT INTO `demo_stock_exchange`.`companies` (`id`, `code`, `budget`, `bid`) VALUES (3, 'C3', 3, 5);

COMMIT;


-- -----------------------------------------------------
-- Data for table `demo_stock_exchange`.`categories`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo_stock_exchange`;
INSERT INTO `demo_stock_exchange`.`categories` (`id`, `title`) VALUES (1, 'Automobile');
INSERT INTO `demo_stock_exchange`.`categories` (`id`, `title`) VALUES (2, 'Finance');
INSERT INTO `demo_stock_exchange`.`categories` (`id`, `title`) VALUES (3, 'IT');

COMMIT;


-- -----------------------------------------------------
-- Data for table `demo_stock_exchange`.`companies_has_categories`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo_stock_exchange`;
INSERT INTO `demo_stock_exchange`.`companies_has_categories` (`companies_id`, `categories_id`) VALUES (1, 1);
INSERT INTO `demo_stock_exchange`.`companies_has_categories` (`companies_id`, `categories_id`) VALUES (1, 2);
INSERT INTO `demo_stock_exchange`.`companies_has_categories` (`companies_id`, `categories_id`) VALUES (2, 2);
INSERT INTO `demo_stock_exchange`.`companies_has_categories` (`companies_id`, `categories_id`) VALUES (2, 3);
INSERT INTO `demo_stock_exchange`.`companies_has_categories` (`companies_id`, `categories_id`) VALUES (3, 1);
INSERT INTO `demo_stock_exchange`.`companies_has_categories` (`companies_id`, `categories_id`) VALUES (3, 3);

COMMIT;


-- -----------------------------------------------------
-- Data for table `demo_stock_exchange`.`countries`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo_stock_exchange`;
INSERT INTO `demo_stock_exchange`.`countries` (`id`, `code`) VALUES (1, 'US');
INSERT INTO `demo_stock_exchange`.`countries` (`id`, `code`) VALUES (2, 'FR');
INSERT INTO `demo_stock_exchange`.`countries` (`id`, `code`) VALUES (3, 'IN');
INSERT INTO `demo_stock_exchange`.`countries` (`id`, `code`) VALUES (4, 'RU');

COMMIT;


-- -----------------------------------------------------
-- Data for table `demo_stock_exchange`.`companies_has_countries`
-- -----------------------------------------------------
START TRANSACTION;
USE `demo_stock_exchange`;
INSERT INTO `demo_stock_exchange`.`companies_has_countries` (`companies_id`, `countries_id`) VALUES (1, 1);
INSERT INTO `demo_stock_exchange`.`companies_has_countries` (`companies_id`, `countries_id`) VALUES (1, 2);
INSERT INTO `demo_stock_exchange`.`companies_has_countries` (`companies_id`, `countries_id`) VALUES (2, 1);
INSERT INTO `demo_stock_exchange`.`companies_has_countries` (`companies_id`, `countries_id`) VALUES (2, 3);
INSERT INTO `demo_stock_exchange`.`companies_has_countries` (`companies_id`, `countries_id`) VALUES (3, 1);
INSERT INTO `demo_stock_exchange`.`companies_has_countries` (`companies_id`, `countries_id`) VALUES (3, 4);

COMMIT;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
