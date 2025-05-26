import React, { useState } from "react";
import { Checkbox, Modal } from "antd";
import { ScxButton, ScxCard, ScxColumn, ScxRow } from "packages/ui/src/schemax-component-lib";
import { RequestStatusEnum } from "@xpparel/shared-models";
import './Request-Status.css'

interface IRequestProps {
  title: RequestStatusEnum;
  statusRequest: any[];
  requestType?: RequestStatusEnum;
  getDataAgainstToStatus?: () => void;
}

export const RequestCard = (props: IRequestProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const { title, statusRequest, requestType, getDataAgainstToStatus } = props;

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <ScxCard className="card-shadow"  title={<div style={{ textAlign: "center", }}>{title}</div>} style={{ height: "90vh", }}>
      <ScxRow gutter={[16, 16]}>
        {statusRequest.map((rec, index) => (
          <ScxColumn xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} key={index}>
            <div
              onClick={() => setShowModal(true)}
              style={{
                margin: "7px",
                textAlign: "center",
                borderStyle: "solid",
                borderWidth: "0px",
                borderRadius: "5px",
                backgroundColor:'gray',
                height: "30px",
                width: "80%",
                overflow: "hidden",
                padding: "3px",
              }}
            >
              <div style={{ marginTop: '4px', color: 'white', fontWeight: '500' }}>{rec.rollNo}</div>
            </div>
          </ScxColumn>
        ))}
      </ScxRow>

      <Modal open={showModal} onCancel={() => setShowModal(false)} >
        <ScxButton onClick={getDataAgainstToStatus}>{requestType}</ScxButton>
        <Checkbox checked={isChecked} style={{ marginLeft: "10px" }} onChange={handleCheckboxChange}>
          Click To Change the Status
        </Checkbox>
      </Modal>
    </ScxCard>
  );
};
