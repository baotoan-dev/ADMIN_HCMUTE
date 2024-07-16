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
import { ConfirmDialog, ImageList, CreatePostImages } from "components";
import BasicInformationService from "./Create/BasicInformationService";
import { ArrowLeft } from "components/Icons";
import { usePermission } from "hooks";
import imageCompression from "browser-image-compression";
import { updateServiceValidation } from "validations/Service/update";
import { validatePostImages } from "validations";
import { useNavigate } from "react-router-dom";
import { API_CONSTANT_V3 } from "constant/urlServer";
import { IoIosCreate } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";

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
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);

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
      setBasicInformation({
        ...otherData,
        price: otherData.valueOld ? otherData.valueOld : 0,
      });
      setServiceData(res.data);
      setEnabledImages(
        res.data && res.data.imageData.length > 0
          ? [
              {
                id: res.data.imageData[0].id,
                image: res.data.imageData[0].image,
              },
            ]
          : []
      );
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
    serviceSubmit.append(
      "price",
      basicInformation.price ? basicInformation.price : 0
    );
    serviceSubmit.append(
      "discount",
      basicInformation.discount ? basicInformation.discount : 0
    );
    serviceSubmit.append(
      "expiration",
      basicInformation.expiration ? basicInformation.expiration : 0
    );
    serviceSubmit.append(
      "type",
      basicInformation.type ? basicInformation.type : "V1"
    );
    serviceSubmit.append(
      "status",
      basicInformation.status ? basicInformation.status : 1
    );
    deleteImages.length > 0 &&
      deleteImages.forEach((image) =>
        serviceSubmit.append("deleteImages", image.id)
      );
    images.length > 0 &&
      images.forEach((image) => serviceSubmit.append("images", image.image));

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
        return toast.success("Update service successfully");
      }
    } catch (error) {
      return toast.error("Update service failed");
    }
  };

  // Handle remove image
  const handleRemoveImage = (image) => {
    setImages((prevState) =>
      prevState.filter((prevImage) => prevImage.preview !== image.preview)
    );
  };

  const hideCommunity = async (id, status) => {
    const res = await axios.put(
      `${API_CONSTANT_V3}/v3/service-recruitment/${id}/status/${status}`,
      {
        data: {
          status: 0,
        },
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.statusCode === 200) {
      toast.success("Hide service successfully");
      navigate("/admin/service-manager");
    } else {
      toast.error("Hide service failed");
    }
  };

  const deleteServiceManager = async () => {
    const res = await axios.delete(
      `${API_CONSTANT_V3}/v3/service-recruitment/by-admin/${id}`
    );
    
    if (res.statusCode === 200) {
      toast.success(res.message);
      navigate("/admin/service-manager");
      setShowModalConfirmDelete(false);
    } else {
      toast.error("Delete service failed");
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
          Detail service
        </Typography>
        <Link to="/admin/service-manager/create">
          <Button
            sx={{
              height: "40px",
              marginRight: "10px",
            }}
            variant="outlined"
          >
            <IoIosCreate />
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
            marginRight: "10px",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              height: "40px",
              marginRight: "10px",
            }}
            onClick={() =>
              hideCommunity(id, basicInformation?.status === 1 ? 0 : 1)
            }
          >
            {basicInformation?.status === 1 ? <FaEye /> : <FaEyeSlash />}
          </Button>
          <Button
            variant="outlined"
            sx={{
              height: "40px",
            }}
            onClick={() => {
              setShowModalConfirmDelete(true);
            }}
          >
            <MdAutoDelete/>
          </Button>
        </Box>
      </Box>

      {serviceData ? (
        <Box>
          {/* BASIC INFORMATION */}
          {/* {basicInformation !== null && ( */}
          <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Basic information
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
                  Add image
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
              Save service
            </Button>
          )}

          {/* Confirm update post dialog */}
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onClickConfirm={handleSubmitSeviceData}
            title="Update service"
            text="Are you sure?"
          />
          <ConfirmDialog
            isOpen={showModalConfirmDelete}
            onClose={() => setShowModalConfirmDelete(false)}
            onClickConfirm={() => deleteServiceManager(id, 1)}
            title="Bạn có chắc chắn muốn xóa bài đăng này?"
            text="Bài đăng sẽ không hiển thị trên trang chủ"
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
