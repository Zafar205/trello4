"use client"
import { useState, useContext } from 'react';
import { CardContext} from '../app/page';
import TaskItem from './TaskItem';

interface Task {
    text: string;
    id : string;
  }


export default function Card({ title, index, tasks }: { title: string;  index: number; tasks: Task[] }) {
    const context = useContext(CardContext);
    const [showOptions, setShowOptions] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState(title);
  
    const handleAddTask = () => {
      if (newTaskText.trim() && context) {
        context.addTask(index, newTaskText);
        setNewTaskText("");
      }
    };
  
    const handleTitleSubmit = () => {
      if (titleText.trim() && context) {
        context.updateTitle(index, titleText);
        setIsEditingTitle(false);
      }
    };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    }
  };

  const handleUpdateTask = (taskId: string, newText: string) => {
    if (context) {
      context.updateTask(index, taskId, newText);
    }
  };
  

  return (
    <div>
      <div className="bg-gray-200 h-auto min-h-[250px] w-[220px] mt-[50px] ml-[20px] rounded-2xl p-4">
        <div className="flex justify-between">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyPress}
              className="pl-[29px] bg-white rounded-lg text-sm w-32"
              autoFocus
            />
          ) : (
            <h3 
              className="pl-[29px] cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h3>
          )}
          
          <div className="relative">
            <img src="./dots.png" alt="not" height="10" width="25" onClick={() => setShowOptions(!showOptions)} />
            {
            showOptions && 
            (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ml-[40px]"
                  onClick={() => {
                    context?.deleteCard(index);
                    setShowOptions(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                cardIndex={index}

              />
            ))}
          </ul>
          <div className="flex gap-2 mb-4 mt-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="flex-1 px-2 py-1 rounded-lg text-sm w-full"
              placeholder="New task..."
            />
            <button 
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-2 py-1 text-sm rounded-xl"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


