
const createCommunityValidation = (post) => {

  if (post.title.trim() === "") {
    return {
      isError: true,
      message: "Tên công việc không hợp lệ",
      field: "title",
    };
  }
  if (post.content.trim() === "") { 
    return { 
      isError: true,
      message: "Content không được để trống",
      field: "content",
    }
  }
  return {
    isError: false,
  };
};

export default createCommunityValidation;
