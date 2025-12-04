-- ==================================================================================
--  CẬP NHẬT CẤU TRÚC BẢNG: thuviencot và thuvien_volume_khac
--  Version: 2.0
-- ==================================================================================

USE quanly_bts;

-- ==================================================================================
--  CẬP NHẬT BẢNG: thuviencot
--  Loại bỏ: loaicot, giadonvi
--  Thêm: vitri
-- ==================================================================================

-- Xóa cột loaicot
ALTER TABLE thuviencot 
DROP COLUMN IF EXISTS loaicot;

-- Xóa cột giadonvi
ALTER TABLE thuviencot 
DROP COLUMN IF EXISTS giadonvi;

-- Thêm cột vitri (Vị trí lắp đặt: Dưới đất, Trên mái)
ALTER TABLE thuviencot 
ADD COLUMN vitri VARCHAR(50) NULL COMMENT 'Vị trí lắp đặt (Dưới đất, Trên mái)';

-- ==================================================================================
--  CẬP NHẬT BẢNG: thuvien_volume_khac
--  Loại bỏ: donvitinh, loaivolume, giadonvi
-- ==================================================================================

-- Xóa cột donvitinh
ALTER TABLE thuvien_volume_khac 
DROP COLUMN IF EXISTS donvitinh;

-- Xóa cột loaivolume
ALTER TABLE thuvien_volume_khac 
DROP COLUMN IF EXISTS loaivolume;

-- Xóa cột giadonvi
ALTER TABLE thuvien_volume_khac 
DROP COLUMN IF EXISTS giadonvi;

-- ==================================================================================
-- DONE!
-- ==================================================================================

