import React, { useState, useMemo } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Stack, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Snackbar, Alert, InputAdornment, Pagination,
  Tooltip,
} from "@mui/material";
import {
  Delete, Search, AddCircleOutline, Category,
  Add, Warning, Close, ArrowBack, DriveFileRenameOutline
} from "@mui/icons-material";
import {
  deleteRequest, getRequest, postRequest, putRequest
} from "@app/backendServices/ApiCalls";
import { useApiSWR } from "@app/_hooks/useApiSWR";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export default function SubCategories() {
  const { data: categoriesRes, isLoading } = useApiSWR("/categories");
  const categories = (categoriesRes && categoriesRes.data) || [];
  const [subCategories, setSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [manageOpen, setManageOpen] = useState(false);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editSubCategory, setEditSubCategory] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  // SWR provides loading
  const [actionLoading, setActionLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Categories are fetched via SWR and cached

  const handleManage = async (category) => {
    setSelectedCategory(category);
    setManageOpen(true);
    setAddEditOpen(false);
    setDeleteOpen(false);
    await fetchSubCategories(category._id);
  };

  const fetchSubCategories = async (categoryId) => {
    setSubCategoriesLoading(true);
    try {
      const res = await getRequest(`/sub-categories/category/${categoryId}`);
      setSubCategories(res?.data || []);
    } catch (err) {
      showSnackbar("Failed to fetch subcategories", "error");
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAdd = () => {
    setEditSubCategory(null);
    setAddEditOpen(true);
  };

  const handleOpenEdit = (subCategory) => {
    setEditSubCategory(subCategory);
    setAddEditOpen(true);
  };

  const handleCloseAddEdit = () => {
    setAddEditOpen(false);
    setEditSubCategory(null);
  };

  const handleOpenDelete = (subCategory) => {
    setDeleteItem(subCategory);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleAddEditSubCategory = async (values, actions) => {
    const isDuplicate = subCategories.some(
      (sub) => sub.Name.toLowerCase() === values.Name.trim().toLowerCase() &&
      (!editSubCategory || sub._id !== editSubCategory._id)
    );
    
    if (isDuplicate) {
      actions.setFieldError("Name", "Subcategory already exists");
      return;
    }

    setActionLoading(true);
    try {
      if (editSubCategory) {
        // Update existing subcategory
        await putRequest(`/sub-categories/${editSubCategory._id}`, {
          Name: values.Name.trim(),
        });
        
        setSubCategories(prev => 
          prev.map(item => 
            item._id === editSubCategory._id 
              ? {...item, Name: values.Name.trim()} 
              : item
          )
        );
        
        showSnackbar("Subcategory updated successfully");
      } else {
        // Add new subcategory
        const response = await postRequest(`/sub-categories`, {
          Name: values.Name.trim(),
          CategoryId: selectedCategory._id
        });
        
        if (response?.data) {
          setSubCategories(prev => [...prev, response.data]);
        } else {
          await fetchSubCategories(selectedCategory._id);
        }
        
        showSnackbar("Subcategory added successfully");
      }
      
      handleCloseAddEdit();
    } catch (err) {
      showSnackbar(`Failed to ${editSubCategory ? 'update' : 'add'} subcategory`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    if (!deleteItem) return;

    setActionLoading(true);
    try {
      await deleteRequest(`/sub-categories/${deleteItem._id}`);
      setSubCategories(prev => prev.filter(item => item._id !== deleteItem._id));
      showSnackbar("Subcategory deleted successfully");
      handleCloseDelete();
    } catch (err) {
      showSnackbar("Failed to delete subcategory", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCategories, page]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
          Subcategories Management
        </Typography>

        {/* Search */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing="auto"
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
        </Stack>

        {/* Categories Table */}
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
                    {/* <Category size={20} /> */}
                    <span>Category Name</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "150px" }}>
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
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutline size={16} />}
                        onClick={() => handleManage(cat)}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        Manage
                      </Button>
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

      {/* Manage Subcategories Modal */}
      <Dialog 
        open={manageOpen && !addEditOpen && !deleteOpen} 
        onClose={() => setManageOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            minHeight: "500px",
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton 
                onClick={() => setManageOpen(false)}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Manage Subcategories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {selectedCategory?.categoryName}
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              startIcon={<Add size={16} />}
              onClick={handleOpenAdd}
              size="small"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Add Subcategory
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {subCategoriesLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : subCategories.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, opacity: 0.6 }}>
              <AddCircleOutline
                size={48}
                color="#ccc"
                style={{ marginBottom: 16 }}
              />
              <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                No subcategories added yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Add Subcategory" to create your first subcategory
              </Typography>
            </Box>
          ) : (
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
                    <TableCell sx={{ fontWeight: 600, width: "80px" }}>
                      Sr. No.
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Subcategory Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: "120px" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subCategories.map((sub, index) => (
                    <TableRow
                      key={sub._id}
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&:last-child td": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {sub.Name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Rename Subcategory">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenEdit(sub)}
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
                          <Tooltip title="Delete Subcategory">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDelete(sub)}
                              disabled={actionLoading}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Subcategory Modal */}
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
              {editSubCategory ? "Edit Subcategory" : "Add New Subcategory"}
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
        <Formik
          initialValues={{ Name: editSubCategory?.Name || "" }}
          validationSchema={Yup.object({
            Name: Yup.string().trim().required("Subcategory name is required")
          })}
          onSubmit={handleAddEditSubCategory}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent sx={{ pt: 2 }}>
                <Field
                  name="Name"
                  as={TextField}
                  label="Subcategory Name"
                  fullWidth
                  autoFocus
                  variant="outlined"
                  error={touched.Name && Boolean(errors.Name)}
                  helperText={touched.Name && errors.Name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
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
                  type="submit"
                  variant="contained"
                  disabled={actionLoading}
                  sx={{ borderRadius: 2, minWidth: "80px" }}
                >
                  {actionLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    editSubCategory ? "Update" : "Add"
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
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
              Delete Subcategory
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the subcategory{" "}
            <strong>"{deleteItem?.Name}"</strong>?
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
            onClick={handleDeleteSubCategory}
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