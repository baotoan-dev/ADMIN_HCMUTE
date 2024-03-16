export const updateServiceValidation = (service) => {
    if (!service.name.trim()) {
        return {
            isError: true,
            message: "Tên không hợp lệ",
            field: "name",
        };
    }
    if (!service.description.trim()) {
        return {
            isError: true,
            message: "Mô tả không hợp lệ",
            field: "description",
        };
    }
    if (service.price < 0) {
        return {
            isError: true,
            message: "Giá không hợp lệ",
            field: "price",
        };
    }
    if (service.discount < 0) {
        return {
            isError: true,
            message: "Giảm giá không hợp lệ",
            field: "discount",
        };
    }
    if (service.expiration < 0) {
        return {
            isError: true,
            message: "Hạn sử dụng không hợp lệ",
            field: "expiration",
        };
    }

    return {
        isError: false,
    };
}
