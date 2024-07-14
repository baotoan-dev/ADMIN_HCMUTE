import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { axios } from "configs";
import {
  ConfirmDialog,
  CreatePostImages,
} from "components";
import { validatePostImages } from "validations";
import { usePermission } from "hooks";
import CreateCommunityInformations from "components/Community/Create/information";
import createCommunityValidation from "validations/Community/create";
import { API_CONSTANT_V3 } from "constant/urlServer";

const initCommunity = {
  title: "",
  content: "",
};

const AdminCommunityCreatePage = () => {
  usePermission();

  const navigate = useNavigate();
  const theme = useTheme();
  const [community, setCommunity] = useState(initCommunity);
  const [isShowConfirmDialog, setIsShowConfirmDialog] = useState(false);
  const [images, setImages] = useState([]);

  // Handle on change images
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

  // Handle remove image
  const handleRemoveImage = (image) => {
    setImages((prevState) =>
      prevState.filter((prevImage) => prevImage.preview !== image.preview)
    );
  };

  // Handle submit create post
  const handleOnCreateCommunity = async () => {
    setIsShowConfirmDialog(false);

    const createCommunityValidationReply = createCommunityValidation(community);
    if (createCommunityValidationReply.isError) {
      return toast.warn(createCommunityValidationReply.message);
    }

    const communitySubmit = new FormData();
    communitySubmit.append("title", community.title.trim());
    communitySubmit.append("content", community.content.trim());


    images.forEach((image) => communitySubmit.append("images", image.image));

    let toastId = toast.loading("Please wait...");


    // Fetch api
    try {
      await axios.post(
        `${API_CONSTANT_V3}/v3/communications/by-admin`,
        communitySubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCommunity(initCommunity);
      images.forEach((image) => window.URL.revokeObjectURL(image));
      setImages([]);
      return toast.update(toastId, {
        render: "Create community successfully",
        type: toast.TYPE.SUCCESS,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    } catch (error) {
      console.log("Create post error ::: ", error);
      if (error.response && error.response.status === 401) {
        return navigate("/admin/auth");
      }
      return toast.update(toastId, {
        render: "Create community failure",
        type: toast.TYPE.ERROR,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    }
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h2" color={theme.palette.color.main}>
          Create Community
        </Typography>
        {/* <Link to="/admin/worker-manager/detail?own=true">
          <Button variant="outlined">Bài đã đăng</Button>
        </Link> */}
      </Box>

      <Box>
        {/* BASIC INFORMATION */}
        <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
          <CreateCommunityInformations
            community={community}
            setCommunity={setCommunity}
          />
        </Box>

        {/* Images */}
        <Box p="2rem 0">
          <Typography mb="1rem" variant="h3" color={theme.palette.color.main}>
            Hình ảnh
          </Typography>

          <Typography variant="p" color={theme.palette.color.main}>
            Có thể tải tối đa 5 ảnh, mỗi ảnh không quá 10MB. (Định dạng cho
            phép: jpeg, jpg, png)
          </Typography>

          <Box mt="2rem">
            <Button
              variant="outlined"
              component="label"
              disabled={images.length === 5}
            >
              Tải ảnh
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

        {/* SUBMIT BUTTON */}
        <Button
          sx={{ marginTop: "1rem" }}
          variant="outlined"
          onClick={() => setIsShowConfirmDialog(true)}
        >
          Tạo
        </Button>

        {/* DIALOG */}
        <ConfirmDialog
          isOpen={isShowConfirmDialog}
          onClose={() => setIsShowConfirmDialog(false)}
          onClickConfirm={handleOnCreateCommunity}
          title="Confirm create community"
          text="Are you sure to create this community?"
        />
      </Box>
    </Box>
  );
};

export default AdminCommunityCreatePage;
