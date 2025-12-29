import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Pagination,
  Tooltip,
} from "@mui/material";
import { 
  Delete, 
  Search, 
  Category, 
  Add,
  Warning,
  Close,
  DriveFileRenameOutline
} from "@mui/icons-material";
import {
  deleteRequest,
  postRequest,
  putRequest,
} from "@app/backendServices/ApiCalls";
import { useApiSWR } from "@app/_hooks/useApiSWR";

export default function Categories() {
  const { data: categoriesRes, isLoading, mutate } = useApiSWR("/categories");
  const categories = (categoriesRes && categoriesRes.data) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const rowsPerPage = 10;

  // SWR caches categories; no imperative fetch on mount

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Paginated categories
  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCategories, page]);

  const handleOpenAdd = () => {
    setNewCategory("");
    setEditMode(false);
    setEditId(null);
    setAddEditOpen(true);
  };

  const handleOpenEdit = (id, name) => {
    setNewCategory(name);
    setEditMode(true);
    setEditId(id);
    setAddEditOpen(true);
  };

  const handleCloseAddEdit = () => {
    setAddEditOpen(false);
    setActionLoading(false);
    setNewCategory("");
    setEditMode(false);
    setEditId(null);
  };

  const handleOpenDelete = (category) => {
    setDeleteItem(category);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    if (!newCategory.trim()) {
      showSnackbar("Category name cannot be empty", "error");
      return;
    }

    setActionLoading(true);

    try {
      if (editMode) {
        putRequest(
          `/categories/${editId}`,
          { categoryName: newCategory.trim() },
          (response) => {
            showSnackbar("Category updated successfully");
            mutate();
            handleCloseAddEdit();
          },
          (error) => {
            console.error("PUT error:", error);
            showSnackbar(
              error.response?.data?.message || "Error updating category",
              "error"
            );
            setActionLoading(false);
          }
        );
      } else {
        postRequest(
          "/categories",
          { categoryName: newCategory.trim() },
          (response) => {
            showSnackbar("Category added successfully");
            mutate();
            handleCloseAddEdit();
          },
          (error) => {
            console.error("POST error:", error);
            showSnackbar(
              error.response?.data?.message || "Error saving category",
              "error"
            );
            setActionLoading(false);
          }
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    setActionLoading(true);
    try {
      await deleteRequest(`/categories/${deleteItem._id}`);
      showSnackbar("Category deleted successfully");
      mutate();
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting category:", error);
      showSnackbar("Error deleting category", "error");
    } finally {
      setActionLoading(false);
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
        {/* Header */}
        <Typography variant="h4" sx={{ mb: 4, mt: 2 }} color="primary.main">
          Categories Management
        </Typography>

        {/* Search and Add Button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={"auto"}
          alignItems="center"
          mb={3}
        >
          <TextField
            placeholder="Search categories..."
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

          <Button
            variant="contained"
            startIcon={<Add size={16} />}
            onClick={handleOpenAdd}
            size="small"
            sx={{ 
              borderRadius: 2,
              ml: "auto",
              minWidth: "140px"
            }}
          >
            Add Category
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: "120px" }}>
                  Sr. No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>Category Name</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "120px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <Category
                        size={48}
                        color="#ccc"
                        style={{ marginBottom: 16 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        {searchQuery
                          ? `No categories found for "${searchQuery}"`
                          : "No categories available"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((cat, index) => (
                  <TableRow
                    key={cat._id}
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
                      <Typography variant="body2" color="text.secondary">
                        {(page - 1) * rowsPerPage + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500} color="primary.main">
                        {cat.categoryName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit Category">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEdit(cat._id, cat.categoryName)}
                            sx={{
                              transition: "all 0.2s",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "white",
                              },
                            }}
                          >
                            <DriveFileRenameOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Category">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDelete(cat)}
                            sx={{
                              transition: "all 0.2s",
                              "&:hover": {
                                backgroundColor: "error.light",
                                color: "white",
                              },
                            }}
                          >
                            <Delete size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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
            Showing <strong>{paginatedCategories.length}</strong> of{" "}
            <strong>{filteredCategories.length}</strong> categories
          </Typography>

          <Pagination
            count={Math.ceil(filteredCategories.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size="small"
            color="primary"
          />
        </Stack>
      </Box>

      {/* Add/Edit Category Modal */}
      <Dialog 
        open={addEditOpen} 
        onClose={handleCloseAddEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {editMode ? "Edit Category" : "Add New Category"}
            </Typography>
            <IconButton 
              onClick={handleCloseAddEdit}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ 
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !actionLoading) {
                handleSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseAddEdit} 
            disabled={actionLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={actionLoading}
            sx={{ borderRadius: 2, minWidth: "80px" }}
          >
            {actionLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              editMode ? "Update" : "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                backgroundColor: "error.light",
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Warning sx={{ color: "error.main", fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Delete Category
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the category{" "}
            <strong>"{deleteItem?.categoryName}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone and may affect related data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDelete}
            disabled={actionLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={actionLoading}
            sx={{ borderRadius: 2, minWidth: "80px" }}
          >
            {actionLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}