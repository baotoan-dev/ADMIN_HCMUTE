import { useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { TextField, CreatePostImages } from "components";
import { axios } from "configs";
import {
  ConfirmDialog,
} from "components";
import { usePermission } from "hooks";
import { MenuItem, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { validatePostImages } from "validations";
import imageCompression from "browser-image-compression";
import { API_CONSTANT_V3 } from "constant/urlServer";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CreateParentCategoryPage = () => {
  usePermission();
  const theme = useTheme();
  const role = localStorage.getItem("role");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nameCategories, setNameCategories] = useState('');
  const [nameEnCategories, setNameEnCategories] = useState()
  const [nameKorCategories, setNameKorCategories] = useState()
  const [status, setStatus] = useState(1); // Default value "1"
  const [images, setImages] = useState([]);

  // GET POST DATA

  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);
    const formData = new FormData();

    if (!nameCategories || !nameEnCategories || !nameKorCategories || images.length < 0) {
      toast.warning('Chưa nhập đủ dữ liệu')
      return
    }
    else {
      formData.append('image', images[0].image);
      formData.append('defaultPostImage', images[0].image);
      formData.append('name', nameCategories);
      formData.append('nameEn', nameEnCategories);
      formData.append('nameKor', nameKorCategories);
      formData.append('status', status);
    }

    // GET RESPONSE
    try {
      const res = await axios.post(`${API_CONSTANT_V3}/v3/parent/add`, formData);
      if (res.status === 200) {
        setNameCategories('')
        setNameEnCategories('')
        setNameKorCategories('')
        setStatus(1)
        setImages([])
        return toast.success("Tạo danh mục thành công");
      }
    } catch (error) {
      return toast.error("Tạo danh mục thất bại");
    }
  };


  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleOnChangeImages = async (e) => {
    const imagesUpload = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 840,
    };

    const imagesToCheck =
      images.length + imagesUpload.length > 1
        ? imagesUpload.slice(0, 1 - images.length)
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


  return (
    <Box sx={{ padding: "1rem" }}>

      <Typography variant="h3" style={{ marginBottom: '1rem' }} color={theme.palette.color.main}>
        Create Parent Category
      </Typography>

      <Grid container spacing={4}>
        {/* Id */}

        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Name"
              variant="outlined"
              multiline
              value={nameCategories}
              onChange={(e) => {
                setNameCategories(e.target.value);
              }}
              fullWidth
            />
          </Item>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Name parent En"
              variant="outlined"
              multiline
              value={nameEnCategories}
              onChange={(e) => {
                setNameEnCategories(e.target.value);
              }}
              fullWidth
            />
          </Item>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              label="Name parent Kor"
              variant="outlined"
              multiline
              value={nameKorCategories}
              onChange={(e) => {
                setNameKorCategories(e.target.value)
              }}
              fullWidth
            />
          </Item>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Item>
            <TextField
              select
              label="Trạng thái"
              variant="outlined"
              value={status}
              onChange={handleStatusChange}
              fullWidth
            >
              <MenuItem value="1">Hiện</MenuItem>
              <MenuItem value="0">Ẩn</MenuItem>
            </TextField>
          </Item>
        </Grid>

        <Box p="2rem 2rem">
          <Typography mb="1rem" variant="h3" color={theme.palette.color.main}>
              Images
          </Typography>

          <Typography variant="p" color={theme.palette.color.main}>
           A maximum of 1 photo can be downloaded, the photo is not more than 10MB. (Format for
            Magic: jpeg, jpg, png)
          </Typography>

          <Box mt="2rem">
            <Button
              variant="outlined"
              component="label"
              disabled={images.length === 1}
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

          {(role === "1") && (
            <Button
              sx={{ marginTop: "2rem" }}
              variant="outlined"
              onClick={() => setShowConfirmModal(true)}
            >
              Save category
            </Button>
          )}
        </Box>
        <ConfirmDialog
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onClickConfirm={handleSubmitPostData}
          title="Tạo danh mục"
          text="Bạn đã chắc chắn tạo"
        />

      </Grid>
    </Box>
  );
};

export default CreateParentCategoryPage;
