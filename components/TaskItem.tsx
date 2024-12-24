import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useContext, useState } from "react";
import { CardContext } from "../app/page";
import TaskModal from "./TaskModal";

interface Task {
  text: string;
  id: string;
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export default function TaskItem({ task, cardIndex }: { task: Task; cardIndex: number }) {
  const context = useContext(CardContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
      cardIndex,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : 1,
  };

  const handleSubmit = () => {
    if (editText.trim() && context) {
      handleUpdateTask(task.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    context?.deleteTask(cardIndex, task.id);
  };

  const handleUpdateTask = (taskId: string, newText: string) => {
    if (context) {
      const task = context.cards
        .flatMap((card) => card.tasks)
        .find((task) => task.id === taskId);
      context.updateTask(cardIndex, taskId, newText, task?.subtasks || []);
    }
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className={`bg-white p-2 rounded-lg text-sm flex items-center group ${isDragging ? 'shadow-lg' : ''}`}
        onClick={(e) => {
          if (!isDragging) {
            setIsModalOpen(true);
          }
        }}
      >
        <div 
          className="cursor-grab active:cursor-grabbing p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} className="text-gray-400" />
        </div>
        <div className="flex-1 ml-2">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyPress}
              className="flex-1 px-2 py-1 rounded-lg text-sm w-full"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="select-none">{task.text}</span>
          )}
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={handleDeleteTask}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} className="text-red-500 hover:text-red-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil size={14} className="text-gray-500 hover:text-blue-500" />
          </button>
        </div>
      </li>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        cardIndex={cardIndex}
        onUpdateTask={handleUpdateTask}
      />
    </>
  );
}