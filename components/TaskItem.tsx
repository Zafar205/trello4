import { Pencil, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { CardContext } from '../app/page';

interface Task {
    text: string;
    id : string;
  }

export default function TaskItem({ task, cardIndex }: { task: Task; cardIndex: number;  }) {
    const context = useContext(CardContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
  
    const handleSubmit = () => {
      if (editText.trim()) {
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
        if (context) {
            context.deleteTask(cardIndex, task.id);
        }
    }

    const handleUpdateTask = (taskId: string, newText: string) => {
        if (context) {
          context.updateTask(cardIndex, taskId, newText);
        }
      };
  
    return (
      <li className="bg-white p-2 rounded-lg text-sm flex justify-between items-center group">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyPress}
            className="flex-1 px-2 py-1 rounded-lg text-sm"
            autoFocus
          />
        ) : (
          <>
            <span>{task.text}</span>
            <div className='justify-between'>
            <button className='mr-2' onClick={handleDeleteTask}>
                <Trash2 size={14} className="text-red-500"/>
            </button>
            <button
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={14} className=" text-blue-500" />
            </button>
            </div>
          </>
        )}
      </li>
    );
  }