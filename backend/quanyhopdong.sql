-- ==================================================================================
--  DATABASE: QUAN LY HOP DONG THI CONG TRAM BTS
--  Version: 1.0
-- ==================================================================================

CREATE DATABASE IF NOT EXISTS quanly_bts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quanly_bts;

-- ==================================================================================
--  BẢNG: nguoidung
-- ==================================================================================
CREATE TABLE nguoidung (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ten           VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  matkhau_hash  VARCHAR(255) NOT NULL,
  vaitro        ENUM('admin','qlda','ktv','chudautu') NOT NULL DEFAULT 'ktv',
  ngaytao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: tinhthanh
-- ==================================================================================
CREATE TABLE tinhthanh (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma   VARCHAR(50) NOT NULL UNIQUE,
  ten  VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: tram (MÃ TRẠM)
-- ==================================================================================
CREATE TABLE tram (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  matram         VARCHAR(100) NOT NULL UNIQUE,
  tinhthanh_id   INT UNSIGNED NOT NULL,
  diachi         TEXT NULL,
  lat            DOUBLE NULL,
  lng            DOUBLE NULL,
  loaiproject    ENUM('btsmoi','kienco') NOT NULL,
  ngaytao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tram_tinh (tinhthanh_id),
  CONSTRAINT fk_tram_tinhthanh
    FOREIGN KEY (tinhthanh_id) REFERENCES tinhthanh(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: thuviencot
-- ==================================================================================
CREATE TABLE thuviencot (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  macot      VARCHAR(100) NOT NULL UNIQUE,
  tencot     VARCHAR(255) NOT NULL,
  loaicot    ENUM('rooftop','greenfield','nguytrang','phongmay') NOT NULL,
  cao        INT NULL,
  giadonvi   DECIMAL(18,2) NOT NULL DEFAULT 0,
  mota       TEXT NULL,
  ngaytao    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: hopdong
-- ==================================================================================
CREATE TABLE hopdong (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tram_id        BIGINT UNSIGNED NOT NULL,
  sohopdong      VARCHAR(255) NOT NULL,
  chudautu       VARCHAR(255) NOT NULL,
  ngayky         DATE NOT NULL,
  tonggiatri     DECIMAL(18,2) NOT NULL DEFAULT 0,
  trangthai      ENUM('dangxuly','hoanthanh','tretien_do') NOT NULL DEFAULT 'dangxuly',
  daxoa          TINYINT(1) NOT NULL DEFAULT 0,
  ngaytao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hopdong_tram (tram_id),
  CONSTRAINT fk_hopdong_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: hopdong_cot (Volume theo hợp đồng)
-- ==================================================================================
CREATE TABLE hopdong_cot (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id  BIGINT UNSIGNED NOT NULL,
  cot_id      BIGINT UNSIGNED NOT NULL,
  soluong     INT NOT NULL DEFAULT 0,
  tongtien    DECIMAL(18,2) NOT NULL DEFAULT 0,
  ngaytao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hopdongcot (hopdong_id, cot_id),
  KEY idx_hopdongcot_hd (hopdong_id),
  KEY idx_hopdongcot_cot (cot_id),
  CONSTRAINT fk_hopdongcot_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_hopdongcot_cot
    FOREIGN KEY (cot_id) REFERENCES thuviencot(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: kstk_thucte (Khối lượng thực tế KSTK)
-- ==================================================================================
CREATE TABLE kstk_thucte (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id           BIGINT UNSIGNED NOT NULL,
  cot_id               BIGINT UNSIGNED NOT NULL,
  soluong_thucte       INT NOT NULL DEFAULT 0,
  chenhlech            INT NOT NULL DEFAULT 0,
  phantram_chenhlech   FLOAT NOT NULL DEFAULT 0,
  nguoinhap_id         BIGINT UNSIGNED NOT NULL,
  ngaytao              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_kstk_hd (hopdong_id),
  KEY idx_kstk_cot (cot_id),
  KEY idx_kstk_user (nguoinhap_id),
  CONSTRAINT fk_kstk_hd
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kstk_cot
    FOREIGN KEY (cot_id) REFERENCES thuviencot(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kstk_user
    FOREIGN KEY (nguoinhap_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: tiendotc (6 giai đoạn)
-- ==================================================================================
CREATE TABLE tiendotc (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id       BIGINT UNSIGNED NOT NULL,
  ngayks           DATE NULL,
  nguoiks_id       BIGINT UNSIGNED NULL,
  ngaytk           DATE NULL,
  ngaydutoan       DATE NULL,
  ngaypheduyet     DATE NULL,
  ngaynhan_dhtc    DATE NULL,
  trangthai_tc     ENUM( 'dangtc','hoanthanh','vuong') NULL,
  phantram_ht      FLOAT NOT NULL DEFAULT 0,
  ngaysua          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tiendotc_hd (hopdong_id),
  KEY idx_td_hd (hopdong_id),
  KEY idx_td_ks (nguoiks_id),
  CONSTRAINT fk_td_hd
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_td_nguoiks
    FOREIGN KEY (nguoiks_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  BẢNG: lichsu (log thay đổi)
-- ==================================================================================
CREATE TABLE lichsu (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nguoidung_id  BIGINT UNSIGNED NULL,
  hanhdong      VARCHAR(255) NOT NULL,
  dulieu_truoc  JSON NULL,
  dulieu_sau    JSON NULL,
  ngaytao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lichsu_user (nguoidung_id),
  CONSTRAINT fk_lichsu_user
    FOREIGN KEY (nguoidung_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
-- DONE!
-- ==================================================================================
