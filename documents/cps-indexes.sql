-- COMP CORRECTION
ALTER TABLE xpparel_cps_live.`po_component_serials` ADD INDEX C_U_PO_PROD_COMP(company_code, unit_code, po_serial, product_name);
-- COMP CORRECTION
ALTER TABLE xpparel_cps_live.`po_docket_serials` ADD INDEX C_U_PO_PROD_COMP(company_code, unit_code, po_serial, product_name);


-- COMP CORRECTION
ALTER TABLE xpparel_cps_live.`po_docket_bundle` ADD INDEX C_U_DOC_BUN_COMP(company_code, unit_code, docket_number, bundle_number);
-- COMP CORRECTION
ALTER TABLE xpparel_cps_live.`po_docket_bundle` ADD INDEX C_U_DOC_COMP(company_code, unit_code, docket_number, component);
-- COMP CORRECTION
ALTER TABLE xpparel_cps_live.`po_docket_bundle` ADD INDEX C_U_PO_COL_SZ_COMP(company_code, unit_code, po_serial, color, size);

-- COMP CORRECTION
ALTER TABLE xpparel_cps_live.`po_docket_panel` ADD INDEX C_U_DOC_BUN_COMP(company_code, unit_code, docket_number, bundle_number);
ALTER TABLE xpparel_cps_live.`po_docket_panel` ADD INDEX C_U_DOC_BUN_PAN(company_code, unit_code, docket_number, bundle_number, panel_number);
ALTER TABLE xpparel_cps_live.`po_docket_panel` ADD INDEX C_U_DOC_LAY(company_code, unit_code, docket_number, under_doc_lay_number);



ALTER TABLE xpparel_cps_live.`po_adb` ADD INDEX C_U_DOC_DLY(company_code, unit_code, docket_number, po_docket_lay_id);
ALTER TABLE xpparel_cps_live.`po_adb` ADD INDEX C_U_DLY(company_code, unit_code, po_docket_lay_id);


ALTER TABLE xpparel_cps_live.`po_adb_shade` ADD INDEX C_U_DLY_ULADB(company_code, unit_code, po_docket_lay_id, under_lay_adb_number);


ALTER TABLE xpparel_cps_live.`po_adb_component` ADD INDEX PO_DLY_ADB(po_docket_lay_id, adb_id);


ALTER TABLE po_cut ADD INDEX C_U_PO(company_code, unit_code, po_serial);

