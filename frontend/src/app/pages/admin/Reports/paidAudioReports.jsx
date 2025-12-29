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
  Stack,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Snackbar,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
  Collapse,
} from "@mui/material";
import {
  Search,
  RotateCcw,
  Download,
  Mail,
  DollarSign,
  Calendar,
  ShoppingBag,
  Music,
  Headphones,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
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

function exportToCSV(data, filename = "paid_audios.csv") {
  const headers = ["User Email", "Audio Title", "Audio ID", "Amount Paid", "Purchase Date"];
  const csvContent = [
    headers.join(","),
    ...data.map((r) => {
      const audioId = typeof r.audioId === "string" ? r.audioId : r.audioId?._id || "";
      const audioTitle = r.audioId?.title || "";
      return [
        r.email,
        audioTitle,
        audioId,
        (r.amount || 0).toFixed(2),
        formatDate(r.date),
      ].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function PaidAudios() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const rowsPerPage = 10;

  const fetchPaidAudioRecords = async () => {
    try {
      const response = await getRequest("/paid-audio/reports");
      setRecords(Array.isArray(response) ? response : []);
      setError("");
    } catch (err) {
      setError("Failed to fetch paid audio purchases");
      showSnackbar("Failed to fetch paid audio purchases", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidAudioRecords();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPaidAudioRecords();
    // Reset filters on refresh
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setTimeout(() => {
      setIsRefreshing(false);
      showSnackbar("Data refreshed successfully", "success");
    }, 1000);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredRecords, `paid_audios_${new Date().toISOString().split("T")[0]}.csv`);
    showSnackbar("CSV exported successfully", "success");
  };

  const filteredRecords = useMemo(() => {
    let filtered = records.filter((r) => {
      // Search filter
      const search = searchQuery.toLowerCase();
      const emailMatch = r.email?.toLowerCase().includes(search);
      const audioIdString = typeof r.audioId === "string" ? r.audioId : r.audioId?._id || "";
      const audioMatch = audioIdString.toLowerCase().includes(search);
      const titleMatch = r.audioId?.title?.toLowerCase().includes(search);
      
      // Date filter
      let dateMatch = true;
      if (startDate || endDate) {
        const purchaseDate = new Date(r.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && purchaseDate < start) dateMatch = false;
        if (end) {
          const endOfDay = new Date(end);
          endOfDay.setHours(23, 59, 59, 999);
          if (purchaseDate > endOfDay) dateMatch = false;
        }
      }
      
      // Amount filter
      let amountMatch = true;
      if (minAmount && (r.amount || 0) < parseFloat(minAmount)) amountMatch = false;
      if (maxAmount && (r.amount || 0) > parseFloat(maxAmount)) amountMatch = false;
      
      return (emailMatch || audioMatch || titleMatch) && dateMatch && amountMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "amount":
          aValue = a.amount || 0;
          bValue = b.amount || 0;
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
  }, [records, searchQuery, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRecords.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRecords, page]);

  const totalRevenue = filteredRecords.reduce(
    (sum, r) => sum + (r.amount || 0),
    0
  );

  const hasActiveFilters = searchQuery || startDate || endDate || minAmount || maxAmount;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, mt: 2 }} color="primary.main">
          Paid Audio Purchases Report
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Card 
              sx={{ 
                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Purchases
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {filteredRecords.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card 
              sx={{ 
                background: 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)',
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  ${totalRevenue.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Actions */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by email, audio ID, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#666" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<RotateCcw size={16} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="small"
                sx={{ borderRadius: 2, mb: { xs: 1, md: 0 } }}
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>

              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={handleExportCSV}
                size="small"
                sx={{ borderRadius: 2, mb: { xs: 1, md: 0 } }}
              >
                Export CSV
              </Button>

              <Button
                variant="outlined"
                startIcon={filtersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                size="small"
                sx={{ borderRadius: 2, display: { md: 'none' } }}
              >
                Filters
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Collapse in={filtersExpanded || !isMobile}>
          <Box sx={{ 
            p: 2, 
            mb: 3, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 2,
            backgroundColor: 'grey.50'
          }}>
            <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Filter size={18} style={{ marginRight: 8 }} />
              Filters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Order"
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <MenuItem value="desc">Descending</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    startIcon={<X size={16} />}
                    onClick={() => {
                      setSearchQuery("");
                      setStartDate("");
                      setEndDate("");
                      setMinAmount("");
                      setMaxAmount("");
                    }}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflowX: 'auto'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
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
                    <Headphones size={16} />
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
                    <DollarSign size={16} />
                    <span>Amount Paid</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar size={16} />
                    <span>Purchase Date</span>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <ShoppingBag
                        size={48}
                        color="#ccc"
                        style={{ marginBottom: 16 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        {hasActiveFilters
                          ? "No purchases match your filters"
                          : "No purchases available"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((r, index) => (
                  <TableRow
                    key={r._id || index}
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      "&:last-child td": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32, display: { xs: 'none', sm: 'flex' } }}>
                          <Music size={16} />
                        </Avatar>
                        <Typography fontWeight={500} color="primary.main">
                          {r.audioId?.title || "-"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={typeof r.audioId === "string" ? r.audioId : r.audioId?._id || "-"}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.email}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`$${(r.amount || 0).toFixed(2)}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(r.date)}
                      </Typography>
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
            <strong>{filteredRecords.length}</strong> purchases
          </Typography>

          <Pagination
            count={Math.ceil(filteredRecords.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size={isMobile ? "small" : "medium"}
            color="primary"
          />
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}