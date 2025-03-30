import React from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Add Edit icon

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
    return (
        <Card
            sx={{
                mb: 2,
                boxShadow: 3,
                borderRadius: 2,
                mt: 3,
                '&:hover': { boxShadow: 6 },
                transition: 'box-shadow 0.3s ease',
            }}
        >
            <CardContent>
                {/* Task Title */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {task.title}
                </Typography>

                {/* Task Description */}
                <Typography variant="body2" color="textSecondary" paragraph>
                    {task.description}
                </Typography>

                {/* Task Due Date */}
                <Typography variant="body2" color="textSecondary" paragraph>
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>

                {/* Task Status */}
                <Typography
                    variant="body2"
                    color={task.completed ? 'green' : 'orange'}
                    paragraph
                    fontWeight="medium"
                    display="flex"
                    alignItems="center"
                >
                    {task.completed ? (
                        <CheckIcon sx={{ mr: 1 }} />
                    ) : (
                        <AccessTimeIcon sx={{ mr: 1 }} />
                    )}
                    Status: {task.completed ? 'Completed' : 'Pending'}
                </Typography>

                {/* Buttons for status change and deletion */}
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    {/* Status Button */}
                    <Button
                        variant="contained"
                        color={task.completed ? 'secondary' : 'primary'}
                        onClick={() => onStatusChange(task.id, !task.completed)}
                        sx={{
                            textTransform: 'none',
                            minWidth: 130,
                            borderRadius: 20,
                            fontWeight: 'medium',
                            '&:hover': {
                                backgroundColor: task.completed ? '#f44336' : '#1976d2',
                                boxShadow: 2,
                            },
                        }}
                    >
                        {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                    </Button>

                    {/* Edit Button */}
                    <IconButton color="primary" onClick={() => onEdit(task.id)} sx={{ padding: '8px' }}>
                        <EditIcon />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton
                        color="error"
                        onClick={() => onDelete(task.id)}
                        sx={{
                            '&:hover': { backgroundColor: '#f5f5f5', transform: 'scale(1.1)' },
                            borderRadius: '50%',
                            padding: '8px',
                            transition: 'transform 0.2s ease, background-color 0.2s ease',
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
