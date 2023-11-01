import { Grid, Box, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextField } from "components";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CreatePostInformations = ({
  post,
  setPost,
  locations,
  districts,
  wards,
  setDistricts,
  setWards,
  salaryTypes,
  jobTypes,
  companies,
}) => {
  const handleOnChangeProvince = (e) => {
    const province = locations.find(
      (location) => location.province_id === e.target.value
    );
    if (province) {
      setDistricts(province.districts);
      setWards(province.districts[0].wards);

      setPost((prevState) => ({
        ...prevState,
        provinceId: e.target.value,
        districtId: province.districts[0].district_id,
        wardId: province.districts[0].wards[0].id,
      }));
    }
  };

  const handleOnChangeDistrict = (e) => {
    const wards = districts.find(
      (district) => district.district_id === e.target.value
    ).wards;
    setWards(() => (wards ? wards : []));
    setPost((prevState) => ({
      ...prevState,
      districtId: e.target.value,
      wardId: wards && wards.length > 0 ? wards[0].id : null,
    }));
  };

  const handleOnChangeDescription = (e) => {
    setPost((prevState) => ({
      ...prevState,
      description: e.target.value,
    }));
  };

  return (
    <Grid container spacing={4}>
      {/* Title */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Tên công việc"
            variant="outlined"
            value={post.title}
            onChange={(e) => {
              setPost((prevState) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="URL bài đăng (Ex: https://neowork.vn)"
            variant="outlined"
            value={post.url}
            onChange={(e) => {
              setPost((prevState) => ({
                ...prevState,
                url: e.target.value,
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      {companies.length > 0 && (
        <Grid item xs={12} lg={3}>
          <Item>
            <TextField
              label="Nguồn (Ex: HiJob, Vietnamwork, ...)"
              variant="outlined"
              value={post.companyResourceId || ""}
              onChange={(e) => {
                setPost((prevState) => ({
                  ...prevState,
                  companyResourceId: e.target.value,
                }));
              }}
              fullWidth
              select
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          </Item>
        </Grid>
      )}

      {jobTypes.length > 0 && (
        <Grid item xs={12} lg={3}>
          <Item>
            <TextField
              label="Loại công việc (Ex: Fulltime, Parttime, ...)"
              variant="outlined"
              value={post.jobTypeId || ""}
              onChange={(e) => {
                setPost((prevState) => ({
                  ...prevState,
                  jobTypeId: e.target.value,
                }));
              }}
              fullWidth
              select
            >
              {jobTypes.map((jobType) => (
                <MenuItem key={jobType.id} value={jobType.id}>
                  {jobType.name}
                </MenuItem>
              ))}
            </TextField>
          </Item>
        </Grid>
      )}

      {/* Company name */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Công ty"
            variant="outlined"
            value={post.companyName}
            onChange={(e) => {
              setPost((prevState) => ({
                ...prevState,
                companyName: e.target.value,
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      {/* Province */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Tỉnh/Thành phố"
            variant="outlined"
            value={post.provinceId || ""}
            onChange={handleOnChangeProvince}
            fullWidth
            select
          >
            {locations.map((location) => (
              <MenuItem key={location.province_id} value={location.province_id}>
                {location.province_name}
              </MenuItem>
            ))}
          </TextField>
        </Item>
      </Grid>

      {/* District */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Quận/Huyện"
            variant="outlined"
            value={
              post.districtId ||
              (districts.length > 0 ? districts[0].district_id : "")
            }
            onChange={handleOnChangeDistrict}
            fullWidth
            select
          >
            {districts.map((district) => (
              <MenuItem key={district.district_id} value={district.district_id}>
                {district.district}
              </MenuItem>
            ))}
          </TextField>
        </Item>
      </Grid>

      {/* Ward */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Phường/Xã"
            variant="outlined"
            value={post.wardId || (wards.length > 0 ? wards[0].id : "")}
            onChange={(e) =>
              setPost((prevState) => ({
                ...prevState,
                wardId: e.target.value,
              }))
            }
            fullWidth
            select
          >
            {wards.map((ward) => (
              <MenuItem key={ward.id} value={ward.id}>
                {ward.full_name}
              </MenuItem>
            ))}
          </TextField>
        </Item>
      </Grid>

      {/* Street */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Tên đường"
            variant="outlined"
            value={post.address}
            onChange={(e) => {
              setPost((prevState) => ({
                ...prevState,
                address: e.target.value,
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      {/* Phone number */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Số điện thoại (0-***-***-***)"
            variant="outlined"
            value={post.phoneNumber}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            onChange={(e) =>
              setPost((prevState) => ({
                ...prevState,
                phoneNumber: e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>

      {/* EMAIL */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Email"
            variant="outlined"
            value={post.email}
            onChange={(e) =>
              setPost((prevState) => ({
                ...prevState,
                email: e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>

      {/* Is working date period */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            select
            label="Thời gian làm việc"
            value={post.isDatePeriod}
            onChange={(e) => {
              setPost((prevState) => ({
                ...prevState,
                isDatePeriod: e.target.value,
              }));
            }}
            fullWidth
          >
            <MenuItem value={0}>Không thời hạn</MenuItem>
            <MenuItem value={1}>Có thời hạn</MenuItem>
          </TextField>
        </Item>
      </Grid>

      {/* WORKING DATE */}
      {post.isDatePeriod === 1 && (
        <>
          <Grid item xs={6} lg={3}>
            <Item>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={moment(post.startDate)}
                  onChange={(e) =>
                    setPost((prevState) => ({
                      ...prevState,
                      startDate: new Date(e._d).getTime(),
                    }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Item>
          </Grid>

          <Grid item xs={6} lg={3}>
            <Item>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={moment(post.endDate)}
                  onChange={(e) =>
                    setPost((prevState) => ({
                      ...prevState,
                      endDate: new Date(e._d).getTime(),
                    }))
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Item>
          </Grid>
        </>
      )}

      {/* WORKING TIME */}
      <Grid item xs={12} lg={3}>
        <Item>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              label="Thời gian bắt đầu"
              
              // disabled={true}
              // ampm={false}
              value={moment(post.startTime)}
              onChange={(e) =>
                {
                setPost((prevState) => ({
                  ...prevState,
                  startTime: new Date(e._d).getTime(),
                }))}
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Item>
      </Grid>

      <Grid item xs={12} lg={3}>
        <Item>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              label="Thời gian kết thúc"
              // ampm={false}
              value={moment(post.endTime)}
              onChange={(e) =>
                setPost((prevState) => ({
                  ...prevState,
                  endTime: new Date(e._d).getTime(),
                }))
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Item>
      </Grid>

      {/* Min salary */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Lương (tối thiểu)"
            variant="outlined"
            type="number"
            inputProps={{ min: 0 }}
            value={post.salaryMin}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setPost((prevState) => ({
                ...prevState,
                salaryMin: +e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>

      {/* Max salary */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Lương (tối đa)"
            variant="outlined"
            type="number"
            inputProps={{ min: 0 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={post.salaryMax}
            onChange={(e) =>
              setPost((prevState) => ({
                ...prevState,
                salaryMax: +e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>

      {/* Salary types */}
      {salaryTypes.length > 0 && (
        <Grid item xs={12} lg={3}>
          <Item>
            <TextField
              label="Tính lương theo"
              variant="outlined"
              select
              value={post.salaryType}
              onChange={(e) =>
                setPost((prevState) => ({
                  ...prevState,
                  salaryType: e.target.value,
                }))
              }
              fullWidth
            >
              {salaryTypes.map((salaryType) => (
                <MenuItem key={salaryType.id} value={salaryType.id}>
                  {salaryType.value}
                </MenuItem>
              ))}
            </TextField>
          </Item>
        </Grid>
      )}

      {/* Money types */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Đơn vị tiền"
            variant="outlined"
            select
            value={post.moneyType}
            onChange={(e) =>
              setPost((prevState) => ({
                ...prevState,
                moneyType: e.target.value,
              }))
            }
            fullWidth
          >
            <MenuItem value={1}>VND</MenuItem>
            <MenuItem value={2}>USD</MenuItem>
          </TextField>
        </Item>
      </Grid>

      {/* Is working weekend */}
      <Grid item xs={6} lg={3}>
        <Item>
          <FormControlLabel
            sx={{ color: "#eee" }}
            control={
              <Checkbox
                checked={post.isWorkingWeekend === 1}
                onChange={() =>
                  setPost((prevState) => ({
                    ...prevState,
                    isWorkingWeekend: prevState.isWorkingWeekend === 0 ? 1 : 0,
                  }))
                }
              />
            }
            label="Làm việc cuối tuần"
          />
        </Item>
      </Grid>

      {/* Is remotely */}
      <Grid item xs={6} lg={3}>
        <Item>
          <FormControlLabel
            sx={{ color: "#eee" }}
            control={
              <Checkbox
                checked={post.isRemotely === 1}
                onChange={() =>
                  setPost((prevState) => ({
                    ...prevState,
                    isRemotely: prevState.isRemotely === 0 ? 1 : 0,
                  }))
                }
              />
            }
            label="Làm việc từ xa"
          />
        </Item>
      </Grid>
      

      {/* Description */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Mô tả"
            variant="outlined"
            multiline
            value={post.description}
            onChange={handleOnChangeDescription}
            fullWidth
          />
        </Item>
      </Grid>

      <Grid item xs={12} lg={3}>
        <Item>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label="Thời gian hêt hạn"
              value={moment(post.expiredDate) || null}
              onChange={(e) =>
                setPost((prevState) => ({
                  ...prevState,
                  expiredDate: new Date(e._d).getTime(),
                }))
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Item>
      </Grid>
    </Grid>
  );
};

export default CreatePostInformations;