import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Stack,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search,
  RotateCcw,
  Download,
  Music,
  Calendar,
  Filter,
  X,
  Eye,
  Mail,   // ✅ add this
} from "lucide-react";

import { getRequest } from "@app/backendServices/ApiCalls";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const FreeAudios = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const rowsPerPage = 10;

  useEffect(() => {
    fetchFreeAudioRecords();
  }, []);

  const fetchFreeAudioRecords = async () => {
    try {
      const response = await getRequest("/free-audio/reports");
      setRecords(Array.isArray(response) ? response : []);
    } catch (err) {
      setError("Failed to fetch free audio downloads");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFreeAudioRecords();
    // Reset filters on refresh
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // --- Export CSV
  const handleExportCSV = () => {
    if (!records.length) return;

    const headers = ["Email", "Audio ID", "Audio Title", "Download Date"];
    const rows = filteredRecords.map((r) => [
      r.email,
      r.audioId?._id || r.audioId || "",
      r.audioId?.title || "",
      r.date ? formatDate(r.date) : "",
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "free_audios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filtering and Sorting
  const filteredRecords = useMemo(() => {
    let filtered = records.filter((r) => {
      // Search filter
      const email = r.email?.toLowerCase() || "";
      const audioIdStr =
        typeof r.audioId === "string"
          ? r.audioId.toLowerCase()
          : r.audioId?._id?.toLowerCase() || "";
      const audioTitle = r.audioId?.title?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      const searchMatch = (
        email.includes(query) ||
        audioIdStr.includes(query) ||
        audioTitle.includes(query)
      );
      
      // Date filter
      let dateMatch = true;
      if (startDate || endDate) {
        const downloadDate = new Date(r.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && downloadDate < start) dateMatch = false;
        if (end) {
          const endOfDay = new Date(end);
          endOfDay.setHours(23, 59, 59, 999);
          if (downloadDate > endOfDay) dateMatch = false;
        }
      }
      
      return searchMatch && dateMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "title":
          aValue = a.audioId?.title || "";
          bValue = b.audioId?.title || "";
          break;
        case "date":
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [records, searchQuery, startDate, endDate, sortBy, sortOrder]);

  // --- Pagination
  const paginatedRecords = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, page]);

  const hasActiveFilters = searchQuery || startDate || endDate;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, mt: 2 }} color="primary.main">
          Free Audio Downloads Report
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
          Total Downloads: <strong>{filteredRecords.length}</strong>
        </Typography>

        {/* Search + Filters + Actions */}
        <Stack spacing={2} mb={3}>
          {/* Search and Sort Row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              placeholder="Search by email, audio ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              variant="outlined"
              sx={{
                width: "100%",
                maxWidth: 350,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#666" />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 90 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="desc">Desc</MenuItem>
                  <MenuItem value="asc">Asc</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={1.5} ml="auto">
              <Button
                variant="outlined"
                startIcon={<RotateCcw size={16} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>

              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={handleExportCSV}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Export CSV
              </Button>
            </Stack>
          </Stack>

          {/* Date Filters Row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Filter size={18} color="#666" />
              <Typography variant="body2" color="textSecondary">
                Date Range:
              </Typography>
            </Stack>
            
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            
            {hasActiveFilters && (
              <Button
                variant="outlined"
                startIcon={<X size={16} />}
                onClick={() => {
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                }}
                size="small"
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          {/* Active Filters Indicator */}
          {hasActiveFilters && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="textSecondary">
                Active filters:
              </Typography>
              {searchQuery && (
                <Chip 
                  label={`Search: ${searchQuery}`} 
                  size="small" 
                  onDelete={() => setSearchQuery("")}
                />
              )}
              {startDate && (
                <Chip 
                  label={`From: ${startDate}`} 
                  size="small" 
                  onDelete={() => setStartDate("")}
                />
              )}
              {endDate && (
                <Chip 
                  label={`To: ${endDate}`} 
                  size="small" 
                  onDelete={() => setEndDate("")}
                />
              )}
            </Stack>
          )}
        </Stack>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Music size={16} />
                    <span>Audio Title</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Music size={16} />
                    <span>Audio ID</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Mail size={16} />
                    <span>User Email</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar size={16} />
                    <span>Download Date</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <Music size={48} color="#ccc" style={{ marginBottom: 16 }} />
                      <Typography variant="h6" color="textSecondary">
                        {hasActiveFilters
                          ? "No downloads match your filters"
                          : "No downloads available"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((r) => (
                  <TableRow
                    key={r._id}
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                      "&:last-child td": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
                          <Music size={16} />
                        </Avatar>
                        <Typography fontWeight={500} color="primary.main">
                          {r.audioId?.title || "-"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.audioId?._id || r.audioId}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.email}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(r.date)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedRecord(r);
                            setDialogOpen(true);
                          }}
                          sx={{
                            color: "primary.main",
                            "&:hover": { backgroundColor: "primary.light" },
                          }}
                        >
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          mt={3}
        >
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{paginatedRecords.length}</strong> of{" "}
            <strong>{filteredRecords.length}</strong> downloads
          </Typography>

          <Pagination
            count={Math.ceil(filteredRecords.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size="small"
            color="primary"
          />
        </Stack>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Music size={20} />
            <span>Free Audio Download Details</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User Email
                </Typography>
                <Chip
                  label={selectedRecord.email}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Audio ID
                </Typography>
                <Chip
                  label={selectedRecord.audioId?._id || selectedRecord.audioId}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Audio Title
                </Typography>
                <Typography variant="body1">
                  {selectedRecord.audioId?.title || "-"}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Download Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedRecord.date)}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FreeAudios;