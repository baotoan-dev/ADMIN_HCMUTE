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

const Item = styled(Box)(({ theme }) => ({
    textarea: {
        fontSize: "1rem",
    },
}));

const AdminServiceCreatePage = () => {
    usePermission();
    const theme = useTheme();
    const role = localStorage.getItem("role");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [nameService, setNameService] = useState('');
    const [discountValue, setDiscountValue] = useState(0)
    const [priceValue, setPriceValue] = useState(0)
    const [status, setStatus] = useState(1); // Default value "1"
    const [images, setImages] = useState([]);
    const [expireValue, setExpireValue] = useState(1);
    const [description, setDescription] = useState('')

    // GET POST DATA

    // HANDLE SUBMIT
    const handleSubmitPostData = async () => {
        // HIDE MODAL
        setShowConfirmModal(false);
        const formData = new FormData();

        if (nameService === '' || description === '' || priceValue < 0 || discountValue < 0 || expireValue < 0 || images.length === 0) {
            toast.warning('Chưa nhập đủ dữ liệu')
            return
        }
        else {
            formData.append('images', images[0].image);
            formData.append('name', nameService);
            formData.append('description', description);
            formData.append('price', priceValue);
            formData.append('discount', discountValue);
            formData.append('expiration', expireValue);
            formData.append('status', status);
        }

        // GET RESPONSE
        try {
            const res = await axios.post(`http://localhost:1902/api/v3/service-recruitment`, formData);
            if (res.status === 200) {
                setNameService('')
                setPriceValue(0)
                setDiscountValue(0)
                setExpireValue(1)
                setDescription('')
                setStatus(1)
                setImages([])
                return toast.success("Tạo dịch vụ thành công");
            }
        } catch (error) {
            return toast.error("Tạo dịch vụ thất bại");
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
                Tạo dịch vụ cha
            </Typography>

            <Grid container spacing={4}>
                {/* Id */}

                <Grid item xs={12} lg={6}>
                    <Item>
                        <TextField
                            label="Name"
                            variant="outlined"
                            multiline
                            inputProps={{
                                style: {
                                    cursor: "pointer",
                                }
                            }}
                            value={nameService}
                            onChange={(e) => {
                                setNameService(e.target.value);
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} lg={3}>
                    <Item>
                        <TextField
                            label="Price"
                            variant="outlined"
                            value={priceValue}
                            type="number"
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    style: {
                                        cursor: "pointer",
                                    },
                                },
                            }
                            }
                            onChange={(e) => {
                                setPriceValue(e.target.value);
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>

                <Grid item xs={12} lg={3}>
                    <Item>
                        <TextField
                            label="Discount"
                            variant="outlined"
                            type="number"
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    max: 100,
                                    style: {
                                        cursor: "pointer",
                                    },
                                },
                            }}
                            value={discountValue}
                            onChange={(e) => {
                                setDiscountValue(e.target.value)
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>


                <Grid item xs={12} lg={6}>
                    <Item>
                        <TextField
                            label="Expire"
                            variant="outlined"
                            type="number"
                            InputProps={
                                {
                                    inputProps: {
                                        min: 0,
                                        style: {
                                            cursor: "pointer",
                                        },
                                    }
                                }
                            }
                            value={expireValue}
                            onChange={(e) => {
                                setExpireValue(e.target.value)
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

                <Grid item xs={12} lg={12}>
                    <Item>
                        <TextField
                            label="Description"
                            variant="outlined"
                            multiline
                            maxRows={4}
                            inputProps={{
                                style: {
                                    height: "150px",
                                    cursor: "pointer",
                                },
                            }}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>

                <Box p="2rem 2rem">
                    <Typography mb="1rem" variant="h3" color={theme.palette.color.main}>
                        Hình ảnh
                    </Typography>

                    <Typography variant="p" color={theme.palette.color.main}>
                        Có thể tải tối đa 1 ảnh, ảnh không quá 10MB. (Định dạng cho
                        phép: jpeg, jpg, png)
                    </Typography>

                    <Box mt="2rem">
                        <Button
                            variant="outlined"
                            component="label"
                            disabled={images.length === 1}
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

                    {(role === "1") && (
                        <Button
                            sx={{ marginTop: "2rem" }}
                            variant="outlined"
                            onClick={() => setShowConfirmModal(true)}
                        >
                            Lưu dịch vụ
                        </Button>
                    )}
                </Box>
                <ConfirmDialog
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onClickConfirm={handleSubmitPostData}
                    title="Tạo dịch vụ"
                    text="Bạn đã chắc chắn tạo"
                />

            </Grid>
        </Box>
    );
};

export default AdminServiceCreatePage;
