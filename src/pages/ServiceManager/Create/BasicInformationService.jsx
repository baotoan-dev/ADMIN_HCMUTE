import { memo } from "react";
import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";

import { TextField } from "components";
const Item = styled(Box)(({ theme }) => ({
    textarea: {
        fontSize: "1rem",
    },
}));


const BasicInformationService = ({ basicInformation, setBasicInformation }) => {
    return (
        basicInformation && (
            <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                    <Item>
                        <TextField
                            label="ID"
                            variant="outlined"
                            value={basicInformation.id || "1"}
                            InputProps={{
                                readOnly: true,
                            }}
                            onChange={(e) => { }}
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
                            value={
                                moment(basicInformation.created_at).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                ) || ""
                            }
                            InputProps={{
                                readOnly: true,
                            }}
                            onChange={(e) => { }}
                            fullWidth
                        />
                    </Item>
                </Grid>

                {/* Title */}
                <Grid item xs={12} lg={6}>
                    <Item>
                        <TextField
                            label="Tên"
                            variant="outlined"
                            value={basicInformation.name || ""}
                            onChange={(e) => {
                                setBasicInformation((prevState) => ({
                                    ...prevState,
                                    name: e.target.value,
                                }));
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>

                {/* price */}

                <Grid item xs={12} lg={3}>
                    <Item>
                        <TextField
                            label="Giá"
                            type="number"
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            value={basicInformation.price || 0}
                            onChange={(e) => {
                                setBasicInformation((prevState) => ({
                                    ...prevState,
                                    price: e.target.value,
                                }));
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>

                <Grid item xs={12} lg={3}>
                    <Item>
                        <TextField
                            label="Loại"
                            type="string"
                            variant="outlined"
                            value={basicInformation.type || ''}
                            onChange={(e) => {
                                setBasicInformation((prevState) => ({
                                    ...prevState,
                                    type: e.target.value,
                                }));
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>



                {/* Discount */}

                <Grid item xs={12} lg={6}>
                    <Item>
                        <TextField
                            label="Giảm giá"
                            variant="outlined"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={basicInformation.discount || 0}
                            onChange={(e) => {
                                setBasicInformation((prevState) => ({
                                    ...prevState,
                                    discount: e.target.value,
                                }));
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>


                {/* Expire */}

                <Grid item xs={12} lg={6}>
                    <Item>
                        <TextField
                            label="Hạn sử dụng"
                            variant="outlined"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={basicInformation.expiration || 0}
                            onChange={(e) => {
                                setBasicInformation((prevState) => ({
                                    ...prevState,
                                    expiration: e.target.value,
                                }));
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>

                {/* URL */}
                <Grid item xs={12} lg={12}>
                    <Item>
                        <TextField
                            label="Mô tả"
                            variant="outlined"
                            multiline
                            rows={6}
                            value={basicInformation.description || ""}
                            onChange={(e) => {
                                setBasicInformation((prevState) => ({
                                    ...prevState,
                                    description: e.target.value,
                                }));
                            }}
                            fullWidth
                        />
                    </Item>
                </Grid>


            </Grid>
        )
    );
};

export default memo(BasicInformationService);
