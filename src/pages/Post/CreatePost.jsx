import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

import { axios } from "configs";
import {
  ConfirmDialog,
  CreatePostInformations,
  CreatePostCategories,
  CreatePostImages,
} from "components";
import { createPostValidation, validatePostImages } from "validations";
import { usePermission } from "hooks";

const initPost = {
  title: "",
  companyName: "",
  provinceId: null,
  districtId: null,
  wardId: null,
  address: "",
  latitude: null,
  longitude: null,
  isDatePeriod: 0,
  startDate: null,
  endDate: null,
  startTime: new Date(1970, 0, 2, 0, 0).getTime(),
  endTime: new Date(1970, 0, 2, 0, 0).getTime(),
  isWorkingWeekend: 0,
  isRemotely: 0,
  salaryMin: 0,
  salaryMax: 0,
  salaryType: 1,
  moneyType: 1,
  description: "",
  phoneNumber: "",
  categories: [],
  images: [],
  jobTypeId: null,
  companyResourceId: null,
  url: "",
  email: "",
  expiredDate: null,
};

const CreatePostPage = () => {
  usePermission();

  const navigate = useNavigate();
  const theme = useTheme();

  const [post, setPost] = useState(initPost);
  
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState(
    allCategories.map((category) => ({
      id: category.parent_category_id,
      name: category.parent_category,
    }))
  );
  const [parentCategoryIdSelected, setParentCategoryIdSelected] =
    useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [isShowConfirmDialog, setIsShowConfirmDialog] = useState(false);
  const [images, setImages] = useState([]);

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

  const fetchAllCategories = async () => {
    const res = await axios.get("/v1/categories");
    if (res.success) {
      setAllCategories(res.data);
      setParentCategories(
        res.data.map((category) => ({
          id: category.parent_category_id,
          name: category.parent_category,
        }))
      );
    }
  };

  const fetchAllLocations = async () => {
    const res = await axios.get("/v1/locations");
    if (res.success) {
      setLocations(res.data);
    }
  };

  // Fetch salary types and categories
  useEffect(() => {
    fetchSalaryTypes();
    fetchJobTypes();
    fetchCompaniesResource();
    fetchAllCategories();
    fetchAllLocations();
  }, []);

  // Set child categories when change parent category
  useEffect(() => {
    if (parentCategoryIdSelected) {
      setChildCategories(
        allCategories.find(
          (category) => category.parent_category_id === parentCategoryIdSelected
        ).childs
      );
    }
  }, [parentCategoryIdSelected]);

  // Handle change child category
  const handleOnChangeChildCategory = (e) => {
    if (e.target.value.length > post.categories.length) {
      const childIdSelected = e.target.value[e.target.value.length - 1];
      const index = e.target.value.indexOf(childIdSelected);
      if (index >= 0 && index < e.target.value.length - 1) {
        setPost((prevState) => ({
          ...prevState,
          categories: prevState.splice(index, 1),
        }));
      } else {
        const childCategorySelected = childCategories.find(
          (childCategory) => childCategory.id === childIdSelected
        );
        const parentCategorySelected = parentCategories.find(
          (parentCategory) => parentCategory.id === parentCategoryIdSelected
        );
        if (childCategorySelected && parentCategorySelected) {
          setPost((prevState) => ({
            ...prevState,
            categories: [
              ...post.categories,
              {
                parent_id: parentCategorySelected.id,
                parent_name: parentCategorySelected.name,
                child_id: childCategorySelected.id,
                child_name: childCategorySelected.name,
              },
            ],
          }));
        }
      }
    } else {
      // Find removed element
      setPost((prevState) => ({
        ...prevState,
        categories: prevState.categories.filter((category) =>
          e.target.value.includes(category.child_id)
        ),
      }));
    }
  };

  // Handle on change images
  const handleOnChangeImages = async (e) => {
    const imagesUpload = Array.from(e.target.files);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 840,
    };

    const imagesToCheck =
      images.length + imagesUpload.length > 5
        ? imagesUpload.slice(0, 5 - images.length)
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

  // Handle submit create post
  const handleOnCreatePost = async () => {
    setIsShowConfirmDialog(false);

    const createPostValidationReply = createPostValidation(post);
    if (createPostValidationReply.isError) {
      // console.log(createPostValidationReply.field);
      return toast.warn(createPostValidationReply.message);
    }

    // if (images.length === 0) {
    //   return toast.warn("Vui lòng chọn ít nhất 1 ảnh");
    // }

    const postSubmit = new FormData();
    postSubmit.append("title", post.title.trim());
    postSubmit.append("companyName", post.companyName.trim());
    postSubmit.append("wardId", post.wardId);
    postSubmit.append("address", post.address.trim());
    // postSubmit.append("latitude", 10.761955);
    // postSubmit.append("longitude", 106.70183);
    postSubmit.append("isDatePeriod", post.isDatePeriod);
    post.startDate && postSubmit.append("startDate", post.startDate);
    post.endDate && postSubmit.append("endDate", post.endDate);

    postSubmit.append(
      "startTime",
      post.startTime,
    );
    postSubmit.append(
      "endTime",
      post.endTime
    );
    postSubmit.append("isWorkingWeekend", post.isWorkingWeekend);
    postSubmit.append("isRemotely", post.isRemotely);
    postSubmit.append("salaryMin", post.salaryMin);
    postSubmit.append("salaryMax", post.salaryMax);
    postSubmit.append("salaryType", post.salaryType);
    postSubmit.append("moneyType", post.moneyType);
    postSubmit.append("description", post.description.trim());
    post.phoneNumber && postSubmit.append("phone", post.phoneNumber);
    post.categories.forEach((category) => {
      postSubmit.append("categoriesId", category.child_id);
    });
    images.forEach((image) => postSubmit.append("images", image.image));

    // NEW FIELD
    post.email && postSubmit.append("email", post.email);
    postSubmit.append("jobTypeId", post.jobTypeId ? post.jobTypeId : 3);
    postSubmit.append("companyResourceId", post.companyResourceId ? post.companyResourceId : "");
    postSubmit.append("siteUrl", post.url);

    post.expiredDate && postSubmit.append("expiredDate", post.expiredDate);
    let toastId = toast.loading("Please wait...");

    // Fetch api
    try {
      // await axios.post("/v3/posts/by-worker", postSubmit, {
      await axios.post("https://web-service-tkv2.onrender.com/api/v3/posts/by-worker", postSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPost(initPost);
      setDistricts([]);
      setWards([]);
      images.forEach((image) => window.URL.revokeObjectURL(image));
      setImages([]);
      return toast.update(toastId, {
        render: "Tạo bài đăng thành công",
        type: toast.TYPE.SUCCESS,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    } catch (error) {
      console.log("Create post error ::: ", error);
      if (error.response && error.response.status === 401) {
        return navigate("/admin/auth");
      }
      return toast.update(toastId, {
        render: "Tạo bài đăng thất bại",
        type: toast.TYPE.ERROR,
        closeButton: true,
        closeOnClick: true,
        autoClose: 4000,
        isLoading: false,
      });
    }
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h2" color={theme.palette.color.main}>
          Tạo bài đăng
        </Typography>
        <Link to="/admin/worker-manager/detail?own=true">
          <Button variant="outlined">Bài đã đăng</Button>
        </Link>
      </Box>

      <Box>
        {/* BASIC INFORMATION */}
        <Box sx={{ flexGrow: 1, padding: "2rem 0" }}>
          <CreatePostInformations
            post={post}
            setPost={setPost}
            locations={locations}
            districts={districts}
            wards={wards}
            setDistricts={setDistricts}
            setWards={setWards}
            salaryTypes={salaryTypes}
            jobTypes={jobTypes}
            companies={companies}
          />
        </Box>

        {/*  CATEGORIES */}
        <Box p="2rem 0">
          <Typography mb="2rem" variant="h3" color={theme.palette.color.main}>
            Danh mục nghành nghề
          </Typography>
          <CreatePostCategories
            parentCategories={parentCategories}
            childCategories={childCategories}
            parentCategoryIdSelected={parentCategoryIdSelected}
            setParentCategoryIdSelected={setParentCategoryIdSelected}
            categories={post.categories}
            handleOnChangeChildCategory={handleOnChangeChildCategory}
          />
        </Box>

        {/* Images */}
        <Box p="2rem 0">
          <Typography mb="1rem" variant="h3" color={theme.palette.color.main}>
            Hình ảnh
          </Typography>

          <Typography variant="p" color={theme.palette.color.main}>
            Có thể tải tối đa 5 ảnh, mỗi ảnh không quá 10MB. (Định dạng cho
            phép: jpeg, jpg, png)
          </Typography>

          <Box mt="2rem">
            <Button
              variant="outlined"
              component="label"
              disabled={images.length === 5}
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
        </Box>

        {/* SUBMIT BUTTON */}
        <Button
          sx={{ marginTop: "1rem" }}
          variant="outlined"
          onClick={() => setIsShowConfirmDialog(true)}
        >
          Tạo
        </Button>

        {/* DIALOG */}
        <ConfirmDialog
          isOpen={isShowConfirmDialog}
          onClose={() => setIsShowConfirmDialog(false)}
          onClickConfirm={handleOnCreatePost}
          title="Tạo bài đăng"
          text="Hãy kiểm tra thật kỹ thông tin trước khi nhấn nút Đồng ý"
        />
      </Box>
    </Box>
  );
};

export default CreatePostPage;