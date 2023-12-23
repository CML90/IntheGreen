-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2023 at 08:57 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `greenbudget`
--

-- --------------------------------------------------------

--
-- Table structure for table `dailystats`
--

CREATE TABLE `dailystats` (
  `ID` int(11) NOT NULL,
  `User` int(11) NOT NULL,
  `Spent` decimal(20,2) NOT NULL,
  `Avail` decimal(20,2) NOT NULL,
  `NewDayBudg` decimal(20,2) NOT NULL,
  `Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dailystats`
--

INSERT INTO `dailystats` (`ID`, `User`, `Spent`, `Avail`, `NewDayBudg`, `Date`) VALUES
(1, 1, '145.00', '355.00', '1196.15', '2023-12-18'),
(2, 2, '32.00', '100.26', '312.92', '2023-12-18'),
(6, 1, '450.00', '841.67', '1287.50', '2023-12-19'),
(11, 1, '-140.00', '1549.09', '1413.64', '2023-12-20'),
(15, 2, '0.00', '372.73', '372.73', '2023-12-20'),
(16, 2, '0.00', '410.00', '410.00', '2023-12-21'),
(19, 1, '426.00', '1124.00', '1397.90', '2023-12-21'),
(20, 1, '50.00', '1672.22', '1547.67', '2023-12-22'),
(50, 2, '0.00', '455.56', '455.56', '2023-12-22'),
(61, 3, '0.00', '1222.22', '1222.22', '2023-12-22'),
(70, 3, '0.00', '1375.00', '1375.00', '2023-12-23'),
(75, 1, '40.00', '1897.50', '1736.13', '2023-12-23'),
(76, 4, '0.00', '354.84', '1375.00', '2023-12-23'),
(80, 5, '0.00', '1000.00', '1000.00', '2023-12-23'),
(81, 5, '0.00', '1000.00', '1000.00', '2023-12-23');

-- --------------------------------------------------------

--
-- Table structure for table `monthlyset`
--

CREATE TABLE `monthlyset` (
  `ID` int(11) NOT NULL,
  `User` int(11) NOT NULL,
  `UpdateDate` date NOT NULL DEFAULT curdate(),
  `Income` decimal(20,2) NOT NULL,
  `Bills` decimal(20,2) NOT NULL,
  `Budget` decimal(20,2) NOT NULL,
  `Save` decimal(20,2) NOT NULL,
  `DayBudget` decimal(20,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monthlyset`
--

INSERT INTO `monthlyset` (`ID`, `User`, `UpdateDate`, `Income`, `Bills`, `Budget`, `Save`, `DayBudget`) VALUES
(1, 1, '2023-12-18', '19500.00', '2000.00', '15500.00', '2000.00', '500.00'),
(2, 2, '2023-12-18', '15000.00', '8900.00', '4100.00', '2000.00', '132.26'),
(14, 3, '2023-12-22', '15000.00', '2000.00', '11000.00', '2000.00', '354.84'),
(15, 4, '2023-12-23', '15000.00', '2000.00', '11000.00', '2000.00', '354.84'),
(17, 5, '2023-12-23', '12000.00', '2000.00', '8000.00', '2000.00', '258.06');

-- --------------------------------------------------------

--
-- Table structure for table `monthlyspent`
--

CREATE TABLE `monthlyspent` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Living` decimal(20,2) NOT NULL,
  `Entertainment` decimal(20,2) NOT NULL,
  `Other` decimal(20,2) NOT NULL,
  `Total` decimal(20,2) NOT NULL,
  `Date` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monthlyspent`
--

INSERT INTO `monthlyspent` (`ID`, `UserID`, `Living`, `Entertainment`, `Other`, `Total`, `Date`) VALUES
(1, 1, '1341.00', '40.00', '130.00', '1611.00', '2023-12-18'),
(2, 2, '0.00', '0.00', '0.00', '0.00', '2023-12-18'),
(12, 3, '0.00', '0.00', '0.00', '0.00', '2023-12-22'),
(13, 4, '0.00', '0.00', '0.00', '0.00', '2023-12-23'),
(15, 5, '0.00', '0.00', '0.00', '0.00', '2023-12-23');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `ID` int(11) NOT NULL,
  `User` int(11) NOT NULL,
  `Value` decimal(20,2) NOT NULL,
  `Operation` varchar(10) NOT NULL CHECK (`Operation` in ('Add','Subtract')),
  `Category` varchar(13) NOT NULL CHECK (`Category` in ('Living','Entertainment','Other')),
  `Date` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`ID`, `User`, `Value`, `Operation`, `Category`, `Date`) VALUES
(1, 1, '50.00', 'Add', 'Living', '0000-00-00'),
(2, 1, '-50.00', 'Subtract', 'Living', '0000-00-00'),
(3, 1, '50.00', 'Add', 'Living', '0000-00-00'),
(4, 1, '50.00', 'Add', 'Living', '2023-12-19'),
(5, 1, '50.00', 'Add', 'Living', '2023-12-19'),
(6, 1, '-50.00', 'Subtract', 'Living', '2023-12-19'),
(7, 1, '50.00', 'Add', 'Living', '2023-12-05'),
(8, 1, '50.00', 'Add', 'Living', '2023-12-19'),
(9, 1, '50.00', 'Add', 'Living', '2023-12-19'),
(10, 1, '100.00', 'Add', 'Living', '2023-12-19'),
(11, 1, '10.00', 'Add', 'Living', '2023-12-19'),
(12, 1, '20.00', 'Add', 'Living', '2023-12-19'),
(13, 1, '50.00', 'Add', 'Living', '2023-12-19'),
(14, 1, '20.00', 'Add', 'Living', '2023-12-19'),
(15, 1, '40.00', 'Add', 'Living', '2023-12-19'),
(32, 1, '100.00', 'Add', 'Living', '2023-12-20'),
(37, 1, '50.00', 'Add', 'Living', '2023-12-20'),
(38, 1, '50.00', 'Add', 'Entertainment', '2023-12-20'),
(39, 1, '110.00', 'Add', 'Other', '2023-12-20'),
(40, 1, '20.00', 'Add', 'Other', '2023-12-20'),
(41, 1, '10.00', 'Add', 'Living', '2023-12-20'),
(42, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(43, 1, '15.00', 'Add', 'Living', '2023-12-20'),
(44, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(45, 1, '10.00', 'Add', 'Living', '2023-12-20'),
(46, 1, '-10.00', 'Subtract', 'Living', '2023-12-20'),
(47, 1, '10.00', 'Add', 'Living', '2023-12-20'),
(48, 1, '50.00', 'Add', 'Living', '2023-12-21'),
(49, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(50, 1, '10.00', 'Add', 'Entertainment', '2023-12-21'),
(51, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(52, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(53, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(54, 1, '-10.00', 'Subtract', 'Living', '2023-12-21'),
(55, 1, '-10.00', 'Subtract', 'Living', '2023-12-21'),
(56, 1, '50.00', 'Add', 'Living', '2023-12-21'),
(57, 1, '50.00', 'Add', 'Living', '2023-12-21'),
(58, 1, '100.00', 'Add', 'Living', '2023-12-21'),
(59, 1, '100.00', 'Add', 'Living', '2023-12-21'),
(60, 1, '100.00', 'Add', 'Living', '2023-12-21'),
(61, 1, '-100.00', 'Subtract', 'Living', '2023-12-21'),
(62, 1, '10.00', 'Add', 'Living', '2023-12-21'),
(63, 1, '50.00', 'Add', 'Living', '2023-12-21'),
(64, 1, '50.00', 'Add', 'Living', '2023-12-21'),
(65, 1, '-100.00', 'Subtract', 'Living', '2023-12-21'),
(66, 1, '-100.00', 'Subtract', 'Living', '2023-12-21'),
(67, 1, '-100.00', 'Subtract', 'Entertainment', '2023-12-21'),
(70, 1, '126.00', 'Add', 'Living', '2023-12-22'),
(71, 1, '10.00', 'Add', 'Living', '2023-12-22'),
(72, 1, '10.00', 'Add', 'Living', '2023-12-22'),
(73, 1, '30.00', 'Add', 'Entertainment', '2023-12-22'),
(74, 3, '100.00', 'Add', 'Living', '2023-12-22'),
(75, 3, '100.00', 'Add', 'Living', '2023-12-22'),
(76, 3, '100.00', 'Add', 'Living', '2023-12-22'),
(78, 1, '10.00', 'Add', 'Living', '2023-12-22'),
(79, 1, '20.00', 'Add', 'Living', '2023-12-22'),
(80, 1, '10.00', 'Add', 'Living', '2023-12-22'),
(81, 5, '55.55', 'Add', 'Living', '2023-12-22');

-- --------------------------------------------------------

--
-- Table structure for table `users_t`
--

CREATE TABLE `users_t` (
  `UserId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_t`
--

INSERT INTO `users_t` (`UserId`, `username`, `password`, `email`) VALUES
(1, 'Caitlin', 'Caitlin2023', 'Caitlin@gmail.com'),
(2, 'James', 'James2023', 'James@hotmail.com'),
(3, 'Caitlin1!', 'Caitlin23', 'Caitlin1@gmail.com'),
(4, 'Caitlin1', 'Caitlin234', 'Cait@gmail.com'),
(5, 'Cait', 'Cait2023', 'cait@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dailystats`
--
ALTER TABLE `dailystats`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_FK` (`User`);

--
-- Indexes for table `monthlyset`
--
ALTER TABLE `monthlyset`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_FK2` (`User`);

--
-- Indexes for table `monthlyspent`
--
ALTER TABLE `monthlyspent`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_FK3` (`UserID`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_FK4` (`User`);

--
-- Indexes for table `users_t`
--
ALTER TABLE `users_t`
  ADD PRIMARY KEY (`UserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dailystats`
--
ALTER TABLE `dailystats`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `monthlyset`
--
ALTER TABLE `monthlyset`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `monthlyspent`
--
ALTER TABLE `monthlyspent`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `users_t`
--
ALTER TABLE `users_t`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dailystats`
--
ALTER TABLE `dailystats`
  ADD CONSTRAINT `User_FK` FOREIGN KEY (`User`) REFERENCES `users_t` (`UserId`);

--
-- Constraints for table `monthlyset`
--
ALTER TABLE `monthlyset`
  ADD CONSTRAINT `User_FK2` FOREIGN KEY (`User`) REFERENCES `users_t` (`UserId`);

--
-- Constraints for table `monthlyspent`
--
ALTER TABLE `monthlyspent`
  ADD CONSTRAINT `User_FK3` FOREIGN KEY (`UserId`) REFERENCES `users_t` (`UserId`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `User_FK4` FOREIGN KEY (`User`) REFERENCES `users_t` (`UserId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
