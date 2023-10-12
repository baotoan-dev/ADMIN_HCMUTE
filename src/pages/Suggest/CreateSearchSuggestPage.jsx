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
import { TextField, CreatePostImages } from "components";
import { axios } from "configs";
import {
  ConfirmDialog,
  Table,
  PostBasicInformation,
  PostCategories,
  ImageList,
} from "components";
import { usePermission } from "hooks";
import { MenuItem, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { validatePostImages } from "validations";
import imageCompression from "browser-image-compression";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CreateSearchSuggestPage = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const idParent = +params.id;
  const role = localStorage.getItem("role");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [keyword, setkeyword] = useState('');
  const [order, setOrder] = useState(1)
  const [status, setStatus] = useState(1); // Default value "1"

  // GET POST DATA

  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);
    const formData = new FormData();

    if (!keyword || !order|| !status ) {
        toast.warning('Chưa nhập đủ dữ liệu')
        return
    }

    if (+order <= 0) {
        toast.warning('Nhập order lớn hơn 0')
        return
    }

    // GET RESPONSE
    try {
      const res = await axios.post(`/v3/suggest-search/create`, {
        keyword, order, status
      });
      if (res.statusCode === 200){
        setkeyword('')
        setOrder('')
        setStatus(1)
        return toast.success("Tạo từ khoá thành công");
      }
    } catch (error) {
        return toast.error("Tạo từ khoá thất bại");
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleOnchangeOrder = (e) => {
    setOrder(e.target.value);
  }
  return (
    <Box sx={{ padding: "1rem" }}>

      <Typography variant="h3" style={{marginBottom: '3rem'}} color={theme.palette.color.main}>
        Tạo từ khoá 
      </Typography>

      <Grid container spacing={4}>
      {/* Id */}

      <Grid item xs={12} lg={12}>
        <Item>
          <TextField
            label="Keyword"
            variant="outlined"
            multiline
            placeholder="Nhập từ khoá..."
            value={keyword || ""}
            onChange={(e) => {
              setkeyword(e.target.value);
            }}
            fullWidth
          />
        </Item>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Item>
        <TextField
            label="Order"
            inputProps={{
              name: 'inputProps',
              type: 'number',
              min: 1,
              placeholder: 'Nhập số thứ tự...(VD: 0,1,2....)',
              value: order,
              onChange: handleOnchangeOrder,
            }}
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

          {(role === "1") && (
            <Button
              sx={{ marginTop: "2rem"}}
              variant="outlined"
              onClick={() => setShowConfirmModal(true)}
            >
              Lưu từ khoá 
            </Button>
        )}
        </Box>
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onClickConfirm={handleSubmitPostData}
            title="Tạo từ khoá"
            text="Bạn đã chắc chắn tạo"
          />

      </Grid>
    </Box>
  );
};

export default CreateSearchSuggestPage;
