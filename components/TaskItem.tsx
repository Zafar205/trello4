import { Pencil, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { CardContext } from '../app/page';
import TaskModal from './TaskModal';

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



export default function TaskItem({ task, cardIndex }: {task : Task, cardIndex: number}) {
  const context = useContext(CardContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    if (editText.trim() && context) {
      handleUpdateTask(task.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleDeleteTask = () => {
    context?.deleteTask(cardIndex, task.id);
  };

  const handleUpdateTask = (taskId: string, newText: string) => {
    if (context) {
      const task = context.cards.flatMap(card => card.tasks).find(task => task.id === taskId);
      context.updateTask(cardIndex, taskId, newText, task?.subtasks || []);
    }
  };

  return (
    <>
      <li className="bg-white p-2 rounded-lg text-sm flex justify-between items-center group cursor-pointer">
        <div onClick={() => setIsModalOpen(true)} className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyPress}
              className="flex-1 px-2 py-1 rounded-lg text-sm w-full"
              autoFocus
            />
          ) : (
            <span>{task.text}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask();
            }}
          >
            <Trash2 size={14} className="text-red-500 hover:text-red-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
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