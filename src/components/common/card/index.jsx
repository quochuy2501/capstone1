import { Typography, Button, Badge  } from "antd";
const { Title, Paragraph } = Typography;
import "./style.css";

const CATEGORY = {
  1: { text: "Sân 5", color: "cyan" },
  2: { text: "Sân 7", color: "geekblue" },
  3: { text: "Sân 11", color: "magenta" },
}; 

const Card = ({ field }) => {
  const { image, describe, price, name, id_category } = field;

  function formatVietnameseMoney(number) {
    // Chuyển đổi số thành chuỗi và loại bỏ dấu phẩy nếu có
    const numberString = number.toString().replace(/,/g, "");
    // Kiểm tra nếu số không hợp lệ hoặc không phải là một số
    if (isNaN(numberString) || numberString === "") {
      return "Invalid number";
    }
    // Định dạng số tiền theo quy tắc 3 chữ số một nhóm, phân cách bằng dấu phẩy
    const formattedNumber = parseFloat(numberString).toLocaleString("vi-VN");
    // Thêm đơn vị tiền tệ (đồng)
    return formattedNumber + " đồng";
  }

  return (
    <Badge.Ribbon
      text={CATEGORY[id_category].text}
      color={CATEGORY[id_category].color}
    >
      <div className="card-container" style={{ width: "100%" }}>
        <div className="image-wrapper">
          <img src={image} alt="hinh_san_bong" style={{ height: "200px" }} />
        </div>
        <div className="desc-wrapper">
          <Title level={3} style={{ color: "#1677ff" }}>
            {name}
          </Title>
          <Paragraph>
            <strong>Địa chỉ:</strong> 03 Quang Trung, Hải Châu, Đà Nẵng
          </Paragraph>
          <Paragraph>
            <strong>Mô tả:</strong> {describe.slice(0, 60)}...
          </Paragraph>
          <Paragraph>
            <strong>Giá:</strong> {formatVietnameseMoney(price)}
          </Paragraph>
          <div className="btn-wrapper">
            <Button type="primary">Đặt sân</Button>
            <Button>Xem chi tiết</Button>
          </div>
        </div>
      </div>
    </Badge.Ribbon>
  );
};

export default Card;
