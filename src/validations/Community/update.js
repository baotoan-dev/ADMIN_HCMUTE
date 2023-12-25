const updateCommunityValidation = (community) => {
  if (!community.title.trim()) {
    return {
      isError: true,
      message: "Tiêu đề không hợp lệ",
      field: "title",
    };
  }
  if (!community.content.trim()) {
    return {
      isError: true,
      message: "Nội dung không hợp lệ",
      field: "content",
    };
  }

  return {
    isError: false,
  };
};

export default updateCommunityValidation;
