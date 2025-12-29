import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Snackbar,
  Pagination,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  RotateCcw,
  Download,
  Music,
  Edit,
  Delete,
  Plus,
  Star,
  Calendar,
  Tag,
  Upload,
  User,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { deleteRequest, getRequest, putRequest } from "@app/backendServices/ApiCalls";
import { useApiSWR } from "@app/_hooks/useApiSWR";

const ManageAudio = () => {
  // State management
  const { data: audiosRes, isLoading: loadingAudios, mutate: mutateAudios } = useApiSWR("/free-audio");
  const audios = (audiosRes && audiosRes.data) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data: categoriesRes, isLoading: loadingCategory } = useApiSWR("/categories");
  const categories = (categoriesRes && categoriesRes.data) || [];
  const { data: subcategoriesRes, isLoading: loadingSubcategory } = useApiSWR("/sub-categories");
  const allSubcategories = (subcategoriesRes && subcategoriesRes.data) || [];
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [rowsPerPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoading = loadingAudios || loadingCategory || loadingSubcategory;
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState(null);
  // loadingCategory and loadingSubcategory provided by SWR
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state for editing
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: 0,
    categoryId: "",
    subCategoryId: "",
    language: "",
    voice: "",
    audioFile: null,
  });

  // Create a mapping of subcategory IDs to names for quick lookup
  const subcategoryMap = useMemo(() => {
    const map = {};
    allSubcategories.forEach(sub => {
      map[sub._id] = sub.Name;  // Use "Name" field from API response
    });
    return map;
  }, [allSubcategories]);

  // Create a mapping of category IDs to names for quick lookup
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach(cat => {
      map[cat._id] = cat.categoryName;
    });
    return map;
  }, [categories]);

  // Categories fetched via SWR

  // Fetch all subcategories
  // Subcategories fetched via SWR

  // Audios fetched via SWR

  // SWR caches across navigation; no imperative fetching needed

  // Fetch subcategories for a specific category
  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const response = await getRequest(`/sub-categories/category/${categoryId}`);
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      showSnackbar("Error fetching subcategories", "error");
      return [];
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutateAudios();
    setIsRefreshing(false);
    showSnackbar("Data refreshed successfully", "success");
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Title", "Description", "Rating", "Category", "Subcategory", "Language", "Voice", "Created At"].join(","),
      ...filteredAudios.map((audio) =>
        [
          audio.title,
          audio.description,
          audio.rating,
          audio.categoryId?.categoryName || categoryMap[audio.categoryId] || "N/A",
          subcategoryMap[audio.subCategoryId] || "N/A",  // Use the map to get name
          audio.language || "N/A",
          audio.voice || "N/A",
          formatDate(audio.createdAt),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio_list.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    showSnackbar("CSV exported successfully", "success");
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAudios = audios.filter(
    (audio) => audio && (  // Add this guard clause
      audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audio.categoryId?.categoryName || categoryMap[audio.categoryId] || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subcategoryMap[audio.subCategoryId] || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audio.language || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audio.voice || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedAudios = filteredAudios.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleOpenEditDialog = async (audio) => {
    setSelectedAudio(audio);

    // Set initial form data
    const initialFormData = {
      title: audio.title,
      description: audio.description,
      rating: audio.rating,
      categoryId: audio.categoryId?._id || audio.categoryId || "",
      subCategoryId: audio.subCategoryId || "",
      language: audio.language || "",
      voice: audio.voice || "",
      audioFile: null,
    };

    setFormData(initialFormData);

    // If category is set, fetch its subcategories
    if (initialFormData.categoryId) {
      const subs = await fetchSubcategoriesByCategory(initialFormData.categoryId);
      setFilteredSubcategories(subs);
    }

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedAudio(null);
    setFormData({
      title: "",
      description: "",
      rating: 0,
      categoryId: "",
      subCategoryId: "",
      language: "",
      voice: "",
      audioFile: null,
    });
    // Reset to all subcategories when closing
    setFilteredSubcategories([]);
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(c => c._id === categoryId);

    // Update form data
    const updatedFormData = {
      ...formData,
      categoryId,
      categoryName: selectedCategory?.categoryName || "",
      subCategoryId: "" // Reset subcategory when category changes
    };

    setFormData(updatedFormData);

    // Fetch subcategories for the selected category
    if (categoryId) {
      const subs = await fetchSubcategoriesByCategory(categoryId);
      setFilteredSubcategories(subs);
    } else {
      // If no category selected, show no subcategories
      setFilteredSubcategories([]);
    }
  };


  const handleEditSubmit = async () => {
    setActionLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("subCategoryId", formData.subCategoryId);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("voice", formData.voice);

      if (formData.audioFile) {
        formDataToSend.append("audioFile", formData.audioFile);
      }

      const response = await putRequest(`/free-audio/${selectedAudio._id}`, formDataToSend);
      if (response.success || response.message) {
        showSnackbar("Audio updated successfully", "success");
        await mutateAudios();
      } else {
        throw new Error(response.message || "Update failed");
      }

      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating audio:", error);
      showSnackbar(`Error updating audio: ${error.message || "Unknown error"}`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteDialog = (audio) => {
    setAudioToDelete(audio);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAudioToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!audioToDelete) return;

    setActionLoading(true);
    try {
      const response = await deleteRequest(`/free-audio/${audioToDelete._id}`);
      if (response.success || response.message) {
        showSnackbar("Audio deleted successfully", "success");
        await mutateAudios();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting audio:", error);
      showSnackbar("Error deleting audio", "error");
    } finally {
      setActionLoading(false);
      handleCloseDeleteDialog();
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
          Manage Audio
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          mb={3}
        >
          <TextField
            placeholder="Search audio, category, description..."
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
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={handleExportCSV}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Export CSV
            </Button>

            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              size="small"
              sx={{ borderRadius: 2 }}
              component={Link}
              to="/admin/audio/add"
            >
              Add Audio
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
                    <Music size={16} />
                    <span>Audio</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Star size={16} />
                    <span>Rating</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tag size={16} />
                    <span>Category</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tag size={16} />
                    <span>Subcategory</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MessageSquare size={16} />
                    <span>Language</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <User size={16} />
                    <span>Voice</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Calendar size={16} />
                    <span>Created At</span>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAudios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <Music
                        size={48}
                        color="#ccc"
                        style={{ marginBottom: 16 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        {searchQuery
                          ? `No audio found for "${searchQuery}"`
                          : "No audio available"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAudios.map((audio, index) => (
                  audio && (
                    <TableRow
                      key={audio._id || index}
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
                          <Avatar sx={{ bgcolor: "primary.light" }}>
                            <Music size={20} />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={500} color="primary.main">
                              {audio.title}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {audio.description.length > 50
                            ? `${audio.description.substring(0, 50)}...`
                            : audio.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={audio.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({audio.rating})
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={audio.categoryId?.categoryName || categoryMap[audio.categoryId] || "N/A"}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={audio.subCategoryId?.Name || subcategoryMap[audio.subCategoryId] || "N/A"}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={audio?.language || "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={audio?.voice || "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(audio.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Edit Audio">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog(audio)}
                              disabled={actionLoading}
                              sx={{
                                color: "primary.main",
                                "&:hover": { backgroundColor: "primary.light" },
                              }}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Audio">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteDialog(audio)}
                              disabled={actionLoading}
                              sx={{
                                color: "error.main",
                                "&:hover": { backgroundColor: "error.light" },
                              }}
                            >
                              <Delete size={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
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
            Showing <strong>{paginatedAudios.length}</strong> of{" "}
            <strong>{filteredAudios.length}</strong> audios
          </Typography>

          <Pagination
            count={Math.ceil(filteredAudios.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size="small"
            color="primary"
          />
        </Stack>
      </Box>

      {/* Edit Audio Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Music size={20} />
            <span>Edit Audio</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={handleCategoryChange}
                label="Category"
                disabled={loadingCategory}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={formData.subCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryId: e.target.value })
                }
                label="Subcategory"
                disabled={!formData.categoryId || loadingSubcategory}
              >
                {filteredSubcategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.Name} {/* Use "Name" field from API */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Language"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Voice"
              value={formData.voice}
              onChange={(e) =>
                setFormData({ ...formData, voice: e.target.value })
              }
              fullWidth
              required
            />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, rating: newValue })
                }
                precision={0.5}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Audio File{" "}
                {"(Leave empty to keep current file)"}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload size={16} />}
                fullWidth
                sx={{ mt: 1 }}
              >
                Choose Audio File
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={(e) =>
                    setFormData({ ...formData, audioFile: e.target.files[0] })
                  }
                />
              </Button>
              {formData.audioFile && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Selected: {formData.audioFile.name}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.categoryId ||
              !formData.subCategoryId ||
              !formData.language ||
              !formData.voice ||
              actionLoading
            }
          >
            {actionLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            Update Audio
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the audio titled "
            <strong>{audioToDelete?.title}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            Delete
          </Button>
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
};

export default ManageAudio;