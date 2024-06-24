import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { TextField } from "components";
import { axios } from "configs";
import {
  ConfirmDialog,
} from "components";
import { usePermission } from "hooks";
import { MenuItem, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCategory from "../../components/Table/TableCategory"
import categoryChildColumns from "configs/table/categoryChildColumns";
import { AddIcon } from "components/Icons";
import { API_CONSTANT_V3 } from "constant/urlServer";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CategoryDetail = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [categoryData, setCategoryData] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [childCategories, setChildCategories] = useState([]);
  const [nameChildCategories, setNameChildCategories] = useState([]);
  const [nameEnChildCategories, setNameEnChildCategories] = useState([]);
  const [nameKorChildCategories, setNameKorChildCategories] = useState([]);
  const [nameParentCategories, setNameParentCategories] = useState()
  const [nameEnParentCategories, setNameEnParentCategories] = useState()
  const [nameKorParentCategories, setNameKorParentCategories] = useState()
  const [idChildCategories, setIdChildCategories] = useState()
  const [showConfirmApprovalModal, setShowConfirmApprovalModal] = useState(false);
  const [showConfirmEnableModal, setShowEnableApprovalModal] = useState(false);
  const [checkRefresh, setCheckRefresh] = useState(false)
  const [categories, setCategories] = useState([]);

  // GET POST DATA
  const fetchCategoryData = async (id) => {
    const res = await axios.get(`${API_CONSTANT_V3}/v3/parent/${id}`);
    if (res.status === 200) {
      const data  = res.data;
      setCategoryData(data);
      setNameParentCategories(data.name)
      setNameKorParentCategories(data.nameKor)
      setNameEnParentCategories(data.nameEn)
      setChildCategories(data?.childCategories)
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchCategoryData(id);
    }
  }, [checkRefresh, id]);


  const fetchCategories = async () => {
    let res;
    res = await axios.get(`${API_CONSTANT_V3}/v3/children/by-parent/${id}`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, [checkRefresh, id]);


  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);
    let data;

    if (idChildCategories) {
       data = {
       name: nameParentCategories,
       nameEn: nameEnParentCategories,
       nameKor : nameKorParentCategories,
       childCategories: [{
          id: idChildCategories,
          name: nameChildCategories,
          nameEn: nameEnChildCategories,
          nameKor: nameKorChildCategories,
          parentCategoryId: id
       }]
      };
    }
    else {
      data = {
        name: nameParentCategories,
        nameEn: nameEnParentCategories,
        nameKor : nameKorParentCategories
       };
    }

    // GET RESPONSE
    try {
      await axios.put(`${API_CONSTANT_V3}/v3/parent/${id}`, data);
      setCheckRefresh(!checkRefresh)
      return toast.success("Cập nhật danh mục thành công");
    } catch (error) {
      return toast.error("Cập nhật danh mục thất bại");
    }
  };

  const handleOnChangeChildCategoriries = (e) => {
    const childCategory = childCategories.find(
      (child) => child.id === e.target.value
    );

    setIdChildCategories(e.target.value);

    if (childCategory) {
      setNameChildCategories(childCategory.name);
      setNameKorChildCategories(childCategory.nameKor);
      setNameEnChildCategories(childCategory.nameEn);
    }
  };

  const handleApproveCategory = async () => {
    setShowConfirmApprovalModal(false);

    // UPDATE POST STATUS
    const res = await axios.put(`${API_CONSTANT_V3}/v3/parent/${id}`, {
      status: 0
    });
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
    const res = await axios.put(`/v3/parent/${id}`, {
      status: 1
    });
    if (res && res.status === 200) {
      setCheckRefresh(!checkRefresh);
      return toast.success("Hiện danh mục thành công");
    } else {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleRefreshDelete = () => {
    setCheckRefresh(!checkRefresh);
  }

  return (
    <>
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h3" style={{marginBottom: '1rem'}} color={theme.palette.color.main}>
          Chi tiết danh mục
      </Typography>

      {role === "1" && categoryData?.status === 1 && (
        <Button
          variant="outlined"
          sx={{ marginBottom: "2rem" }}
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
            value={nameParentCategories || "1"}
            onChange={(e) => {
              setNameParentCategories(e.target.value);
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
            value={nameEnParentCategories || "1"}
            onChange={(e) => {
              setNameEnParentCategories(e.target.value);
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
            value={nameKorParentCategories || "1"}
            onChange={(e) => {
              setNameKorParentCategories(e.target.value)
            }}
            fullWidth
          />
        </Item>
      </Grid>

      {childCategories.length > 0 && (
        <>
        <Grid item xs={12} lg={3}>
          <Item>
          <TextField
            label="Child Category"
            variant="outlined"
            onChange={handleOnChangeChildCategoriries}
            fullWidth
            select
          >
            {childCategories.map((child) => (
              <MenuItem key={child.id} value={child.id}>
                {child.name}
              </MenuItem>
            ))}
          </TextField>
          </Item>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Item>
          <TextField
            label="Name child"
            variant="outlined"
            multiline
            value={nameChildCategories || "1"}
            onChange={(e) => {
              setNameChildCategories(e.target.value)
            }}
            fullWidth
          />
          </Item>
        </Grid>

        <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Name child En"
            variant="outlined"
            value={nameEnChildCategories}
            onChange={(e) => {
              setNameEnChildCategories(e.target.value)
            }}
            fullWidth
          />
        </Item>
        </Grid>

        <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Name child KOR"
            variant="outlined"
            value={nameKorChildCategories}
            onChange={(e) => {
              setNameKorChildCategories(e.target.value)
            }}
            fullWidth
          />
        </Item>
        </Grid>
        </>
       
      )}

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

      <Box
        sx={{
        marginTop: '2rem',
        marginBottom: '2rem',
        // display: "flex",
        // justifyContent: "space-between",
        }}
      >
          <Typography
            variant="h3"
            sx={{
            color: theme.palette.color.main,
            paddingBottom: "1rem",
            }}
            >
              Tất cả danh mục con
              </Typography>

              <Box sx={{justifyContent: 'flex-end'}}>
              <Link to={`/admin/${id}/create-child-category`}>
              <IconButton
                variant="outlined"
              >
                <AddIcon />
              </IconButton>
              </Link>

            </Box>
        </Box>

        <Box
          sx={{ 
            width: "100%",
            height: `calc(60vh - ${theme.height.navbar} - 6rem)`,
          }}
        >
          <TableCategory 
            handleRefreshDelete={handleRefreshDelete}
            rows={categories} 
            columns={categoryChildColumns} 
            showCheckbox={false} 
          />
        </Box>
      
    </Box>
    </>
  );
};

export default CategoryDetail;
