const updatePostValidation = (post) => {

  if (!post.title) {
    return {
      isError: true,
      message: "Tiêu đề không hợp lệ",
      field: "title",
    };
  }
  // if (!post.url) {
  //   return {
  //     isError: true,
  //     message: "URL không hợp lệ",
  //     field: "url",
  //   };
  // }
  if (!post.companyResourceId){
    return {
      isError: true,
      message: "Nguồn không hợp lệ",
      field: "companyResourceId",
    }
  }
  if (!post.jobTypeId) {
    return {
      isError: true,
      message: "Loại công việc không hợp lệ",
      field: "jobTypeId",
    }
  }
  if (!post.companyName) {
    return {
      isError: true,
      message: "Tên công ty không hợp lệ",
      field: "companyName",
    };
  }
  if (!post.wardId) {
    return {
      isError: true,
      message: "Quận/Huyện không hợp lệ",
      field: "wardId",
    };
  }
  if (!post.address) {
    return {
      isError: true,
      message: "Tên đường không hợp lệ",
      field: "address",
    };
  }
  // if(post.email){
  //   if(!validator.isEmail(post.email.trim()))
  //   {
  //     return {
  //       isError: true,
  //       message: "Email không hợp lệ",
  //       field: "email",
  //     };
  //   }
  // }
  // else{
  //   return {
  //     isError: true,
  //     message: "Email không được để trống",
  //     field: "email",
  //   }
  // }
  // if (!post.description.trim()) {
  //   return {
  //     isError: true,
  //     message: "Thông tin mô tả không hợp lệ",
  //     field: "description",
  //   };
  // }
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
  //   !post.startTime ||
  //   !post.endTime ||
  //   new Date(post.startTime).toString() === "Invalid Date" ||
  //   new Date(post.endTime).toString() === "Invalid Date"
  // ) {
  //   return {
  //     isError: true,
  //     message: "Thời gian làm việc không hợp lệ",
  //     field: "startTime | endTime",
  //   };
  // }
  if (!Number.isInteger(post.salaryMin)) {
    return {
      isError: true,
      message: "Giá trị lương không hợp lệ",
      field: "salaryMin",
    };
  }
  if (!Number.isInteger(post.salaryMax)) {
    return {
      isError: true,
      message: "Giá trị lương không hợp lệ",
      field: "salaryMax",
    };
  }
  if (!Number.isInteger(post.salaryType)) {
    return {
      isError: true,
      message: "Phương thức tính lương không hợp lệ",
      field: "salaryType",
    };
  }
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
  if (!post.description.trim()) {
    return {
      isError: true,
      message: "Thông tin mô tả bài viết không hợp lệ",
      field: "description",
    };
  }
  if(post.description !== '' && post.description.length > 4000)
  {
    return {
      isError: true,
      message: "Thông tin mô tả quá dài",
      field: "description",
    };
  }
  if (post.categoryIds.length === 0) {
    return {
      isError: true,
      message: "Vui lòng chọn danh mục ngành nghề",
      field: "category",
    };
  }

  return {
    isError: false,
  };
};

export default updatePostValidation;
