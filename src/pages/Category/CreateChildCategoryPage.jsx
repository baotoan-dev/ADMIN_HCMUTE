import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {toast} from 'react-toastify';
import {TextField} from 'components';
import {axios} from 'configs';
import {ConfirmDialog} from 'components';
import {usePermission} from 'hooks';
import {MenuItem, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import { API_CONSTANT_V3 } from 'constant/urlServer';

const Item = styled(Box)(({theme}) => ({
  textarea: {
    fontSize: '1rem',
  },
}));

const CreateChildCategoryPage = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const idParent = +params.id;
  const role = localStorage.getItem('role');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nameCategories, setNameCategories] = useState([]);
  const [nameEnCategories, setNameEnCategories] = useState();
  const [nameKorCategories, setNameKorCategories] = useState();
  const [status, setStatus] = useState(1); // Default value "1"

  const navigate = useNavigate();
  // GET POST DATA

  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);
    let data;

    if (!nameCategories || !nameEnCategories || !nameKorCategories) {
      toast.warning('Chưa nhập đủ dữ liệu');
      return;
    } else {
      data = {
        name: nameCategories,
        nameEn: nameEnCategories,
        nameKor: nameKorCategories,
        parentCategoryId: idParent,
        status: status,
      };
    }

    // GET RESPONSE
    try {
      const res = await axios.post(
        `${API_CONSTANT_V3}/v3/children/create`,
        data,
      );

      if (res.status === 200) {
        setNameCategories('');
        setNameEnCategories('');
        setNameKorCategories('');
        return toast.success('Tạo danh mục thành công');
      }
    } catch (error) {
      return toast.error('Tạo danh mục thất bại');
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <Box sx={{padding: '1rem'}}>
      <Typography
        variant="h3"
        style={{marginBottom: '1rem'}}
        color={theme.palette.color.main}
      >
        Tạo danh mục
      </Typography>
      {role === '1' && (
        <Button
          sx={{marginBottom: '1.5rem'}}
          variant="outlined"
          onClick={() => {
            navigate(`/admin/see-all-child-category/${idParent}`);
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
              label="parent_category_id"
              variant="outlined"
              multiline
              value={idParent || '1'}
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
                setNameKorCategories(e.target.value);
              }}
              fullWidth
            />
          </Item>
        </Grid>

        <Grid item xs={12} lg={12}>
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

        {role === '1' && (
          <Button
            sx={{marginTop: '2rem', marginLeft: '2rem'}}
            variant="outlined"
            onClick={() => setShowConfirmModal(true)}
          >
            Lưu danh mục
          </Button>
        )}

        <ConfirmDialog
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onClickConfirm={handleSubmitPostData}
          title="Cập nhật thông tin danh mục"
          text="Bạn đã chắc chắn với thông tin đã chỉnh sửa?"
        />
      </Grid>
    </Box>
  );
};

export default CreateChildCategoryPage;
