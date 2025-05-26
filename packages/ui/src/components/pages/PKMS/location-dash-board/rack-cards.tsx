import { LocationContainerCartonInfo, RackIdRequest } from "@xpparel/shared-models";
import { FGRackDashboardService } from "@xpparel/shared-services";
import type { ProgressProps } from 'antd';
import { Descriptions, Popover, Progress, Select } from "antd";
import { AlertMessages } from "packages/ui/src/components/common";
import { useEffect, useState } from "react";
import "./warehouse.css";
import { useAppSelector } from "packages/ui/src/common";

export interface RackCardProps {
    rackId: number;
    selectedLocationRackID?: string;
    selectedMaterial?: string;
    selectedRackId: number
}

const { Option } = Select;

export const FGRackCard = (props: RackCardProps) => {
    const { rackId, selectedRackId, selectedLocationRackID, selectedMaterial } = props;
    const [rackData, setRackData] = useState<LocationContainerCartonInfo[]>([]);
    const [selectedLocationID, setSelectedLocationID] = useState<string | undefined>();
    const [uniqueLocationIDs, setuniqueLocationIDs] = useState([])

    const user = useAppSelector((state) => state.user.user.user);
    const unitCode = user?.orgData?.unitCode;
    const companyCode = user?.orgData?.companyCode;
    const userName = user?.userName;
    const userId = user?.userId;

    const whDashboardService = new FGRackDashboardService();

    useEffect(() => {
        getRackDataByRackId();
    }, [rackId]);


    useEffect(() => {
        const uniqueLocationIDsLocal = Array.from(new Set(rackData.flatMap((warehouse) => warehouse?.locationDetails?.map((bin) => bin.locationLocation))));
        setuniqueLocationIDs(uniqueLocationIDsLocal)
    }, [rackData])


    const getRackDataByRackId = () => {
        const rackReq = new RackIdRequest(userName, unitCode, companyCode, userId, rackId, 0, 0);
        whDashboardService.getLocationInfoByRack(rackReq).then((rackDataResp) => {
            const actualRackData = rackDataResp.data;
            setRackData([actualRackData]);
        })
            .catch((err) => {
                AlertMessages.getErrorMessage(err.message);
                return;
            });
    };

    const getLocationColorBasedOnOccupancy = (binOccupancy: string | number) => {
        const occupancyNum = typeof binOccupancy === 'string' ? parseInt(binOccupancy, 10) : binOccupancy;

        if (occupancyNum === 0) return "Green";
        if (occupancyNum > 0 && occupancyNum <= 70) return "Orange";
        if (occupancyNum >= 71) return "Red";

        return "Blue";
    };

    const groupLocationsByLevel = (bins: any[]) => {
        // console.log(bins);
        return bins.reduce((acc, bin) => {
            // console.log(bin.locationLocation);
            const level = bin.locationLocation.split("/")[2];
            // console.log(level);
            if (level) {
                if (!acc[level]) acc[level] = [];
                acc[level].push(bin);
            }
            return acc;
        }, {} as Record<string, any[]>);
    };

    const filteredLocations = (bins: any[]) => {
        return bins.filter((bin) => {
            const locationRackID =
                selectedLocationRackID === "All Racks" || !selectedLocationRackID
                    ? true
                    : bin.locationRackID === selectedLocationRackID;

            const materialMatch = selectedMaterial
                ? Array.isArray(bin.materialInLocation)
                    ? bin.materialInLocation.includes(selectedMaterial)
                    : bin.materialInLocation === selectedMaterial
                : true;

            const binIDMatch = selectedLocationID ? bin.locationLocation === selectedLocationID : true;

            return locationRackID && materialMatch && binIDMatch;
        });
    };

    const calculateOccupancy = (bins: any[]) => {
        const totalLocations = bins.length;
        const occupiedLocations = bins.filter((bin) => !bin.available).length;
        return totalLocations > 0 ? Math.round((occupiedLocations / totalLocations) * 100) : 0;
    };

    const calculateLocationAvailability = (bins: any[]) => {
        const totalLocations = bins.length;
        const availableLocations = bins.filter((bin) => bin.available).length;
        return { totalLocations, availableLocations };
    };

    const totalFabric = (bins: any[]) => {
        const totalFabricMeterage = bins.reduce((acc, bin) => {
            return acc + (bin.totalFabricMeterageStock || 0);
        }, 0);

        return totalFabricMeterage;
    };

    const totalRolls = (bins: any[]) => {
        const totalRollsInRack = bins.reduce((acc, bin) => {
            const rolls = Number(bin.rollsInLocation);
            return acc + (isNaN(rolls) ? 0 : rolls);
        }, 0);
        return totalRollsInRack;
    };

    const totalBales = (bins: any[]) => {
        const totalBalesInRack = bins.reduce((acc, bin) => {
            const bales = Number(bin.balesInLocation);
            return acc + (isNaN(bales) ? 0 : bales);
        }, 0);
        return totalBalesInRack;
    }

    const totalRelaxedFabricMeterage = (bins: any[]) => {
        const totalRelaxedFabric = bins.reduce((acc, bin) => {
            return acc + (bin.relaxedFabricMeterageStock || 0)
        }, 0)
        return totalRelaxedFabric;
    }

    const totalRelaxedRollsinRack = (bins: any[]) => {
        const totalRelaxedRollsInRack = bins.reduce((acc, bin) => {
            return acc + (bin.relaxedFabricPercentage || 0)
        }, 0)
        return totalRelaxedRollsInRack;
    }


    const parseDate = (dateString: string): Date | null => {
        if (!dateString || dateString === "null") return null;

        const parts = dateString.split(" ")[0].split("-");
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        return new Date(year, month, day);
    };

    const shouldBlink = (binDetail: any): boolean => {
        const today = new Date();
        const allocatedDate = parseDate(binDetail?.materialProductionAllocatedDate);

        return (
            (binDetail?.materialAllocatedForProduction === true ||
                binDetail?.materialAllocatedForProduction === "true") &&
            allocatedDate &&
            today >= allocatedDate
        );
    };

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const rackTotalOccupancy = (totalLocations: number, availableLocations: number): number => {
        const occupiedLocations = totalLocations - availableLocations;
        return totalLocations > 0 ? Math.round((occupiedLocations / totalLocations) * 100) : 0;
    };

    return (
        <div style={{ marginTop: "10px" }}>

            <div className="bin_container">
                <div className="bin-grid">
                    {rackData.map((warehouse, warehouseIndex) => {
                        const anyArray = []
                        const allLocations = [
                            ...warehouse?.locationDetails ? warehouse?.locationDetails : [],
                            ...[...warehouse?.locationsAvailability?.availableLocationsLocation ? warehouse.locationsAvailability.availableLocationsLocation : anyArray].map(
                                (location) => ({
                                    locationRackID: warehouse?.locationDetails[0]?.locationRackID ?? "",
                                    locationLocation: location,
                                    available: true,
                                })
                            ),
                        ];

                        const binsGroupedByRack = allLocations.reduce((acc, bin) => {
                            const rackID = bin.locationRackID;
                            if (!acc[rackID]) acc[rackID] = [];
                            acc[rackID].push(bin);

                            return acc;
                        }, {} as Record<string, any[]>);
                        return Object.entries(binsGroupedByRack).map(([rackID, bins]) => {
                            const { totalLocations, availableLocations } = calculateLocationAvailability(bins);
                            const totalRollsInRack = totalRolls(bins);
                            const filteredAndGroupedLocations = groupLocationsByLevel(filteredLocations(bins));
                            const rackOccupancy = rackTotalOccupancy(totalLocations, availableLocations);
                            return (
                                <div key={rackID} style={{ margin: "2px 0", overflow: "scroll", scrollbarWidth: "none", width: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} >
                                        <h2 style={{ margin: "5px" }}>{`Rack Code: ${rackID}`}  </h2>
                                        <div className="total-details-header">
                                            <div className="rackDetails" >
                                                <span> Rack Occupancy </span>
                                                <Progress percent={rackOccupancy} strokeColor={twoColors} />
                                            </div>
                                            <div className=" rackDetails"> <span> Total Capacity </span> <strong> {totalLocations} </strong> </div>
                                            <div className=" rackDetails" > <span>  Available Locations </span> <strong> {availableLocations}</strong> </div>
                                            <div className=" rackDetails" >  <span> Total Cartons </span> <strong>{totalRollsInRack} </strong> </div>
                                            {/* <div className=" rackDetails" >  <span>Total Relaxed Fabric </span> <strong> {totalRelaxedFabric} </strong>    </div> */}
                                            {/* <div className=" rackDetails" >  <span> Total Relaxed Rolls </span> <strong> {totalRelaxedRollsInRack} </strong>  </div> */}
                                        </div>
                                        <Select
                                            placeholder="Select Location Code"
                                            style={{ width: 200 }}
                                            onChange={setSelectedLocationID}
                                            allowClear
                                        // className="binID-filter"
                                        >
                                            {uniqueLocationIDs.map(locationLocation => (
                                                <Option key={locationLocation} value={locationLocation}>{locationLocation}</Option>
                                            ))}
                                        </Select>
                                    </div>


                                    <div className="levels-grid-container">
                                        {Object.keys(filteredAndGroupedLocations).map((level) => {
                                            const occupancyPercentage = calculateOccupancy(filteredAndGroupedLocations[level]);

                                            return (
                                                <div key={level} className="level-card">
                                                    <div style={{ marginRight: "0px", display: "flex", alignItems: "center", }}>
                                                        <div className="levels-percentage">
                                                            {occupancyPercentage}%
                                                        </div>
                                                        <h3 style={{ display: "flex" }}>{level}</h3>
                                                    </div>
                                                    <div
                                                        // style={{ marginRight: "10px" }}
                                                        className="level-row"
                                                    >
                                                        {filteredAndGroupedLocations[level].map((bin: any, binIndex: any) => {
                                                            const content = bin.available ? (
                                                                <p><strong>Available Location Location:</strong> {bin.locationLocation}</p>
                                                            ) : (
                                                                <Descriptions layout="vertical" bordered>
                                                                    <Descriptions.Item label="Location Location">{bin.locationLocation}</Descriptions.Item>
                                                                    <Descriptions.Item label="Material">
                                                                        {Array.isArray(bin.materialInLocation) ? bin.materialInLocation.join(", ") : bin.materialInLocation}
                                                                    </Descriptions.Item>
                                                                    <Descriptions.Item label="Location Occupancy">{bin.binOccupancy}</Descriptions.Item>
                                                                    <Descriptions.Item label="Rack Code">{bin.locationRackID}</Descriptions.Item>
                                                                    <Descriptions.Item label="Material Allocated For Production Date">{bin.materialProductionAllocatedDate}</Descriptions.Item>
                                                                    {/* <Descriptions.Item label="Material Relaxation Status">
                                                                        <Tag color={getInspectionColor(bin.materialInspectionStatus)}>
                                                                            {bin.materialInspectionStatus}
                                                                        </Tag>
                                                                    </Descriptions.Item> */}
                                                                    {/* <Descriptions.Item label="Material Age After Relaxation">{bin.materialAgeAfterInspection}</Descriptions.Item> */}
                                                                    {/* <Descriptions.Item label="Material Allocated For Production">{bin.materialAllocatedForProduction}</Descriptions.Item> */}
                                                                    <Descriptions.Item label="Rolls in Location">{bin.rollsInLocation}</Descriptions.Item>
                                                                    <Descriptions.Item label="Total Fabric Qty">{bin.totalFabricMeterageStock} mts</Descriptions.Item>
                                                                    <Descriptions.Item label="Allocated Qty">{bin.allocatedStockMeterage} mts</Descriptions.Item>
                                                                    <Descriptions.Item label="Non-Allocated Qty">{bin.nonAllocatedStockMeterage} mts</Descriptions.Item>
                                                                    {/* <Descriptions.Item label="Relaxed Fabric Meterage">{bin.relaxedFabricMeterageStock}</Descriptions.Item> */}
                                                                </Descriptions>
                                                            );

                                                            return (
                                                                <Popover
                                                                    key={binIndex}
                                                                    content={content}
                                                                    title={`Location Code - ${bin.locationLocation}`}
                                                                    trigger="hover"
                                                                    placement="bottom"
                                                                // mouseLeaveDelay={500}
                                                                >
                                                                    <div
                                                                        className={`bin ${bin.available ? "available-bin" : "occupied-bin"} `}
                                                                        style={{ backgroundColor: bin.available ? "green" : getLocationColorBasedOnOccupancy(bin.binOccupancy) }}
                                                                    ></div>
                                                                </Popover>
                                                            );
                                                        })}

                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        });
                    })}
                </div>
            </div>
        </div >
    );
};

export default FGRackCard;