
const createPostValidation = (post) => {

  if (post.title.trim() === "") {
    return {
      isError: true,
      message: "Tên công việc không hợp lệ",
      field: "title",
    };
  }
  if (post.url.trim() === "") { 
    return { 
      isError: true,
      message: "URL không được để trống",
      field: "url",
    }
  }
  if(!post.companyResourceId){
    return { 
      isError: true,
      message: "Nguồn không hợp lệ",
    }
  }
  if(!post.jobTypeId){
    return { 
      isError: true,
      message: "Loại công việc không hợp lệ",
      field: "url",
    }
  }
  if (post.companyName.trim() === "") {
    return {
      isError: true,
      message: "Tên công ty không được để trống",
      field: "companyName",
    };
  }
  if(!post.provinceId){
    return {
      isError: true,
      message: "Tỉnh/Thành phố không hợp lệ",
      field: "provinceId",
    };
  }
  if (post.wardId.trim() === "") {
    return {
      isError: true,
      message: "Phường/Xã không hợp lệ",
      field: "wardId",
    };
  }
  if (post.address.trim() === "") {
    return {
      isError: true,
      message: "Tên đường không hợp lệ",
      field: "address",
    };
  }
  if (
    !Number.isInteger(post.isDatePeriod) ||
    post.isDatePeriod < 0 ||
    post.isDatePeriod > 1
  ) {
    return {
      isError: true,
      message: "Thông tin không hợp lệ",
      field: "isDatePeriod",
    };
  }
  // if (
  //   new Date(post.startTime).toString() === "Invalid Date" ||
  //   new Date(post.endTime).toString() === "Invalid Date"
  // ) {
  //   return {
  //     isError: true,
  //     message: "Thời gian làm việc không hợp lệ",
  //     field: "startTime | endTime",
  //   };
  // }
  if (
    !Number.isInteger(post.isWorkingWeekend) ||
    post.isWorkingWeekend < 0 ||
    post.isWorkingWeekend > 1
  ) {
    return {
      isError: true,
      message: "Thông tin không hợp lệ",
      field: "isWorkingWeekend",
    };
  }
  if (
    !Number.isInteger(post.isRemotely) ||
    post.isRemotely < 0 ||
    post.isRemotely > 1
  ) {
    return {
      isError: true,
      message: "Thông tin không hợp lệ",
      field: "isRemotely",
    };
  }
  if (
    !Number.isInteger(post.salaryMin) ||
    !Number.isInteger(post.salaryMax) ||
    +post.salaryMin > +post.salaryMax
  ) {
    return {
      isError: true,
      message: "Tiền lương không hợp lệ",
      field: "salaryMin | salaryMax",
    };
  }
  if (
    !Number.isInteger(post.salaryType)
    // ||
    // post.salaryType < 1 ||
    // post.salaryType >= 5
  ) {
    console.log("post.salaryType", post.salaryType);
    return {
      isError: true,
      message: "Thông tin không hợp lệ",
      field: "salaryType",
    };
  }
  if (
    !Number.isInteger(post.moneyType) ||
    post.moneyType < 1 ||
    post.moneyType > 2
  ) {
    return {
      isError: true,
      message: "Thông tin không hợp lệ",
      field: "moneyType",
    };
  }
  // if(post.email.trim() !== ""){
  //   if(!validator.isEmail(post.email.trim()))
  //   {
  //     return {
  //       isError: true,
  //       message: "Email không hợp lệ",
  //       field: "email",
  //     };
  //   }
  // }
  if (!post.description.trim()) {
    return {
      isError: true,
      message: "Thông tin mô tả không hợp lệ",
      field: "description",
    };
  }
  if (post.description.trim().length > 4000) {
    return {
      isError: true,
      message: `Thông tin mô tả vượt quá 4000 kí tự (${
        post.description.trim().length
      })`,
      field: "description",
    };
  }
  if (post.categories.length === 0) {
    return {
      isError: true,
      message: "Vui lòng chọn danh mục công việc",
      field: "category",
    };
  }
  return {
    isError: false,
  };
};

export default createPostValidation;
