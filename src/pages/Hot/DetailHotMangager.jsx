import { useState, useEffect } from "react";
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
  HotBasicInformation,
  ImageList,
} from "components";
import { ArrowLeft } from "components/Icons";
import { usePermission } from "hooks";
import imageCompression from "browser-image-compression";
import { validatePostImages } from "validations";
import { API_CONSTANT_V3 } from "constant/urlServer";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const DetailHotMangager = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [postData, setPostData] = useState();
  const [basicInformation, setBasicInformation] = useState(null);
  const [enabledImages, setEnabledImages] = useState([]);
  const [enabledLogo, setEnabledLogo] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [logoData, setLogoData] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [images, setImages] = useState([]);
  const [check, setCheck] = useState(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);

  const handleOnChangeImages = async (e) => {
    const imagesUpload = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 840,
    };

    const imagesToCheck = imagesUpload;

    if (imagesUpload.length > 1) {
      return toast.warn("Chỉ được chọn tối đa 1 ảnh");
    }

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

          setImageData(compressedImages);

          setEnabledImages((prevState) => [
            ...prevState,
            ...compressedImages.map((image) => ({
              image: window.URL.createObjectURL(image),
            })),
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleOnChangeLogo = async (e) => {
    const imagesUpload = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 840,
    };

    const imagesToCheck = imagesUpload;

    if (imagesUpload.length > 1) {
      return toast.warn("Chỉ được chọn tối đa 1 ảnh");
    }

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

          setLogoData(compressedImages);

          setEnabledLogo((prevState) => [
            ...prevState,
            ...compressedImages.map((image) => ({
              image: window.URL.createObjectURL(image),
            })),
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const fetchThemeData = async (id) => {
    const res = await axios.get(`${API_CONSTANT_V3}/v3/theme-companies/${id}`);

    if (res && res.statusCode === 200) {
      const { image, ...otherData } = res.data;
      setBasicInformation(otherData);
      setPostData(res.data);
      setEnabledLogo(
        res.data.logo
          ? [
              {
                image: res.data.logo,
              },
            ]
          : []
      );
      setEnabledImages(
        res.data.image
          ? [
              {
                image: res.data.image,
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
      fetchThemeData(id);
    }
  }, [check]);

  // HANDLE DISABLE PHOTO
  const handleDisableImage = () => {
    setEnabledImages([]);
  };

  const handleDisableLogo = () => {
    setEnabledLogo([]);
  };

  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);

    const data = {
      name: basicInformation.name.trim(),
      description: basicInformation.description.trim(),
      link: basicInformation.link.trim(),
      nameButton: basicInformation.nameButton.trim(),
      status: basicInformation.status,
    };

    const themeSubmit = new FormData();
    themeSubmit.append("name", data.name);
    themeSubmit.append("description", data.description);
    themeSubmit.append("link", data.link);
    themeSubmit.append("nameButton", data.nameButton);

    if (logoData.length > 0) {
      themeSubmit.append("logoData", logoData[0]);
    }

    if (imageData.length > 0) {
      themeSubmit.append("imageData", imageData[0]);
    }

    if (enabledImages.length === 0 && imageData.length === 0) {
      return toast.error("Chưa có ảnh");
    }

    if (enabledLogo.length === 0 && logoData.length === 0) {
      return toast.error("Chưa có logo");
    }

    if (
      data.name === "" ||
      data.link === "" ||
      data.nameButton === "" ||
      data.description === ""
    ) {
      return toast.error("Chưa điền đủ thông tin");
    }
    // GET RESPONSE
    try {
      await axios.put(
        `${API_CONSTANT_V3}/v3/theme-companies/by-admin/${id}`,
        themeSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCheck(!check);
      setImages([]);
      fetchThemeData(id);
      return toast.success("Cập nhật bìa thành công");
    } catch (error) {
      return toast.error("Cập nhật bìa thất bại");
    }
  };

  const updateStatusTheme = async (id, status) => {
    const res = await axios.put(
      `${API_CONSTANT_V3}/v3/theme-companies/by-admin/status/${id}`,
      {
        status,
      }
    );

    if (res.statusCode === 200) {
      toast.success("Cập nhật bìa đăng thành công");
      fetchThemeData(id);
      setLogoData([]);
      setImageData([]);
    } else {
      fetchThemeData(id);
      setLogoData([]);
      setImageData([]);
      toast.error("Cập nhật bìa đăng thất bại");
    }
  };

  const deleteTheme = async (id) => {
    try {
      const res = await axios.delete(
        `${API_CONSTANT_V3}/v3/theme-companies/by-admin/${id}`
      );

      if (res.statusCode === 200) {
        toast.success(res.message)
        window.history.back();
      }

      else {
        toast.error("Thất bại");  
      }
    } catch (error) { 
      throw error;
    }
  }
    

  return (
    <Box sx={{ padding: "1rem" }}>
      {role === "2" && (
        <Tooltip title="Quay trở lại danh sách">
          <Link to="/admin/community-manager">
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
          Detail Hot Company
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Button
          sx={{
            height: "40px",
            marginRight: "1rem",
          }}
          variant="outlined"
          onClick={() =>
            updateStatusTheme(id, basicInformation?.status ? 0 : 1)
          }
        >
          {basicInformation?.status ? <FaEye /> : <FaEyeSlash />}
        </Button>
        <Button
          sx={{
            height: "40px",
          }}
          variant="outlined"
          onClick={() =>
            setShowModalConfirmDelete(true)
          }
        >
          <MdDelete />
        </Button>
      </Box>
      {postData ? (
        <Box>
          {/* BASIC INFORMATION */}
          {/* {basicInformation !== null && ( */}
          <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Thông tin bài viết
            </Typography>
            <HotBasicInformation
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
                  Logo
                </Typography>
                <ImageList
                  images={enabledLogo}
                  handleOnClick={handleDisableLogo}
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
                  disabled={enabledLogo.length >= 1}
                >
                  Thêm logo
                  <input
                    type="file"
                    name="images"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleOnChangeLogo(e)}
                    multiple
                  />
                </Button>
              </Box>
            </Box>
          )}

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
                  disabled={enabledImages.length >= 1}
                >
                  Thêm hình ảnh
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
            onClickConfirm={handleSubmitPostData}
            title="Cập nhật bìa"
            text="Bạn có chắc chắn muốn cập nhật bìa này không?"
          />
          <ConfirmDialog
            isOpen={showModalConfirmDelete}
            onClose={() => setShowModalConfirmDelete(false)}
            onClickConfirm={() => deleteTheme(id)}
            title="Xóa bài viết"
            text="Bạn có chắc chắn muốn xóa bài viết này không?"
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

export default DetailHotMangager;
