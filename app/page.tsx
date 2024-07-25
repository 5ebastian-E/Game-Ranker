"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState<any[] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const allTags = [
    "horror",
    "teenager",
    "comedy",
    "graphic",
    "story",
    "adventure",
    "survival",
    "open world",
    "action",
    "rts",
  ];
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("./data/gamesData.json");
      const jsonData = await response.json();
      const sortData = (games: any[]) => {
        return games.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          } else {
            return a.title.localeCompare(b.title);
          }
        });
      };

      const sortedData = sortData(jsonData);
      setData(sortedData);
      setFilteredData(sortedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredData(data);
    } else {
      const filtered = data?.filter((game) =>
        selectedTags.every((tag) => game.tags.includes(tag))
      );
      setFilteredData(filtered as any[]);
    }
  }, [selectedTags, data]);
  useEffect(() => {
    if (filteredData) {
      const sortData = (games: any[]) => {
        return games.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          } else {
            return a.title.localeCompare(b.title);
          }
        });
      };

      const sortedData = sortData(filteredData);
      setFilteredData(sortedData);
    }
  }, [filteredData]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  return (
    <div className="w-screen h-screen bg-gray-800">
      <div className="p-6 bg-gray-800 text-white">
        <div className="mb-6">
          <p className="text-2xl font-bold">Games</p>
          <p className="text-xl">Creepears Ranking</p>
        </div>
        <div className="flex items-center mb-6 relative">
          <input
            className="flex-grow px-4 py-2 text-black rounded-l-md"
            placeholder="Search..."
          />
          <div className="relative">
            <button
              className="px-4 py-2 bg-blue-500 rounded-r-md hover:bg-blue-600"
              onClick={toggleDropdown}
            >
              Filters
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                {allTags.map((tag) => (
                  <div
                    key={tag}
                    className={`px-4 py-2 cursor-pointer ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "text-black"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-900 text-white">
        <div className="mb-6 p-4 flex items-center">
          <div className="w-16 h-16 bg-slate-700 mr-4"></div>
          <p className="font-bold">Title</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredData?.map((game) => (
            <div
              key={game.id}
              className="flex items-center p-4 bg-gray-800 rounded-lg"
            >
              <Image
                className="w-16 h-16 rounded-md mr-4"
                src={game.image}
                alt={game.title}
              ></Image>
              <div>
                <p className="text-lg font-bold">{game.title}</p>
                <p className="text-sm">Rating: {game.rating}</p>
                <p className="text-sm">Tags: {game.tags.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
