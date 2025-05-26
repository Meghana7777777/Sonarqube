import { WarehouseContainerCartonsModel, ContainerCartonsUIModel, CartonBasicInfoUIModel, InspectionContainerCartonsModel } from "@xpparel/shared-models";

export const constructWarehouseCarton = (containerInfo: WarehouseContainerCartonsModel) => {
    const containerObj = new ContainerCartonsUIModel();
    containerObj.containerCode = containerInfo.containerCode;
    containerObj.containerId = containerInfo.containerId;
    containerObj.phId = containerInfo.phId;
    containerObj.containerCapacity = containerInfo.containerCapacity;
    let noOfCartons = 0;
    const cartonsInfo: CartonBasicInfoUIModel[] = [];

    containerInfo.cartonsInfo.forEach(cartonInfo => {
        noOfCartons++;
        const cartonObj = new CartonBasicInfoUIModel();
        // cartonObj.batchNo = cartonInfo.packListId;
        cartonObj.barcode = cartonInfo.barcode;
        cartonObj.cartonId = cartonInfo.cartonId;
        cartonObj.cartonNo = cartonInfo.cartonNo;
        cartonObj.inspectionPick = cartonInfo.inspectionPick;
        cartonObj.barcode = cartonInfo.barcode;
        cartonObj.width = cartonInfo.width;
        cartonObj.length = cartonInfo.length;
        cartonObj.height = cartonInfo.height;
        cartonObj.netWeight = cartonInfo.netWeight;
        cartonObj.grossWeight = cartonInfo.grossWeight;
        // if(cartonObj.actualCartonInfo){
        //     cartonObj.actualCartonInfo.aGsm = cartonInfo.actualCartonInfo?.aGsm;
        //     cartonObj.actualCartonInfo.aLength = cartonInfo.actualCartonInfo?.aLength;
        //     cartonObj.actualCartonInfo.aShade = cartonInfo.actualCartonInfo?.aShade;
        //     cartonObj.actualCartonInfo.aWidth = cartonInfo.actualCartonInfo?.aWidth;
        // }
        cartonsInfo.push(cartonObj);
    });

    containerObj.noOfCartons = noOfCartons;
    containerObj.cartonsInfo = cartonsInfo;
    return containerObj;
}

export const constructInspectionsCarton = (containerInfo: InspectionContainerCartonsModel) => {
    const containerObj = new ContainerCartonsUIModel();
    containerObj.containerCode = containerInfo.containerCode;
    containerObj.containerId = containerInfo.containerId;
    containerObj.phId = containerInfo.phId;
    containerObj.containerCapacity = 0;
    let noOfCartons = 0;
    const cartonsInfo: CartonBasicInfoUIModel[] = [];
    containerInfo.groupedCartons.forEach(groupedCarton => {
        groupedCarton.cartonsInfo.forEach(cartonInfo => {
            noOfCartons++;
            const cartonObj = new CartonBasicInfoUIModel();
            // cartonObj.batchNo = cartonInfo.packListId;
            cartonObj.barcode = cartonInfo.barcode;
            cartonObj.cartonId = cartonInfo.cartonId;
            cartonObj.cartonNo = cartonInfo.cartonNo;
            cartonObj.inspectionPick = cartonInfo.inspectionPick;
            cartonObj.barcode = cartonInfo.barcode;
            cartonObj.width = cartonInfo.width;
            cartonObj.length = cartonInfo.length;
            cartonObj.height = cartonInfo.height;
            cartonObj.netWeight = cartonInfo.netWeight;
            cartonObj.grossWeight = cartonInfo.grossWeight;
            // cartonObj.status = cartonInfo.status;
            // cartonObj.phId = cartonInfo.packListId;
            // cartonObj.packListId = cartonInfo.packListId;
            // cartonObj.packListCode = cartonInfo.packListCode;
            // if(cartonObj.actualCartonInfo){
            //     cartonObj.actualCartonInfo.aGsm = cartonInfo.actualCartonInfo?.aGsm;
            //     cartonObj.actualCartonInfo.aLength = cartonInfo.actualCartonInfo?.aLength;
            //     cartonObj.actualCartonInfo.aShade = cartonInfo.actualCartonInfo?.aShade;
            //     cartonObj.actualCartonInfo.aWidth = cartonInfo.actualCartonInfo?.aWidth;
            // }
            cartonsInfo.push(cartonObj);
        });
    });
    containerObj.noOfCartons = noOfCartons;
    containerObj.cartonsInfo = cartonsInfo;
    return containerObj;
}