"use client"
import { createContext, useContext, useState } from 'react';
import "./globals.css";
import Card from "../components/Card";
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

export const CardContext = createContext<CardContextType | undefined>(undefined);


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