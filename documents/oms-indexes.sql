
ALTER TABLE xpparel_oms.order ADD INDEX C_U_SPST(company_code, unit_code, so_progress_status);
ALTER TABLE xpparel_oms.order ADD INDEX C_U_PSTY(company_code, unit_code, plant_style);
ALTER TABLE xpparel_oms.order ADD INDEX C_U_ONO(company_code, unit_code, order_no);


