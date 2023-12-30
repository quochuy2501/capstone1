import { Layout, Dropdown, Avatar } from 'antd';
import { forgetCookie } from '../../../configs/cookie';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const headerStyle = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#001529'
};

const UserLayout = ({ children }) => {
  const { user, setUser } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    forgetCookie('access_token');
    setUser({ id: '', role: '', address: '' });
  };

  const items = [
    {
      key: '1',
      label: (
        <a
          // rel="noopener noreferrer"
          // role="button"
          onClick={() => navigate('/history')}
        >
          Lịch sử thanh toán
        </a>
      )
    },
    {
      key: '2',
      label: (
        <a
          // rel="noopener noreferrer"
          // role="button"
          onClick={() => navigate('/booked-schedule')}
        >
          Lịch đặt sân
        </a>
      )
    },
    {
      key: '3',
      label: (
        <a rel="noopener noreferrer" role="button" onClick={handleLogout}>
          Đăng xuất
        </a>
      )
    }
  ];

  return (
    <Layout style={{ height: '100vh', overflowY: 'scroll' }}>
      <Header style={headerStyle}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img
            style={{
              marginTop: '7px',
              width: '60px',
              height: '50px',
              borderRadius: '50%'
            }}
            src="https://makan.vn/wp-content/uploads/2022/11/logo-da-banh-vector-1.jpg"
          />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Dropdown
            menu={{
              items
            }}
          >
            <Avatar
              style={{
                backgroundColor: '#1677ff',
                verticalAlign: 'middle',
                marginTop: '10px',
                cursor: 'default'
              }}
              size="large"
            >
              {user.fullName.slice(0, 1).toUpperCase()}
            </Avatar>
          </Dropdown>
        </div>
      </Header>
      {children}
    </Layout>
  );
};

export default UserLayout;