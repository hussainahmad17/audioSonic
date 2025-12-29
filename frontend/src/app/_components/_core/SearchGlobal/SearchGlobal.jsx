import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchIconWrapper, StyledInputBase } from "./style";

const SearchGlobal = ({ sx }) => {
  return (
    <Search sx={sx ?? {}}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <StyledInputBase
        name="search-globally"
        placeholder="Search anything"
        inputProps={{ "aria-label": "search" }}
      />
    </Search>
  );
};

export { SearchGlobal };
