import { useEffect, useState } from 'react';
import UserLayout from '../../components/common/user-layout';
import useAxios from '../../hooks/useAxios';
import {
  Badge,
  Descriptions,
  Button,
  Divider,
  Popconfirm,
  Pagination
} from 'antd';
import { useGlobalContext } from '../../contexts/GlobalContext';

function formatVietnameseMoney(number) {
  // Chuyển đổi số thành chuỗi và loại bỏ dấu phẩy nếu có
  const numberString = number.toString().replace(/,/g, '');
  // Kiểm tra nếu số không hợp lệ hoặc không phải là một số
  if (isNaN(numberString) || numberString === '') {
    return 'Invalid number';
  }
  // Định dạng số tiền theo quy tắc 3 chữ số một nhóm, phân cách bằng dấu phẩy
  const formattedNumber = parseFloat(numberString).toLocaleString('vi-VN');
  // Thêm đơn vị tiền tệ (đồng)
  return formattedNumber + ' đồng';
}

const History = () => {
  const [history, setHistory] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const { api } = useAxios();
  const { user } = useGlobalContext();

  useEffect(() => {
    hanldeGetHistory();
  }, [curPage]);

  const hanldeGetHistory = async () => {
    try {
      const { data } = await api.get(`/history?page=${curPage}`);
      setCurPage(data.schedule.current_page);
      setTotalPage(data.schedule.last_page);
      setHistory(data.schedule.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      api.get(`/delete-schedule/${id}`);
      hanldeGetHistory();
    } catch (error) {
      console.log(error);
    }
  };

  const handleProcessPaypal = async (price) => {
    try {
      const { data } = await api.post('/process-paypal', {
        user_id: +user.id,
        price
      });
      console.log(data);
      window.location.href = data.link;
    } catch (error) {
      console.log(error);
    }
  };
  const confirm = (id) => {
    handleDelete(id);
  };

  const cancel = () => {};

  const hanldeRenderItems = (item) => {
    return [
      {
        key: '1',
        label: 'Tên sân bóng',
        children: <p>{item.name_pitch}</p>
      },
      {
        key: '2',
        label: 'Giờ bắt đầu',
        children: <p>{item.time_start.slice(0, -3)}</p>
      },
      {
        key: '3',
        label: 'Giờ kết thúc',
        children: <p>{item.time_end.slice(0, -3)}</p>
      },
      {
        key: '4',
        label: 'Địa chỉ',
        children: (
          <p>{`${item.address}, ${item.name_ward}, ${item.name_district}, TP. Đà Nẵng`}</p>
        )
      },
      {
        key: '5',
        label: 'Số điện thoại',
        children: <p>{item.phone}</p>
      },
      {
        key: '6',
        label: 'Giá tiền',
        children: <p>{formatVietnameseMoney(item.total_price)}</p>
      },
      {
        key: '7',
        label: 'Trạng thái',
        children: (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Badge
              status={`${item.payment_id ? 'success' : 'error'}`}
              text={`${item.payment_id ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
            />
            {!item.payment_id && (
              <Popconfirm
                title="Huỷ lịch đặt"
                description="Bạn có chắc chắn muốn huỷ lịch đặt sân này?"
                onConfirm={() => confirm(item.id)}
                onCancel={() => cancel()}
                okText="Đồng ý"
                cancelText="Không"
              >
                <Button type="default">Huỷ</Button>
              </Popconfirm>
            )}
            {!item.payment_id && (
              <Button
                type="primary"
                onClick={() => handleProcessPaypal(item.total_price)}
              >
                Thanh toán
              </Button>
            )}
          </div>
        ),
        span: 3
      }
    ];
  };

  return (
    <UserLayout>
      <div style={{ padding: '20px' }}>
        {history.map((val, idx) => (
          <div key={idx} style={{ padding: '0 20px' }}>
            <Descriptions
              title={val.date}
              bordered
              items={hanldeRenderItems(val)}
            />
            {history.length - 1 !== idx && <Divider />}
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0'
          }}
        >
          <Pagination
            current={curPage}
            total={totalPage * 10}
            onChange={(value) => setCurPage(value)}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default History;