import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  TimePicker,
  Spin,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useAxios from "../../../../../hooks/useAxios";
import Editor from "../../../../common/editor";
import dayjs from "dayjs";

const { RangePicker } = TimePicker;

const initialOpens = [
  {
    id: 'Mon',
    value: 'close',
    label: 'Thứ hai',
    startTime: null,
    endTime: null
  },
  {
    id: 'Tue',
    value: 'close',
    label: 'Thứ ba',
    startTime: null,
    endTime: null
  },
  {
    id: 'Wed',
    value: 'close',
    label: 'Thứ tư',
    startTime: null,
    endTime: null
  },
  {
    id: 'Thu',
    value: 'close',
    label: 'Thứ năm',
    startTime: null,
    endTime: null
  },
  {
    id: 'Fri',
    value: 'close',
    label: 'Thứ sáu',
    startTime: null,
    endTime: null
  },
  {
    id: 'Sat',
    value: 'close',
    label: 'Thứ bảy',
    startTime: null,
    endTime: null
  },
  {
    id: 'Sun',
    value: 'close',
    label: 'Chủ nhật',
    startTime: null,
    endTime: null
  }
];

const CreateField = ({
  editMode,
  currentFieldId,
  currentField,
  setIsModalOpen,
  getFootballFields,
  setSelectedKey,
  openNotification,
}) => {
  const [fieldName, setFieldName] = useState(currentField?.name || "");
  const [price, setPrice] = useState(currentField?.price || "");
  const [description, setDescription] = useState(currentField?.describe || "");
  const [opens, setOpens] = useState(
    currentField?.detailed_schedule || initialOpens
  );
  const [indexForRangePicker, setIndexForRangePicker] = useState(0);
  const [category, setCategory] = useState(currentField?.id_category || 1);
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState(
    editMode
      ? currentField?.image.map((img) => {
          return {
            url: img,
          };
        })
      : []
  );
  const [loading, setLoading] = useState(false);

  const { api } = useAxios();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/get-category");
        setCategories(
          data.categories.map((d) => {
            return {
              value: d.id,
              label: d.name_category,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [api]);

  const onFinish = async () => {
    const formData = new FormData();
    formData.append("id", currentField?.id || null);
    formData.append("name", fieldName);
    fileList.forEach((file, idx) => {
      formData.append(`image_${idx}`, file.url || file.originFileObj);
    });
    formData.append("price", price);
    formData.append("detailed_schedule", JSON.stringify(opens));
    formData.append("describe", description);
    formData.append("id_category", category);

    try {
      await api.post(
        `/owner/football-pitch/${editMode ? "update" : "create"}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      openNotification(
        "Thành công",
        `${editMode ? "Chỉnh sửa" : "Tạo"} sân bóng thành công!`
      );
      if (!editMode) {
        setSelectedKey(["2"]);
      }
      setIsModalOpen(false);
      getFootballFields();
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleFileChange = async ({ fileList }) => {
    setFileList(fileList);
  };

  const handleOpenDateChange = (value, { id }) => {
    const newOpens = [...opens];
    const index = newOpens.findIndex((val) => val.id === id);
    if (value === "open") {
      newOpens[index].value = value;
      newOpens[index].startTime = "7:0";
      newOpens[index].endTime = "22:0";
    } else {
      newOpens[index].value = value;
      newOpens[index].startTime = null;
      newOpens[index].endTime = null;
    }
    setOpens(newOpens);
  };

   const handleOpenTimeChange = (_, timeString) => {
    const [startTime, endTime] = timeString;
    const startHour = +startTime.split(':')[0];
    const startMin = startTime.split(':')[1];
    const endHour = endTime.split(':')[0];
    const endMin = endTime.split(':')[1];

    const newOpens = [...opens];
    const index = newOpens.findIndex((val) => val.id === indexForRangePicker);

    newOpens[index].startTime = `${
      startHour < 10 ? '0' + startHour : startHour
    }:${startMin}`;

    newOpens[index].endTime = `${
      endHour < 10 ? '0' + endHour : endHour
    }:${endMin}`;

    setOpens(newOpens);
  };

  const handleDeleteField = async () => {
    try {
      await api.get(`/owner/football-pitch/destroy/${currentFieldId}`);
      openNotification("Thành công", "Xoá sân bóng thành công!");
      setIsModalOpen(false);
      getFootballFields();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          style={{
            display: "grid",
            gridTemplateColumns: editMode ? "450px" : "450px 450px",
            gap: "20px",
            padding: "20px",
          }}
        >
          <Form.Item
            label="Tên sân"
            name="fieldname"
            initialValue={fieldName}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập vào tên sân bóng!",
              },
              {
                pattern: "^[^!@#$%^&*()]+$",
                message: "Tên sân bóng không được chứa số và ký tự đặc biêt!",
              },
            ]}
          >
            <Input
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Loại sân"
            name="category"
            initialValue={category}
            rules={[
              {
                required: true,
                message: "Vui lòng loại sân bóng!",
              },
            ]}
          >
            <Select
              value={category}
              onChange={(value) => setCategory(value)}
              options={categories}
            />
          </Form.Item>

          <Form.Item
            label="Giá tiền một giờ (VNĐ)"
            name="price"
            initialValue={price}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập vào giá tiền!",
              },
            ]}
          >
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="pictures"
            initialValue={fileList}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ảnh sân bóng!",
              },
            ]}
          >
            <Upload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileChange}
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            initialValue={description}
            // rules={[
            //   {
            //     required: true,
            //     message: "Vui lòng nhập vào mô tả sân bóng!",
            //   },
            // ]}
            style={{ gridColumn: editMode ? "" : "1/3" }}
          >
            <Editor
              value={description}
              onBlur={(value) => setDescription(value)}
            />
          </Form.Item>

          {opens.map((val) => {
            return (
              <div key={val.id}>
                <h4 style={{ margin: "15px 0 10px 0" }}>{val.label}:</h4>
                <Select
                  onChange={handleOpenDateChange}
                  style={{
                    width: val.value === "open" ? "34%" : "100%",
                    marginBottom: "10px",
                  }}
                  value={val.value}
                  name={val.id}
                  options={[
                    {
                      value: "open",
                      label: "Mở",
                      id: val.id,
                    },
                    {
                      value: "close",
                      label: "Đóng",
                      id: val.id,
                    },
                  ]}
                />
                {val.value === "open" && (
                  <RangePicker
                    disabled={val.value === "close" ? true : false}
                    style={{ marginLeft: "20px" }}
                    format="H:mm"
                    hideDisabledOptions={true}
                    onChange={handleOpenTimeChange}
                    onClick={() => setIndexForRangePicker(val.id)}
                    value={
                      val.startTime && val.endTime
                        ? [
                            dayjs(val.startTime, "HH:mm"),
                            dayjs(val.endTime, "HH:mm"),
                          ]
                        : []
                    }
                    disabledTime={() => {
                      return {
                        disabledMinutes: () =>
                          Array.from(
                            { length: 61 },
                            (_, index) => index
                          ).filter((val) => val !== 30 && val !== 0),
                      };
                    }}
                  />
                )}
              </div>
            );
          })}
          <div
            style={{
              width: "99%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Space size="middle">
              {editMode && (
                <Button
                  style={{ marginTop: "20px" }}
                  onClick={handleDeleteField}
                >
                  Xoá sân
                </Button>
              )}
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: "20px" }}
              >
                {editMode ? "Chỉnh sửa" : "Tạo sân"}
              </Button>
            </Space>
          </div>
        </Form>
      )}
    </>
  );
};

export default CreateField;