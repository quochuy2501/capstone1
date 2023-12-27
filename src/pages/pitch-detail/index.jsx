import { useState, useEffect } from 'react';
import UserLayout from '../../components/common/user-layout';
import { Carousel, Image, Card, Button, Divider } from 'antd';
import useResponsive from '../../hooks/useResponsive';
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import { FiArrowRight } from 'react-icons/fi';
import useAxios from '../../hooks/useAxios';
import { useParams, Link } from 'react-router-dom';
import ModalBooking from '../../components/common/modal-booking';
import './index.css';

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

const IMAGES = [
  'https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg'
];

const PitchDetail = () => {
  const [pitchDetail, setPitchDetail] = useState();
  const [pitchAround, setPitchAround] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [images, setImages] = useState(IMAGES);
  const [center, setCenter] = useState();
  const { width } = useResponsive();
  const { api } = useAxios();
  const { id } = useParams();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCzbavrZ6_TjLj2Cc4s4S2F1l0a8rstg4U'
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/get-football-pitch/${id}`);
        setPitchDetail(data.football_pitch);
        setImages(data.football_pitch.image.split(','));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (pitchDetail?.id) {
      (async () => {
        try {
          const { data } = await api.get(`/get-football-pitch-around/${id}`);
          setPitchAround(data.football_pitchs);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [pitchDetail]);

  useEffect(() => {
    async function getCoordinatesFromAddress(address) {
      console.log(address, 'address');
      const encodedAddress = encodeURIComponent(address);
      const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data, 'data');
        if (Array.isArray(data) && data.length > 0) {
          const { lat, lon } = data[0];
          return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
          throw new Error('No results found for the address.');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    if (pitchDetail?.address) {
      const address = ` ${pitchDetail.address}, TP. Đà Nẵng`;
      getCoordinatesFromAddress(address).then((coordinates) => {
        setCenter({ lat: coordinates.latitude, lng: coordinates.longitude });
      });
    }
  }, [pitchDetail]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  console.log(pitchAround);
  return (
    <div>
      <UserLayout>
        <ModalBooking
          id={id}
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
        />
        <Image.PreviewGroup
          items={images}
          preview={{
            visible: isPreviewVisible,
            onVisibleChange: (visible) => setPreviewVisible(visible),
            imageRender: () => {
              return (
                <img
                  className="image"
                  alt=""
                  src={images[selectedImageIndex]}
                  style={{ width: '90%', height: '90%' }}
                />
              );
            }
          }}
          // src="https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/bltf65bc65fc205ad23/641b4e9c99cb6c0a57d664c6/Disen%CC%83o_sin_ti%CC%81tulo-9.jpg?auto=webp&format=pjpg&width=3840&quality=60"
        />
        {pitchDetail && (
          <>
            <div className="detail-pitch-container">
              <div
                style={{
                  width: width < 790 ? '50%' : '60%',
                  marginLeft: '20px',
                  fontSize: width > 790 ? '15px' : '10px'
                }}
              >
                <h1
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    color: '#1677ff',
                    fontSize: width < 790 ? '18px' : '23px'
                  }}
                >
                  {pitchDetail.name}
                </h1>
                <Carousel autoplay infinite>
                  {images.map((image, idx) => {
                    return (
                      <div key={idx}>
                        <img
                          className="image"
                          style={{ cursor: 'pointer' }}
                          src={image}
                          onClick={() => {
                            setSelectedImageIndex(idx);
                            setPreviewVisible(!isPreviewVisible);
                          }}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
              <div
                style={{
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignItems: 'start',
                  marginLeft: '20px',
                  marginTop: '75px',
                  fontSize: width < 790 ? '12px' : '15px'
                }}
              >
                <p style={{ lineHeight: '1.7' }}>
                  <FiArrowRight
                    style={{
                      width: '20px',
                      height: width < 790 ? '12px' : '15px'
                    }}
                  />
                  <strong>Địa chỉ:</strong> {pitchDetail.address},{' '}
                  {pitchDetail.name_ward}, {pitchDetail.name_district}, TP. Đà
                  Nẵng
                </p>
                <br />
                <p>
                  <FiArrowRight
                    style={{
                      width: '20px',
                      height: width < 790 ? '12px' : '15px'
                    }}
                  />
                  <strong>Giá:</strong>{' '}
                  {formatVietnameseMoney(pitchDetail.price)}
                </p>
                <br />
                <p>
                  <FiArrowRight
                    style={{
                      width: '20px',
                      height: width < 790 ? '12px' : '15px'
                    }}
                  />
                  <strong>Loại sân:</strong> {pitchDetail.name_category}
                </p>
                <Button
                  type="primary"
                  style={{ float: 'right', marginTop: '20px' }}
                  onClick={showModal}
                >
                  Đặt sân
                </Button>
              </div>
            </div>
            <div className="pitch-description">
              <Divider style={{ background: '#b8a1a0', height: '3px' }} />
              <div
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: width < 1000 ? '1fr' : '2fr 1fr',
                  marginBottom: '20px',
                  gap: '50px'
                }}
              >
                <Card
                  title="Mô tả:"
                  type="inner"
                  headStyle={{ background: '#1677ff', color: 'white' }}
                  style={{ borderWidth: '2px' }}
                >
                  <div style={{ padding: '20px 0' }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: pitchDetail.describe }}
                    />
                  </div>
                  {isLoaded ? (
                    <GoogleMap
                      center={center}
                      zoom={15}
                      mapContainerStyle={{ width: '100%', height: '500px' }}
                    >
                      <MarkerF position={center} />
                    </GoogleMap>
                  ) : (
                    <></>
                  )}
                </Card>
                <div>
                  <Card
                    title="Sân gần đây:"
                    type="inner"
                    headStyle={{ background: '#1677ff', color: 'white' }}
                    style={{
                      borderWidth: '2px'
                    }}
                  >
                    {pitchAround.length > 0 ? (
                      pitchAround.slice(0, 3).map((pitch) => {
                        return (
                          <Link key={pitch.id} to={`/pitch-detail/${pitch.id}`}>
                            <Card
                              style={{
                                width: '100%',
                                marginBottom: '20px',
                                cursor: 'pointer'
                              }}
                              cover={
                                <img
                                  style={{
                                    height: '150px',
                                    objectFit: 'cover'
                                  }}
                                  alt="example"
                                  src={pitch.image.split(',')[0]}
                                />
                              }
                            >
                              <h3 style={{ color: 'rgb(22, 119, 255)' }}>
                                {pitch.name}
                              </h3>
                              <p style={{ margin: '7px 0' }}>
                                <strong>Địa chỉ:</strong> {pitch.address}
                              </p>
                              <p>
                                <strong>Giá:</strong>{' '}
                                {formatVietnameseMoney(pitch.price)}
                              </p>
                            </Card>
                          </Link>
                        );
                      })
                    ) : (
                      <p>Không có thông tin về các sân gần địa điểm này</p>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}
      </UserLayout>
    </div>
  );
};

export default PitchDetail;