import { Modal, ModalProps } from "antd";

export interface IscModalProps extends ModalProps {

}
export const ScxModal = (props: IscModalProps) => {
    return (
        <Modal {...props} >
        </Modal>
    )
}

export default ScxModal;