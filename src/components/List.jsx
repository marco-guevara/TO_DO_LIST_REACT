export default function List({
  list,
  handleDelete,
  handleEdit,
  handleToggleCompleted,
  deletingIds,
  draggingId,
  dragOffset,
  handleDragStart,
}) {
  return list.map((task) => {
    const isDeleting = deletingIds.includes(task.id);
    const isDragging = draggingId === task.id;

    return (
      <li
        key={task.id}
        data-task-id={task.id}
        style={isDragging ? { "--drag-offset": `${dragOffset}px` } : undefined}
        className={`${task.completed ? "completed" : ""} ${
          isDeleting ? "deleting" : ""
        } ${isDragging ? "dragging" : ""}`}
      >
        <button
          className="drag-button"
          type="button"
          aria-label={`Move ${task.title}`}
          onPointerDown={(e) => {
            e.preventDefault();
            handleDragStart(task.id, e.clientY);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="task-copy">
          <h3>{task.title}</h3>
          {task.content && <p>{task.content}</p>}
        </div>

        <div className="task-actions">
          <button
            className="mini-button"
            type="button"
            onClick={() => handleToggleCompleted(task.id)}
          >
            {task.completed ? "UNDO" : "DONE"}
          </button>
          <button
            className="mini-button"
            type="button"
            onClick={() => handleEdit(task)}
          >
            EDIT
          </button>
          <button
            className="mini-button danger-button"
            type="button"
            onClick={() => handleDelete(task.id)}
            disabled={isDeleting}
          >
            DELETE
          </button>
        </div>
      </li>
    );
  });
}
