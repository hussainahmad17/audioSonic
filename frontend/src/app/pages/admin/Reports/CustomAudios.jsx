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
  IconButton,
  Tooltip,
  Stack,
  Button,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Collapse,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  RotateCcw,
  Download,
  Mail,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getRequest } from "@app/backendServices/ApiCalls";

// Date formatting helper
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

// CSV Export helper
function exportToCSV(data, filename = "custom_audios.csv") {
  const headers = ["Email", "Amount", "Description", "Date"];
  const csvContent = [
    headers.join(","),
    ...data.map((req) =>
      [
        req.email,
        req.amount || 0,
        `"${req.description}"`,
        formatDate(req.date),
      ].join(",")
    ),
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

export default function CustomAudios() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const rowsPerPage = 10;

  const fetchCustomAudioRequests = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/custom-audio/reports");
      setRequests(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to fetch custom audio requests", err);
      showSnackbar("Failed to fetch custom audio requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomAudioRequests();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Email filter
      const emailMatch = req.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      
      // Date range filter
      let dateMatch = true;
      if (startDate || endDate) {
        const requestDate = new Date(req.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && requestDate < start) dateMatch = false;
        if (end && requestDate > end) {
          // Set end date to end of day for inclusive filtering
          const endOfDay = new Date(end);
          endOfDay.setHours(23, 59, 59, 999);
          if (requestDate > endOfDay) dateMatch = false;
        }
      }
      
      return emailMatch && dateMatch;
    });
  }, [requests, searchEmail, startDate, endDate]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredRequests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequests, page]);

  const totalRevenue = useMemo(() => 
    filteredRequests.reduce((sum, req) => sum + (req.amount || 0), 0),
    [filteredRequests]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCustomAudioRequests();
    // Reset filters on refresh
    setSearchEmail("");
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      setIsRefreshing(false);
      showSnackbar("Data refreshed successfully", "success");
    }, 1000);
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredRequests,
      `custom_audios_${new Date().toISOString().split("T")[0]}.csv`
    );
    showSnackbar("CSV exported successfully", "success");
  };

  const handleViewDescription = (req) => {
    setSelectedRequest(req);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const hasActiveFilters = searchEmail || startDate || endDate;

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
          Custom Audio Requests Report
        </Typography>

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
                  Total Requests
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {filteredRequests.length}
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
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
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
              <Grid item xs={12} sm={6} md={4}>
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
              
              <Grid item xs={12} sm={6} md={4}>
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
              
              <Grid item xs={12} md={4}>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    startIcon={<X size={16} />}
                    onClick={() => {
                      setSearchEmail("");
                      setStartDate("");
                      setEndDate("");
                    }}
                    size="small"
                    sx={{ borderRadius: 2, mt: { xs: 0, md: 0.5 } }}
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
                    <FileText size={16} />
                    <span>Description</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar size={16} />
                    <span>Request Date</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <FileText size={48} color="#ccc" style={{ marginBottom: 16 }} />
                      <Typography variant="h6" color="textSecondary">
                        {hasActiveFilters
                          ? "No requests match your filters"
                          : "No custom audio requests available"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((req, index) => (
                  <TableRow
                    key={req._id || index}
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      "&:last-child td": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={req.email}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`$${(req.amount || 0).toFixed(2)}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {req.description.length > 50
                        ? `${req.description.substring(0, 50)}...`
                        : req.description}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(req.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Full Description">
                        <IconButton
                          onClick={() => handleViewDescription(req)}
                          color="primary"
                          size="small"
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

        {/* Pagination + footer */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          mt={3}
        >
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{paginatedRequests.length}</strong> of{" "}
            <strong>{filteredRequests.length}</strong> requests
          </Typography>

          <Pagination
            count={Math.ceil(filteredRequests.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size={isMobile ? "small" : "medium"}
            color="primary"
          />
        </Stack>
      </Box>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Custom Audio Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>User Email:</strong> {selectedRequest.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Amount Paid:</strong> $
                {(selectedRequest.amount || 0).toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Request Date:</strong> {formatDate(selectedRequest.date)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Full Description:</strong>
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                {selectedRequest.description}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

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