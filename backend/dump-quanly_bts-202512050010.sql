-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: quanly_bts
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hopdong`
--

DROP TABLE IF EXISTS `hopdong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hopdong` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tram_id` bigint(20) unsigned NOT NULL,
  `sohopdong` varchar(255) NOT NULL,
  `chudautu` varchar(255) NOT NULL,
  `ngayky` date NOT NULL,
  `tonggiatri` decimal(18,2) NOT NULL DEFAULT 0.00,
  `trangthai` enum('dangxuly','hoanthanh','tretien_do') NOT NULL DEFAULT 'dangxuly',
  `daxoa` tinyint(1) NOT NULL DEFAULT 0,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_hopdong_tram` (`tram_id`),
  CONSTRAINT `fk_hopdong_tram` FOREIGN KEY (`tram_id`) REFERENCES `tram` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hopdong`
--

LOCK TABLES `hopdong` WRITE;
/*!40000 ALTER TABLE `hopdong` DISABLE KEYS */;
INSERT INTO `hopdong` VALUES (1,2,'1402052-BQLDA/VTNet-ANTHANHSON/TV2025','VTnet','2025-12-04',10000000.00,'dangxuly',0,'2025-12-04 22:44:54','2025-12-04 22:44:54'),(2,2,'qưewqe','eqew','2025-12-05',1000000.00,'dangxuly',0,'2025-12-04 23:09:59','2025-12-04 23:34:53');
/*!40000 ALTER TABLE `hopdong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hopdong_cot`
--

DROP TABLE IF EXISTS `hopdong_cot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hopdong_cot` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hopdong_id` bigint(20) unsigned NOT NULL,
  `cot_id` bigint(20) unsigned NOT NULL,
  `soluong` int(11) NOT NULL DEFAULT 0,
  `tongtien` decimal(18,2) NOT NULL DEFAULT 0.00,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_hopdongcot` (`hopdong_id`,`cot_id`),
  KEY `idx_hopdongcot_hd` (`hopdong_id`),
  KEY `idx_hopdongcot_cot` (`cot_id`),
  CONSTRAINT `fk_hopdongcot_cot` FOREIGN KEY (`cot_id`) REFERENCES `thuviencot` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_hopdongcot_hopdong` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hopdong_cot`
--

LOCK TABLES `hopdong_cot` WRITE;
/*!40000 ALTER TABLE `hopdong_cot` DISABLE KEYS */;
INSERT INTO `hopdong_cot` VALUES (3,2,1,1,1000000.00,'2025-12-04 23:34:53');
/*!40000 ALTER TABLE `hopdong_cot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hopdong_volume_khac`
--

DROP TABLE IF EXISTS `hopdong_volume_khac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hopdong_volume_khac` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hopdong_id` bigint(20) unsigned NOT NULL,
  `volume_id` bigint(20) unsigned NOT NULL COMMENT 'FK đến thuvien_volume_khac',
  `soluong` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng',
  `tongtien` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng tiền',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_hopdongvolume` (`hopdong_id`,`volume_id`),
  KEY `idx_hdvolume_hd` (`hopdong_id`),
  KEY `idx_hdvolume_volume` (`volume_id`),
  CONSTRAINT `fk_hdvolume_hopdong` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_hdvolume_volume` FOREIGN KEY (`volume_id`) REFERENCES `thuvien_volume_khac` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Volume khác trong hợp đồng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hopdong_volume_khac`
--

LOCK TABLES `hopdong_volume_khac` WRITE;
/*!40000 ALTER TABLE `hopdong_volume_khac` DISABLE KEYS */;
/*!40000 ALTER TABLE `hopdong_volume_khac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kstk_thucte`
--

DROP TABLE IF EXISTS `kstk_thucte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kstk_thucte` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hopdong_id` bigint(20) unsigned NOT NULL,
  `cot_id` bigint(20) unsigned NOT NULL COMMENT 'FK đến thuviencot - chỉ dành cho cột',
  `soluong_thucte` int(11) NOT NULL DEFAULT 0,
  `chenhlech` int(11) NOT NULL DEFAULT 0,
  `phantram_chenhlech` float NOT NULL DEFAULT 0,
  `nguoinhap_id` bigint(20) unsigned NOT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kstk_hd` (`hopdong_id`),
  KEY `idx_kstk_cot` (`cot_id`),
  KEY `idx_kstk_user` (`nguoinhap_id`),
  CONSTRAINT `fk_kstk_cot` FOREIGN KEY (`cot_id`) REFERENCES `thuviencot` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_kstk_hd` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_kstk_user` FOREIGN KEY (`nguoinhap_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kstk_thucte`
--

LOCK TABLES `kstk_thucte` WRITE;
/*!40000 ALTER TABLE `kstk_thucte` DISABLE KEYS */;
/*!40000 ALTER TABLE `kstk_thucte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kstk_thucte_volume_khac`
--

DROP TABLE IF EXISTS `kstk_thucte_volume_khac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kstk_thucte_volume_khac` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hopdong_id` bigint(20) unsigned NOT NULL,
  `volume_id` bigint(20) unsigned NOT NULL COMMENT 'FK đến thuvien_volume_khac',
  `soluong_thucte` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng thực tế',
  `chenhlech` int(11) NOT NULL DEFAULT 0 COMMENT 'Chênh lệch',
  `phantram_chenhlech` float NOT NULL DEFAULT 0 COMMENT 'Phần trăm chênh lệch',
  `nguoinhap_id` bigint(20) unsigned NOT NULL COMMENT 'Người nhập KSTK',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_kstkvolume_hd` (`hopdong_id`),
  KEY `idx_kstkvolume_volume` (`volume_id`),
  KEY `idx_kstkvolume_user` (`nguoinhap_id`),
  CONSTRAINT `fk_kstkvolume_hd` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_kstkvolume_user` FOREIGN KEY (`nguoinhap_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_kstkvolume_volume` FOREIGN KEY (`volume_id`) REFERENCES `thuvien_volume_khac` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Khối lượng thực tế KSTK cho volume khác';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kstk_thucte_volume_khac`
--

LOCK TABLES `kstk_thucte_volume_khac` WRITE;
/*!40000 ALTER TABLE `kstk_thucte_volume_khac` DISABLE KEYS */;
/*!40000 ALTER TABLE `kstk_thucte_volume_khac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsu`
--

DROP TABLE IF EXISTS `lichsu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsu` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nguoidung_id` bigint(20) unsigned DEFAULT NULL,
  `hanhdong` varchar(255) NOT NULL,
  `dulieu_truoc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dulieu_truoc`)),
  `dulieu_sau` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dulieu_sau`)),
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_lichsu_user` (`nguoidung_id`),
  CONSTRAINT `fk_lichsu_user` FOREIGN KEY (`nguoidung_id`) REFERENCES `nguoidung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsu`
--

LOCK TABLES `lichsu` WRITE;
/*!40000 ALTER TABLE `lichsu` DISABLE KEYS */;
INSERT INTO `lichsu` VALUES (1,1,'Tạo trạm mới: NAN1927',NULL,'{\"matram\":\"NAN1927\",\"tinhthanh_id\":12,\"diachi\":null,\"loaiproject\":\"btsmoi\"}','2025-12-04 22:35:09'),(2,1,'Tạo trạm mới: NAN1928',NULL,'{\"matram\":\"NAN1928\",\"tinhthanh_id\":20,\"diachi\":\"Nghệ An\",\"loaiproject\":\"btsmoi\"}','2025-12-04 22:35:35'),(3,1,'Tạo hợp đồng mới: 1402052-BQLDA/VTNet-ANTHANHSON/TV2025',NULL,'{\"tram_id\":2,\"sohopdong\":\"1402052-BQLDA/VTNet-ANTHANHSON/TV2025\",\"chudautu\":\"VTnet\",\"ngayky\":\"2025-12-04\",\"tonggiatri\":10000000}','2025-12-04 22:44:54'),(4,1,'Tạo cột mới: Cột cóc H=3m trên mái',NULL,'{\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"loaicot\":\"Dưới đất\",\"cao\":3,\"giadonvi\":10000000,\"mota\":null}','2025-12-04 22:51:04'),(5,1,'Tạo volume khác mới: Phòng máy',NULL,'{\"mavolume\":\"VOL001\",\"tenvolume\":\"Phòng máy\",\"loaivolume\":\"Phòng máy\",\"donvitinh\":\"cái\",\"giadonvi\":12,\"mota\":null}','2025-12-04 22:53:18'),(6,1,'Cập nhật cột ID: 1','{\"id\":1,\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"cao\":3,\"mota\":null,\"ngaytao\":\"2025-12-04T15:51:04.000Z\",\"vitri\":null}','{\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"vitri\":\"Trên mái\",\"cao\":3,\"mota\":null}','2025-12-04 23:01:25'),(7,1,'Tạo hợp đồng mới: qưewqe',NULL,'{\"tram_id\":2,\"sohopdong\":\"qưewqe\",\"chudautu\":\"eqew\",\"ngayky\":\"2025-12-05\",\"tonggiatri\":1111111}','2025-12-04 23:09:59'),(8,1,'Thêm cột vào hợp đồng 2',NULL,'{\"cot_id\":1,\"soluong\":4,\"tongtien\":0}','2025-12-04 23:13:51'),(9,1,'Xóa cột khỏi hợp đồng 2','{\"id\":1,\"hopdong_id\":2,\"cot_id\":1,\"soluong\":4,\"tongtien\":\"0.00\",\"ngaytao\":\"2025-12-04T16:13:51.000Z\"}',NULL,'2025-12-04 23:14:49'),(10,1,'Cập nhật cột ID: 1','{\"id\":1,\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"cao\":3,\"mota\":null,\"ngaytao\":\"2025-12-04T15:51:04.000Z\",\"vitri\":\"Trên mái\",\"giadonvi\":\"0.00\"}','{\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"vitri\":\"Trên mái\",\"cao\":3,\"giadonvi\":1000000,\"mota\":null}','2025-12-04 23:26:41'),(11,1,'Thêm cột vào hợp đồng 2',NULL,'{\"cot_id\":1,\"soluong\":4,\"tongtien\":4000000}','2025-12-04 23:30:24'),(12,1,'Xóa cột khỏi hợp đồng 2','{\"id\":2,\"hopdong_id\":2,\"cot_id\":1,\"soluong\":4,\"tongtien\":\"4000000.00\",\"ngaytao\":\"2025-12-04T16:30:24.000Z\"}',NULL,'2025-12-04 23:30:40'),(13,1,'Thêm cột vào hợp đồng 2',NULL,'{\"cot_id\":1,\"soluong\":1,\"tongtien\":1000000}','2025-12-04 23:34:53');
/*!40000 ALTER TABLE `lichsu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoidung` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `matkhau_hash` varchar(255) NOT NULL,
  `vaitro` enum('admin','ktv') NOT NULL DEFAULT 'ktv',
  `la_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = admin, 0 = ktv',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoidung`
--

LOCK TABLES `nguoidung` WRITE;
/*!40000 ALTER TABLE `nguoidung` DISABLE KEYS */;
INSERT INTO `nguoidung` VALUES (1,'Admin','admin@example.com','$2b$10$c/D5dcQcyjtQ10FmhTZ25OD2/f2OB8jfc4nEOVJkXkkx/hhVCXdEC','admin',1,'2025-12-04 21:55:52','2025-12-04 22:02:57');
/*!40000 ALTER TABLE `nguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phancong_khaosat`
--

DROP TABLE IF EXISTS `phancong_khaosat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phancong_khaosat` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hopdong_id` bigint(20) unsigned NOT NULL,
  `ktv_id` bigint(20) unsigned NOT NULL COMMENT 'Kỹ thuật viên được phân công',
  `admin_id` bigint(20) unsigned NOT NULL COMMENT 'Admin phân công',
  `trangthai` enum('chua_ks','dang_ks','hoan_thanh','da_huy') NOT NULL DEFAULT 'chua_ks',
  `ngay_phan_cong` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày admin phân công',
  `ngay_bat_dau` date DEFAULT NULL COMMENT 'Ngày KTV bắt đầu khảo sát',
  `ngay_hoan_thanh` date DEFAULT NULL COMMENT 'Ngày KTV hoàn thành khảo sát',
  `ghichu` text DEFAULT NULL COMMENT 'Ghi chú của admin khi phân công',
  `ghichu_ktv` text DEFAULT NULL COMMENT 'Ghi chú của KTV sau khi khảo sát',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pc_hopdong` (`hopdong_id`),
  KEY `idx_pc_ktv` (`ktv_id`),
  KEY `idx_pc_admin` (`admin_id`),
  KEY `idx_pc_trangthai` (`trangthai`),
  CONSTRAINT `fk_pc_admin` FOREIGN KEY (`admin_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_pc_hopdong` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_pc_ktv` FOREIGN KEY (`ktv_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng phân công KTV đi khảo sát hợp đồng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phancong_khaosat`
--

LOCK TABLES `phancong_khaosat` WRITE;
/*!40000 ALTER TABLE `phancong_khaosat` DISABLE KEYS */;
/*!40000 ALTER TABLE `phancong_khaosat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thuvien_volume_khac`
--

DROP TABLE IF EXISTS `thuvien_volume_khac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thuvien_volume_khac` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mavolume` varchar(100) NOT NULL COMMENT 'Mã volume',
  `tenvolume` varchar(255) NOT NULL COMMENT 'Tên volume',
  `mota` text DEFAULT NULL COMMENT 'Mô tả',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `giadonvi` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá đơn vị',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mavolume` (`mavolume`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Thư viện volume khác (ngoài cột)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thuvien_volume_khac`
--

LOCK TABLES `thuvien_volume_khac` WRITE;
/*!40000 ALTER TABLE `thuvien_volume_khac` DISABLE KEYS */;
INSERT INTO `thuvien_volume_khac` VALUES (1,'VOL001','Phòng máy',NULL,'2025-12-04 22:53:18',0.00);
/*!40000 ALTER TABLE `thuvien_volume_khac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thuviencot`
--

DROP TABLE IF EXISTS `thuviencot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thuviencot` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `macot` varchar(100) NOT NULL,
  `tencot` varchar(255) NOT NULL,
  `cao` int(11) DEFAULT NULL,
  `mota` text DEFAULT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `vitri` varchar(50) DEFAULT NULL COMMENT 'Vị trí lắp đặt (Dưới đất, Trên mái)',
  `giadonvi` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá đơn vị',
  PRIMARY KEY (`id`),
  UNIQUE KEY `macot` (`macot`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thuviencot`
--

LOCK TABLES `thuviencot` WRITE;
/*!40000 ALTER TABLE `thuviencot` DISABLE KEYS */;
INSERT INTO `thuviencot` VALUES (1,'COT-001','Cột cóc H=3m trên mái',3,NULL,'2025-12-04 22:51:04','Trên mái',1000000.00);
/*!40000 ALTER TABLE `thuviencot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiendotc`
--

DROP TABLE IF EXISTS `tiendotc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiendotc` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hopdong_id` bigint(20) unsigned NOT NULL,
  `ngayks` date DEFAULT NULL,
  `nguoiks_id` bigint(20) unsigned DEFAULT NULL,
  `ngaytk` date DEFAULT NULL,
  `ngaydutoan` date DEFAULT NULL,
  `ngaypheduyet` date DEFAULT NULL,
  `ngaynhan_dhtc` date DEFAULT NULL,
  `trangthai_tc` enum('khaosat','thietke','dutoan','pheduyet','dhtc','hoanthanh') DEFAULT NULL,
  `phantram_ht` float NOT NULL DEFAULT 0,
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tiendotc_hd` (`hopdong_id`),
  KEY `idx_td_hd` (`hopdong_id`),
  KEY `idx_td_ks` (`nguoiks_id`),
  CONSTRAINT `fk_td_hd` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_td_nguoiks` FOREIGN KEY (`nguoiks_id`) REFERENCES `nguoidung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiendotc`
--

LOCK TABLES `tiendotc` WRITE;
/*!40000 ALTER TABLE `tiendotc` DISABLE KEYS */;
/*!40000 ALTER TABLE `tiendotc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tinhthanh`
--

DROP TABLE IF EXISTS `tinhthanh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tinhthanh` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ma` varchar(50) NOT NULL,
  `ten` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma` (`ma`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tinhthanh`
--

LOCK TABLES `tinhthanh` WRITE;
/*!40000 ALTER TABLE `tinhthanh` DISABLE KEYS */;
INSERT INTO `tinhthanh` VALUES (1,'AGG','An Giang'),(2,'CBG','Cao Bằng'),(3,'CMU','Cà Mau'),(4,'CTO','Cần Thơ'),(5,'DBN','Điện Biên'),(6,'DLK','Đắk Lắk'),(7,'DNG','Đà Nẵng'),(8,'DNI','Đồng Nai'),(9,'DTP','Đồng Tháp'),(10,'GLI','Gia Lai'),(11,'HCM','TP. Hồ Chí Minh'),(12,'HNI','Hà Nội'),(13,'HTH','Hà Tĩnh'),(14,'HYN','Hưng Yên'),(15,'KHA','Khánh Hòa'),(16,'LCI','Lào Cai'),(17,'LCU','Lai Châu'),(18,'LDG','Lâm Đồng'),(19,'LSN','Lạng Sơn'),(20,'NAN','Nghệ An'),(21,'NBH','Ninh Bình'),(22,'PTO','Phú Thọ'),(23,'QNI','Quảng Ngãi'),(24,'QNH','Quảng Ninh'),(25,'QTI','Quảng Trị'),(26,'SLA','Sơn La'),(27,'TNN','Thái Nguyên'),(28,'THA','Thanh Hóa'),(29,'TQG','Tuyên Quang'),(30,'TTH','Thừa Thiên Huế'),(31,'VLG','Vĩnh Long'),(32,'BNH','Bắc Ninh'),(33,'HPG','Hải Phòng'),(34,'TNH','Tây Ninh');
/*!40000 ALTER TABLE `tinhthanh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tram`
--

DROP TABLE IF EXISTS `tram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tram` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `matram` varchar(100) NOT NULL,
  `tinhthanh_id` int(10) unsigned NOT NULL,
  `diachi` text DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `loaiproject` enum('btsmoi','kienco') NOT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `matram` (`matram`),
  KEY `idx_tram_tinh` (`tinhthanh_id`),
  CONSTRAINT `fk_tram_tinhthanh` FOREIGN KEY (`tinhthanh_id`) REFERENCES `tinhthanh` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tram`
--

LOCK TABLES `tram` WRITE;
/*!40000 ALTER TABLE `tram` DISABLE KEYS */;
INSERT INTO `tram` VALUES (1,'NAN1927',12,NULL,NULL,NULL,'btsmoi','2025-12-04 22:35:09','2025-12-04 22:35:09'),(2,'NAN1928',20,'Nghệ An',NULL,NULL,'btsmoi','2025-12-04 22:35:35','2025-12-04 22:35:35');
/*!40000 ALTER TABLE `tram` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_phancong_khaosat`
--

DROP TABLE IF EXISTS `v_phancong_khaosat`;
/*!50001 DROP VIEW IF EXISTS `v_phancong_khaosat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_phancong_khaosat` AS SELECT 
 1 AS `id`,
 1 AS `hopdong_id`,
 1 AS `sohopdong`,
 1 AS `chudautu`,
 1 AS `matram`,
 1 AS `diachi`,
 1 AS `tinhthanh_ten`,
 1 AS `ktv_id`,
 1 AS `ktv_ten`,
 1 AS `ktv_email`,
 1 AS `admin_id`,
 1 AS `admin_ten`,
 1 AS `trangthai`,
 1 AS `ngay_phan_cong`,
 1 AS `ngay_bat_dau`,
 1 AS `ngay_hoan_thanh`,
 1 AS `ghichu`,
 1 AS `ghichu_ktv`,
 1 AS `ngaytao`,
 1 AS `ngaysua`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'quanly_bts'
--

--
-- Final view structure for view `v_phancong_khaosat`
--

/*!50001 DROP VIEW IF EXISTS `v_phancong_khaosat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_phancong_khaosat` AS select `pc`.`id` AS `id`,`pc`.`hopdong_id` AS `hopdong_id`,`hd`.`sohopdong` AS `sohopdong`,`hd`.`chudautu` AS `chudautu`,`t`.`matram` AS `matram`,`t`.`diachi` AS `diachi`,`tt`.`ten` AS `tinhthanh_ten`,`pc`.`ktv_id` AS `ktv_id`,`ktv`.`ten` AS `ktv_ten`,`ktv`.`email` AS `ktv_email`,`pc`.`admin_id` AS `admin_id`,`admin`.`ten` AS `admin_ten`,`pc`.`trangthai` AS `trangthai`,`pc`.`ngay_phan_cong` AS `ngay_phan_cong`,`pc`.`ngay_bat_dau` AS `ngay_bat_dau`,`pc`.`ngay_hoan_thanh` AS `ngay_hoan_thanh`,`pc`.`ghichu` AS `ghichu`,`pc`.`ghichu_ktv` AS `ghichu_ktv`,`pc`.`ngaytao` AS `ngaytao`,`pc`.`ngaysua` AS `ngaysua` from (((((`phancong_khaosat` `pc` join `hopdong` `hd` on(`pc`.`hopdong_id` = `hd`.`id`)) join `tram` `t` on(`hd`.`tram_id` = `t`.`id`)) join `tinhthanh` `tt` on(`t`.`tinhthanh_id` = `tt`.`id`)) join `nguoidung` `ktv` on(`pc`.`ktv_id` = `ktv`.`id`)) join `nguoidung` `admin` on(`pc`.`admin_id` = `admin`.`id`)) where `hd`.`daxoa` = 0 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05  0:10:21
