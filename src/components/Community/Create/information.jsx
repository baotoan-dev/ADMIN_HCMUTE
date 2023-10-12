import { Grid, Box} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextField } from "components";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CreateCommunityInformations = ({ community, setCommunity }) => {
  return (
    <Grid container spacing={4}>
      {/* Title */}
      <Grid item xs={12} lg={12}>
        <Item>
          <TextField
            label="Tiêu đề"
            variant="outlined"
            value={community.title}
            onChange={(e) => {
              setCommunity((prevState) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
            fullWidth
          />
        </Item>
      </Grid>

      <Grid item xs={12} lg={12}>
        <Item>
          <TextField
            label="Nội dung"
            variant="outlined"
            value={community.content}
            multiline
            rows={4}
            onChange={(e) => {
              setCommunity((prevState) => ({
                ...prevState,
                content: e.target.value,
              }));
            }}
            size="large"
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export default CreateCommunityInformations;
