import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Neural Network Visualization
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-600">
            Your neural network visualization application is ready.
          </p>
          <div className="mt-4 space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Upload Model
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              View Projects
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;