
-- PREFIXES for indexes
company - C
unit - U
pack header id/pack LIST id - PH
pack LIST line - PLL
pack LIST item - PLI
pack item line - PIL
roll barcode - ROLLB
pallet id - PALL
pallet barcode - PALLB
BIN id - BIN
BIN barcode - BINB
Rack - RACK
rack barcode - RACKB
inspection request - IR
Lot - LOT
batch - BAT



-- ins_request
ALTER TABLE ins_request ADD INDEX C_U_PH(company_code, unit_code, ph_id);
ALTER TABLE ins_request ADD INDEX C_U_IAS(company_code, unit_code, ins_activity_status);

-- ins_request_attributes
ALTER TABLE ins_request_attributes ADD INDEX IR(ins_request_id);

-- ins_request_items
ALTER TABLE ins_request_items ADD INDEX C_U_PIL(company_code, unit_code, ph_item_lines_id);
ALTER TABLE ins_request_items ADD INDEX C_U_IR(company_code, unit_code, ins_request_id);

-- lbin
ALTER TABLE l_bin ADD INDEX C_U_RACK(company_code, unit_code, l_rack_id); 
ALTER TABLE l_bin ADD INDEX C_U_BINB(company_code, unit_code, barcode_id); 

-- lpallet
ALTER TABLE l_pallet ADD INDEX C_U_PALLB(company_code, unit_code, barcode_id); 


-- pallet_bin_map
ALTER TABLE pallet_bin_map ADD INDEX C_U_SBIN(company_code, unit_code, suggested_bin_id); 
ALTER TABLE pallet_bin_map ADD INDEX C_U_CBIN(company_code, unit_code, confirmed_bin_id); 
ALTER TABLE pallet_bin_map ADD INDEX C_U_PALL(company_code, unit_code, pallet_id); 


-- pallet group
ALTER TABLE pallet_group ADD INDEX C_U_PH(company_code, unit_code, pack_list_id);


-- pallet group items
ALTER TABLE pallet_group_items ADD INDEX C_U_PG(company_code, unit_code, pg_id);

-- pallet roll map
ALTER TABLE pallet_roll_map ADD INDEX C_U_SPALL(company_code, unit_code, suggested_pallet_id);
ALTER TABLE pallet_roll_map ADD INDEX C_U_CPALL(company_code, unit_code, confirmed_pallet_id);
ALTER TABLE pallet_roll_map ADD INDEX C_U_PH(company_code, unit_code, pack_list_id);
ALTER TABLE pallet_roll_map ADD INDEX C_U_PLI(company_code, unit_code, item_lines_id);


-- pallet sub group
ALTER TABLE pallet_sub_group ADD INDEX C_U_PG(company_code, unit_code, pg_id);


-- ph grn
ALTER TABLE ph_grn ADD INDEX C_U_PH(company_code, unit_code, ph_id);

-- ph item lines
ALTER TABLE ph_item_lines ADD INDEX C_U_BAT(company_code, unit_code, batch_number);
ALTER TABLE ph_item_lines ADD INDEX C_U_LOT(company_code, unit_code, lot_number);
ALTER TABLE ph_item_lines ADD INDEX C_U_ROLLB(company_code, unit_code, barcode);
ALTER TABLE ph_item_lines ADD INDEX PH(ph_id);
ALTER TABLE ph_item_lines ADD INDEX PLI(ph_items_id);


-- ph item lines actual
ALTER TABLE ph_item_lines_actual ADD INDEX C_U_PLI(company_code, unit_code, ph_item_lines_id);

-- ph item shrinkage lines
ALTER TABLE ph_item_shrinkage_lines ADD INDEX C_U_PLI(company_code, unit_code, ph_item_lines_id);

-- ph items
ALTER TABLE ph_items ADD INDEX PLL(ph_lines_id);

-- ph items defect capture
ALTER TABLE ph_items_defect_capture ADD INDEX C_U_PLI(company_code, unit_code,ph_item_lines_id);


-- ph items relaxation
ALTER TABLE ph_items_relaxation ADD INDEX C_U_PLI(company_code, unit_code,ph_item_lines_id);


-- ph lines
ALTER TABLE ph_lines ADD INDEX PH(ph_id);
ALTER TABLE ph_lines ADD INDEX C_U_LOT(company_code, unit_code, lot_number);
ALTER TABLE ph_lines ADD INDEX C_U_BAT(company_code, unit_code, batch_number);






------------- NOT YET TAKEN TO UAT AND PROD -------------------

-- ph vehicle
ALTER TABLE `ph_vehicle` ADD INDEX C_U_ST(company_code, unit_code, STATUS);
ALTER TABLE `ph_vehicle` ADD INDEX C_U_PH(company_code, unit_code, ph_id);



