import { useEffect, useState } from 'react';
import UserLayout from '../../components/common/user-layout';
import { Button } from 'antd';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
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

const ConfirmPayment = () => {
  const [bookingInfo, setBookingInfo] = useState();
  const { user } = useGlobalContext();
  const { api } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/get-schedule-ordered');
        setBookingInfo(data.schedule);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handlePayment = async () => {
    try {
      const { data } = await api.post('/process-paypal', {
        user_id: user.id,
        price: bookingInfo.total_price
      });
      window.location.href = data.link;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserLayout>
      {bookingInfo && (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%',
              height: '50vh',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src="https://news.nganluong.vn/wp-content/uploads/6-hinh-thuc-thanh-toan-truc-tuyen-o-viet-nam3.jpg"
              alt=""
              style={{ width: '200px', height: '150px' }}
            />
            <h1>Xác nhận thanh toán</h1>
            <p style={{ textAlign: 'center' }}>
              Quý khách vui lòng kiểm tra lại thông tin thanh toán một lần nữa
              để Dịch vụ Paypal có thể gửi chính xác giao dịch tới Quý khách!
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '20px'
              }}
            >
              <p style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Tên sân:</span>{' '}
                {bookingInfo.name_pitch}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Giờ bắt đầu:</span>{' '}
                {bookingInfo.time_start.slice(0, -3)}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Giá:</span>{' '}
                {formatVietnameseMoney(bookingInfo.total_price)}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Giờ kết thúc:</span>{' '}
                {bookingInfo.time_end.slice(0, -3)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
              <Button type="primary" onClick={() => handlePayment()}>
                Tiến hành thanh toán
              </Button>
            </div>
          </div>
        </>
      )}
    </UserLayout>
  );
};

export default ConfirmPayment;