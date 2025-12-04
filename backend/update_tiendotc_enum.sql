-- ==================================================================================
--  CẬP NHẬT ENUM CHO BẢNG tiendotc
--  Thay đổi các giá trị ENUM của trường trangthai_tc
-- ==================================================================================

-- Bước 1: Cập nhật dữ liệu cũ (nếu có) sang giá trị mới
-- Chuyển đổi các giá trị cũ sang giá trị mới tương ứng
UPDATE tiendotc 
SET trangthai_tc = CASE 
    WHEN trangthai_tc = 'dangtc' THEN 'khaosat'      -- Đang TC -> Khảo sát
    WHEN trangthai_tc = 'hoanthanh' THEN 'hoanthanh'  -- Hoàn thành -> Hoàn thành
    WHEN trangthai_tc = 'vuong' THEN 'pheduyet'      -- Vướng -> Phê duyệt (giả định)
    ELSE NULL
END
WHERE trangthai_tc IS NOT NULL;

-- Bước 2: Thay đổi ENUM của trường trangthai_tc
ALTER TABLE tiendotc 
MODIFY COLUMN trangthai_tc ENUM(
    'khaosat',      -- Khảo sát
    'thietke',      -- Thiết kế
    'dutoan',       -- Dự toán
    'pheduyet',     -- Phê duyệt
    'dhtc',         -- ĐHTC
    'hoanthanh'     -- Hoàn thành
) NULL;

-- ==================================================================================
--  GHI CHÚ:
--  - Các giá trị ENUM mới:
--    1. khaosat    -> Khảo sát
--    2. thietke    -> Thiết kế
--    3. dutoan     -> Dự toán
--    4. pheduyet   -> Phê duyệt
--    5. dhtc       -> ĐHTC
--    6. hoanthanh  -> Hoàn thành
--  
--  - Dữ liệu cũ đã được chuyển đổi:
--    - 'dangtc' -> 'khaosat'
--    - 'hoanthanh' -> 'hoanthanh'
--    - 'vuong' -> 'pheduyet'
-- ==================================================================================

