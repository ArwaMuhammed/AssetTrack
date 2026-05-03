-- USERS
INSERT INTO users (name, email, password_hash, role, created_at) VALUES
                                                                     ('Admin User', 'admin@assettrack.com', 'hashed_pw', 'ADMIN', NOW()),
                                                                     ('Manager User', 'manager@assettrack.com', 'hashed_pw', 'MANAGER', NOW()),
                                                                     ('Dev User', 'dev@assettrack.com', 'hashed_pw', 'DEVELOPER', NOW());

-- ASSETS
INSERT INTO assets (type, brand, model, serial_number, purchase_date, warranty_expiration_date, status, condition, created_at)
VALUES
    ('LAPTOP', 'Dell', 'XPS 15', 'SN12345', '2023-01-01', '2026-01-01', 'AVAILABLE', 'GOOD', NOW()),
    ('MONITOR', 'LG', 'UltraWide', 'SN67890', '2022-05-01', '2025-05-01', 'AVAILABLE', 'GOOD', NOW());

-- ACCESSORY STOCK
INSERT INTO accessory_stocks (name, quantity, minimum_required_quantity, updated_at)
VALUES
    ('Mouse', 10, 5, NOW()),
    ('Keyboard', 3, 5, NOW());

-- NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
VALUES
    (1, 'Warranty Alert', 'Laptop warranty expiring soon', 'WARRANTY_EXPIRATION', false, NOW());