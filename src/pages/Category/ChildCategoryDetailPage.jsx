import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const ChildCategoryDetailPage = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [categoryData, setCategoryData] = useState();
  const [showConfirmApprovalModal, setShowConfirmApprovalModal] = useState(false);
  const [showConfirmEnableModal, setShowEnableApprovalModal] = useState(false);
  const [checkRefresh, setCheckRefresh] = useState(false)
  const [parentId, setParentId] = useState();
  const navigate = useNavigate();
  // GET POST DATA
  const fetchCategoryData = async (id) => {
    const res = await axios.get(`${API_CONSTANT_V3}/v3/children/${id}`);
    if (res.status === 200) {
      const data  = res.data;
      setParentId(data.parentCategoryId)
      setCategoryData(data);
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchCategoryData(id);
    }
  }, [checkRefresh]);

  const handleApproveCategory = async () => {
    setShowConfirmApprovalModal(false);

    // UPDATE POST STATUS
    const res = await axios.post(`${API_CONSTANT_V3}/v3/children/disable/${id}`);
    if (res && res.status === 200) {
      setCheckRefresh(!checkRefresh);
      return toast.success("Ẩn danh mục thành công");
    } else {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleEnableCategory = async () => {
    setShowEnableApprovalModal(false);

    // UPDATE POST STATUS
    const res = await axios.post(`${API_CONSTANT_V3}/v3/children/enable/${id}`);
    if (res && res.status === 200) {
      setCheckRefresh(!checkRefresh);
      return toast.success("Hiện danh mục thành công");
    } else {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Box sx={{ padding: "1rem" }}>

      <Typography variant="h3" style={{marginBottom: '1rem'}} color={theme.palette.color.main}>
          Chi tiết danh mục con
      </Typography>

      {role === "1" && categoryData?.status === 1 && (
        <Button
          variant="outlined"
          sx={{ marginTop: "1rem" , marginBottom: "2rem" }}
          onClick={() => {
            setShowConfirmApprovalModal(true);
          }}
            >
          Ẩn danh mục         
        </Button>
      )}

      {role === "1" && categoryData?.status === 0 && (
        <Button
          variant="outlined"
          sx={{ marginTop: "1rem" , marginBottom: "2rem" }}
          onClick={() => {
            setShowEnableApprovalModal(true);
          }}
            >
          Hiện danh mục          
        </Button>
      )}


    {(role === "1") && (
        <Button
          sx={{ marginTop: "-1rem", marginLeft: "1rem" }}
          variant="outlined"
          onClick={() => {
            navigate(`/admin/see-all-child-category/${parentId}`);
          }}
        >
          Xem tất cả
        </Button>
      )}

      <Grid container spacing={4}>
      {/* Id */}

      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Category_id"
            variant="outlined"
            multiline
            value={categoryData?.id || "1"}
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
            label="Name parent"
            variant="outlined"
            multiline
            value={categoryData?.name || "1"}
            onChange={(e) => {}}
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
            value={categoryData?.nameEn || "1"}
            onChange={(e) => {}}
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
            value={categoryData?.nameKor || "1"}
            onChange={(e) => {}}
            fullWidth
          />
        </Item>
      </Grid>

          <ConfirmDialog
            isOpen={showConfirmApprovalModal}
            onClose={() => setShowConfirmApprovalModal(false)}
            onClickConfirm={handleApproveCategory} 
            title="Ẩn danh mục"
            text={"Bạn có chắt ẩn danh mục ?"}
          />

          <ConfirmDialog
            isOpen={showConfirmEnableModal}
            onClose={() => setShowEnableApprovalModal(false)}
            onClickConfirm={handleEnableCategory} 
            title="Hiện danh mục"
            text={"Bạn có chắt hiện danh mục ?"}
          />

      </Grid>
    </Box>
  );
};

export default ChildCategoryDetailPage;
