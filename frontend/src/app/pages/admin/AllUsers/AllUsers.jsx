import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  RotateCcw,
  Download,
  Users,
  Copy,
  Check,
  Mail,
  Calendar,
  Hash,
} from "lucide-react";
import { postRequest, apiClient } from "@app/backendServices/ApiCalls";
import { useApiSWR } from "@app/_hooks/useApiSWR";

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

function exportToCSV(data, filename = "users.csv") {
  const headers = [
    "Username",
    "Email",
    "First Name",
    "Last Name",
    "Referral Code",
    "Referred By",
    "Created At",
  ];
  const csvContent = [
    headers.join(","),
    ...data.map((user) =>
      [
        user.username,
        user.email,
        user.firstName,
        user.lastName,
        user.referralCode,
        user.referredBy?.username || user.referredBy || "N/A",
        formatDate(user.createdAt),
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

export default function AllUsers() {
  const { data: usersRes, isLoading, mutate } = useApiSWR(
    "/auth/getallusers",
    async (url) => (await apiClient.post(url, {})).data
  );
  const users = (
    Array.isArray(usersRes?.data)
      ? usersRes.data
      : Array.isArray(usersRes?.users)
        ? usersRes.users
        : Array.isArray(usersRes)
          ? usersRes
          : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState("");
  const rowsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.referralCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.referredBy?.username &&
          user.referredBy.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (typeof user.referredBy === "string" &&
          user.referredBy.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredUsers,
      `users_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleCopyReferralCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (isLoading) {
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
          p: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, mt: 2 }} color="primary.main">
          All Users
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          mb={3}
        >
          <TextField
            placeholder="Search users, emails, codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: 350,
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
                    <Users size={16} />
                    <span>Username</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Mail size={16} />
                    <span>Email</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Hash size={16} />
                    <span>Referral Code</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Referred By</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar size={16} />
                    <span>Created At</span>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <Users
                        size={48}
                        color="#ccc"
                        style={{ marginBottom: 16 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        {searchQuery
                          ? `No users found for "${searchQuery}"`
                          : "No users available"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user._id || index}
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
                      <Typography fontWeight={500} color="primary.main">
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={user.referralCode}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontFamily: "monospace", fontWeight: 600 }}
                        />
                        <Tooltip
                          title={
                            copiedCode === user.referralCode
                              ? "Copied!"
                              : "Copy code"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCopyReferralCode(user.referralCode)
                            }
                            sx={{
                              transition: "all 0.2s",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "white",
                              },
                            }}
                          >
                            {copiedCode === user.referralCode ? (
                              <Check size={14} color="green" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {user.referredBy ? (
                        <Chip
                          label={user.referredBy.username || user.referredBy}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          Direct signup
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          mt={3}
        >
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{paginatedUsers.length}</strong> of{" "}
            <strong>{filteredUsers.length}</strong> users
          </Typography>

          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size="small"
            color="primary"
          />
        </Stack>
      </Box>
    </Box>
  );
}
