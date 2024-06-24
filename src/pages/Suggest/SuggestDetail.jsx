import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { TextField } from "components";
import { axios } from "configs";
import {
  ConfirmDialog,
} from "components";
import { usePermission } from "hooks";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { API_CONSTANT_V3 } from "constant/urlServer";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const SuggestDetailPage = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [suggestData, setSuggestData] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmApprovalModal, setShowConfirmApprovalModal] = useState(false);
  const [showConfirmEnableModal, setShowEnableApprovalModal] = useState(false);
  const [checkRefresh, setCheckRefresh] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [order, setOrder] = useState(0)

  // GET POST DATA
  const fetchSuggestData = async (id) => {
    const res = await axios.get(`${API_CONSTANT_V3}/v3/suggest-search/${id}`);
    if (res.statusCode === 200) {
      const data  = res.data;
      setSuggestData(data);
      setKeyword(data.keyword)
      setOrder(data.order)
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchSuggestData(id);
    }
  }, [checkRefresh, id]);


  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);

    if (+order <= 0) {
      toast.warning('Nhập order lớn hơn 0')
      return
    }

    // GET RESPONSE
    try {
      const res = await axios.put(`${API_CONSTANT_V3}/v3/suggest-search/update/${id}`, {
        keyword : keyword, order : order
      });
      if (res && res.statusCode === 200) {
        setCheckRefresh(!checkRefresh)
        return toast.success("Cập nhật từ khoá thành công");
      }
    } catch (error) {
      return toast.error("Cập nhật từ khoá thất bại");
    }
  };

  const handleApproveCategory = async () => {
    setShowConfirmApprovalModal(false);

    // UPDATE POST STATUS
    const res = await axios.put(`${API_CONSTANT_V3}/v3/suggest-search/update/${id}`, {
      status: 0
    });
    if (res && res.statusCode === 200) {
      setCheckRefresh(!checkRefresh);
      return toast.success("Ẩn từ khoá thành công");
    } else {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleEnableCategory = async () => {
    setShowEnableApprovalModal(false);

    // UPDATE POST STATUS
    const res = await axios.put(`${API_CONSTANT_V3}/v3/suggest-search/update/${id}`, {
      status: 1
    });
    if (res && res.statusCode === 200) {
      setCheckRefresh(!checkRefresh);
      return toast.success("Hiện từ khoá thành công");
    } else {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  const handleOnchangeOrder = (e) => {
      setOrder(e.target.value)
    
  }
  return (
    <>
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h3" style={{marginBottom: '1rem'}} color={theme.palette.color.main}>
          Chi tiết từ khoá 
      </Typography>

      {role === "1" && suggestData?.status === 1 && (
        <Button
          variant="outlined"
          sx={{ marginBottom: "2rem" }}
          onClick={() => {
            setShowConfirmApprovalModal(true);
          }}
            >
          Ẩn từ khoá        
        </Button>
      )}

      {role === "1" && suggestData?.status === 0 && (
        <Button
          variant="outlined"
          sx={{ marginTop: "1rem" , marginBottom: "2rem" }}
          onClick={() => {
            setShowEnableApprovalModal(true);
          }}
            >
          Hiện từ khoá         
        </Button>
      )}


      <Grid container spacing={4}>
      {/* Id */}

      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Suggest_id"
            variant="outlined"
            multiline
            value={suggestData?.id || "1"}
            InputProps={{
              readOnly: true,
            }}
            onChange={(e) => {}}
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

      <Grid item xs={12} lg={12}>
        <Item>
          <TextField
            label="Keyword"
            variant="outlined"
            multiline
            value={keyword || "1"}
            onChange={(e) => {
              setKeyword(e.target.value)
            }}
            fullWidth
          />
        </Item>
      </Grid>


        {(role === "1") && (
            <Button
              sx={{ marginTop: "2rem", marginLeft: "2rem"}}
              variant="outlined"
              onClick={() => setShowConfirmModal(true)}
            >
              Lưu thay đổi
            </Button>
        )}

    
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onClickConfirm={handleSubmitPostData}
            title="Cập nhật thông tin danh mục"
            text="Bạn đã chắc chắn với thông tin đã chỉnh sửa?"
          />

          <ConfirmDialog
            isOpen={showConfirmApprovalModal}
            onClose={() => setShowConfirmApprovalModal(false)}
            onClickConfirm={handleApproveCategory} 
            title="Ẩn từ khoá"
            text={"Bạn có chắt ẩn từ khoá?"}
          />

          <ConfirmDialog
            isOpen={showConfirmEnableModal}
            onClose={() => setShowEnableApprovalModal(false)}
            onClickConfirm={handleEnableCategory} 
            title="Hiện từ khoá"
            text={"Bạn có chắt hiện từ khoá?"}
          />

      </Grid>
    </Box>
    </>
  );
};

export default SuggestDetailPage;
