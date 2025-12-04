-- ==================================================================================
--  THÊM LẠI CỘT ĐƠN GIÁ (giadonvi) VÀO BẢNG thuviencot và thuvien_volume_khac
-- ==================================================================================

USE quanly_bts;

-- Thêm lại cột giadonvi vào thuviencot
ALTER TABLE thuviencot 
ADD COLUMN giadonvi DECIMAL(18,2) NOT NULL DEFAULT 0 COMMENT 'Giá đơn vị';

-- Thêm lại cột giadonvi vào thuvien_volume_khac
ALTER TABLE thuvien_volume_khac 
ADD COLUMN giadonvi DECIMAL(18,2) NOT NULL DEFAULT 0 COMMENT 'Giá đơn vị';

-- ==================================================================================
-- DONE!
-- ==================================================================================

