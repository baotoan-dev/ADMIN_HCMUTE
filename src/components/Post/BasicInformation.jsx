import { useState, useEffect, memo } from "react";
import { Box, MenuItem, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";

import { TextField } from "components";
import { axios } from "configs";
import { DateTimePicker } from "@mui/x-date-pickers";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const BasicInformation = ({ basicInformation, setBasicInformation }) => {
  const [statusValue, setStatusValue] = useState();
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [jobTypes, setJobTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const fetchSalaryTypes = async () => {
    const res = await axios.get("/v1/salary-types");
    setSalaryTypes(res.data);
  };

  const fetchJobTypes = async () => {
    const res = await axios.get("/v1/job-types");
    setJobTypes(res.data);
  };


  const fetchCompaniesResource = async () => {
    const res = await axios.get("/v1/companies");
    setCompanies(res.data);
  };

  useEffect(() => {
    if (basicInformation) {
      switch (basicInformation.status) {
        case 0:
          setStatusValue("Đang chờ duyệt");
          break;
        case 1:
          setStatusValue("Đã được duyệt");
          break;
        case 2:
          setStatusValue("Đã không được duyệt");
          break;
        case 3:
          setStatusValue("Đã đóng");
          break;
        default:
          setStatusValue("Trạng thái không hợp lệ");
          break;
      }
    }
  }, [basicInformation]);

  useEffect(() => {
    const fetchAllLocations = async () => {
      const res = await axios.get("/v1/locations");
      if (res.success) {
        setLocations(res.data);
        if (
          basicInformation &&
          basicInformation.province_id &&
          basicInformation.district_id &&
          basicInformation.ward_id
        ) {
          const province = res.data.find(
            (location) => location.province_id === basicInformation.province_id
          );
          const districts = province.districts;
          const district = districts.find(
            (d) => d.district_id === basicInformation.district_id
          );
          setDistricts(districts);
          setWards(district.wards);
        }
      }
    };
    fetchAllLocations();
    fetchSalaryTypes();
    fetchJobTypes();
    fetchCompaniesResource();
  }, []);

  // Handle on change province
  const handleOnChangeProvince = (e) => {
    const province = locations.find(
      (location) => location.province_id === e.target.value
    );
    if (province) {
      setDistricts(province.districts);
      setWards(province.districts[0].wards);

      setBasicInformation((prevState) => ({
        ...prevState,
        province_id: e.target.value,
        district_id: province.districts[0].district_id,
        ward_id: province.districts[0].wards[0].id,
      }));
    }
  };

  // Handle on change district
  const handleOnChangeDistrict = (e) => {
    const wards = districts.find(
      (district) => district.district_id === e.target.value
    ).wards;
    setWards(() => (wards ? wards : []));
    setBasicInformation((prevState) => ({
      ...prevState,
      district_id: e.target.value,
      ward_id: wards && wards.length > 0 ? wards[0].id : null,
    }));
  };

  return (
    
      basicInformation && 
      
      <Grid container spacing={4}>
      {/* Id */}

      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Account_id"
            variant="outlined"
            value={basicInformation.account_id || "1"}
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
            label="ID"
            variant="outlined"
            value={basicInformation.id || "1"}
            InputProps={{
              readOnly: true,
            }}
            onChange={(e) => {}}
            fullWidth
          />
        </Item>
      </Grid>

      {/* Created at */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Ngày tạo"
            variant="outlined"
            value={moment(basicInformation.created_at).format(
              "DD/MM/YYYY HH:mm:ss"
            ) || ""}
            InputProps={{
              readOnly: true,
            }}
            onChange={(e) => {}}
            fullWidth
          />
        </Item>
      </Grid>

      {/* Status */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Trạng thái"
            variant="outlined"
            value={statusValue || "1"}
            InputProps={{
              readOnly: true,
            }}
            onChange={(e) => {}}
            fullWidth
          />
        </Item>
      </Grid>

      {/* Title */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Tên công việc"
            variant="outlined"
            value={basicInformation.title || "1"}
            onChange={(e) => {
              setBasicInformation((prevState) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      {/* URL */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="URL bài đăng (Ex: http://neowork.vn)"
            variant="outlined"
            value={basicInformation.resource.url || ""}
            onChange={(e) => {
              setBasicInformation((prevState) => ({
                ...prevState,
                resource: {
                  ...prevState.resource,
                  url: e.target.value,
                },
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      {
        companies.length > 0 && (
          <Grid item xs={12} lg={3}>
            <Item>
              <TextField
                label="Nguồn (Ex: HiJob, Vietnamwork, ...)"
                variant="outlined"
                value={basicInformation.resource.company_resource_id || ""}
                onChange={(e) => {
                  setBasicInformation((prevState) => ({
                    ...prevState,
                    resource: {
                      ...prevState.resource,
                      company_resource_id: e.target.value,
                    },
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
        ) 
      }

      {
        jobTypes.length > 0 && (
          <Grid item xs={12} lg={3}>
            <Item>
              <TextField
                label="Loại công việc (Ex: Fulltime, Parttime, ...)"
                variant="outlined"
                value={basicInformation.job_type.job_type_id || ""}
                onChange={(e) => {
                  setBasicInformation((prevState) => ({
                    ...prevState,
                    job_type: {
                      ...prevState.job_type,
                      job_type_id: e.target.value,
                    },
                  }))
                }
                }
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
        ) 
      }

      {/* Company name */}
      <Grid item xs={12} lg={6}>
        <Item>
          <TextField
            label="Công ty"
            variant="outlined"
            value={basicInformation.company_name || "1"}
            onChange={(e) => {
              setBasicInformation((prevState) => ({
                ...prevState,
                company_name: e.target.value,
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
            value={basicInformation.province_id || "1"}
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
            value={basicInformation.district_id || "1"}
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
            value={basicInformation.ward_id || "1"}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                ward_id: e.target.value,
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
            value={basicInformation.address || "1"}
            onChange={(e) => {
              setBasicInformation((prevState) => ({
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
            value={basicInformation.phone_contact ? basicInformation.phone_contact.replace("+84", "0") : ""}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                phone_contact: e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>


      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            label="Email"
            variant="outlined"
            value={basicInformation.email}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                email: e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>
      {/* Is working date period */}
      <Grid item xs={12} lg={3}>
        <Item>
          <TextField
            select
            label="Thời gian làm việc"
            value={basicInformation.is_date_period || 0}
            onChange={(e) => {
              setBasicInformation((prevState) => ({
                ...prevState,
                is_date_period: e.target.value,
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
      {basicInformation.is_date_period === 1 && (
        <>
          <Grid item xs={6} lg={3}>
            <Item>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={moment(basicInformation.start_date) || null}
                  onChange={(e) =>
                    setBasicInformation((prevState) => ({
                      ...prevState,
                      start_date: new Date(e._d).getTime(),
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
                  value={moment(basicInformation.end_date) || null}
                  onChange={(e) =>
                    setBasicInformation((prevState) => ({
                      ...prevState,
                      end_date: new Date(e._d).getTime(),
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
              value={moment(basicInformation.start_time) || null}
              onChange={(e) =>
                setBasicInformation((prevState) => ({
                  ...prevState,
                  start_time: new Date(e._d).getTime(),
                }))
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
              value={moment(basicInformation.end_time) || null}
              onChange={(e) =>
                setBasicInformation((prevState) => ({
                  ...prevState,
                  end_time: new Date(e._d).getTime(),
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
            InputLabelProps={{
              shrink: true,
            }}
            value={basicInformation.salary_min || 0}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                salary_min: +e.target.value,
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
            value={basicInformation.salary_max || 0}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                salary_max: +e.target.value,
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
              value={basicInformation.salary_type_id || 0}
              onChange={(e) =>
                setBasicInformation((prevState) => ({
                  ...prevState,
                  salary_type_id: e.target.value,
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
            value={basicInformation.money_type || 1}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                money_type: e.target.value,
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
                checked={basicInformation.is_working_weekend === 1}
                onChange={() =>
                  setBasicInformation((prevState) => ({
                    ...prevState,
                    is_working_weekend:
                      prevState.is_working_weekend === 0 ? 1 : 0,
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
                checked={basicInformation.is_remotely === 1}
                onChange={() =>
                  setBasicInformation((prevState) => ({
                    ...prevState,
                    is_remotely: prevState.is_remotely === 0 ? 1 : 0,
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
            value={basicInformation.description || "1"}
            onChange={(e) =>
              setBasicInformation((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            fullWidth
          />
        </Item>
      </Grid>

      <Grid item xs={12} lg={3}>
        <Item>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label="Thời gian hêt hạn"
              value={moment(basicInformation.expired_date) || null}
              onChange={(e) =>
                setBasicInformation((prevState) => ({
                  ...prevState,
                  expired_date: new Date(e._d),
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

export default memo(BasicInformation);