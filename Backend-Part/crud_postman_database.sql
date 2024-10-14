-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 10, 2024 at 10:34 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crud_postman`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyerId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buyerId` (`buyerId`),
  KEY `productId` (`productId`)
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `buyerId`, `productId`, `quantity`) VALUES
(6, 36, 36, 2),
(7, 27, 27, 6),
(8, 34, 34, 3),
(19, 30, 30, 3),
(22, 29, 29, 2),
(38, 35, 35, 4),
(43, 37, 37, 5);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `quantity`, `userId`) VALUES
(29, 'I phone 14 pro', 'Nice Model', 1399, 1, 69),
(28, 'I phone 15 pro', 'Nice Model', 1599, 2, 54),
(33, 'I phone 11 pro', 'Nice Model', 899, 1, 56),
(34, 'Brown Perfume', 'Better Fragrance', 300, 2, 54),
(31, 'I phone 12 pro', 'Nice Model', 999, 3, 56),
(27, 'I phone 16 pro', 'Nice Model', 1799, 5, 54),
(30, 'I phone 13 pro', 'Nice Model', 1299, 2, 69),
(35, 'Rose Perfume', 'Better Fragrance', 600, 3, 56);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(200) NOT NULL,
  `ProImg` varchar(200) NOT NULL,
  `role` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `ProImg`, `role`) VALUES
(54, 'Darshan', 'darshan123@gmail.com', '$2b$10$n5D0.AjLiPhP8VMzG9glf.BU6ooC/A6tGmkdmMsRogllvtbOxNY8i', 'uploads\\profile\\1728365145023.jpeg', 'Admin'),
(58, 'John', 'john123@gmail.com', '$2b$10$2EVR0jeMfA0z2D6NQ84IVOEK6.J.Z2G9gepTZfxyfayKFBPgD3mfu', 'uploads\\profile\\1728365375643.jpeg', 'Buyer'),
(56, 'Denver', 'denver123@gmail.com', '$2b$10$Pid19ABlD.2aSYtYiwt1HeQbu6b.hKm1HYA4XRU/hxCeb5MDYRO52', 'uploads\\profile\\1728365284108.jpeg', 'Seller'),
(55, 'Jordan', 'jordan123@gmail.com', '$2b$10$yva4vaCGu5QgnrmWe.M3ZeK8R/FrybZ5wQ3/llhqzKXASu4gBcILy', 'uploads\\profile\\1728365239115.jpeg', 'Buyer'),
(57, 'Adam', 'adam123@gmail.com', '$2b$10$Fw4xgJZ.R6aJATDltZysYeR0PeBhq8o1BI9r6kBHxQwrEagDrQYsK', 'uploads\\profile\\1728365327625.jpeg', 'Seller'),
(70, 'Professor', 'professor123@gmail.com', '$2b$10$4QGOlLW1VBZUMJBAV1udlOuzMU2qCn9mm9gYykhJgvsIel/yat7la', '', 'Admin');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
