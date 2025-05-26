
alter table p_cut_rm add column ref_component varchar(5) not null after components;


alter table op_version add column style varchar(50) not null;
alter table op_version add column prod_code varchar(50) not null;
alter table op_version add column fg_color varchar(50) not null;



alter table op_sequence add column style varchar(50) not null;
alter table op_sequence add column prod_code varchar(50) not null;
alter table op_sequence add column fg_color varchar(50) not null;
alter table op_sequence add column prod_name varchar(50) not null;


alter table po_docket_panel add column psl_id bigint not null;
alter table po_actual_docket_panel add column psl_id bigint not null;



CREATE TABLE `psl_info` (
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
  `psl_id` bigint(20) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `del_date` varchar(15) DEFAULT NULL,
  `co` varchar(15) DEFAULT NULL,
  `destination` varchar(30) DEFAULT NULL,
  `vpo` varchar(30) DEFAULT NULL,
  `mo_no` varchar(20) DEFAULT NULL,
  `prod_name` varchar(50) DEFAULT NULL,
  `prod_code` varchar(50) DEFAULT NULL,
  `ref_number` varchar(10) DEFAULT NULL,
  `style` varchar(50) DEFAULT NULL,
  `pcd` varchar(15) DEFAULT NULL,
  `mo_line_no` varchar(20) DEFAULT NULL,
  `buyer_po` varchar(50) DEFAULT NULL,
  `quantity` mediumint(9) NOT NULL,
  `oq_type` char(2) NOT NULL,
  `fg_start_no` mediumint(9) NOT NULL,
  `fg_end_no` mediumint(9) NOT NULL,
  `fg_created` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Will turn to true if the FGs are created for this osl',
  `fg_ops_created` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Will turn to true if the FG OPs are created for this osl',
  `fg_dep_created` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Will turn to true if the FG OP DEPs are created for this osl',
  `bun_created` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Will turn to true if the bundles are created for this osl',
  `bun_fg_created` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Will turn to true if the bundles FG are created for this osl',
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci




CREATE TABLE `po_docket_psl` (
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
  `po_serial` bigint(20) NOT NULL,
  `docket_number` bigint(20) NOT NULL,
  `psl_id` bigint(20) NOT NULL COMMENT 'The PSL Id in oms',
  `quantity` smallint(6) NOT NULL,
  `bundled_quantity` smallint(6) NOT NULL COMMENT 'This will update after the bundling operation',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




CREATE TABLE `po_docket_bundle_psl` (
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
  `po_serial` bigint(20) NOT NULL,
  `docket_number` bigint(20) DEFAULT NULL,
  `bundle_number` int(11) NOT NULL COMMENT ' Auto inc number under a docket + component .i.e irrespective of size, this will start from 1 and max will be equal to the SUM(ratios of all sizes) for any component',
  `psl_id` bigint(20) NOT NULL COMMENT 'The PSL Id in oms',
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



