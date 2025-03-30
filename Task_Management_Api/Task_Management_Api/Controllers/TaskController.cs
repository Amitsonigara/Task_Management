using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Service.Task;
using TaskManagement.Domain.Entities.API.Request.Task;
using TaskManagement.Domain.Entities.Entities;
namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        [Authorize]
        [HttpGet("GetAllTasks")]
        public async Task<ActionResult<List<Task>>> GetAllTasks([FromQuery] int userId)
        {
            var tasks = await _taskService.GetAllTasks(userId);
            return Ok(tasks);
        }
        [Authorize]
        [HttpGet("GetTaskById")]
        public async Task<ActionResult<Task>> GetTaskById([FromQuery]  int taskId)
        {
            var task = await _taskService.GetTaskById(taskId);
            if (task == null) return NotFound();
            return Ok(task);
        }
        [Authorize]
        [HttpPost("CreateTask")]
        public async Task<ActionResult<Task>> CreateTask([FromBody] TaskDTO task)
        {
            var createdTask = await _taskService.CreateTask(task);
            return CreatedAtAction(nameof(GetTaskById), new { taskId = createdTask.Id }, createdTask);
        }
        [Authorize]
        [HttpPut("UpdateTask")]
        public async Task<ActionResult<Task>> UpdateTask([FromBody] TaskDTO task)
        {
            var updatedTask = await _taskService.UpdateTask(task);
            if (updatedTask == null) return NotFound();
            return Ok(updatedTask);
        }
        [Authorize]
        [HttpDelete("DeleteTask")]
        public async Task<ActionResult> DeleteTask([FromQuery]  int taskId)
        {
            var success = await _taskService.DeleteTask(taskId);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
