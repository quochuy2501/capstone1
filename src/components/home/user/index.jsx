import { useState, useEffect } from 'react';
import { Input, Select, Button, Pagination, DatePicker, Empty } from 'antd';
import Card from '../../common/card';
import UserLayout from '../../common/user-layout';
import useAxios from '../../../hooks/useAxios';
import useResponsive from '../../../hooks/useResponsive';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import './style.css';

const User = () => {
  const [footballFields, setFootballFields] = useState([]);
  const [fieldName, setFieldName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [category, setCategory] = useState(0);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(0);
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(null);

  const { width } = useResponsive();
  const { api } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/get-districts');
        const _data = data.districts.map((d) => {
          return {
            value: d.id,
            label: d.name_district
          };
        });
        _data.unshift({ value: 0, label: 'Tất cả' });
        setDistricts(_data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedDistrict === '') return;
    (async () => {
      try {
        const { data } = await api.get(`/get-wards/${selectedDistrict}`);
        const _wards = data.wards.map((d) => {
          return {
            value: d.id,
            label: d.name_ward
          };
        });
        setWards(_wards);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedDistrict]);

  useEffect(() => {
    getFootballField(currentPage);
  }, [currentPage]);

  const getFootballField = async (_currentPage) => {
    try {
      const { data } = await api.post(
        `/get-football-pitch?page=${_currentPage}`,
        {
          id_category: category,
          name: fieldName,
          id_district: selectedDistrict,
          id_ward: selectedWard,
          price,
          date
        }
      );
      setFootballFields(data.football_pitchs.data);
      setCurrentPage(data.football_pitchs.current_page);
      setTotalPage(data.football_pitchs.last_page);
    } catch (error) {
      if (
        error.response.data.error ===
        'There are no football pitches in the system'
      ) {
        setFootballFields(null);
        setCurrentPage(1);
        setTotalPage(null);
      }
    }
  };

  const handleChangeCategory = (value) => {
    setCategory(value);
    setCurrentPage(1);
    setTotalPage(null);
  };

  const handleChangePrice = (value) => {
    setPrice(value);
    setCurrentPage(1);
    setTotalPage(null);
  };

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  const handleResetFilter = () => {
    setFieldName('');
    setDate(null);
    setSelectedDistrict(0);
    setSelectedWard(null);
    setPrice(0);
    setCategory(0);
  };

  const handleFilter = () => {
    getFootballField(currentPage);
  };

  const handleDateChange = (date) => {
    if (date) {
      setDate(String(date.$d));
    } else {
      setDate(null);
    }
    setCurrentPage(1);
    setTotalPage(null);
  };
  console.log(date);
  return (
    <UserLayout>
      <h2>TÌM KIẾM SÂN BÓNG: </h2>
      <div className="filter-wrapper">
        <div>
          <h4>Tên sân: </h4>
          <Input
            value={fieldName}
            onChange={(event) => {
              setFieldName(event.target.value);
              setCurrentPage(1);
              setTotalPage(null);
            }}
          />
        </div>
        <div>
          <h4>Quận/ Huyện: </h4>
          <Select
            style={{
              width: '100%'
            }}
            value={selectedDistrict}
            onChange={(value) => {
              setSelectedDistrict(value);
              setCurrentPage(1);
              setTotalPage(null);
            }}
            options={districts}
          />
        </div>
        <div>
          <h4>Phường: </h4>
          <Select
            style={{
              width: '100%'
            }}
            value={selectedWard}
            onChange={(value) => {
              setSelectedWard(value);
              setCurrentPage(1);
              setTotalPage(null);
            }}
            options={wards}
            disabled={Boolean(!selectedDistrict)}
          />
        </div>
        <div>
          <h4>Giá (một giờ): </h4>
          <Select
            value={price}
            style={{
              width: '100%'
            }}
            onChange={handleChangePrice}
            options={[
              {
                value: 0,
                label: 'Tất cả'
              },
              {
                value: 1,
                label: 'Nhỏ hơn 200'
              },
              {
                value: 2,
                label: '200 - 400'
              },
              {
                value: 3,
                label: 'Lớn hơn 400'
              }
            ]}
          />
        </div>
        <div>
          <h4>Loại sân: </h4>
          <Select
            value={category}
            style={{
              width: '100%'
            }}
            onChange={handleChangeCategory}
            options={[
              {
                value: 0,
                label: 'Tất cả'
              },
              {
                value: 1,
                label: 'Sân 5'
              },
              {
                value: 2,
                label: 'Sân 7'
              },
              {
                value: 3,
                label: 'Sân 11'
              }
            ]}
          />
        </div>
        <div>
          <h4>Ngày: </h4>
          <DatePicker
            style={{
              width: '100%'
            }}
            value={date ? dayjs(date) : null}
            onChange={handleDateChange}
            placeholder="Chọn ngày"
          />
        </div>
        <div></div>
        <div></div>
        <div>
          <h4 style={{ opacity: 0 }}>...</h4>
          <Button
            type="primary"
            style={{ width: '40%', marginRight: '15px' }}
            onClick={handleFilter}
          >
            {width > 1396 ? 'Tìm kiếm' : <SearchOutlined />}
          </Button>
          <Button
            style={{
              width: '40%'
            }}
            onClick={handleResetFilter}
          >
            {width > 1396 ? 'Xoá bộ lọc' : <ReloadOutlined />}
          </Button>
        </div>
      </div>
      <h2>SÂN BÓNG ĐÁ: </h2>
      <div className="results-wrapper">
        {!footballFields ? (
          <>
            <Empty
              description={
                <p>Không có sân bóng phù hợp với kết quả tìm kiếm</p>
              }
            />
          </>
        ) : (
          footballFields.map((field, idx) => {
            return <Card field={field} key={idx} />;
          })
        )}
      </div>
      {footballFields && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px'
          }}
        >
          <Pagination
            current={currentPage}
            total={totalPage * 10}
            onChange={handlePageChange}
          />
        </div>
      )}
    </UserLayout>
  );
};
export default User;