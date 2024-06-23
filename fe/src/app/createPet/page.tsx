import React from 'react';

const CreatePetPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-bg">
      <div className="text-center text-black">
        <h1 className="text-5xl font-bold mb-4">Create new Pet</h1>
        <form className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <label className="block mb-2 text-lg font-bold text-gray-800" htmlFor="petName">
              Pet Name
            </label>
            <input
              type="text"
              id="petName"
              className="w-full px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-bold text-gray-800" htmlFor="petType">
              Pet Type
            </label>
            <input
              type="text"
              id="petType"
              className="w-full px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-bold text-gray-800" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 text-xl font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Create Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePetPage;
