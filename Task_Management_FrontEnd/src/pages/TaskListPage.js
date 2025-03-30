import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import { Container, Grid, CircularProgress, Alert, Box, Button, TextField, FormControl, Select, MenuItem, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddTask from '../components/AddTask';
import EditTask from '../components/EditTask';
import { Delete, Warning, CheckCircle, HelpOutline } from '@mui/icons-material';

const TaskListPage = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loadingToast, setLoadingToast] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false); // State to handle status update confirmation dialog
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToUpdateStatus, setTaskToUpdateStatus] = useState(null); // Store the task to update status

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`https://localhost:7131/api/Task/GetAllTasks?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filteredTasks = response.data;

      if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.completed === (statusFilter === 'completed'));
      }

      if (searchQuery && searchQuery.length >= 3 && searchQuery.length <= 4) {
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (sortOrder === 'date') {
        filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      } else if (sortOrder === 'name') {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      }

      setTasks(filteredTasks);
    } catch (error) {
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      toast.info('Loading tasks...', {
        position: "top-right",
        autoClose: 2000,
      });
      fetchTasks();
    }
  }, [user, token, statusFilter, sortOrder, searchQuery]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = async (taskId) => {
    try {
      const response = await axios.get(`https://localhost:7131/api/Task/GetTaskById?taskId=${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskToEdit(response.data);
      setOpenEditDialog(true);
    } catch (error) {
      toast.error('Failed to fetch task details');
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setTaskToEdit(null);
  };

  const handleStatusChange = async (taskId, completed) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);

    if (!taskToUpdate) {
      toast.error('Task not found');
      return;
    }

    // Open the status update confirmation dialog
    setTaskToUpdateStatus({ ...taskToUpdate, completed });
    setOpenStatusDialog(true);
  };

  const handleDeleteDialogOpen = (taskId) => {
    setTaskToDelete(taskId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setTaskToDelete(null);
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete('https://localhost:7131/api/Task/DeleteTask', {
        params: { taskId: taskToDelete },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted successfully');
      fetchTasks();
      handleDeleteDialogClose();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusDialogClose = () => {
    setOpenStatusDialog(false);
    setTaskToUpdateStatus(null);
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      const updatedTask = {
        ...taskToUpdateStatus,
        completed: taskToUpdateStatus.completed,
      };

      await axios.put('https://localhost:7131/api/Task/UpdateTask', updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Task status updated successfully');
      fetchTasks();
      handleStatusDialogClose();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box display="flex" gap={3} flexWrap="wrap">
            <FormControl sx={{ minWidth: 180 }} size="large">
              <InputLabel>Status Filter</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status Filter">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="large">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort By">
                <MenuItem value="date">Due Date</MenuItem>
                <MenuItem value="name">Task Name</MenuItem>
                <MenuItem value="description">Description</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
              sx={{ width: 240 }}
            />
          </Box>

          <Button variant="contained" sx={{ marginLeft: 'auto' }} onClick={handleOpenAddDialog} size="large">
            Add Task
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <TaskCard
              task={task}
              onStatusChange={handleStatusChange} // Trigger status update confirmation dialog
              onDelete={() => handleDeleteDialogOpen(task.id)}
              onEdit={handleOpenEditDialog}
            />
          </Grid>
        ))}
      </Grid>

      <AddTask open={openAddDialog} onClose={handleCloseAddDialog} fetchTasks={fetchTasks} />

      {taskToEdit && (
        <EditTask open={openEditDialog} onClose={handleCloseEditDialog} task={taskToEdit} fetchTasks={fetchTasks} />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-task-dialog"
      >
        <DialogTitle id="delete-task-dialog">
          <Warning color="error" sx={{ marginRight: 1 }} />
          Are you sure you want to delete this task?
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            This action is permanent and cannot be undone. Do you want to proceed?
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleDeleteTask} color="secondary" variant="contained" startIcon={<Delete />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Confirmation Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleStatusDialogClose}
        aria-labelledby="status-update-dialog"
      >
        <DialogTitle id="status-update-dialog">
          <HelpOutline color="primary" sx={{ marginRight: 1 }} />
          Are you sure you want to update this task's status?
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            You are about to {taskToUpdateStatus?.completed ? 'mark this task as completed' : 'mark this task as pending'}.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} color="primary">Cancel</Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            color="secondary"
            variant="contained"
            startIcon={<CheckCircle />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default TaskListPage;
