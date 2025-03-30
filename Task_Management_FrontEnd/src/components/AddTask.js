import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const AddTask = ({ open, onClose, fetchTasks }) => {
  const { user, token } = useAuth();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [errors, setErrors] = useState({}); 

  // Validate the fields
  const validateFields = () => {
    const newErrors = {};
    if (!taskName) newErrors.taskName = 'Task Name is required';
    if (!taskDescription) newErrors.taskDescription = 'Task Description is required';
    if (!taskDueDate) newErrors.taskDueDate = 'Task Due Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTask = async () => {
    if (!validateFields()) return;
    try {
      const newTask = {
        title: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        userId: user.id,
        completed: false,
      };

      // Make the API request to add the task
      const response = await axios.post('https://localhost:7131/api/Task/CreateTask', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Task created successfully', {
        position: 'top-right',
        autoClose: 2000, 
      });

      fetchTasks(); 
      onClose(); 
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  // Handle blur event to remove validation error once user focuses on the field
  const handleBlur = (field) => {
    if (field === 'taskName' && taskName) {
      setErrors((prevErrors) => {
        const { taskName, ...rest } = prevErrors;
        return rest;
      });
    }
    if (field === 'taskDescription' && taskDescription) {
      setErrors((prevErrors) => {
        const { taskDescription, ...rest } = prevErrors;
        return rest;
      });
    }
    if (field === 'taskDueDate' && taskDueDate) {
      setErrors((prevErrors) => {
        const { taskDueDate, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Name"
          fullWidth
          variant="outlined"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          error={!!errors.taskName}
          helperText={errors.taskName}
          onBlur={() => handleBlur('taskName')}
        />
        <TextField
          margin="dense"
          label="Task Description"
          fullWidth
          variant="outlined"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          error={!!errors.taskDescription}
          helperText={errors.taskDescription}
          onBlur={() => handleBlur('taskDescription')}
        />
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          variant="outlined"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.taskDueDate}
          helperText={errors.taskDueDate}
          onBlur={() => handleBlur('taskDueDate')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveTask} color="primary" disabled={Object.keys(errors).length > 0}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTask;
