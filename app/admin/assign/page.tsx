// // app/admin/assign/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import AdminLayout from '@/app/components/AdminLayout';
// import axios from 'axios';

// type Selection = {
//   goalId?: string;
//   courseId?: string;
//   topicId?: string;
// };

// export default function AssignPage() {
//   const [step, setStep] = useState(1);
//   const [selection, setSelection] = useState<Selection>({});
//   const [userId, setUserId] = useState('');
//   const [goals, setGoals] = useState<any[]>([]);
//   const [courses, setCourses] = useState<any[]>([]);
//   const [topics, setTopics] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchGoals();
//   }, []);

//   useEffect(() => {
//     if (selection.goalId) {
//       fetchCourses(selection.goalId);
//     }
//   }, [selection.goalId]);

//   useEffect(() => {
//     if (selection.courseId) {
//       fetchTopics(selection.courseId);
//     }
//   }, [selection.courseId]);

//   const fetchGoals = async () => {
//     try {
//       const res = await axios.get('/api/goals');
//       setGoals(res.data.goals);
//       console.log(res);
      
//     } catch (err) {
//       console.error('Failed to fetch goals', err);
//     }
//   };

//   const fetchCourses = async (goalId: string) => {
//     try {
//       const goal = goals.find(g => g._id === goalId);
//       if (goal) {
//         setCourses(goal.courses);
//       }
//     } catch (err) {
//       console.error('Failed to fetch courses', err);
//     }
//   };

//   const fetchTopics = async (courseId: string) => {
//     try {
//       const course = courses.find(c => c._id === courseId);
//       if (course) {
//         setTopics(course.topics);
//       }
//     } catch (err) {
//       console.error('Failed to fetch topics', err);
//     }
//   };

//   const handleAssign = async () => {
//     if (!userId || !selection.goalId || !selection.courseId || !selection.topicId) {
//       setError('Please complete all steps');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       await axios.post('/api/assignments', {
//         userId,
//         goalId: selection.goalId,
//         courseId: selection.courseId,
//         topicId: selection.topicId
//       });
      
//       setMessage('Assignment created successfully!');
//       setSelection({});
//       setUserId('');
//       setStep(1);
//     } catch (err) {
//       setError(axios.isAxiosError(err) 
//         ? err.response?.data?.message || 'Assignment failed' 
//         : 'Assignment failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="space-y-4">
//             <h2 className="text-lg font-medium">Select a Goal</h2>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {goals.map((goal) => (
//                 <div
//                   key={goal._id}
//                   className={`p-4 border rounded-lg cursor-pointer ${
//                     selection.goalId === goal._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
//                   }`}
//                   onClick={() => {
//                     setSelection({ goalId: goal._id });
//                     setStep(2);
//                   }}
//                 >
//                   <h3 className="font-medium">{goal.name}</h3>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <button
//               onClick={() => setStep(1)}
//               className="text-indigo-600 hover:text-indigo-800"
//             >
//               ← Back
//             </button>
//             <h2 className="text-lg font-medium">Select a Course</h2>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {courses.map((course) => (
//                 <div
//                   key={course._id}
//                   className={`p-4 border rounded-lg cursor-pointer ${
//                     selection.courseId === course._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
//                   }`}
//                   onClick={() => {
//                     setSelection(prev => ({ ...prev, courseId: course._id }));
//                     setStep(3);
//                   }}
//                 >
//                   <h3 className="font-medium">{course.name}</h3>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-4">
//             <button
//               onClick={() => setStep(2)}
//               className="text-indigo-600 hover:text-indigo-800"
//             >
//               ← Back
//             </button>
//             <h2 className="text-lg font-medium">Select a Topic</h2>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {topics.map((topic) => (
//                 <div
//                   key={topic._id}
//                   className={`p-4 border rounded-lg cursor-pointer ${
//                     selection.topicId === topic._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
//                   }`}
//                   onClick={() => {
//                     setSelection(prev => ({ ...prev, topicId: topic._id }));
//                     setStep(4);
//                   }}
//                 >
//                   <h3 className="font-medium">{topic.name}</h3>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="space-y-4">
//             <button
//               onClick={() => setStep(3)}
//               className="text-indigo-600 hover:text-indigo-800"
//             >
//               ← Back
//             </button>
//             <h2 className="text-lg font-medium">Assign to User</h2>
            
//             <div className="space-y-2">
//               <div>
//                 <span className="text-gray-500">Goal:</span>
//                 <p>{goals.find(g => g._id === selection.goalId)?.name}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Course:</span>
//                 <p>{courses.find(c => c._id === selection.courseId)?.name}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Topic:</span>
//                 <p>{topics.find(t => t._id === selection.topicId)?.name}</p>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 User ID
//               </label>
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <button
//               onClick={handleAssign}
//               disabled={loading}
//               className={`px-4 py-2 rounded-md text-white ${
//                 loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
//               }`}
//             >
//               {loading ? 'Assigning...' : 'Assign Learning Path'}
//             </button>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="max-w-4xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6">Assign Learning Path</h1>

//         {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
//         {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

//         <div className="mb-6">
//           <div className="flex items-center justify-center">
//             {[1, 2, 3, 4].map((stepNumber) => (
//               <div key={stepNumber} className="flex items-center">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
//                   }`}
//                 >
//                   {stepNumber}
//                 </div>
//                 {stepNumber < 4 && (
//                   <div className={`h-1 w-8 mx-1 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {renderStep()}
//       </div>
//     </AdminLayout>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import axios from 'axios';

type Selection = {
  goalId?: string;
  courseId?: string;
  topicId?: string;
};

export default function AssignPage() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<Selection>({});
  const [userId, setUserId] = useState('');
  const [goals, setGoals] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (selection.goalId) {
      fetchCourses(selection.goalId);
    } else {
      setCourses([]);
    }
  }, [selection.goalId]);

  useEffect(() => {
    if (selection.courseId) {
      fetchTopics(selection.courseId);
    } else {
      setTopics([]);
    }
  }, [selection.courseId]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get('/api/goals');
      setGoals(res.data.goals || []);
    } catch (err) {
      console.error('Failed to fetch goals', err);
    }
  };

  const fetchCourses = async (goalId: string) => {
    try {
      const res = await axios.get(`/api/courses?goalId=${goalId}`);
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const fetchTopics = async (courseId: string) => {
    try {
      const res = await axios.get(`/api/topics?courseId=${courseId}`);
      setTopics(res.data.topics || []);
    } catch (err) {
      console.error('Failed to fetch topics', err);
    }
  };

  const handleAssign = async () => {
    if (!userId || !selection.goalId || !selection.courseId || !selection.topicId) {
      setError('Please complete all steps');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post('/api/assignments', {
        userId,
        goalId: selection.goalId,
        courseId: selection.courseId,
        topicId: selection.topicId
      });

      setMessage('Assignment created successfully!');
      setSelection({});
      setUserId('');
      setStep(1);
    } catch (err) {
      setError(axios.isAxiosError(err)
        ? err.response?.data?.message || 'Assignment failed'
        : 'Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Select a Goal</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {goals.map((goal) => (
                <div
                  key={goal._id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selection.goalId === goal._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelection({ goalId: goal._id });
                    setStep(2);
                  }}
                >
                  <h3 className="font-medium">{goal.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back
            </button>
            <h2 className="text-lg font-medium">Select a Course</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selection.courseId === course._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelection(prev => ({ ...prev, courseId: course._id }));
                    setStep(3);
                  }}
                >
                  <h3 className="font-medium">{course.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <button
              onClick={() => setStep(2)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back
            </button>
            <h2 className="text-lg font-medium">Select a Topic</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {topics.map((topic) => (
                <div
                  key={topic._id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selection.topicId === topic._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelection(prev => ({ ...prev, topicId: topic._id }));
                    setStep(4);
                  }}
                >
                  <h3 className="font-medium">{topic.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <button
              onClick={() => setStep(3)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back
            </button>
            <h2 className="text-lg font-medium">Assign to User</h2>

            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Goal:</span>
                <p>{goals.find(g => g._id === selection.goalId)?.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Course:</span>
                <p>{courses.find(c => c._id === selection.courseId)?.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Topic:</span>
                <p>{topics.find(t => t._id === selection.topicId)?.name}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
                disabled={loading}
              />
            </div>

            <button
              onClick={handleAssign}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Assigning...' : 'Assign Learning Path'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Assign Learning Path</h1>

        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="mb-6">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`h-1 w-8 mx-1 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </AdminLayout>
  );
}
