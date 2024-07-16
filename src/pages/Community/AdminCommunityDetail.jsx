import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  CommunityBasicInformation,
  ImageList,
  CreatePostImages,
} from "components";
import { ArrowLeft } from "components/Icons";
import { usePermission } from "hooks";
import imageCompression from "browser-image-compression";
import updateCommunityValidation from "validations/Community/update";
import { validatePostImages } from "validations";
import { API_CONSTANT_V3 } from "constant/urlServer";
import { MdAutoDelete } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";

const CommunityDetail = () => {
  usePermission();
  const navigate = useNavigate();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [postData, setPostData] = useState();
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
      `${API_CONSTANT_V3}/v3/communications/detail/${id}`
    );

    if (res.status === 200) {
      const { image, ...otherData } = res.data;

      setBasicInformation(otherData);
      setPostData(res.data);
      setEnabledImages(res.data.image);
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchPostData(id);
    }
  }, [check]);

  // HANDLE DISABLE PHOTO
  const handleDisableImage = useCallback(
    (image) => {
      let newDeleteImage = [...deleteImages];
      newDeleteImage.push(image.id);

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
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);

    const data = {
      title: basicInformation.title.trim(),
      content: basicInformation.content.trim(),
    };

    const communitySubmit = new FormData();
    communitySubmit.append("title", basicInformation.title.trim());
    communitySubmit.append("content", basicInformation.content.trim());

    images.forEach((image) => communitySubmit.append("images", image.image));
    deleteImages.forEach((image) =>
      communitySubmit.append("deleteImages", image)
    );

    // communitySubmit.append('deleteImages', deleteImages)

    // VALIDATION
    const validationRes = updateCommunityValidation(data);

    if (validationRes.isError) {
      return toast.warn(validationRes.message);
    }

    // GET RESPONSE
    try {
      await axios.put(
        `${API_CONSTANT_V3}/v3/communications/by-admin/${id}`,
        communitySubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCheck(!check);
      setImages([]);
      return toast.success("Cập nhật bài đăng thành công");
    } catch (error) {
      return toast.error("Cập nhật bài đăng thất bại");
    }
  };

  // Handle remove image
  const handleRemoveImage = (image) => {
    setImages((prevState) =>
      prevState.filter((prevImage) => prevImage.preview !== image.preview)
    );
  };

  const deleteCommunity = async (id) => {
    const res = await axios.delete(
      `${API_CONSTANT_V3}/v3/communications/action/by-admin/${id}`
    );

    if (res.statusCode === 200) {
      toast.success(res.message);
      navigate('/admin/community-manager');
    } else {
      toast.error("Xoá bài thất bại");
    }
  };

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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h2" color={theme.palette.color.main}>
            Post Details
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Link to="/admin/community-create">
            <Button sx={{
              marginRight: "10px"
            }} variant="outlined">
              <IoIosCreate />
            </Button>
          </Link>
          <Button variant="outlined" onClick={() => {
            setShowModalConfirmDelete(true);
          }}>
            <MdAutoDelete />
          </Button>
        </Box>
      </Box>

      {postData ? (
        <Box>
          {/* BASIC INFORMATION */}
          {/* {basicInformation !== null && ( */}
          <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Thông tin bài viết
            </Typography>
            <CommunityBasicInformation
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
            onClickConfirm={handleSubmitPostData}
            title="Cập nhật thông tin bài đăng"
            text="Bạn đã chắc chắn với thông tin đã chỉnh sửa?"
          />
          <ConfirmDialog  
            isOpen={showModalConfirmDelete}
            onClose={() => setShowModalConfirmDelete(false)}
            onClickConfirm={() => deleteCommunity(id)}
            title="Xác nhận xoá bài viết"
            text="Bạn có chắc chắn muốn xoá bài viết này?"
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

export default CommunityDetail;
