import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
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

import { axios } from "configs";
import {
  ConfirmDialog,
  Table,
  PostBasicInformation,
  PostCategories,
  ImageList,
} from "components";
import { applicationsOfPostColumns } from "configs/table";
import { ArrowLeft } from "components/Icons";
import updatePostValidation from "validations/post/update";
import { usePermission } from "hooks";
import imageCompression from "browser-image-compression";

const PostDetail = () => {
  usePermission();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [currentPage, setCurrentPage] = useState(1);
  const [postData, setPostData] = useState();
  const [modifyLimit, setModifyLimit] = useState(10)
  const [checkData, setCheckData] = useState(false);
  const [basicInformation, setBasicInformation] = useState(null);
  const [postCategories, setPostCategories] = useState([]);
  const [enabledImages, setEnabledImages] = useState([]);
  const [disabledImages, setDisabledImages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmApprovalModal, setShowConfirmApprovalModal] =
    useState(false);
  const [postStatusApproved, setPostStatusApproved] = useState(1);

  const handleOnChangeImages = async (e) => {
    const imagesUpload = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 840,
    };

    const imagesToCheck =
      enabledImages.length + disabledImages.length + imagesUpload.length > 5
        ? imagesUpload.slice(0, 5 - enabledImages.length)
        : imagesUpload;
    if (imagesToCheck.length > 0) {
      const validateImagesReply = validateImagesReply(imagesToCheck);
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

          // console.log("Original image ::: ", imagesUpload);
          // console.log("Compressed image ::: ", compressedImages);

          // setImages((prevState) => [
          //   ...prevState,
          //   ...compressedImages.map((image) => ({
          //     image,
          //     preview: window.URL.createObjectURL(image),
          //   })),
          // ]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // GET POST DATA
  const fetchPostData = async (id) => {
    const res = await axios.get(`/v1/posts/by-admin/${id}`);
    // console.log("fetchPostData -> res", res);
    if (res.success) {
      const { categories, images, ...otherData } = res.data;
      // console.log("fetchPostData -> otherData");
      // SET BASIC INFORMATION
      setBasicInformation(otherData);
      setPostData(res.data);
      // console.log(otherData);

      // SET CATEGORIES
      setPostCategories(res.data.categories);

      // SET ENABLED IMAGE URLS
      setEnabledImages(res.data.images.filter((image) => image.status === 1));

      // SET DISABLED IMAGE URLS
      setDisabledImages(res.data.images.filter((image) => image.status === 0));
    }
  };

  // GET APPLICATIONS
  const fetchApplicationsOfPostData = async (id) => {

    let limitNumber = +modifyLimit ? +modifyLimit : 10

    const res = await axios.get(`/v1/history/recruiter/${id}/applications`);

    // const res = await axios.get(`/v1/history/recruiter/${id}/applications?page=${currentPage}&limit=${limitNumber}`);
    if (res.success) {
      setApplications(res.data.applications);

      if (res?.data.applications.length > 0) {
        setCheckData(true);
      }
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchPostData(id);
      fetchApplicationsOfPostData(id);
    }
  }, [currentPage, modifyLimit]);

  // HANDLE DISABLE PHOTO
  const handleDisableImage = useCallback((image) => {
    setEnabledImages((prevState) =>
      prevState.filter((prevStateImage) => prevStateImage.image !== image.image)
    );
    setDisabledImages((prevState) => [{ ...image, status: 0 }, ...prevState]);
  }, []);

  // HANDLE ENABLE PHOTO
  const handleEnableImage = useCallback((image) => {
    setDisabledImages((prevState) =>
      prevState.filter((prevStateImage) => prevStateImage.image !== image.image)
    );
    setEnabledImages((prevState) => [{ ...image, status: 1 }, ...prevState]);
  }, []);

  // HANDLE SUBMIT
  const handleSubmitPostData = async () => {
    // HIDE MODAL
    setShowConfirmModal(false);

    const data = {
      id: id,
      title: basicInformation.title.trim(),
      companyName: basicInformation.company_name.trim(),
      wardId: basicInformation.ward_id,
      address: basicInformation.address.trim(),
      phoneContact: basicInformation.phone_contact,
      isDatePeriod: basicInformation.is_date_period,
      isWorkingWeekend: basicInformation.is_working_weekend,
      isRemotely: basicInformation.is_remotely,
      startDate: basicInformation.start_date,
      endDate: basicInformation.end_date,
      startTime: basicInformation.start_time,
      endTime: basicInformation.end_time,
      salaryMin: basicInformation.salary_min,
      salaryMax: basicInformation.salary_max,
      salaryType: basicInformation.salary_type_id,
      moneyType: basicInformation.money_type,
      description: basicInformation.description.trim(),
      categoryIds: postCategories.map((category) => category.child_category_id),
      enabledImageIds: enabledImages.map((image) => image.id),
      disabledImageIds: disabledImages.map((image) => image.id),
      jobTypeId: basicInformation.job_type.job_type_id,
      companyResourceId: basicInformation.resource.company_resource_id,
      url: basicInformation.resource.url,
      email: basicInformation.email ? basicInformation.email.trim() : null,
      expiredDate: basicInformation.expired_date,
    };

    // console.log("handleSubmitPostData -> data", data)

    // VALIDATION
    const validationRes = updatePostValidation(data);
    
    if (validationRes.isError) {
      return toast.warn(validationRes.message);
    }

    // GET RESPONSE
    try {
      await axios.put("/v1/posts/inf/by-ad", data);
      return toast.success("Cập nhật bài đăng thành công");
    } catch (error) {
      return toast.error("Cập nhật bài đăng thất bại");
    }
  };

  // HANDLE APPROVE POST
  const handleApprovePost = async () => {
    setShowConfirmApprovalModal(false);

    if (
      !Number.isInteger(postStatusApproved) ||
      (postStatusApproved !== 1 && postStatusApproved !== 2)
    ) {
      return toast.warn("Trạng thái phê duyệt của bài đăng không hợp lệ");
    }

    // UPDATE POST STATUS
    const res = await axios.put(`/v1/posts/sta/`, {
      id,
      status: postStatusApproved,
    });
    if (res && res.success) {
      setBasicInformation((prevState) => ({
        ...prevState,
        status: postStatusApproved,
      }));
      return toast.success("Phê duyệt bài đăng thành công");
    } else {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  }

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }

  const handleOnchangeLimit = (limit) => {
    setModifyLimit(limit);
  }

  const handleSearchFilterParent = (search) => {
    console.log(search);
  }

  return (
    <Box sx={{ padding: "1rem" }}>
      {role === "2" && (
        <Tooltip title="Quay trở lại danh sách">
          <Link to="/admin/posts?own=true">
            <IconButton>
              <ArrowLeft />
            </IconButton>
          </Link>
        </Tooltip>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h2" color={theme.palette.color.main}>
          Chi tiết bài đăng
        </Typography>

        <Link to="/admin/posts/create">
          <Button variant="outlined">Tạo bài đăng</Button>
        </Link>
      </Box>
      {postData ? (
        <Box>
          {basicInformation.status === 0 && role === "1" && (
            <Box>
              <Typography sx={{ color: "#eee", marginBottom: "1rem" }}>
                Bài viết này chưa được phê duyệt
              </Typography>
              <Button
                variant="outlined"
                sx={{ marginRight: "2rem" }}
                onClick={() => {
                  setPostStatusApproved(1);
                  setShowConfirmApprovalModal(true);
                }}
              >
                Phê duyệt
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setPostStatusApproved(2);
                  setShowConfirmApprovalModal(true);
                }}
              >
                Không phê duyệt
              </Button>
            </Box>
          )}

          {role === "1" && basicInformation.status === 1 && (
            <Button
              variant="outlined"
              sx={{ marginTop: "1rem" }}
              onClick={() => {
                setPostStatusApproved(2);
                setShowConfirmApprovalModal(true);
              }}
            >
              Bỏ bài đăng
            </Button>
          )}

          {role === "1" && basicInformation.status === 2 && (
            <Button
              variant="outlined"
              sx={{ marginTop: "1rem" }}
              onClick={() => {
                setPostStatusApproved(1);
                setShowConfirmApprovalModal(true);
              }}
            >
              Phục hồi bài đăng
            </Button>
          )}

          {/* BASIC INFORMATION */}
          {/* {basicInformation !== null && ( */}
          <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Thông tin bài viết
            </Typography>
            <PostBasicInformation
              basicInformation={basicInformation}
              setBasicInformation={setBasicInformation}
            />
          </Box>
          {/* )} */}

          {/*  CATEGORIES */}
          <Box p="2rem 0">
            <Typography mb="1rem" variant="h3" color={theme.palette.color.main}>
              Danh mục nghành nghề
            </Typography>
            <PostCategories
              categories={postCategories}
              setCategories={setPostCategories}
            />
          </Box>

          {/* APPLICATIONS */}
          <Box width="100%" p="2rem 0" sx={{ color: "#eeeeee" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Đơn ứng tuyển
            </Typography>
            <Box height="400px">
              <Table
                // handleOnchangeLimit={handleOnchangeLimit}
                // handleSearchFilterParent={handleSearchFilterParent}
                // checkData={checkData}
                // prevPage={prevPage}
                // currentPage={currentPage}
                // nextPage={nextPage}
                rows={applications}
                columns={applicationsOfPostColumns}
                showCheckbox={false}
              />
            </Box>
          </Box>

          {/* Images */}
          {role === "1" && (
            <>
              {/* ENABLED PHOTOS */}
              <Box p="2rem 0">
                <Typography
                  mb="2rem"
                  variant="h3"
                  color={theme.palette.color.main}
                >
                  Hình ảnh hợp lệ
                </Typography>
                <ImageList
                  images={enabledImages}
                  handleOnClick={handleDisableImage}
                />
              </Box>

              {/* DISABLED PHOTOS */}
              <Box p="2rem 0">
                <Typography
                  mb="2rem"
                  variant="h3"
                  color={theme.palette.color.main}
                >
                  Hình ảnh không hợp lệ
                </Typography>
                <ImageList
                  images={disabledImages}
                  handleOnClick={handleEnableImage}
                />
              </Box>
            </>
          )}

          {role === "2" && (
            <Box p="2rem 0">
              <Typography
                mb="2rem"
                variant="h3"
                color={theme.palette.color.main}
              >
                Images
              </Typography>
              <Box mt="2rem">
                <Button
                  variant="outlined"
                  component="label"
                  disabled={enabledImages.length === 5}
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
              <ImageList
                images={enabledImages}
                handleOnClick={handleDisableImage}
              />
            </Box>
          )}

          {/* SUBMIT BUTTON */}
          {(role === "1" || role === "2") && (
            <Button
              sx={{ marginTop: "1rem" }}
              variant="outlined"
              onClick={() => setShowConfirmModal(true)}
            >
              Lưu
            </Button>
          )}

          {/* Confirm update post dialog */}
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onClickConfirm={handleSubmitPostData}
            title="Cập nhật thông tin bài đăng"
            text="Bạn đã chắc chắn với thông tin đã chỉnh sửa?"
          />

          {/* Confirm update post status dialog */}
          <ConfirmDialog
            isOpen={showConfirmApprovalModal}
            onClose={() => setShowConfirmApprovalModal(false)}
            onClickConfirm={handleApprovePost}
            title="Phê duyệt bài đăng"
            text={
              postStatusApproved === 1
                ? "Bài đăng này sẽ được phê duyệt, bạn chắc chắn chứ?"
                : "Bài đăng này sẽ không được phê duyệt, bạn chắc chắn chứ?"
            }
          />
        </Box>
      ) : (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={60} />
          <Skeleton variant="rounded" width={210} height={60} />
        </Stack>
      )}
    </Box>
  );
};

export default PostDetail;