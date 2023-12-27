
import { useEffect, useState } from "react";
import { Modal as AntdModal } from "antd";
import CreateField from "../create-field";
import useAxios from "../../../../../hooks/useAxios";

const Modal = ({ fieldId, getFootballFields, openNotification }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({});

  const { api } = useAxios();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setCurrentField({});
    if (isModalOpen) {
      (async () => {
        try {
          const { data } = await api.get(
            `/owner/football-pitch/get-data/${fieldId}`
          );
          setCurrentField({
            ...data.football_pitchs,
            detailed_schedule: JSON.parse(
              data.football_pitchs.detailed_schedule
            ),
            image: data.football_pitchs.image.split(","),
          });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [isModalOpen, api, fieldId]);

  return (
    <>
      <a type="primary" onClick={showModal}>
        Chỉnh sửa
      </a>
      {isModalOpen && currentField?.id && (
        <AntdModal
          title="Chi tiết sân bóng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={() => <></>}
        >
          <CreateField
            editMode
            currentFieldId={currentField.id}
            currentField={currentField}
            setIsModalOpen={setIsModalOpen}
            openNotification={openNotification}
            getFootballFields={getFootballFields}
          />
        </AntdModal>
      )}
    </>
  );
};
export default Modal;