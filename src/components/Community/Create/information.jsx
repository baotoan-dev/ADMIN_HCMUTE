import { Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextField } from "components";
import JoditEditor from "jodit-react";
import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";

const Item = styled(Box)(({ theme }) => ({
  textarea: {
    fontSize: "1rem",
  },
}));

const CreateCommunityInformations = ({ community, setCommunity }) => {
  const [content, setContent] = useState("");
  const [logs, setLogs] = useState([]);
  const appendLog = useCallback(
    (message) => {
      setCommunity({
        ...community,
        content: message,
      });
    },
    [logs, setLogs, community]
  );
  const themeMode = localStorage.getItem("theme-mode");

  const config = useMemo(
    () => ({
      readonly: false,
      minHeight: 600,
      toolbar: true,
      spellcheck: false,
      toolbarAdaptive: false,
      toolbarSticky: false,
      toolbarButtonSize: "large",
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      askBeforePasteFromExcel: false,
      askBeforePaste: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      showPlaceholder: false,
      showWordsCounterInFooter: false,
      showCharsCounterInFooter: false,
      showTooltip: true,
      showTooltipDelay: 0,
      showTooltipOnSelection: false,
      style: {
        background: themeMode === 'light' ? '#ffff' : '#0a1929',
        color: "#ffff",
      },
      theme: "dark",
    }),
    []
  );

  const onChange = () => (
    (newContent) => {
      appendLog(`${newContent}`);
      setCommunity(newContent);
    },
    [appendLog]
  );

  const onBlur = useCallback(
    (newContent) => {
      appendLog(`${newContent}`);
    },
    [appendLog, setContent]
  );

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

      {/* <Grid item xs={12} lg={12}>
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
      </Grid> */}

      <Grid item xs={12} lg={12}>
        <JoditEditor
          value={community.content}
          config={config}
          tabIndex={1}
          onBlur={onBlur}
          onChange={onChange}
        />
      </Grid>
    </Grid>
  );
};

export default CreateCommunityInformations;
