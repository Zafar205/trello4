"use client"
import { createContext, useContext, useState } from 'react';
import "./globals.css";

interface Task {
  text: string;
}

interface CardObject {
  index: number;
  title: string;
  description: string;
  tasks: Task[];
}

interface CardContextType {
  cards: CardObject[];
  addCard: () => void;
  deleteCard: (index: number) => void;
  addTask: (cardIndex: number, taskText: string) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

function Card({ title, index, tasks }: { title: string;  index: number; tasks: Task[] }) {
  const context = useContext(CardContext);
  const [showOptions, setShowOptions] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim() && context) {
      context.addTask(index, newTaskText);
      setNewTaskText("");
    }
  };
  

  return (
    <div>
      <div className="bg-gray-200 h-auto min-h-[250px] w-[220px] mt-[50px] ml-[20px] rounded-2xl p-4">
        <div className="flex justify-between">

          <h3 className="pl-[29px]">{title}</h3>
          
          <div className="relative">
            <img src="./dots.png" alt="not" height="10" width="25" onClick={() => setShowOptions(!showOptions)} />
            {showOptions && (
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
        {/* <div className="flex justify-center pt-6">
          <p>{description}</p>
        </div> */}
        <div className="mt-4">
          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li key={i} className="bg-white p-2 rounded-lg text-sm">{task.text}</li>
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
              className= ' bg-blue-500 text-white px-2 py-1 text-sm rounded-xl'
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [cards, setCards] = useState<Array<CardObject>>([]);

  const addCard = () => {
    const newCard: CardObject = {
      title: "New Card",
      description: "This is a new card",
      index: cards.length,
      tasks: []
    };
    setCards([...cards, newCard]);
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const addTask = (cardIndex: number, taskText: string) => {
    setCards(cards.map((card, i) => {
      if (i === cardIndex) {
        return {
          ...card,
          tasks: [...card.tasks, { text: taskText }]
        };
      }
      return card;
    }));
  };

  const manageTitle = (index: number, title: string) => {
    setCards(cards.map((card, i) => {
      if (i === index) {
        return {
          ...card,
          title
        };
      }
      return card;
    }));
  }

  const contextValue = {
    cards,
    addCard,
    deleteCard,
    addTask
  };

  return (
    <CardContext.Provider value={contextValue}>
      <div className="flex flex-row m-[20px]">
        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Write Details" />
        <button type="button" className="text-white ml-2 mt-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5 me-2 mb-2">Add</button>
        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-[300px] p-2.5 ml-2">
          <option>Select</option>
          {cards.map((card, index) => (
            <option key={index} value={card.title}>{card.title}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-row flex-wrap">
        {cards.map((card, index) => (
          <div key={index} className="flex-shrink-0">
            <Card
              title={card.title}
              index={index}
              tasks={card.tasks}
            />
          </div>
        ))}
        <button
          className="bg-slate-500 w-[150px] h-[50px] mt-[150px] ml-[100px] rounded-3xl"
          onClick={addCard}
        >
          + Add Card
        </button>
      </div>
    </CardContext.Provider>
  );
}