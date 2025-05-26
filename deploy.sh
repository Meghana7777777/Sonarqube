nx run services-warehouse-management:build
nx run services-cut-planning:build
nx run services-emb-tracking:build
nx run services-order-execution:build
nx run services-order-management:build
nx run services-unit-management:build

nx run ui:build
cd /var/www/html/xapparel_uat_app/
#rm -rf *
#cp -r /var/www/html/xapparel_uat/dist/packages/ui/*  /var/www/html/xapparel_uat_app/
