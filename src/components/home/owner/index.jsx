import { useState } from 'react';
import DashBoardLayout from '../../common/dashboard-layout';
import { notification } from 'antd';
import {
  FolderAddOutlined,
  FileOutlined,
  BarChartOutlined
} from '@ant-design/icons';

import ManageField from './contents/manage-field';
import Statistic from './contents/statistic';
import CreateField from './contents/create-field';
// import ManageProfile from './contents/manage-profile';

const Owner = () => {
  const [selectedKey, setSelectedKey] = useState(['3']);
  const [items] = useState([
    {
      key: '1',
      icon: <FolderAddOutlined />,
      label: 'Tạo sân'
    },
    {
      key: '2',
      icon: <FileOutlined />,
      label: 'Sân bóng'
    },
    {
      key: '3',
      icon: <BarChartOutlined />,
      label: 'Thống kê'
    }
  ]);
  const [apiNotification, contextHolder] = notification.useNotification();

  const openNotification = (message, description) => {
    apiNotification.success({
      message,
      description,
      placement: 'topRight',
      duration: 2
    });
  };

  return (
    <>
      {contextHolder}
      <DashBoardLayout
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        items={items}
      >
        {selectedKey[0] === '1' && (
          <CreateField
            setSelectedKey={setSelectedKey}
            openNotification={openNotification}
          />
        )}
        {selectedKey[0] === '2' && (
          <ManageField
            setSelectedKey={setSelectedKey}
            openNotification={openNotification}
          />
        )}
        {selectedKey[0] === '3' && <Statistic />}
      </DashBoardLayout>
    </>
  );
};

export default Owner;
