import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Chip,
  Snackbar,
  Autocomplete,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  AudioFile as AudioIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getRequest, postRequest } from "@app/backendServices/ApiCalls";

// Validation Schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  rating: Yup.number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5")
    .required("Rating is required"),
  category: Yup.object()
    .nullable()
    .required("Category is required"),
  subcategory: Yup.object()
    .nullable()
    .required("Subcategory is required"),
  voice: Yup.string()
    .required("Voice is required"),
  language: Yup.string()
    .required("Language is required"),
  audioFile: Yup.mixed()
    .required("Audio file is required")
    .test("fileSize", "File size must be less than 50MB", (value) => {
      return value && value.size <= 50 * 1024 * 1024;
    })
    .test("fileType", "Only audio files are allowed", (value) => {
      return value && value.type.startsWith("audio/");
    }),
});

const voiceOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" }
];

export default function AddAudio() {
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await getRequest("/categories");
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      showSnackbar("Error fetching categories", "error");
    } finally {
      setCategoriesLoading(false);
    }
  };


  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    setSubcategoriesLoading(true);
    try {
      const data = await getRequest(`/sub-categories/category/${categoryId}`);
      setSubcategories(data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
      showSnackbar("Error fetching subcategories", "error");
    } finally {
      setSubcategoriesLoading(false);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

 

  const addAudio = async (formData, resetForm) => {
    setLoading(true);

    // Verify required fields
    if (!formData.get("categoryId") || !formData.get("subCategoryId")) {
      showSnackbar("Category and subcategory are required", "error");
      setLoading(false);
      return;
    }

    try {
      postRequest(
        "/free-audio",
        formData, // ✅ FormData handled automatically
        (response) => {
          showSnackbar("Audio added successfully", "success");
          resetForm();
          setSubcategories([]);
        },
        (error) => {
          const errorMessage =
            error?.response?.data?.message || "Error adding audio (server error)";
          console.error("Full error:", error?.response?.data || error);
          showSnackbar(errorMessage, "error");
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      showSnackbar(error.message || "Error adding audio", "error");
    } finally {
      setLoading(false);
    }
  };



  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 4,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          padding: 4,
          borderRadius: 4,
          background: "white",
        }}
      >
        <Box textAlign="center" mb={3}>
          <AudioIcon sx={{ fontSize: 38, color: "primary.main", mb: 1 }} />
          <Typography variant="h3" color="primary.main">
            Add New Free Audio
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Upload and share your audio content with detailed information
          </Typography>
        </Box>

        <Formik
          initialValues={{
            title: "",
            description: "",
            rating: "",
            category: null,
            subcategory: null,
            voice: "",
            language: "",
            audioFile: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            // Check if category and subcategory are selected
            if (!values.category || !values.subcategory) {
              showSnackbar("Please select both category and subcategory", "error");
              return;
            }

            // Check if IDs exist
            if (!values.category._id || !values.subcategory._id) {
              showSnackbar("Invalid category/subcategory selection", "error");
              return;
            }

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("rating", values.rating);
            formData.append("categoryId", values.category._id);
            formData.append("subCategoryId", values.subcategory._id); // Note: backend uses subCategoryId (capital C)
            formData.append("voice", values.voice);
            formData.append("language", values.language);
            formData.append("audioFile", values.audioFile);

            // Debug FormData
            console.log("Submitting FormData:");
            for (const [key, value] of formData.entries()) {
              if (key === "audioFile") {
                console.log(`${key}: ${value.name} (${value.size} bytes)`);
              } else {
                console.log(`${key}: ${value}`);
              }
            }

            addAudio(formData, resetForm);
          }}
        >
          {({ values, errors, touched, setFieldValue, resetForm }) => (
            <Form>
              <Stack spacing={3}>
                {/* Title Field */}
                <Field name="title">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Audio Title"
                      placeholder="Enter a catchy title for your audio"
                      fullWidth
                      variant="outlined"
                      error={touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                </Field>

                {/* Description Field */}
                <Field name="description">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      placeholder="Describe your audio content in detail..."
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      error={touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                </Field>

                {/* Rating Field */}
                <Field name="rating">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Rating"
                      type="number"
                      placeholder="Rate from 0 to 5"
                      inputProps={{ step: "0.1", min: "0", max: "5" }}
                      fullWidth
                      variant="outlined"
                      error={touched.rating && !!errors.rating}
                      helperText={touched.rating && errors.rating}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                </Field>

                {/* Category Field with Search */}
                <FormControl fullWidth error={touched.category && !!errors.category}>
                  <Autocomplete
                    value={values.category}
                    onChange={(event, newValue) => {
                      setFieldValue("category", newValue);
                      setFieldValue("subcategory", null);
                      if (newValue) {
                        fetchSubcategories(newValue._id); // Use _id instead of id
                      } else {
                        setSubcategories([]);
                      }
                    }}
                    options={categories}
                    getOptionLabel={(option) => option.categoryName || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Category"
                        placeholder="Search and select a category"
                        variant="outlined"
                        error={touched.category && !!errors.category}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          endAdornment: (
                            <>
                              {categoriesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Typography variant="body1">{option.categoryName}</Typography>
                      </Box>
                    )}
                    noOptionsText="No categories found"
                    loading={categoriesLoading}
                    filterOptions={(options, { inputValue }) =>
                      options.filter((option) =>
                        option.categoryName.toLowerCase().includes(inputValue.toLowerCase())
                      )
                    }
                  />
                  {touched.category && errors.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                  )}
                </FormControl>

                {/* Subcategory Field - only shown when a category is selected */}
                {values.category && (
                  <FormControl fullWidth error={touched.subcategory && !!errors.subcategory}>
                    <Autocomplete
                      value={values.subcategory}
                      onChange={(event, newValue) => setFieldValue("subcategory", newValue)}
                      options={subcategories}
                      getOptionLabel={(option) => option.Name || ""}
                      loading={subcategoriesLoading}

                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Subcategory"
                          placeholder="Select a subcategory"
                          variant="outlined"
                          error={touched.subcategory && !!errors.subcategory}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {subcategoriesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Typography variant="body1">{option.Name}</Typography>
                        </Box>
                      )}
                      noOptionsText="No subcategories found"
                      disabled={subcategoriesLoading || subcategories.length === 0}
                    />
                    {touched.subcategory && errors.subcategory && (
                      <FormHelperText>{errors.subcategory}</FormHelperText>
                    )}
                  </FormControl>
                )}

                {/* Voice Selection */}
                <FormControl fullWidth error={touched.voice && !!errors.voice}>
                  <InputLabel>Voice</InputLabel>
                  <Select
                    value={values.voice}
                    label="Voice"
                    onChange={(e) => setFieldValue("voice", e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {voiceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.voice && errors.voice && (
                    <FormHelperText>{errors.voice}</FormHelperText>
                  )}
                </FormControl>

                {/* Language Selection */}
                <FormControl fullWidth error={touched.language && !!errors.language}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={values.language}
                    label="Language"
                    onChange={(e) => setFieldValue("language", e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {languageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.language && errors.language && (
                    <FormHelperText>{errors.language}</FormHelperText>
                  )}
                </FormControl>

                {/* Selected Category Display */}
                {values.category && (
                  <Box sx={{ p: 2, backgroundColor: "rgba(25, 118, 210, 0.08)", borderRadius: 2, border: "1px solid rgba(25, 118, 210, 0.2)" }}>
                    <Typography variant="body2" color="text.secondary" mb={1}>Selected Category:</Typography>
                    <Chip
                      label={values.category.categoryName}
                      color="primary"
                      variant="outlined"
                      onDelete={() => {
                        setFieldValue("category", null);
                        setFieldValue("subcategory", null);
                        setSubcategories([]);
                      }}
                      deleteIcon={<DeleteIcon />}
                      sx={{ mb: values.subcategory ? 1 : 0 }}
                    />

                    {values.subcategory && (
                      <>
                        <Typography variant="body2" color="text.secondary" mb={1} mt={2}>Selected Subcategory:</Typography>
                        <Chip
                          label={values.subcategory.Name}
                          color="secondary"
                          variant="outlined"
                          onDelete={() => setFieldValue("subcategory", null)}
                          deleteIcon={<DeleteIcon />}
                        />
                      </>
                    )}
                  </Box>
                )}

                {/* File Upload Section */}
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{
                      width: "100%",
                      height: 60,
                      borderRadius: 2,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      "&:hover": { borderStyle: "dashed", backgroundColor: "primary.light", color: "white" },
                    }}
                  >
                    {values.audioFile ? "Change Audio File" : "Upload Audio File"}
                    <input
                      type="file"
                      accept="audio/*"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFieldValue("audioFile", file);
                      }}
                    />
                  </Button>

                  {/* File Info Display */}
                  {values.audioFile && (
                    <Box mt={2} p={2} sx={{ backgroundColor: "rgba(25, 118, 210, 0.08)", borderRadius: 2, border: "1px solid rgba(25, 118, 210, 0.2)" }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AudioIcon color="primary" />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">{values.audioFile.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatFileSize(values.audioFile.size)}</Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" onClick={() => setFieldValue("audioFile", null)} sx={{ color: "error.main" }}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  )}

                  {touched.audioFile && errors.audioFile && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                      {errors.audioFile}
                    </Typography>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ height: 50, borderRadius: 2, fontSize: "1.1rem", background: "primary.main" }}
                >
                  {loading ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Uploading...</span>
                    </Stack>
                  ) : (
                    "Upload Audio"
                  )}
                </Button>

                {/* Reset Button */}
                <Button
                  type="button"
                  variant="text"
                  onClick={() => {
                    resetForm();
                    setSubcategories([]);
                  }}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  Reset Form
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

