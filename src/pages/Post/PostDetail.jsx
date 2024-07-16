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
import { IoIosCreate } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { API_CONSTANT_V3 } from "constant/urlServer";
import { useNavigate } from "react-router-dom";

const PostDetail = () => {
  usePermission();
  const navigation = useNavigate();
  const theme = useTheme();
  const params = useParams();
  const id = +params.id;
  const role = localStorage.getItem("role");
  const [postData, setPostData] = useState();
  const [basicInformation, setBasicInformation] = useState(null);
  const [postCategories, setPostCategories] = useState([]);
  const [enabledImages, setEnabledImages] = useState([]);
  const [disabledImages, setDisabledImages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmApprovalModal, setShowConfirmApprovalModal] =
    useState(false);
  const [postStatusApproved, setPostStatusApproved] = useState(1);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
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
    const res = await axios.get(`/v1/history/recruiter/${id}/applications`);

    if (res.success) {
      setApplications(res.data.applications);
    }
  };

  // USE EFFECT
  // GET POST DATA, APPLICATIONS
  useEffect(() => {
    if (id) {
      fetchPostData(id);
      fetchApplicationsOfPostData(id);
    }
  }, [id]);

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
      title: basicInformation.title ? basicInformation.title : "",
      companyName: basicInformation.company_name
        ? basicInformation.company_name
        : "",
      wardId: basicInformation.ward_id,
      address: basicInformation.address ? basicInformation.address : "",
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
      description: basicInformation.description
        ? basicInformation.description
        : "",
      categoryIds: postCategories.map((category) => category.child_category_id),
      enabledImageIds: enabledImages.map((image) => image.id),
      disabledImageIds: disabledImages.map((image) => image.id),
      jobTypeId: basicInformation.job_type.job_type_id,
      companyResourceId: basicInformation.resource.company_resource_id,
      url: basicInformation.resource.url,
      email: basicInformation.email ? basicInformation.email : null,
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

  const handleDeletePost = async (id) => {
    const res = await axios.delete(
      `${API_CONSTANT_V3}/v3/posts/by-admin/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );

    if (res && res.statusCode === 200) {
      toast.success(res.message);
      navigation("/admin/post-history");
    } else {
      toast.error(res.message);
    }
  };

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
          Post Details
        </Typography>

        <Link to="/admin/posts/create">
          <Button variant="outlined">
            <IoIosCreate />
          </Button>
        </Link>
      </Box>
      {postData ? (
        <Box>
          {basicInformation.status === 0 && role === "1" && (
            <Box>
              <Typography sx={{ color: "#eee", marginBottom: "1rem" }}>
                This article has not been approved
              </Typography>
              <Button
                variant="outlined"
                sx={{ marginRight: "2rem" }}
                onClick={() => {
                  setPostStatusApproved(1);
                  setShowConfirmApprovalModal(true);
                }}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setPostStatusApproved(2);
                  setShowConfirmApprovalModal(true);
                }}
              >
                Reject
              </Button>
            </Box>
          )}

          {role === "1" && basicInformation.status === 1 && (
            <Box>
              <Button
                variant="outlined"
                sx={{ marginTop: "1rem", marginRight: "1rem" }}
                onClick={() => {
                  setPostStatusApproved(2);
                  setShowConfirmApprovalModal(true);
                }}
              >
                <FaEyeSlash />
              </Button>
              <Button
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                onClick={() => {
                  setShowModalConfirmDelete(true);
                }}
              >
                <MdAutoDelete />
              </Button>
            </Box>
          )}

          {role === "1" && basicInformation.status === 2 && (
            <Box>
              <Button
                variant="outlined"
                sx={{ marginTop: "1rem", marginRight: "1rem" }}
                onClick={() => {
                  setPostStatusApproved(1);
                  setShowConfirmApprovalModal(true);
                }}
              >
                <FaEye />
              </Button>
              <Button
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                onClick={() => {
                  setShowModalConfirmDelete(true);
                }}
              >
                <MdAutoDelete />
              </Button>
            </Box>
          )}

          {/* BASIC INFORMATION */}
          {/* {basicInformation !== null && ( */}
          <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Article information
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
              Categories
            </Typography>
            <PostCategories
              categories={postCategories}
              setCategories={setPostCategories}
            />
          </Box>

          {/* APPLICATIONS */}
          <Box width="100%" p="2rem 0" sx={{ color: "#eeeeee" }}>
            <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
              Applications
            </Typography>
            <Box height="400px">
              <Table
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
                  Valid Images
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
                  Invalid Images
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
              Save
            </Button>
          )}

          {/* Confirm update post dialog */}
          <ConfirmDialog
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onClickConfirm={handleSubmitPostData}
            title="Update post"
            text="Are you sure?"
          />

          {/* Confirm update post status dialog */}
          <ConfirmDialog
            isOpen={showConfirmApprovalModal}
            onClose={() => setShowConfirmApprovalModal(false)}
            onClickConfirm={handleApprovePost}
            title="Approve a post"
            text={
              postStatusApproved === 1
                ? "This post will be approved, are you sure?"
                : "This post won't be approved, are you sure?"
            }
          />
          <ConfirmDialog
            isOpen={showModalConfirmDelete}
            onClose={() => setShowModalConfirmDelete(false)}
            onClickConfirm={() => handleDeletePost(id)}
            title="Delete post"
            text="Are you sure?"
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
