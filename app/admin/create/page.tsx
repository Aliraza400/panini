'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/AdminLayout';
import axios from 'axios';

enum CreateType {
  GOAL = 'goal',
  COURSE = 'course',
  TOPIC = 'topic',
}

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<CreateType>(CreateType.GOAL);
  const [name, setName] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]); 
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]); 
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]); 
  const [goals, setGoals] = useState<{ _id: string; name: string }[]>([]); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get('/api/goals');
        // Access goals from the 'goals' property of the response
        if (Array.isArray(res.data.goals)) {
          setGoals(res.data.goals); // Use res.data.goals instead of res.data
        } else {
          console.error('Expected an array of goals, but received:', res.data);
        }
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      }
    };

    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      let endpoint = '';
      let body = {};

      switch (activeTab) {
        case CreateType.GOAL:
          endpoint = '/api/goals';
          body = { name };
          break;
        case CreateType.COURSE:
          endpoint = '/api/courses';
          body = { name, topics: selectedTopics, goals: selectedGoals };
          break;
        case CreateType.TOPIC:
          endpoint = '/api/topics';
          body = { name };
          break;
      }

      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(endpoint, body);
      console.log(response);

      setMessage(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} created successfully!`);
      setName('');
      setSelectedCourses([]);
      setSelectedTopics([]);
      setSelectedGoals([]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Creation failed');
      } else {
        setError(err instanceof Error ? err.message : 'Creation failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New</h1>

        <div className="flex border-b border-gray-200 mb-6">
          {Object.values(CreateType).map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === tab
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              required
              disabled={isLoading}
            />
          </div>

          {activeTab === CreateType.COURSE && (
            <>
              {/* Goals Checkbox */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Goals</label>
                <div className="mt-2 space-y-2">
                  {goals.length > 0 ? (
                    goals.map((goal) => (
                      <div key={goal._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`goal-${goal._id}`}
                          checked={selectedGoals.includes(goal._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGoals([...selectedGoals, goal._id]);
                            } else {
                              setSelectedGoals(selectedGoals.filter((g) => g !== goal._id));
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          disabled={isLoading}
                        />
                        <label htmlFor={`goal-${goal._id}`} className="ml-2 block text-sm text-gray-900">
                          {goal.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div>No goals available</div>
                  )}
                </div>
              </div>

              {/* Topics (Static or replace with API data) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Topics</label>
                <div className="mt-2 space-y-2">
                  {['HTML Basics', 'CSS Fundamentals', 'JavaScript Intro'].map((topic) => (
                    <div key={topic} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`topic-${topic}`}
                        checked={selectedTopics.includes(topic)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTopics([...selectedTopics, topic]);
                          } else {
                            setSelectedTopics(selectedTopics.filter((t) => t !== topic));
                          }
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <label htmlFor={`topic-${topic}`} className="ml-2 block text-sm text-gray-900">
                        {topic}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : `Create ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
