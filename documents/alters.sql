


// added a new column four_points_width while during the 4 point inspection
ALTER TABLE ph_item_lines_actual MODIFY COLUMN a_width NUMERIC DEFAULT 0;
ALTER TABLE ph_item_lines_actual ADD COLUMN four_points_width NUMERIC DEFAULT 0;

ALTER TABLE ins_request_items DROP COLUMN inspection_status;
ALTER TABLE ins_request_items DROP COLUMN final_inspection_status;
ALTER TABLE ins_request_items ADD COLUMN final_inspection_result VARCHAR(10) DEFAULT 'OPEN';
ALTER TABLE packing_list_header ADD COLUMN supplier_name VARCHAR(100) NOT NULL AFTER supplier_code;

ALTER TABLE ins_request ADD COLUMN `create_re_request` BOOLEAN DEFAULT FALSE NULL;


ALTER TABLE xapparel_wms_dev.`ph_items_defect_capture` ADD COLUMN point_position VARCHAR(5) NOT NULL;



-- New table for the material issuance

CREATE TABLE `ph_item_issuance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `ph_items_id` int(11) NOT NULL,
  `issued_quantity` decimal(10,0) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) 


-- PHASE 2
-- New table to track the consumption of the WH fab requests

CREATE TABLE `wh_mat_request_header` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT '1',
  `remarks` text,
  `ext_ref_id` bigint(20) NOT NULL COMMENT 'The PK of the external requesting table',
  `ext_ref_entity_type` varchar(20) NOT NULL DEFAULT 'DOCKET' COMMENT 'Docket/sewing job/carton',
  `req_material_type` varchar(15) NOT NULL DEFAULT 'FABRIC' COMMENT 'Fabric/buttons/thread/etc',
  `ext_req_no` varchar(20) NOT NULL COMMENT 'po_serial + auto inc number under a PO',
  `wh_req_no` varchar(20) NOT NULL COMMENT 'the unique request key for the warehouse',
  `fulfill_within` datetime NOT NULL COMMENT 'the datetime by which the req has to be fulfilled',
  `material_req_on` datetime NOT NULL COMMENT 'the datetime at which the material was requested by the ext system',
  `material_req_by` varchar(25) NOT NULL COMMENT 'the person who requested the material',
  `req_progress_status` varchar(5) NOT NULL DEFAULT '0' COMMENT 'the unique request key for the warehouse',
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;


CREATE TABLE `wh_mat_request_line` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT '1',
  `remarks` text,
  `ext_ref_line_id` bigint(20) NOT NULL COMMENT 'Ref key of the external entity whatsoever it is. Usually the po docket material request id',
  `job_number` varchar(15) NOT NULL COMMENT 'Reference key of the external job number if any. i.e docket/sewing job',
  `mat_destination_type` varchar(15) NOT NULL COMMENT 'Usually to where should the material go. The type of destination.',
  `req_line_status` varchar(5) NOT NULL DEFAULT 'OP' COMMENT 'The material status of this entity',
  `wh_mat_request_header_id` bigint(20) NOT NULL COMMENT 'PK of the WH request header',
  `mat_destination_desc` varchar(30) NOT NULL COMMENT 'Usually to where should the material go. The type of destination.',
  `mat_destination_id` varchar(10) NOT NULL COMMENT 'The PK of the cut-table/sewing-table/packing-table',
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `wh_mat_request_line_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT '1',
  `remarks` text,
  `item_id` bigint(20) NOT NULL COMMENT 'The PK of the roll/sticers bunch/buttons pakcet/ etc',
  `item_barcode` varchar(20) NOT NULL COMMENT 'item barcode of the requesting item. ie. ROLL barcode / Pakcet barcode / etc',
  `item_type` varchar(15) NOT NULL DEFAULT 'ROLL' COMMENT 'Roll/Stickers/Cartons etc',
  `req_quanitty` decimal(8,2) NOT NULL COMMENT 'The requesting quantity form this specific roll/scahet/pack',
  `req_line_item_status` varchar(5) NOT NULL DEFAULT 'OP' COMMENT 'The material status of this entity',
  `wh_mat_request_header_id` bigint(20) NOT NULL COMMENT 'PK of the WH request header',
  `wh_mat_request_line_id` bigint(20) NOT NULL COMMENT 'PK of the WH request line',
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0;


CREATE TABLE `ph_item_lines_con` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `consumed_quantity` decimal(8,2) NOT NULL DEFAULT 0.00,
  `ref_transaction_id` varchar(10) NOT NULL COMMENT 'The PK of the layed_roll entity for this case',
  `job_ref` varchar(15) NOT NULL COMMENT 'The job ref id the docket number. Since fab is utilized only by a docket',
  `job_actual_ref` varchar(15) NOT NULL COMMENT 'The laying id of the docket number',
  `consumed_on` datetime(6) NOT NULL COMMENT 'The date on which the fab is comsumed by the docket',
  `barcode` varchar(20) NOT NULL COMMENT 'The roll barcode',
  `ph_items_id` bigint(20) NOT NULL COMMENT 'The roll PK',
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1


--- new alters
ALTER TABLE emb_line ADD COLUMN freeze_status BOOLEAN DEFAULT FALSE;
ALTER TABLE po_marker ADD COLUMN pat_version VARCHAR(20) DEFAULT '';
ALTER TABLE po_marker ADD COLUMN `end_allowance` DECIMAL(6,2) NOT NULL AFTER `marker_width`, ADD COLUMN `perimeter` DECIMAL(6,2) NOT NULL AFTER end_allowance;
ALTER TABLE p_cut_rm CHANGE `avg_cons` `avg_cons` DECIMAL(8,4) NULL, CHANGE `binding_cons` `binding_cons` DECIMAL(8,4) DEFAULT 0.00 NULL;
ALTER TABLE po_marker CHANGE `marker_length` `marker_length` DECIMAL(8,4) NOT NULL;
ALTER TABLE po_docket DROP COLUMN `material_requirement`;
ALTER TABLE po_docket DROP COLUMN `binding_requirement`;










------------ UAT ROUN 1 CHANGES -----------
CREATE TABLE `xpparel_ums`.`sizes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_code` VARCHAR(20) NOT NULL,
  `unit_code` VARCHAR(20) NOT NULL,
  `is_active` TINYINT(4) NOT NULL DEFAULT 1,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_user` VARCHAR(40) DEFAULT NULL,
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_user` VARCHAR(40) DEFAULT NULL,
  `version_flag` INT(11) NOT NULL DEFAULT 1,
  `remarks` TEXT DEFAULT NULL,
  `size_code` VARCHAR(15) NOT NULL,
  `size_desc` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


-- PROD RELEASE ON 2024-04-18 ------------
ALTER TABLE `xpparel_oms`.order ADD COLUMN plant_style VARCHAR(30) DEFAULT NULL;
ALTER TABLE `xpparel_oes`.p_order_line ADD COLUMN plant_style VARCHAR(30) DEFAULT NULL;
ALTER TABLE `xpparel_oes`.`p_cut_rm`   
  CHANGE `wastage` `wastage` DECIMAL(8,4) DEFAULT 0 NULL;







  -------------- 10-MAY-2024 Release ---------
  
ALTER TABLE xpparel_cps.`on_floor_rolls` ADD COLUMN reason_id INT DEFAULT 0;
ALTER TABLE xpparel_cps.`on_floor_rolls` ADD COLUMN rc_status VARCHAR(4) DEFAULT 'YR';





---------------------- 23-05-2024 ------------------------
ALTER TABLE xpparel_cps.`po_docket` ADD COLUMN is_binding BOOLEAN DEFAULT FALSE COMMENT "The is binding flag that is selected in the fabric properties" AFTER main_docket ;



ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN sequence tinyint DEFAULT 0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN joints_overlapping DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN no_of_joints tinyint DEFAULT 0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN remnants_of_other_lay DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN half_plie_of_pre_roll DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN fabric_defects DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN usable_remains DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN un_usable_remains DECIMAL(5,2) DEFAULT 0.0;









-------------------------- TRAY TROLLEYS ------------------------


CREATE TABLE `tray_roll_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `item_lines_id` int(11) NOT NULL COMMENT 'The roll id. PK of the ph_item_lines',
  `suggested_tray_id` int(11) DEFAULT NULL COMMENT 'The suggested tray id for the roll. This is kept for futrue impelementation. currently not utilized',
  `confirmed_tray_id` int(11) NOT NULL COMMENT 'The PK of the tray id l_tray',
  `pack_list_id` int(11) NOT NULL COMMENT 'The PK of the packlist packing_list_header',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `tray_roll_map_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `item_lines_id` int(11) NOT NULL COMMENT 'The roll id. PK of the ph_item_lines',
  `from_tray_id` int(11) NOT NULL COMMENT 'The PK of the tray id l_tray',
  `to_tray_id` int(11) NOT NULL COMMENT 'The PK of the tray id l_tray',
  `pack_list_id` int(11) NOT NULL COMMENT 'The PK of the packlist packing_list_header',
  `moved_by` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `tray_trolley_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `tray_id` int(11) NOT NULL,
  `suggested_trolley_id` int(11) DEFAULT NULL COMMENT 'PK of the l_trolley',
  `confirmed_trolley_id` int(11) NOT NULL COMMENT 'PK of the l_trolley',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `tray_trolley_map_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `tray_id` int(11) NOT NULL,
  `from_trolley_id` int(11) NOT NULL,
  `to_trolley_id` int(11) NOT NULL,
  `moved_by` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `trolley_bin_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `trolley_id` int(11) NOT NULL COMMENT 'The trolley id. PK of the l_trolly',
  `bin_id` int(11) NOT NULL COMMENT 'The PK of the l_bin',
  `rack_id` int(11) NOT NULL COMMENT 'The PK of the l_rack',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `trolley_bin_map_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `trolley_id` int(11) NOT NULL COMMENT 'The trolley id. PK of the l_trolly',
  `from_bin_id` int(11) NOT NULL COMMENT 'The PK of the l_bin',
  `to_bin_id` int(11) NOT NULL COMMENT 'The PK of the l_bin',
  `moved_by` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1



ALTER TABLE xpparel_wms.`l_tray` ADD COLUMN barcode VARCHAR(20) NOT NULL;
ALTER TABLE xpparel_wms.`l_trolley` ADD COLUMN barcode VARCHAR(20) NOT NULL;

UPDATE xpparel_wms.`l_tray`  SET barcode = CONCAT('TRAY-000',id);
UPDATE xpparel_wms.`l_trolley`  SET barcode = CONCAT('TRLY-000',id);




----------------------------------------------------- DOCKET CLUBBING ----------------------------------------------

ALTER TABLE `xpparel_cps`.po_docket ADD COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE `xpparel_cps`.po_docket DROP COLUMN docket_group_id;

ALTER TABLE xpparel_cps.`po_docket_material` ADD  COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket_material SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE xpparel_cps.`po_docket_material` DROP COLUMN docket_number;


ALTER TABLE xpparel_cps.`po_docket_material_request` ADD  COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket_material_request SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE xpparel_cps.`po_docket_material_request` DROP COLUMN docket_number;

UPDATE `xpparel_cps`.po_docket_material_request SET docket_group = CONCAT(docket_number,'-',1);

ALTER TABLE xpparel_oes.`po_ratio_component` ADD COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE xpparel_oes.`po_ratio_component` ADD COLUMN product_name VARCHAR(60) NOT NULL DEFAULT '';

ALTER TABLE xpparel_cps.`po_docket_lay` ADD COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket_lay SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE xpparel_cps.`po_docket_lay` DROP COLUMN docket_number; 


ALTER TABLE xpparel_cps.`po_docket_cut_table` ADD COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE xpparel_cps.`po_docket_cut_table_history` ADD COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket_cut_table SET docket_group = CONCAT(docket_number,'-',1);

ALTER TABLE xpparel_cps.`on_floor_rolls` ADD COLUMN  docket_group VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE xpparel_cps.po_docket_cut_table DROP COLUMN docket_number;

ALTER TABLE xpparel_cps.`po_docket_lay_downtime` ADD COLUMN docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket_lay_downtime SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE xpparel_cps.`po_docket_lay_downtime` DROP COLUMN docket_number; 

ALTER TABLE xpparel_cps.`po_docket_lay_item` ADD COLUMN  docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.po_docket_lay_item SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE xpparel_cps.`po_docket_lay_item` DROP COLUMN  docket_number;



ALTER TABLE xpparel_cps.`mrn` ADD COLUMN  docket_group VARCHAR(20) NOT NULL DEFAULT '';
UPDATE `xpparel_cps`.mrn SET docket_group = CONCAT(docket_number,'-',1);
ALTER TABLE xpparel_cps.`mrn` DROP COLUMN  docket_number;

ALTER TABLE xpparel_cps.`po_adb_shade` ADD COLUMN docket_number BIGINT NOT NULL DEFAULT 0;


ALTER TABLE xpparel_ets.`emb_header` ADD COLUMN  docket_group VARCHAR(20) NOT NULL DEFAULT '';

ALTER TABLE xpparel_cps.po_cut_docket ADD COLUMN cut_sub_number SMALLINT NOT NULL DEFAULT 0;


ALTER TABLE po_docket_lay_bundle_print ADD COLUMN docket_number VARCHAR(20) NOT NULL DEFAULT '';





// date :(2024/07/26)added for actual marker

CREATE TABLE `actual_marker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_code` varchar(20) NOT NULL,
  `unit_code` varchar(20) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `created_user` varchar(40) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `updated_user` varchar(40) DEFAULT NULL,
  `version_flag` int(11) NOT NULL DEFAULT 1,
  `remarks` text DEFAULT NULL,
  `marker_name` text NOT NULL,
  `marker_length` decimal(8,4) NOT NULL,
  `marker_width` decimal(6,2) NOT NULL,
  `docket_group` varchar(20) NOT NULL DEFAULT '',
  `uuid` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci

//  10-09-2024 Add issuing_entity column in table ph_item_issuance  in warehouse database  manual and docket issuance purpose


ALTER TABLE xpparel_wms.`ph_item_issuance` ADD COLUMN issuing_entity ENUM('M','D')  NOT NULL DEFAULT 'M';


// 11-09-2024 Change Product_type Character Length from 20 to 40 total 14 tables


ALTER TABLE `xpparel_cps`.`po_cut` MODIFY COLUMN `product_type` VARCHAR(40);
ALTER TABLE `xpparel_cps`.`po_docket` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_ets`.`emb_header` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oes`.`p_order_line` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oes`.`p_order` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oes`.`p_cut_rm` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oes`.`po_ratio_line` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`order_pack_method` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`order` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`product_type_component` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`product` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`product_type` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`sub_product` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`order_line` MODIFY COLUMN `product_sub_type` VARCHAR(40);
ALTER TABLE `xpparel_wms`.`sale_order` MODIFY COLUMN `product_type`  VARCHAR(40);
ALTER TABLE `xpparel_oms`.`product_type` MODIFY COLUMN `product_desc` VARCHAR(50);


// 26-09-2024 change start_date_time and completed_date_time alter the validation from not null to null
ALTER TABLE `xpparel_cps`.`po_docket_lay_item`MODIFY COLUMN `started_date_time` DATETIME NULL;

ALTER TABLE `xpparel_cps`.`po_docket_lay_item`MODIFY COLUMN `completed_date_time` DATETIME NULL;



// 28-09-2024 alter the remarks length on ph_item_issuance table for dev database
ALTER TABLE `xpparel_oms`.`order_line` MODIFY COLUMN `product_sub_type` VARCHAR(40);
/** already execute in live earlier */
-- ALTER TABLE xpparel_cps_live.po_adb_shade CHANGE shade shade VARCHAR(10) CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'The shade of the bundle';

-- ALTER TABLE xpparel_cps_live.po_adb_roll CHANGE shade shade VARCHAR(10) CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'The shade of the bundle';


-- 30-09-2024 added po_item uat and dev done
ALTER TABLE xpparel_oms.order_line ADD COLUMN garment_vendor_po_item VARCHAR(50) NULL AFTER garment_vendor_po;

ALTER TABLE xpparel_oms.order ADD COLUMN planned_cut_date VARCHAR(15);


-- 07/11/2024 alter table for so data integration to show the Planned Cut Date and Planned Production Date and Planned Delivery date and Fabric Meters
-- Warehouse management
ALTER TABLE `xpparel_wms``.sale_order_items` ADD COLUMN planned_cut_date VARCHAR(10);
ALTER TABLE `xpparel_wms`.`sale_order_items` ADD COLUMN planned_production_date VARCHAR(10);
ALTER TABLE `xpparel_wms`.`sale_order_items` ADD COLUMN planned_delivery_date VARCHAR(10);
ALTER TABLE `xpparel_wms`.`spo_items` ADD COLUMN fabric_meters VARCHAR(10);

-- 11/11/2024 adding parentId to the 'sale_order_items' table in WMS
ALTER TABLE `xpparel_wms``.sale_order_items` ADD COLUMN parent_id INT DEFAULT 0

-- Order Management database
ALTER TABLE `xpparel_oms`.`order_line` ADD COLUMN planned_cut_date VARCHAR(10);
ALTER TABLE `xpparel_oms`.`order_line` ADD COLUMN planned_production_date VARCHAR(10);
ALTER TABLE `xpparel_oms`.`order_line` ADD COLUMN planned_delivery_date VARCHAR(10);
ALTER TABLE `xpparel_oms`.`order_line_rm` ADD COLUMN fabric_meters VARCHAR(10);



--02/11/2024 added style_number for displaying in inspection dashboards
ALTER TABLE ins_request_items ADD style_number VARCHAR(25) 


--11/11/2024 added new column for displaying capacity in mts in rack masters.
ALTER TABLE xpparel_wms.l_rack ADD COLUMN capacity_in_mts VARCHAR(10);
ALTER TABLE ins_request_items ADD style_number VARCHAR(25);
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN sequence tinyint DEFAULT 0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN joints_overlapping DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN no_of_joints tinyint DEFAULT 0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN remanants_of_other_lay DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN half_plie_of_pre_roll DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN fabric_defects DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN usable_remains DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE xpparel_cps.po_docket_lay ADD COLUMN un_usable_remains DECIMAL(5,2) DEFAULT 0.0;

ALTER TABLE xpparel_cps.po_docket_lay_item CHANGE layed_plies layed_plies SMALLINT(6) DEFAULT 0 NOT NULL COMMENT 'The layed qty in yardage. Mostly plies * mklength';
