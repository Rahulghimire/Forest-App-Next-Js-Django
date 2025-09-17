import { Modal, ModalProps } from "antd";
import "./AntModal.css";

export const AntModal: React.FC<ModalProps> = (props) => {
  const {
    width = "70vw",
    okText = "Save",
    centered = false,
    footer = false,
    classNames,
    ...rest
  } = props;

  return (
    <Modal
      footer={footer}
      centered={centered}
      style={{ top: 20 }}
      width={width}
      okText={okText}
      classNames={classNames}
      {...rest}
    >
      {props?.children}
    </Modal>
  );
};
