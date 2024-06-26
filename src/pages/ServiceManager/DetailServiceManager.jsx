import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Stack,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";

import { axios } from "configs";
import {
  ConfirmDialog,
  ImageList,
  CreatePostImages,
} from "components";
import BasicInformationService from "./Create/BasicInformationService";
import { ArrowLeft } from "components/Icons";
import { usePermission } from "hooks";
import imageCompression from "browser-image-compression";
import { updateServiceValidation } from "validations/Service/update";
import { validatePostImages } from "validations";
import { useNavigate } from "react-router-dom";
import { API_CONSTANT_V3 } from "constant/urlServer";

const ServiceDetail = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [serviceData, setServiceData] = useState();
  const [basicInformation, setBasicInformation] = useState(null);
  const [enabledImages, setEnabledImages] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteImages, setDeleteImages] = useState([]);
  const [images, setImages] = useState([]);
  const [check, setCheck] = useState(false);

  const handleOnChangeImages = async (e) => {

    const imagesUpload = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 840,
    };

    const imagesToCheck =
      images.length + imagesUpload.length > 5
        ? imagesUpload.slice(0, 5 - images.length)
        : imagesUpload;

    if (imagesToCheck.length > 0) {
      const validateImagesReply = validatePostImages(imagesToCheck);
      if (validateImagesReply.isError) {
        console.log("::: Invalid images");
        return toast.warn("Ảnh không đúng định dạng");
      } else {
        try {
          const compressedImages = [];
          await Promise.all(
            imagesToCheck.map(async (image) => {
              const compressedImage = await imageCompression(image, options);
              compressedImages.push(
                new File([compressedImage], compressedImage.name, {
                  type: compressedImage.type,
                })
              );
            })
          );

          setImages((prevState) => [
            ...prevState,
            ...compressedImages.map((image) => ({
              image,
              preview: window.URL.createObjectURL(image),
            })),
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // GET POST DATA
  const fetchPostData = async (id) => {
    const res = await axios.get(
      `${API_CONSTANT_V3}/v3/service-recruitment/${id}`
    );

    if (res.status === 200) {
      const { image, ...otherData } = res.data;
      setBasicInformation(otherData);
      setServiceData(res.data);
      setEnabledImages(res.data && res.data.imageData.length > 0 ? [{
        image: res.data.imageData[0].image,
      }] : []);
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchPostData(id);
    }
  }, [check, id]);

  // HANDLE DISABLE PHOTO
  const handleDisableImage = useCallback(
    (image) => {
      let newDeleteImage = [...deleteImages];
      newDeleteImage.push(image);

      setDeleteImages(newDeleteImage);

      setEnabledImages((prevState) =>
        prevState.filter(
          (prevStateImage) => prevStateImage.image !== image.image
        )
      );
    },
    [deleteImages]
  );

  // HANDLE SUBMIT
  const handleSubmitSeviceData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);

    const data = {
      name: basicInformation.name.trim(),
      description: basicInformation.description.trim(),
      price: basicInformation.price ? basicInformation.price : 0,
      discount: basicInformation.discount ? basicInformation.discount : 0,
      expiration: basicInformation.expire ? basicInformation.expire : 0,
    };

    const serviceSubmit = new FormData();
    serviceSubmit.append("name", basicInformation.name.trim());
    serviceSubmit.append("description", basicInformation.description.trim());
    serviceSubmit.append("price", basicInformation.price ? basicInformation.price : 0);
    serviceSubmit.append("discount", basicInformation.discount ? basicInformation.discount : 0);
    serviceSubmit.append("expiration", basicInformation.expiration ? basicInformation.expiration : 0);
    serviceSubmit.append("type", basicInformation.type ? basicInformation.type : 'V1');
    serviceSubmit.append("status", basicInformation.status ? basicInformation.status : 1);
    serviceSubmit.append("deleteImages", deleteImages);

    images.length > 0 && images.forEach((image) => serviceSubmit.append("images", image.image));

    // VALIDATION
    const validationRes = updateServiceValidation(data);

    if (validationRes.isError) {
      return toast.warn(validationRes.message);
    }

    // GET RESPONSE
    try {
      const res = await axios.put(
        `${API_CONSTANT_V3}/v3/service-recruitment/${id}`,
        serviceSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res && res.statusCode) {
        setCheck(!check);
        setImages([]);
        return toast.success("Cập nhật dịch vụ thành công");
      }
    } catch (error) {
      return toast.error("Cập nhật dịch vụ thất bại");
    }
  };

  // Handle remove image
  const handleRemoveImage = (image) => {
    setImages((prevState) =>
      prevState.filter((prevImage) => prevImage.preview !== image.preview)
    );
  };

  const hideCommunity = async (id, status) => {
    const res = await axios.put(`${API_CONSTANT_V3}/v3/service-recruitment/${id}/status/${status}`, {
      data: {
        status: 0
      }
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (res.statusCode === 200) {
      toast.success("Ẩn dịch vụ thành công")
      navigate('/admin/service-manager')
    }
    else {
      toast.error('Ẩn dịch vụ thất bại')
    }
  }

  return (
    <Box sx={{ padding: "1rem" }}>
      {role === "2" && (
        <Tooltip title="Quay trở lại danh sách">
          <Link to="/admin/service-manager">
            <IconButton>
              <ArrowLeft />
            </IconButton>
          </Link>
        </Tooltip>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h2" color={theme.palette.color.main}>
          Chi tiết dịch vụ
        </Typography>

        <Link to="/admin/community-create">
          <Button variant="outlined">Tạo dịch vụ</Button>
        </Link>
      </Box>

      <Box sx={
        {
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
        }
      }>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
            marginRight: "10px",
          }}
        >
          <Button variant="outlined" onClick={() => hideCommunity(id, basicInformation?.status === 1 ? 0 : 1)}>
            {basicInformation?.status === 1 ? 'Ẩn dịch vụ' : 'Hiện dịch vụ'}
          </Button>
        </Box>
      </Box>

      {serviceData ? (
        <Box>
          {/* BASIC INFORMATION */}
          {/* {basicInformation !== null && ( */}
          <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Thông tin bài viết
            </Typography>
            <BasicInformationService
              basicInformation={basicInformation}
              setBasicInformation={setBasicInformation}
            />
          </Box>
          {/* )} */}

          {/* Images */}
          {role === "1" && (
            <>
              {/* ENABLED PHOTOS */}
              <Box p="2rem 0">
                <Typography
                  mb="2rem"
                  variant="h3"
                  color={theme.palette.color.main}
                >
                  Hình ảnh
                </Typography>
                <ImageList
                  images={enabledImages}
                  handleOnClick={handleDisableImage}
                />
              </Box>
            </>
          )}

          {role === "1" && (
            <Box p="2rem 0">
              <Box mt="2rem">
                <Button
                  variant="outlined"
                  component="label"
                  disabled={enabledImages.length + images.length === 5}
                >
                  Thêm ảnh
                  <input
                    type="file"
                    name="images"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleOnChangeImages(e)}
                    multiple
                  />
                </Button>
              </Box>

              <Box>
                <CreatePostImages
                  images={images}
                  handleRemoveImage={handleRemoveImage}
                />
              </Box>
            </Box>
          )}

          {/* SUBMIT BUTTON */}
          {(role === "1" || role === "2") && (
            <Button
              sx={{ marginTop: "1rem" }}
              variant="outlined"
              onClick={() => setShowConfirmModal(true)}
            >
              Lưu
            </Button>
          )}

          {/* Confirm update post dialog */}
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onClickConfirm={handleSubmitSeviceData}
            title="Cập nhật thông tin dịch vụ"
            text="Bạn đã chắc chắn với thông tin đã chỉnh sửa?"
          />
        </Box>
      ) : (
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      )}
    </Box>
  );
};

export default ServiceDetail;
